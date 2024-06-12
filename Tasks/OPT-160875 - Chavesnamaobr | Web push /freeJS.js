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

                    getStorageInformations.notChangeStatus = false;
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
