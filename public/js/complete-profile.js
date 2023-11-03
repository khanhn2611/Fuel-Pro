// JavaScript for the Client Profile page

// Function to handle profile form submission
function handleProfileSubmission(event) {
    event.preventDefault();

    // Get form input values
    const fullName = document.getElementById("full-name").value;
    const address1 = document.getElementById("address-1").value;
    const address2 = document.getElementById("address-2").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const zipcode = document.getElementById("zipcode").value;

    // Validate and process the data as needed
    // For now, let's just display an alert with the collected data
    const profileData = {
        fullName,
        address1,
        address2,
        city,
        state,
        zipcode,
    };

    // Display the collected data (you can replace this with your logic)
    alert("Profile Data:\n" + JSON.stringify(profileData, null, 2));
}

// Attach an event listener to the profile form
document.getElementById("profile").addEventListener("submit", handleProfileSubmission);