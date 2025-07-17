import dictionary from "./dictionary.js";

/**
 * List of supported languages
 *
 * @type {Array<string>}
 */
export const supportedLanguages = [
    'en',
    'pt-BR'
];

/**
 * Returns user current setting based on with language this application has support
 *
 * @export
 * @returns {string}
 */
export function getLang() {
    const language = navigator.language || 'en';

    // supported languages. If includes another file of lang, insert here the new one
    if (!supportedLanguages.includes(language)) {
        return 'en';
    }

    return language;
}

/**
 * Private constant to save the language. This should not be export
 *
 * @type {string}
 */
const currentLanguage = getLang();

/**
 * Get text for interface based on current language
 *
 * @export
 * @param {'alerts.inputTime'|'defaults.name'|'labels.projectName'|'labels.name'|'labels.updatedAt'|'labels.about'|'labels.report'|'labels.theme'|'buttons.resumePause'|'buttons.delete'|'buttons.reset'|'buttons.new'} path
 * @returns {string}
 */
export function lang(path) {
    return dictionary[currentLanguage][path] ?? path;
}
