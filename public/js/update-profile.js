// update-profile.js
document.addEventListener('DOMContentLoaded', function() {
    // Fetch and populate existing data
    fetch('/get-current-profile')
    .then(response => response.json())
    .then(data => {
        document.getElementById('full-name').value = data.fullName || '';
        document.getElementById('address-1').value = data.address1 || '';
        document.getElementById('address-2').value = data.address2 || '';
        document.getElementById('city').value = data.city || '';
        document.getElementById('state').value = data.state || '';
        document.getElementById('zipcode').value = data.zipcode || '';
    })
    .catch(error => console.error('Error fetching profile data:', error));

    // Handle form submission
    document.getElementById('update-profile').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(this);
        fetch('/update-profile', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const updateMessage = document.getElementById('update-message');
                updateMessage.textContent = 'Profile Updated Successfully!';
                updateMessage.style.display = 'block';
                updateMessage.style.color = 'green';
            } else {
                // Handle unsuccessful updates or errors
                console.error('Update failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
