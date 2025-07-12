/**
 * @typedef StopwatchData
 * @property {string} hash
 * @property {string} name
 * @property {number} time
 * @property {boolean} status
 * @property {string} updated_at
 */

const defaultAlertTime = 5000;

// using this svg to not import all icons. This application is too simple to load so many data
const playIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
</svg>`;

const pauseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0z"/>
</svg>`;

const deleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-backspace" viewBox="0 0 16 16">
  <path d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z"/>
  <path d="M13.683 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/>
</svg>`;

const resetIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
  <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
</svg>`;

const stopWatchIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stopwatch" viewBox="0 0 16 16">
  <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5z"/>
  <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64l.012-.013.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5M8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3"/>
</svg>`;

const hashTagIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
  <path d="M8.39 12.648a1 1 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1 1 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.51.51 0 0 0-.523-.516.54.54 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532s.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531s.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z"/>
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
        if (this.status && this.updated_at) {
            this.__calculateTime();
        }

        // insert the html content in extension container popup
        this.__insert();

        // if status is set to true, start the interval to increase one second in timer. This is just visual effects
        if (this.status) {
            this.resume();
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
    resume() {
        // update stopwatch status before update data in `store` method
        this.status = true;
        // need to save because each time extension popup is closed, the js and html are reset. So this save to keep
        // tracking last user action
        this.store();

        // define interval to increase one second in timer. This does not save the data in local storage. see the
        // `__calculateTime` method for more info about the timer
        this.interval = setInterval(() => {
            this.time += 1;
            this.updateTimer();
        }, 1000);
    }

    /**
     * update visual content
     *
     * @returns {void}
     */
    updateTimer() {
        this.element.querySelector('[name="ce_stopwatch_time"]').value = this.getTime();
    }

    /**
     * Stop the counter and clear interval. This trigger the `store` method
     *
     * @returns {void}
     */
    pause() {
        this.status = false;
        this.store();
        clearInterval(this.interval);
    }

    /**
     * Reset the timer to 0. This trigger the `store` method
     *
     * @returns {void}
     */
    reset() {
        this.time = 0;
        this.store();
        this.updateTimer();
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

    /**
     * Returns the last updated date formatted as `MM/DD/YYYY HH:mm:ss`. If the `updated_at` is not set
     *
     * @returns {string}
     */
    getUpdatedAt() {
        // if updated_at is not set, return empty string
        if (!this.updated_at) {
            return "";
        }

        // format the date to a readable format
        return this.updated_at.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    /**
     * Calculate the time based on the last updated timestamp and current time. This is the actual timer. The interval
     * is just visual effects to show the time increasing each second. Calling this method will update the `time`
     *
     * @returns {void}
     * @private
     */
    __calculateTime() {
        const currentTime = new Date();
        const lastPlayedTine = this.updated_at;

        this.time += Math.round(Math.abs((currentTime.getTime() - lastPlayedTine.getTime()) / 1000));
    }

    /**
     * Converts a time string in format `hh:mm:ss` to seconds
     *
     * @param {string} timeString
     * @returns {number} The time in seconds
     * @private
     */
    __timeStringToSeconds(timeString) {
        try {
            const [hours, minutes, seconds] = timeString.split(':').map(Number);
            return (hours * 3600) + (minutes * 60) + seconds;
        } catch (error) {
            threadError(error);
            return this.time;
        }
    }

    /**
     * Generate a new hash based on date time
     *
     * @returns {string}
     * @private
     */
    __generateHash() {
        return Date.now().toString(36);
    }

    /**
     * Convert current stopwatch to html (string content of a card element), insert into a div element with the hash as
     * ID of it, and appends to stopwatch container in extension popup
     *
     * @returns {void}
     * @private
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
     * 4. delete counter
     * 5. rename
     * 6. update manually the time input
     *
     * @returns {void}
     * @private
     */
    __listeners() {
        this.element.querySelector('.ce_stopwatch_delete').addEventListener('click', () => {
            this.delete();
            clearInterval(this.interval);
            this.element.remove();
        });

        this.element.querySelector('.ce_stopwatch_reset').addEventListener('click', () => {
            this.reset();
        });

        this.element.querySelector('.ce_stopwatch_start').addEventListener('click', () => {
            if (this.status) {
                this.pause();
                this.element.querySelector('.ce_stopwatch_start').innerHTML = playIcon;
            } else {
                this.resume();
                this.element.querySelector('.ce_stopwatch_start').innerHTML = pauseIcon;
            }
        });

        this.element.querySelector('[name="ce_stopwatch_name"]').addEventListener('change', () => {
            this.name = this.element.querySelector('[name="ce_stopwatch_name"]')?.value ?? this.name;
            this.store();
        });

        this.element.querySelector('[name="ce_stopwatch_time"]').addEventListener('input', () => {
            const inputValue = this.element.querySelector('[name="ce_stopwatch_time"]');

            if (this.__inputTimeIsValid(inputValue.value)) {
                this.__performeUpdateTime(inputValue.value);
            } else {
                this.__insertAlert(inputValue, "Incorrect time format. Expected 00:00:00 format");
            }
        });
    }

    /**
     * Validade the input time value. The format is `00:00:00` (hh:mm:ss). If the value is not valid, return false
     *
     * @param {string} inputValue
     * @returns {boolean}
     * @private
     */
    __inputTimeIsValid(inputValue) {
        // format 00:00:00
        const regex = /^\d{2}:\d{2}:\d{2}$/;
        return regex.test(inputValue);
    }

    /**
     * Update the time of the stopwatch based on the input value. This will pause the stopwatch if it is running,
     * convert the input value to seconds, and update the time
     *
     * @param {string} inputValue - The input value in format `hh:mm:ss`
     * @returns {void}
     */
    __performeUpdateTime(inputValue) {
        if (this.status) {
            this.pause();
        }

        // updating the timer
        this.time = this.__timeStringToSeconds(inputValue);

        // not passing the text to only clear the alert
        this.__insertAlert(this.element.querySelector('[name="ce_stopwatch_time"]'));
    }

    /**
     * Insert a alert after the `element`
     *
     * @param {HTMLElement} element
     * @param {string} html
     * @returns {void}
     */
    __insertAlert(element, html = "") {
        // remove any others alerts insert before. In this case is temp alerts
        element.parentElement.querySelectorAll('.ce_alert').forEach(e => e.remove());
        // creating and settings the new alert
        const elementAlert = document.createElement('span');
        elementAlert.classList.add('form-text', 'ce_alert', 'text-warning');
        elementAlert.innerHTML = html;

        element.insertAdjacentElement('afterend', elementAlert);

        // after some time remove the alert. This is inside a try catch cause the extension popup can be closed so the
        // alert element will not exist any more
        setTimeout(() => {
            try {
                elementAlert.remove();
            } catch (error) {
                threadError(error);
            }
        }, defaultAlertTime);
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
                    <div class="row">
                        <div class="col-12 input-group">
                            <span class="input-group-text text-secondary border-0">${hashTagIcon}</span>
                            <input type="text" class="form-control border-0 p-1 fs-3" name="ce_stopwatch_name" value="${this.name}" placeholder="Stopwatch name">
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-6">
                            <div class="input-group">
                                <span class="input-group-text text-secondary border-0">${stopWatchIcon}</span>
                                <input type="text" class="form-control border-0 p-1 fs-2" name="ce_stopwatch_time" value="${this.getTime()}">
                            </div>
                        </div>
                        <div class="col-6 text-end">
                            <div class="btn-group" role="group" aria-label="Buttons control">
                                <button type="button" class="btn text-danger ce_stopwatch_delete" title="Delete"">${deleteIcon}</a>
                                <button type="button" class="btn text-warning ce_stopwatch_reset" title="Reset timer">${resetIcon}</a>
                                <button type="button" class="btn text-primary ce_stopwatch_start" title="Resume/pause timer">${this.status ? pauseIcon : playIcon}</a>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <span class="text-secondary">Last updated: ${this.getUpdatedAt()}</span>
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
