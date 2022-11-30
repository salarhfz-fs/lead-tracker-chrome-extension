// DOM queries
const input_el = document.getElementById('input-el');
const input_btn = document.getElementById('input-btn');
const save_tab_btn = document.getElementById('save-tab-btn');
const delete_btn = document.getElementById('delete-btn');
const ul_el = document.getElementById('ul-el');
// Var declarations
const stored_leads = localStorage.getItem('leads');
const leads = stored_leads ? JSON.parse(stored_leads) : [];

// Business
function saveLead(new_lead) {
    input_el.value = '';
    if (leads.some(item => item === new_lead)) return;
    leads.push(new_lead);
    localStorage.setItem('leads', JSON.stringify(leads));
    const li = createListItem(new_lead);
    ul_el.appendChild(li);
}
// Event handlers
function handleEnterOnInput(e) {
    if (e.key === 'Enter') {
        input_btn.click();
    }
}
function handleInputBtnClick() {
    const { value } = input_el;
    if (value) {
        saveLead(value);
    }
}
function handleSaveTabBtnClick() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        saveLead(activeTab.url);
    });
}
function handleDeleteBtnClick() {
    localStorage.removeItem('leads');
    leads.length = 0;
    renderLeads();
}

input_el.addEventListener('keypress', handleEnterOnInput)
input_btn.addEventListener('click', handleInputBtnClick);
save_tab_btn.addEventListener('click', handleSaveTabBtnClick);
delete_btn.addEventListener('click', handleDeleteBtnClick)
// Helpers
function createListItem(new_lead) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = new_lead;
    a.href = new_lead;
    a.target = '_blank';
    li.appendChild(a);
    return li;
}
function renderLeads() {
    if (leads.length) {
        for (let i = 0; i < leads.length; i++) {
            let list_item = createListItem(leads[i]);
            ul_el.appendChild(list_item);
        }
    } else {
        ul_el.replaceChildren();
    }
}

renderLeads();