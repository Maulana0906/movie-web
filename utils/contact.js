const fs = require('fs');

const dirPath = './data';
if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath)
}

const dataPath = './data/contacts.json';
if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

const loadContacts = () => {
    const fileBuffer = fs.readFileSync('./data/contacts.json', 'utf-8');
    const contacts = JSON.parse(fileBuffer);
    return contacts;
}
const findContact = (nama) => {
    const contacts = loadContacts();
    return contacts.find(e => e.nama.toLowerCase() == nama.toLowerCase());
}
const saveContacts = (contacts) => {
    fs.writeFileSync('./data/contacts.json', JSON.stringify(contacts, null, 2), 'utf-8')
}
const addContact = (data) => {
    const contacts = loadContacts();
    contacts.push(data);
    saveContacts(contacts)
}
const checkDuplikat = (value) => {
    const contacts = loadContacts();
    return contacts.find(e => e.nama==value);
}
const deleteContact = (nama) =>{
    const contacts = loadContacts();
    const newContacts = contacts.filter(e => e.nama !== nama)
    saveContacts(newContacts);
}
const updateContacts = (newContact) => {
    const contacts = loadContacts();
    const newContacts = contacts.map(e => e.nama == newContact.oldName ? newContact : e)
    saveContacts(newContacts);
}

module.exports = {loadContacts, findContact, addContact, checkDuplikat, deleteContact, updateContacts}