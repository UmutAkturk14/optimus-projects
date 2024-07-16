/* OPT-164268 START */
(() => {
    'use strict';

    const builderId = 8;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const requestText = 'timeline';

    if (variationId) {
        Insider.campaign.info.show(variationId);

        Insider.utils.opt.ajaxListener((url, response, method) => {
            if (method === 'GET' && Insider.fns.has(url, requestText)) {
                self.getInBasketData();
            }
        });
    }

    self.getInBasketData = () => {
        const productId = Insider.systemRules.call('getCurrentProduct').id;
        const requestData = {
            partner: Insider.partner.name,
            basket: true,
            campId: variationId,
            rv: { inBasketCount: { start: 5, end: 10 }},
            ms: {},
            noi: {},
            uniqueId: productId };

        const requestBody = Insider.fns.encode(JSON.stringify(requestData));

        fetch('https://abacus.api.useinsider.com/get-purchase-stats', {
            headers: {
                'accept': '*/*',
                'accept-language': 'en-GB,en;q=0.9',
                'cache-control': 'no-cache',
                'content-type': 'text/plain',
                'pragma': 'no-cache',
                'priority': 'u=1, i',
                'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Linux"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site'
            },
            referrer: 'https://sirthelabel.com/',
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: requestBody,
            method: 'POST',
            mode: 'cors',
            credentials: 'omit'
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${ response.status }`);
                }

                console.log('Response: ', response);
            })
            .then((data) => {
                console.log('Data:', data);
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
            });
    };
})({});
/* OPT-164268 END */
