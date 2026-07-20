// header.js - Global Header Component

const headerHTML = `
    <header class="global-header">
        <a href="index.html" class="logo">
            <i class="fa-solid fa-bolt"></i> QSpark AI
        </a>
        <nav>
            <a href="index.html" class="nav-btn">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                <span>Generate Now</span>
            </a>
        </nav>
    </header>
`;

// Yeh function page load hote hi header ko inject kar dega
document.addEventListener("DOMContentLoaded", () => {
    const headerPlaceholder = document.getElementById("header-placeholder");
    
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerHTML;
    } else {
        console.warn("Header placeholder nahi mila is page par!");
    }
});