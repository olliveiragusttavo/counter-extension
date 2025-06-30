// When popup extension finish loads get stored data in local storage to show
document.addEventListener('DOMContentLoaded', () => {
    loadExtensionData();
});

// event listener to create a new stopwatch
document.querySelector('#ce_btn_new_stopwatch')?.addEventListener('click', () => {
    new Stopwatch();
});

/**
 * make a map in local storage data to show in extension popup
 *
 * @returns {void}
 */
function loadExtensionData() {
    try {
        // this use the storage static method of stopwatch. This is in case to create new functions in the extension, so
        // the stopwatch class contains the partner and key to the local storage
        // Is created a new instance for each saved stopwatch. The instance self added in the extension container
        Stopwatch.storage().map(stopwatch => new Stopwatch(stopwatch));
    } catch (error) {
        threadError(error);
    }
}
