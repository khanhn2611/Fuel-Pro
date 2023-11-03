function simulateLogin(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const message = document.getElementById('error-message');

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                // If unauthorized, handle the custom message from the server
                return response.json().then(data => {
                    throw new Error(data.message);
                });
            } else {
                // For other errors, throw a generic error
                throw new Error('Login failed. Please try again.');
            }
        }
        // If redirected, follow the redirect URL
        if (response.redirected) {
            window.location.href = response.url;
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        message.innerText = error.message;
        message.style.color = 'red';
    });
}

document.getElementById('loginForm').addEventListener('submit', simulateLogin);
