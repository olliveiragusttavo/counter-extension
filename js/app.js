
class App {
    constructor() {
        // this content is builded from here to support languages
        this.buildContent();
        // loading data from local storage
        this.loadDataFromLocalStorage();
        // adding listeners to the buttons
        this.__listeners();
    }

    /**
     * Events listeners to the application
     *
     * @returns {void}
     * @private
     */
    __listeners() {
        // event listener to create a new stopwatch
        document.querySelector('#ce_btn_new_stopwatch')?.addEventListener('click', () => {
            new Stopwatch();
        });
    }

    /**
     * make a map in local storage data to show in extension popup
     *
     * @returns {void}
     */
    loadDataFromLocalStorage() {
        try {
            // this use the storage static method of stopwatch. This is in case to create new functions in the extension, so
            // the stopwatch class contains the partner and key to the local storage
            // Is created a new instance for each saved stopwatch. The instance self added in the extension container
            Stopwatch.storage().map(stopwatch => new Stopwatch(stopwatch));
        } catch (error) {
            threadError(error);
        }
    }

    /**
     * Build the content of the application
     *
     * @returns {void}
     * @private
     */
    buildContent() {
        document.querySelector('.container').innerHTML = `
            <div class="row p-2">
                <div class="col-8">
                    <h4>${currentLang.labels.projectName}</h4>
                </div>
                <div class="col-4 text-end">
                    <a id="ce_btn_new_stopwatch" class="btn btn-primary" href="#" role="button">${currentLang.buttons.new}</a>
                </div>
            </div>

            <div class="row" id="ce_div_stopwatch">
                <!-- javascript -->
            </div>

            <div class="row">
                <div class="col p-2 text-center">
                    <a class="me-2" target="_blank" href="https://github.com/olliveiragusttavo/counter-extension">${currentLang.labels.about}</a>
                    <a target="_blank" href="https://github.com/olliveiragusttavo/counter-extension/issues">${currentLang.labels.report}</a>
                </div>
            </div>
        `;
    }
}
