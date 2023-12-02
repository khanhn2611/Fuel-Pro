function isValidProfile() {
    const fullName = document.getElementById('full-name').value;
    const address1 = document.getElementById('address-1').value;
    const address2 = document.getElementById('address-2').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zipcode = document.getElementById('zipcode').value;

    if (fullName.length === 0 || fullName.length > 50) return false;
    if (address1.length === 0 || address1.length > 100) return false;
    if (address2.length > 100) return false;
    if (city.length === 0 || city.length > 100) return false;
    if (!state) return false; 
    if (zipcode.length < 5 || zipcode.length > 9) return false;

    return true;
}

module.exports = {
    isValidProfile
};
