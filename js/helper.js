
/**
 * Debugs and reports extension errors
 *
 * @param {Error} error
 */
function threadError(error) {
    // TODO
    console.error(error);
}

/**
 * Returns the list of stopwatch in localStorage
 *
 * @param {string} keyStorage
 * @returns {*}
 */
function getFromStorage(keyStorage) {
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
 * @param {string} keyStorage
 * @param {*} data
 * @returns {void}
 */
function setOnStorage(keyStorage, data) {
    try {
        window.localStorage.setItem(keyStorage, JSON.stringify(data));
        return true;
    } catch (error) {
        threadError(error);
        return false;
    }
}
