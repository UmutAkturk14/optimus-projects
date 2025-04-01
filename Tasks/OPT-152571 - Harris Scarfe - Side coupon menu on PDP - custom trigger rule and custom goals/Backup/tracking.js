/* OPT-152571 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 483 : 484;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const deliveryTypeStorage = `ins-delivery-type-${ variationId }`;
    const deliveryTypes = {
        homeDelivery: 'Home Delivery',
        clickCollect: 'Click & Collect'
    };

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                const isOnAfterPaymentPage = Insider.systemRules.call('isOnAfterPaymentPage');

                if (Insider.fns.hasParameter('checkout') && !isOnAfterPaymentPage) {
                    self.setDelivery();
                } else if (isOnAfterPaymentPage) {
                    self.sendGoals();
                }
            }

            return true;
        }
    };

    self.setDelivery = () => {
        Insider.utils.opt.ajaxListener((url, _, method) => {
            if (method === 'GET' && url.includes('payment-methods')) {
                Insider.storage.localStorage.set({
                    name: deliveryTypeStorage,
                    value: Insider.dom('.view-address__title').text().trim() === deliveryTypes.homeDelivery
                        ? deliveryTypes.homeDelivery : deliveryTypes.clickCollect
                });
            }
        });
    };

    self.sendGoals = () => {
        if (Insider.storage.localStorage.get(deliveryTypeStorage)) {
            const goalId = Insider.storage.localStorage.get(deliveryTypeStorage) === deliveryTypes.homeDelivery
                ? 105 : 106;

            Insider.utils.opt.sendCustomGoal(builderId, goalId, true);
        }
    };

    return self.init();
})({});
/* OPT-152571 END */
