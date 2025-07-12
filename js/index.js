const currentLang = (() => {
    const language = navigator.language || 'en';
    return lang[language] || lang['en'];
})();

// When popup extension finish loads get stored data in local storage to show
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
