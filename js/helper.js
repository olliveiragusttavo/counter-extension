
/**
 * Debugs and reports extension errors
 *
 * @exports
 * @param {Error} error
 */
export function threadError(error) {
    // TODO
    console.error(error);
}

/**
 * Returns the list of stopwatch in localStorage
 *
 * @exports
 * @param {string} keyStorage
 * @returns {*}
 */
export function getFromStorage(keyStorage) {
    try {
        return JSON.parse(window.localStorage.getItem(keyStorage) ?? '[]');
    } catch (error) {
        threadError(error);
        return null;
    }
}

/**
 * Update current stopwatch in localStorage
 *
 * @exports
 * @param {string} keyStorage
 * @param {*} data
 * @returns {void}
 */
export function setOnStorage(keyStorage, data) {
    try {
        window.localStorage.setItem(keyStorage, JSON.stringify(data));
        return true;
    } catch (error) {
        threadError(error);
        return false;
    }
}
