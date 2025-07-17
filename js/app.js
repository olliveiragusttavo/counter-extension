import constants from './constants.js';
import { getFromStorage, setOnStorage, threadError } from "./helper.js";
import { lang } from './lang/lang.js';
import Stopwatch from './stopwatch.js';

export default class App {

    static storageKey = 'counter_extension-app';

    /**
     * The theme of the application, which can be 'dark', 'light', or null (not yet set).
     *
     * @type {'dark'|'light'|null}
     */
    theme = 'light';

    constructor() {
        this.setTheme(
            getFromStorage(App.storageKey)?.theme || null
        );

        // this content is builded from here to support languages
        this.__buildContent();
        // loading data from local storage
        this.loadDataFromLocalStorage();
        // adding listeners to the buttons
        this.__listeners();
    }

    /**
     * Sets the theme of the application based on the user's system preference or a specified theme.
     *
     * @param {'dark'|'light'|null} theme
     */
    setTheme(theme) {
        if (![null, 'light', 'dark'].includes(theme)) {
            console.warn(`Theme "${theme}" is not supported. Defaulting to 'light'.`);
            theme = 'light';
        }

        // get the default theme if user not set
        if (!theme) {
            theme = this.__getNavigatorTheme();
        }

        // saving on navigator storage
        if (this.theme !== theme) {
            setOnStorage(App.storageKey, { theme });
        }

        // changing theme
        this.theme = theme;
        document.documentElement.setAttribute('data-bs-theme', this.theme);

        // changing icon on container
        if (document.querySelector('#ce_btn_theme')) {
            document.querySelector('#ce_btn_theme').innerHTML = constants.icons[this.theme];
        }
    }

    /**
     * Returns the current theme based on the user's system preference.
     *
     * @returns {("dark" | "light")}
     * @private
     */
    __getNavigatorTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        } else {
            return 'light';
        }
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

        // event for switching themes
        document.querySelector('#ce_btn_theme')?.addEventListener('click', () => {
            this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
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
            getFromStorage(Stopwatch.keyStorage)?.map(stopwatch => new Stopwatch(stopwatch));
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
    __buildContent() {
        document.querySelector('.container').innerHTML = `
            <div class="row p-2">
                <div class="col-1 text-center" id="ce_btn_theme" role="button" title="${lang('labels.theme')}">
                    ${constants.icons[this.theme]}
                </div>
                <div class="col-7">
                    <h4>${lang('labels.projectName')}</h4>
                </div>
                <div class="col-4 text-end">
                    <a id="ce_btn_new_stopwatch" class="btn btn-primary" href="#" role="button">${lang('buttons.new')}</a>
                </div>
            </div>

            <div class="row" id="ce_div_stopwatch">
                <!-- javascript -->
            </div>

            <div class="row">
                <div class="col p-2 text-center">
                    <a class="me-2" target="_blank" href="https://github.com/olliveiragusttavo/counter-extension">${lang('labels.about')}</a>
                    <a target="_blank" href="https://github.com/olliveiragusttavo/counter-extension/issues">${lang('labels.report')}</a>
                </div>
            </div>
        `;
    }
}
