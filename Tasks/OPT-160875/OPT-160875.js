/* OPT-109637 START */
Insider.__external.ajaxListener = function (callback) {
    'use strict';

    const oldOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function (method, url) {
        this.addEventListener('readystatechange', function () {
            if (this.responseType !== 'arraybuffer' && this.responseType !== 'blob'
            && this.readyState === 4 && this.status === 200 && typeof callback === 'function') {
                callback(url, this.response, method);
            }
        });

        oldOpen.apply(this, arguments);
    };
};

Insider.__external.checkInformationSendOpt109637 = function (form) {
    const isOnProductPage = Insider.systemRules.call('isOnProductPage');

    const usageFormsOfInputs = {
        theSameFormsUsageInputs: ['envioumensagem', 'agendouvisita'],
        differentFormsUsageInputs: [
            'envioumensagemwhatsapp',
            'viutelefone',
            'simuloufinanciamento1',
            'simuloufinanciamento2'
        ]
    };

    const formStorageName = 'ins-form-informations-opt109637';
    let isFormSend = Insider.storage.localStorage.get(formStorageName) ||
{
    envioumensagem: true,
    agendouvisita: true,
    envioumensagemwhatsapp: true,
    viutelefone: true,
    simuloufinanciamento1: true,
    simuloufinanciamento2: true
};

    const setStorage = function (storageName, storageValue) {
        Insider.storage.localStorage.set({
            name: storageName,
            value: storageValue,
            expires: 360
        });
    };

    setStorage(formStorageName, isFormSend);

    /* OPT-110287 START */
    let getCurrentTime = Insider.dateHelper.getTime();
    const timeStorageName = 'ins-not-sended-forms-time-opt110287';
    let getTimeInformationsForms = Insider.storage.localStorage.get(timeStorageName) ||
{
    envioumensagem: {
        notChangeStatus: true,
        changeTime: getCurrentTime
    },
    agendouvisita: {
        notChangeStatus: true,
        changeTime: getCurrentTime
    },
    envioumensagemwhatsapp: {
        notChangeStatus: true,
        changeTime: getCurrentTime
    },
    viutelefone: {
        notChangeStatus: true,
        changeTime: getCurrentTime
    },
    simuloufinanciamento1: {
        notChangeStatus: true,
        changeTime: getCurrentTime
    },
    simuloufinanciamento2: {
        notChangeStatus: true,
        changeTime: getCurrentTime
    }
};

    setStorage(timeStorageName, getTimeInformationsForms);
    /* OPT-110287 END */

    if (isOnProductPage) {
        Insider.eventManager.once(`input.${ form.tag }:form:opt109637`, `${ form.selectors.name },${
            form.selectors.mail },${ form.selectors.phone }`,
        function () {
            isFormSend = Insider.storage.localStorage.get(formStorageName);

            if ((usageFormsOfInputs.theSameFormsUsageInputs.indexOf(form.tag) > -1 &&
                Insider.dom(form.selectors.container).attr('class') === 'checked') ||
                (usageFormsOfInputs.differentFormsUsageInputs.indexOf(form.tag) > -1)) {
                isFormSend[form.tag] = false;

                setStorage(formStorageName, isFormSend);

                /* OPT-110287 START */
                getTimeInformationsForms = Insider.storage.localStorage.get(timeStorageName);
                getCurrentTime = Insider.dateHelper.getTime();
                /* OPT-111567 START */
                const getStorageInformations = getTimeInformationsForms[form.tag];

                getStorageInformations.notChangeStatus = false;
                getStorageInformations.changeTime = getCurrentTime;
                getStorageInformations.lastAbandonedUrl = Insider.fns.parseURL().rawHref;
                /* OPT-111567 END */

                setStorage(timeStorageName, getTimeInformationsForms);
                /* OPT-110287 END */
            }

        });

        if (Insider.fns.isFunction(Insider.__external.ajaxListener)) {
            Insider.__external.ajaxListener(function (url, response, method) {
                if (method === 'POST' && url.indexOf(form.url) > -1) {
                    isFormSend = Insider.storage.localStorage.get(formStorageName);

                    isFormSend[form.tag] = true;

                    setStorage(formStorageName, isFormSend);

                    /* OPT-110287 START */
                    getTimeInformationsForms = Insider.storage.localStorage.get(timeStorageName);
                    getCurrentTime = Insider.dateHelper.getTime();
                    /* OPT-111567 START */
                    const getStorageInformations = getTimeInformationsForms[form.tag];

                    getStorageInformations.notChangeStatus = true; /* OPT-160875 */
                    getStorageInformations.changeTime = getCurrentTime;
                    getStorageInformations.lastAbandonedUrl = 'https://www.chavesnamao.com.br/';
                    /* OPT-111567 END */

                    setStorage(timeStorageName, getTimeInformationsForms);
                    /* OPT-110287 END */
                }
            });
        } else {
            Insider.logger.log('Insider.__external.ajaxListener is not a function.');
        }
    }

    return Insider.storage.localStorage.get(formStorageName);
};
/* OPT-109637 END */

