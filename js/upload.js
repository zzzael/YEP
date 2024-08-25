document.querySelector('.upload-button').addEventListener('click', () => {
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', () => {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    const fileName = file.name;
    document.querySelector('.upload-button').textContent = fileName;

    const formData = new FormData();
    formData.append('file', file);

    document.getElementById('loading-message').style.display = 'block'; // Show loading message

    fetch('https://file.io/?expires=1w', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('loading-message').style.display = 'none'; // Hide loading message
        showThankYouMessage();
        sendNotificationToDiscord(fileName, data.link); // Notify via Discord
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('loading-message').style.display = 'none'; // Hide loading message
        alert('An error occurred while uploading the file.');
    });
});

function showThankYouMessage() {
    document.body.innerHTML = '<div class="thank-you">THANK YOU!</div>';
}

function sendNotificationToDiscord(fileName, fileUrl) {
    fetch('https://discord.com/api/webhooks/1259232755481444352/jnvPoP1JYUXRt9F6Z5C5WHKjWrdDbDuYslKPzc-Y-QvSVvgOtGwtqhaTfsumGnwjRkc2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: `A new file has been uploaded: ${fileName}\nDownload link: ${fileUrl}`
        })
    })
    .then(response => response.text()) // Handle non-JSON responses
    .then(responseText => {
        console.log('Notification sent successfully:', responseText);
    })
    .catch(error => console.error('Error sending notification:', error));
}
