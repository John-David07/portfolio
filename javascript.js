document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    fetch('your-backend-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: this.name.value,
            email: this.email.value,
            message: this.message.value
        })
    })
    .then(response => alert('Message sent!'))
    .catch(error => alert('Error sending message'));
});