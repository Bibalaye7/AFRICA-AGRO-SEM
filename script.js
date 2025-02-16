document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Merci de nous avoir contacter! Nous vous reviendrons plus tard.');
    this.reset();
});