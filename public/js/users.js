// users.js, SIMULATING LOGIN ONLY FOR ASSIGMENT #2
// Initialize the registeredUsers object from localStorage if it exists
const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || {};
const userProfiles = JSON.parse(localStorage.getItem('userProfiles')) || {}; // Store user profiles (additional user information)


// Function to save the updated registeredUsers object to localStorage
function saveRegisteredUsers() {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
}

function saveUserProfiles() {
    localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
}

registeredUsers['user1'] = 'password1';
userProfiles['user1'] = {
    fullname: 'John Smith',
    address1: '123 main street',
    address2: '',
    city: 'Houston',
    state: 'Tx'
};