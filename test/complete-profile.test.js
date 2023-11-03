const { JSDOM } = require('jsdom');
const { isValidProfile } = require('./complete-profile.js');

const { window } = new JSDOM('<!doctype html><html><body></body></html>');
global.document = window.document;

describe("Profile Validation", function() {

    beforeEach(() => {
        document.body.innerHTML = `
            <form id="profile">
                <input type="text" id="full-name" value="Valid Name">
                <input type="text" id="address-1" value="Valid Address 1">
                <input type="text" id="address-2" value="">
                <input type="text" id="city" value="Valid City">
                <select id="state"><option value="TX" selected></option></select>
                <input type="text" id="zipcode" value="12345">
            </form>
        `;
    });

    it("validates full name", function() {

        document.getElementById('full-name').value = "";
        expect(isValidProfile()).toBe(false);

        document.getElementById('full-name').value = "A".repeat(51);
        expect(isValidProfile()).toBe(false);
    });

    it("validates address 1", function() {

        document.getElementById('address-1').value = "";
        expect(isValidProfile()).toBe(false);

        document.getElementById('address-1').value = "A".repeat(101);
        expect(isValidProfile()).toBe(false);
    });

    it("validates address 2", function() {
        document.getElementById('address-2').value = "A".repeat(101);
        expect(isValidProfile()).toBe(false);
    });

    it("validates city", function() {

        document.getElementById('city').value = "";
        expect(isValidProfile()).toBe(false);

        document.getElementById('city').value = "A".repeat(101);
        expect(isValidProfile()).toBe(false);
    });

    it("validates state", function() {
        document.getElementById('state').value = "";
        expect(isValidProfile()).toBe(false);
    });

    it("validates zipcode", function() {

        document.getElementById('zipcode').value = "1234";
        expect(isValidProfile()).toBe(false);

        document.getElementById('zipcode').value = "1234567890";
        expect(isValidProfile()).toBe(false);
    });
});
