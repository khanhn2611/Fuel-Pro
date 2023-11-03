function isValidRegistrationForm() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    if (!username || !password) {
        document.getElementById('register-message').textContent = "Both fields are required!";
        return false;
    }

    return true;
}

module.exports = { 
    isValidRegistrationForm 
}; 
