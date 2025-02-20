document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Merci de nous avoir contacter! Nous vous reviendrons plus tard.');
    this.reset();
});
/* Ajouter ce script pour forcer le zoom initial */

    document.addEventListener('DOMContentLoaded', function() {
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        viewportMeta.content = "width=820, initial-scale=1.0";
    });
