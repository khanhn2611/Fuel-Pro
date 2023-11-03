const { JSDOM } = require('jsdom');
const { isValidRegistrationForm } = require('./register-validation.js');

const html = `
    <!DOCTYPE html>
    <html lang="en">
    <body>
        <form id="registrationForm">
            <input type="text" id="register-username">
            <input type="password" id="register-password">
            <p id="register-message"></p>
        </form>
    </body>
    </html>
`;

const dom = new JSDOM(html);
global.document = dom.window.document;

describe("Registration Form Validation", () => {
    it("should return false if username is empty", () => {
        const username = document.getElementById('register-username');
        const password = document.getElementById('register-password');

        username.value = "";
        password.value = "password123";

        expect(isValidRegistrationForm()).toBe(false);
    });

    it("should return false if password is empty", () => {
        const username = document.getElementById('register-username');
        const password = document.getElementById('register-password');

        username.value = "user123";
        password.value = "";

        expect(isValidRegistrationForm()).toBe(false);
    });

    it("should return true if both fields are filled", () => {
        const username = document.getElementById('register-username');
        const password = document.getElementById('register-password');

        username.value = "user123";
        password.value = "password123";

        expect(isValidRegistrationForm()).toBe(true);
    });
});