/* OPT-114389 START */
((self) => {
    'use strict';

    const eventAction = Insider.browser.isMobile() ? 'touchend' : 'click';
    const isAdvertisementPage =
    Insider.fns.hasParameter('ins-anunciar-gratis-imoveis-casas-apartamentos/pessoa-juridica/#0');
    const isAutoFormPage = Insider.fns.hasParameter('anunciar-gratis-carros-e-motos/pessoa-juridica/#step') ||
    Insider.fns.hasParameter('anunciar-gratis-carros-e-motos/pessoa-juridica/#2');
    const isAutoFormAlternativeFinish = Insider.fns.hasParameter('anunciar-gratis-carros-e-motos/pessoa-juridica/#3');
    const isAdvertisementFormPage =
    Insider.fns.hasParameter('anunciar-gratis-imoveis-casas-apartamentos/pessoa-juridica/');
    const isAutoFormButtonsPage = Insider.fns.hasParameter('anunciar-gratis-carros-e-motos/pessoa-juridica/#0');
    const formDataStorageName = 'ins-form-data-114389';
    const defaultUrl = 'https://www.chavesnamao.com.br/';

    const formData = Insider.storage.localStorage.get(formDataStorageName) || {
        corretorButtonClicked: false,
        imobiliariaButtonClicked: false,
        autoFormReached: false,
        advertisementFormReached: false,
        autoFormFinished: false,
        corretorFormFinished: false,
        imobiliariaFormFinished: false,
        corretorFormReached: false,
        imobiliariaFormReached: false
    };

    self.init = () => {
        Insider.storage.localStorage.set({
            name: formDataStorageName,
            value: formData
        });

        self.setFormAttributes();
    };

    self.setFormAttributes = () => {
        if (isAdvertisementPage) {
            Insider.eventManager.once(`${ eventAction }.set:is:button:clicked:114389`,
                'button#corretor, button#imobiliaria', (event) => {
                    Insider.__external.focusedFormName114389 = Insider.dom(event.target).text().trim();

                    if (Insider.__external.focusedFormName114389 === 'CORRETOR') {
                        self.updateLocalStorage({
                            corretorButtonClicked: true,
                            corretorFormFinished: false
                        });
                    } else {
                        self.updateLocalStorage({
                            imobiliariaButtonClicked: true,
                            imobiliariaFormFinished: false
                        });
                    }

                    self.initializeApi();
                });
        } else if (isAutoFormPage || isAdvertisementFormPage || isAutoFormAlternativeFinish || isAutoFormButtonsPage) {
            const $advertisementFormFinishButton = Insider.dom('#realEstateConvertionPJ');
            const $autoFormFinishButton = Insider.dom('#vehicleConvertionPJ');
            const $autoFormStartButton = Insider.dom('.ctaBox');

            if (isAutoFormPage) {
                Insider.eventManager.once(`${ eventAction }.reinit:api:on:back:button:114389`, '.icon-bk-arrow',
                    () => {
                        window.history.pushState(
                            '',
                            '',
                            `${ defaultUrl }anunciar-gratis-carros-e-motos/pessoa-juridica/#0`
                        );
                        window.location.reload();

                        self.initializeApi();
                    });

                self.updateLocalStorage({
                    autoFormReached: true,
                });
            } else if (isAdvertisementFormPage) {
                Insider.eventManager.once(`${ eventAction }.reinit:api:on:previous:button:114389`, '.icon-bk-arrow',
                    () => {
                        window.history.pushState(
                            '',
                            '',
                            `${ defaultUrl }anunciar-gratis-imoveis-casas-apartamentos/pessoa-juridica/#0`
                        );
                        window.location.reload();

                        self.initializeApi();
                    });

                /* OPT-126910 START */
                const formSelectors = '#realEstateConvertionPJ, .form input, #selectCity, #selectedOpt';

                Insider.eventManager.once('click.set:reached:storage:126910', formSelectors, (event) => {
                    event.target.id === 'realEstateConvertionPJ' ?
                        Insider.fns.onElementLoaded('.bt', () => {
                            self.updateLocalStorage ({ imobiliariaFormFinished: true });
                        }).listen() :
                        self.updateLocalStorage({ imobiliariaFormReached: true });
                });
                /* OPT-126910 END */

            } else if (isAutoFormAlternativeFinish) {
                self.updateLocalStorage({ autoFormFinished: true });
            } else if (isAutoFormButtonsPage) {
                Insider.fns.onElementLoaded($autoFormStartButton, () => {
                    setTimeout(() => {
                        Insider.eventManager.once(`${ eventAction }.set:form:finished`, $autoFormStartButton, () => {
                            self.updateLocalStorage({
                                autoFormFinished: false,
                            });

                            self.initializeApi();
                        });
                    }, 500);
                }).listen();
            }

            if ($advertisementFormFinishButton.exists() || $autoFormFinishButton.exists()) {
                const $finishButton = $advertisementFormFinishButton.exists() ? $advertisementFormFinishButton :
                    $autoFormFinishButton;

                Insider.eventManager.once(`${ eventAction }.finish:form:114389`, $finishButton, () => {
                    isAutoFormPage && self.updateLocalStorage({
                        autoFormFinished: true,
                    });

                    if (Insider.__external.focusedFormName114389 === 'CORRETOR') {
                        self.updateLocalStorage({
                            corretorFormFinished: isAdvertisementFormPage && true,
                            corretorButtonClicked: formData.corretorButtonClicked && false,
                        });
                    } else if (Insider.__external.focusedFormName114389 === 'IMOBILIÁRIA') {
                        self.updateLocalStorage({
                            imobiliariaFormFinished: isAdvertisementFormPage && true,
                            imobiliariaButtonClicked: formData.imobiliariaButtonClicked && false
                        });
                    }

                    self.initializeApi();
                });
            }
        }
    };

    self.updateLocalStorage = (value) => {
        Insider.storage.update({
            name: formDataStorageName,
            value,
        });
    };

    self.initializeApi = () => {
        setTimeout(function () {
            Insider.logger.log('OPT-114389 API Inited');

            Insider.eventManager.dispatch('init-manager:re-initialize');
        }, 500);
    };

    self.init();
})({});
/* OPT-114389 END */
