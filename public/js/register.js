function simulateRegistration() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const message = document.getElementById('register-message');

    // Simulate registration by pushing new users into the registeredUsers object
    if (!registeredUsers[username]) {
        registeredUsers[username] = password;
        userProfiles[username] = {
            fullname: '',
            address1: '',
            address2: '',
            city: '',
            state: ''
        };
        //Design 1 - Separate User Profile Object - userProfile = all attributes.
        //Design 2 - Include Profile Attributes in registeredUsers:
        saveRegisteredUsers(); // Save the updated data to localStorage
        saveUserProfiles();
        message.innerText = 'Registration successful!';
        message.classList.add('success-message');
        //window.location.href = 'login.html';
        return false; // Prevent the form from submitting
    } else {
        message.innerText = 'Username already exists. Please choose another.';
        message.classList.remove('success-message');
        return false; // Prevent the form from submitting
    }
}