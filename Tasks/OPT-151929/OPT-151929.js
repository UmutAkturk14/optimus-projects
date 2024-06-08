/* OPT-151929 START */
((self) => {
    'use strict';

    const builderId = { en_US: 570, ar_AR: 571 }[Insider.systemRules.call('getLang')];
    const storage = 'ins-form-abandonment-trigger-151929';
    const classes = {
        chakraInput: 'chakra-input',
        chakraTextArea: 'chakra-textarea',
        chakraErrorMessage: 'chakra-form__error-message'
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        chakraSubmitButton: '.chakra-button[type=submit]',
    });

    self.init = () => {
        Insider.logger.log('Form abandonment trigger is on.');
        self.setEvents();

        return Insider.storage.localStorage.get(storage);
    };

    self.setEvents = () => {
        Insider.eventManager.once('keydown',
            `${ selectors.chakraInput }, ${ selectors.chakraTextArea }`,
            () => {
                if (Insider.storage.localStorage.get(storage) !== true) {
                    Insider.storage.localStorage.set({
                        name: storage,
                        value: true
                    });
                }
            });

        Insider.eventManager.once('click',
            selectors.chakraSubmitButton,
            (event) => {
                if (Insider.dom(selectors.chakraErrorMessage).length === 0) {
                    Insider.storage.localStorage.set({
                        name: storage,
                        value: false
                    });

                    setTimeout(() => {
                        event.target.closest('form').submit();
                    }, 1000);
                }
            });
    };

    return self.init();
})({});
/* OPT-151929 END */
