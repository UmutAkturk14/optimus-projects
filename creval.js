/* OPT-152000 START */
(() => {
    const userId = Insider.getUserId();
    const attributesStorageName = 'ins-attributes-152000';

    if (Insider.systemRules.call('isUserLoggedIn') &&
        Insider.storage.localStorage.get(attributesStorageName)?.[0] !== userId) {
        const payload = {
            partner_name: Insider.partner.name,
            insider_id: userId,
            attributes: ['c_bigcommerce_customer_group']
        };

        Insider.request.post({
            url: 'https://cronus.useinsider.com/api/inone/get-contact-profile',
            data: payload,
            parse: true,
            success(response) {
                const attributes = response?.data?.attributes;

                if (attributes) {
                    Insider.storage.localStorage.set({
                        name: attributesStorageName,
                        value: [userId, attributes],
                        expires: 30,
                    });
                }
            },
            error(err) {
                Insider.logger.log(err);
            }
        });
    }
})({});
/* OPT-152000 END */

/* OPT-169758 START */
((self) => {
    const storageName = 'ins-average-order-purchase-169758';

    self.init = () => {
        if (Insider.systemRules.call('isUserLoggedIn') && Insider.storage.localStorage.get(storageName)) {
            self.getAverageWithUserId();
        } else {
            self.getAverageWithAjaxResponse();
        }
    };

    self.getAverageWithUserId = () => {
        const payload = {
            partner_name: Insider.partner.name,
            insider_id: Insider.getUserId(),
            events: {
                confirmation_page_view: {
                    params: ['usp', 'e_guid']
                }
            }
        };

        self.sendContactRequest(payload);
    };

    self.getAverageWithAjaxResponse = () => {
        Insider.utils.opt.ajaxListener((url, ajaxResponse, method) => {
            if (Insider.fns.has(url, '/api/identity/v1/get') && method === 'POST') {
                const payload = {
                    partner_name: Insider.partner.name,
                    insider_id: ajaxResponse,
                    events: {
                        confirmation_page_view: {
                            params: ['usp', 'e_guid']
                        }
                    }
                };

                self.sendContactRequest(payload);
            }
        });
    };

    self.sendContactRequest = (payload) => {
        Insider.request.post({
            url: 'https://cronus.useinsider.com/api/inone/get-contact-profile',
            headers: {
                'Content-Type': 'application/json'
            },
            data: Insider.fns.stringify(payload),
            parse: true,
            success: (response) => {
                const purchaseEvents = response?.data?.events?.confirmation_page_view ?? [];

                const result = purchaseEvents.reduce((accumulator, purchase) => {
                    if (!accumulator[purchase.e_guid]) {
                        accumulator[purchase.e_guid] = { e_guid: purchase.e_guid, usp: 0 };
                    }
                    accumulator[purchase.e_guid].usp += purchase.usp;

                    return accumulator;
                }, {});

                const total = Insider.fns.objectValues(result).reduce((sum, purchase) => (sum + purchase.usp), 0);
                const averageOrderPurchase =  Number((total / Insider.fns.keys(result).length).toFixed(2)) || 0;

                if (averageOrderPurchase) {
                    Insider.storage.localStorage.set({
                        name: storageName,
                        value: averageOrderPurchase,
                        expires: Insider.dateHelper.addMinutes(30)
                    });
                }
            },
            error: (error) => {
                Insider.logger.log(error);
            }
        });
    };

    self.init();
})({});
/* OPT-169758 END */