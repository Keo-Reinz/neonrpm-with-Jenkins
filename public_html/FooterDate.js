// Makes sure to load in page
document.addEventListener("DOMContentLoaded", function () {
    // Gets id from the page 'lastUpdated'
    const updatedSpan = document.getElementById("lastUpdated");
    // Updates last update across all pages here
    if (updatedSpan) {
        updatedSpan.textContent = "April 25, 2025";
    }
});

// ========== Back to Top Button ==========

// Scrolls to top function
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Shows/hides button on scroll
window.onscroll = function () {
    const btn = document.getElementById("backToTopBtn");
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop > 50 && scrollTop + clientHeight < scrollHeight - 100) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
};

