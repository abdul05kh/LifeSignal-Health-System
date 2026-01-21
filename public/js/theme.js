// 1. Immediate Theme Application (Prevents Flash)
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// 2. Main Toggle Function
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    updateIcon(newTheme);
}

// 3. Icon Updater
function updateIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
        // Remove both classes first
        icon.classList.remove('fa-sun', 'fa-moon');
        // Add the correct one
        icon.classList.add(theme === 'dark' ? 'fa-sun' : 'fa-moon');
    }
}

// 4. Run on Page Load
document.addEventListener('DOMContentLoaded', () => {
    updateIcon(savedTheme);
});