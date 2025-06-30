/**
 * @typedef StopwatchData
 * @property {string} hash
 * @property {string} name
 * @property {number} time
 * @property {boolean} status
 * @property {string} updated_at
 */

const playIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
</svg>`;

const stopIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5m3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5"/>
</svg>`;

const deleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
</svg>`;

class Stopwatch {

    static keyStorage = 'counter_extension-stopwatch';
    static container = "#ce_div_stopwatch";

    interval;


    /**
     * Creates an instance of Stopwatch.
     *
     * @constructor
     * @param {null|undefined|StopwatchData} stopwatch
     */
    constructor(stopwatch) {
        this.hash = stopwatch?.hash ?? this.__generateHash();
        this.name = stopwatch?.name ?? "stopwatch";
        this.time = stopwatch?.time ?? 0;
        this.status = stopwatch?.status ?? false;
        this.updated_at = new Date(stopwatch?.updated_at ?? null);

        // calculate current time from last update in stopwatch
        this.__calculateTime();

        // insert the html content in extension container popup
        this.__insert();

        // if status is set to true, start the interval to increase one second in timer. This is just visual effects
        if (this.status) {
            this.start();
        }

        // if does not has pass the stopwatch, this is a new stopwatch, so we save in the local storage
        if (!stopwatch) {
            this.store();
        }
    }


    /**
     * Start the counter interval for each seconds increase plus one second. This is mostly visual effects, just save
     * the data once to update de timestamps and status of stopwatch. Inside interval just the html content in extension
     * popup in updated
     *
     * @returns {void}
     */
    start() {
        // update stopwatch status before update data in `store` method
        this.status = true;
        // need to save because each time extension popup is closed, the js and html are reset. So this save to keep
        // tracking last user action
        this.store();

        // define interval to increase one second in timer. This does not save the data in local storage. see the
        // `__calculateTime` method for more info about the timer
        this.interval = setInterval(() => {
            this.time += 1;
            // update visual text
            this.element.querySelector('.ce_stopwatch_time').innerHTML = this.getTime();
        }, 1000);
    }

    /**
     * Stop the counter and clear interval. This trigger the `store` method
     *
     * @returns {void}
     */
    stop() {
        this.status = false;
        this.store();
        clearInterval(this.interval);
    }


    /**
     * Returns the time formatted as `hs:mm:ss`
     *
     * @returns {string}
     */
    getTime() {
        const hours = Math.floor(this.time / 3600);
        const minutes = Math.floor((this.time % 3600) / 60);
        const seconds = this.time % 60;

        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');
    }

    __calculateTime() {
        if (!this.status || !this.updated_at) {
            return;
        }

        const currentTime = new Date();
        const lastPlayedTine = this.updated_at;

        this.time += Math.round(Math.abs((currentTime.getTime() - lastPlayedTine.getTime()) / 1000));
    }

    /**
     * Generate a new hash based on date time
     *
     * @returns {string}
     */
    __generateHash() {
        return Date.now().toString(36);
    }

    /**
     * Convert current stopwatch to html (string content of a card element), insert into a div element with the hash as
     * ID of it, and appends to stopwatch container in extension popup
     *
     * @returns {void}
     */
    __insert() {
        try {
            // creates element with stopwatch hash and set the class to add a margin from the next element bellow
            this.element = document.createElement('div');
            this.element.setAttribute('id', "ce_stopwatch-" + this.hash);
            this.element.setAttribute('class', "mb-2");

            // inserts the content and starts the listeners for buttons and input name. There is 3 triggers:
            // 1. resume counter
            // 2. pause counter
            // 3. rename counter
            this.element.innerHTML = this.toHtml();
            this.__listeners();

            // insert the element in stopwatch container
            document.querySelector(Stopwatch.container).appendChild(this.element);
        } catch (error) {
            threadError(error);
        }
    }

    /**
     * Event listeners for each stopwatch element
     * 1. resume counter
     * 2. pause counter
     * 3. rename counter
     *
     * @returns {void}
     */
    __listeners() {
        this.element.querySelector('#ce_stopwatch_delete').addEventListener('click', () => {
            this.delete();
            clearInterval(this.interval);
            this.element.remove();
        });

        this.element.querySelector('#ce_stopwatch_start').addEventListener('click', () => {
            if (this.status) {
                this.stop();
                this.element.querySelector('#ce_stopwatch_start').innerHTML = playIcon;
            } else {
                this.start();
                this.element.querySelector('#ce_stopwatch_start').innerHTML = stopIcon;
            }
        });

        this.element.querySelector(".ce_stopwatch_name").addEventListener('change', () => {
            this.name = this.element.querySelector(".ce_stopwatch_name")?.value ?? this.name;
            this.store();
        })
    }


    /**
     * Returns the list of stopwatch in localStorage
     *
     * @static
     * @returns {Array<StopwatchData>}
     */
    static storage() {
        try {
            return JSON.parse(window.localStorage.getItem(this.keyStorage) ?? '[]');
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    /**
     * Update current stopwatch in localStorage
     *
     * @returns {void}
     */
    store() {
        try {
            // Get current stopwatch in localStorage except current. This filter is based on item hash
            const items = Stopwatch.storage().filter(s => s.hash !== this.hash);

            // insert new data from current stopwatch updating timestamps (updated_at)
            items.push({ ...this.toArray(), updated_at: new Date(), });

            // update localStorage data
            window.localStorage.setItem(Stopwatch.keyStorage, JSON.stringify(items));
        } catch (error) {
            threadError(error);
        }
    }

    /**
     * Delete current stopwatch from localStorage
     *
     * @returns {void}
     */
    delete() {
        try {
            // update the local storage of stopwatch extension ignoring the current stopwatch based on hash
            window.localStorage.setItem(
                Stopwatch.keyStorage, JSON.stringify(
                    Stopwatch.storage().filter(s => s.hash !== this.hash)
                )
            );
        } catch (error) {
            threadError(error);
        }
    }

    /**
     * Convert stopwatch into a html card element based on current status and time
     *
     * @returns {string}
     */
    toHtml() {
        return `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title row">
                        <div class="col-8">
                            <input type="text" class="input-group-text ce_stopwatch_name" value="${this.name}" placeholder="Stopwatch name">
                        </div>
                    </h5>
                    <div class="row">
                        <div class="col-8">
                            <strong class="ce_stopwatch_time fs-2">${this.getTime()}</strong>
                        </div>
                        <div class="col-4 text-end">
                            <a id="ce_stopwatch_start" class="card-link text-primary" href="#" role="button">${this.status ? stopIcon : playIcon}</a>
                            <a id="ce_stopwatch_delete" class="card-link text-danger" href="#" role="button">${deleteIcon}</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Returns stopwatch attributes
     *
     * @returns {StopwatchData}
     */
    toArray() {
        try {
            return {
                hash: this?.hash,
                name: this?.name,
                time: this?.time,
                status: this?.status,
                updated_at: this?.updated_at,
            };
        } catch (error) {
            threadError(error);
            return null;
        }
    }
};
