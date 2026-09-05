// Get input fields
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const addBtn = document.getElementById("addBtn");
const contactList = document.getElementById("contactList");
const searchInput = document.getElementById("search");
const notification = document.getElementById("notification");
const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const exportBtn = document.getElementById("exportBtn");

// Array to store contacts
let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let editIndex = -1;
let deleteIndex = -1;

// Display contacts when page loads
displayContacts();
updateDashboard();
function searchContacts() {

    const searchValue = searchInput.value.toLowerCase();

    contactList.innerHTML = "";

    contacts
        .filter(contact =>
            contact.name.toLowerCase().includes(searchValue) ||
            contact.phone.includes(searchValue) ||
            contact.email.toLowerCase().includes(searchValue)
        )
        .forEach((contact, index) => {

            contactList.innerHTML += `
                <tr>

                    <td>${contact.name}</td>
                    <td>${contact.phone}</td>
                    <td>${contact.email}</td>

                    <td>

                        <button
                            class="btn btn-warning btn-sm"
                            onclick="editContact(${contacts.indexOf(contact)})">

                            <i class="bi bi-pencil-square"></i> Edit

                        </button>

                        <button
                            class="btn btn-danger btn-sm"
                            onclick="deleteContact(${contacts.indexOf(contact)})">
                            <i class="bi bi-trash-fill"></i> Delete

                        </button>

                    </td>

                </tr>
            `;

        });

}
// Live Search
searchInput.addEventListener("input", searchContacts);
exportBtn.addEventListener("click", exportCSV);
// Add Contact
addBtn.addEventListener("click", () => {

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !phone || !email) {
    showNotification("Please fill in all fields.", "danger");
    return;
}

// Name validation
if (name.length < 2) {
    showNotification("Name should contain at least 2 characters.", "danger");
    return;
}

// Phone validation
if (!/^\d{10}$/.test(phone)) {
    showNotification("Phone number must contain exactly 10 digits.", "danger");
    return;
}

// Email validation
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(email)) {
    showNotification("Please enter a valid email address.", "danger");
    return;
}

    const contact = {
    name,
    phone,
    email
    };

    if (editIndex === -1) {
    contacts.push(contact);
    showNotification("Contact added successfully!", "success");
    } else {
    contacts[editIndex] = contact;
    editIndex = -1;
    addBtn.textContent = "Add Contact";
    clearInputs();
    showNotification("Contact updated successfully!", "info");
    }

    saveContacts();

    displayContacts();

    updateDashboard();

    clearInputs();

});

// Save to Local Storage
function saveContacts() {
    localStorage.setItem("contacts", JSON.stringify(contacts));
}

// Display Contacts
function displayContacts() {

    contactList.innerHTML = "";
    if (contacts.length === 0) {

    contactList.innerHTML = `
        <tr>
            <td colspan="4" class="text-center text-muted py-4">
                <i class="bi bi-person-x-fill display-6"></i>
                <br><br>
                No contacts found.
            </td>
        </tr>
    `;

    return;
}

    contacts.forEach((contact, index) => {

        contactList.innerHTML += `
            <tr>
                <td>${contact.name}</td>
                <td>${contact.phone}</td>
                <td>${contact.email}</td>

                <td>
                    <button
                class="btn btn-warning btn-sm"
                onclick="editContact(${index})">
                 <i class="bi bi-pencil-square"></i> Edit
                    </button>

                    <button class="btn btn-danger btn-sm"
                    onclick="deleteContact(${index})">
                        <i class="bi bi-trash-fill"></i> Delete
                    </button>
                </td>

            </tr>
        `;

    });

}

// Clear Input Fields
function clearInputs() {

    nameInput.value = "";
    phoneInput.value = "";
    emailInput.value = "";

    nameInput.focus();

}

function showNotification(message, type) {

    notification.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">

            ${message}

            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert">
            </button>

        </div>
    `;

    setTimeout(() => {
        notification.innerHTML = "";
    }, 3000);

}

function deleteContact(index) {

    deleteIndex = index;

    deleteModal.show();

}

function editContact(index) {

    const contact = contacts[index];

    nameInput.value = contact.name;
    phoneInput.value = contact.phone;
    emailInput.value = contact.email;

    editIndex = index;

    addBtn.textContent = "Update Contact";

    nameInput.focus();

}

function updateDashboard(){

    document.getElementById("totalContacts").textContent = contacts.length;

    if(contacts.length>0){

        document.getElementById("lastAdded").textContent =
        contacts[contacts.length-1].name;

    }
    else{

        document.getElementById("lastAdded").textContent="None";

    }

}
confirmDeleteBtn.addEventListener("click", () => {

    contacts.splice(deleteIndex, 1);

    saveContacts();

    displayContacts();

    updateDashboard();

    showNotification(
        "Contact deleted successfully!",
        "warning"
    );

    deleteModal.hide();

});

function exportCSV() {

    if (contacts.length === 0) {

        showNotification(
            "No contacts available to export.",
            "danger"
        );

        return;
    }

    let csv =
        "Name,Phone,Email\n";

    contacts.forEach(contact => {

        csv +=
            `${contact.name},${contact.phone},${contact.email}\n`;

    });

    const blob =
        new Blob([csv], { type: "text/csv" });

    const url =
        window.URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download = "contacts.csv";

    a.click();

    window.URL.revokeObjectURL(url);

    showNotification(
        "Contacts exported successfully!",
        "success"
    );

}