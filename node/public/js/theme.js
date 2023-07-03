export function applyTheme(theme) {
    const body = document.body;

    if (theme === "light") {
        body.classList.add("light-theme");
        body.classList.remove("dark-theme");
    } else if (theme === "dark") {
        body.classList.add("dark-theme");
        body.classList.remove("light-theme");
    } else {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        if (prefersDarkScheme.matches) {
            body.classList.add("dark-theme");
            body.classList.remove("light-theme");
        } else {
            body.classList.add("light-theme");
            body.classList.remove("dark-theme");
        }
    }

    // Save theme to local storage
    localStorage.setItem("theme", theme);
}

export function applyMarkdownTheme(theme) {
    // Get all link elements
    const links = document.getElementsByTagName('link');

    // Loop through all link elements
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const href = link.getAttribute('href');

        // If link is for github-markdown-css, remove it
        if (href && href.includes('github-markdown-css')) {
            link.parentNode.removeChild(link);
        }
    }

    // Add new link element
    if (theme === 'dark') {
        const darkCss = document.createElement('link');
        darkCss.setAttribute('rel', 'stylesheet');
        darkCss.setAttribute('href', 'https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown-dark.css');
        document.head.appendChild(darkCss);
    } else if (theme === 'light') {
        const lightCss = document.createElement('link');
        lightCss.setAttribute('rel', 'stylesheet');
        lightCss.setAttribute('href', 'https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown-light.css');
        document.head.appendChild(lightCss);
    } else {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        if (prefersDarkScheme.matches) {
            const darkCss = document.createElement('link');
            darkCss.setAttribute('rel', 'stylesheet');
            darkCss.setAttribute('href', 'https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown-dark.css');
            document.head.appendChild(darkCss);
        } else {
            const lightCss = document.createElement('link');
            lightCss.setAttribute('rel', 'stylesheet');
            lightCss.setAttribute('href', 'https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown-light.css');
            document.head.appendChild(lightCss);
        }
    }

    // Save theme to local storage
    localStorage.setItem("markdownTheme", theme);
}

export function initializeTheme() {

    // Listen for theme change
    const themeSelect = document.getElementById("themeSelect");
    themeSelect.addEventListener("change", (event) => {
        const selectedTheme = event.target.value;
        applyTheme(selectedTheme);
        applyMarkdownTheme(selectedTheme);
    });

    // Get theme from local storage
    const localStorageTheme = localStorage.getItem("theme");
    const localStorageMarkdownTheme = localStorage.getItem("markdownTheme");

    // Apply the theme
    applyTheme(localStorageTheme);
    applyMarkdownTheme(localStorageMarkdownTheme);
}