/* OPT-152571 START */
((self) => {
    'use strict';

    const builderId = Insider.browser.isDesktop() ? 483 : 484;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const deliveryTypeStorage = `ins-delivery-type-${ variationId }`;
    const deliveryTypes = {
        homeDelivery: 'Home Delivery',
        clickCollect: 'Click & Collect'
    };

    const config = {
        addressTitle: '.view-address__title'
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
        Insider.utils.opt.ajaxListener((url, response, method) => {
            if (method === 'GET' && Insider.fns.has(url, 'payment-methods')) {
                const { homeDelivery, clickCollect } = deliveryTypes;

                Insider.storage.localStorage.set({
                    name: deliveryTypeStorage,
                    value: Insider.dom(config.addressTitle).text().trim() === homeDelivery ?
                        homeDelivery : clickCollect
                });
            }
        });
    };

    self.sendGoals = () => {
        const deliveryType = Insider.storage.localStorage.get(deliveryTypeStorage);

        if (deliveryType) {
            const goalId = deliveryType === deliveryTypes.homeDelivery ? 105 : 106;

            Insider.utils.opt.sendCustomGoal(builderId, goalId, true);
        }
    };

    return self.init();
})({});
/* OPT-152571 END */
