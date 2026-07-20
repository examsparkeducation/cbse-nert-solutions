// footer.js - Global Footer Component

const footerHTML = `
    <footer class="global-footer">
        <div class="footer-container">
            <div class="footer-links">
                <a href="privacy-policy.html">Privacy Policy</a>
                <a href="terms.html">Terms</a>
                <a href="about.html">About</a>
                <a href="contact.html">Contact</a>
            </div>
            <div class="footer-tagline">
                &copy; 2026 QSpark AI | Built for Students 🚀
            </div>
        </div>
    </footer>
`;

// Yeh function page load hote hi footer ko inject kar dega
document.addEventListener("DOMContentLoaded", () => {
    const footerPlaceholder = document.getElementById("footer-placeholder");
    
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
    } else {
        console.warn("Footer placeholder nahi mila is page par!");
    }
});