/* OPT-162044 START */
((self) => {
    'use strict';

    const builderId = Insider.browser.isDesktop() ? 411 : 412;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const clickCollectGoalId = 102;

    const config = {
        targetPurchaseTypeContainerText: 'Order Summary',
        targetPurchaseTypeText: 'Click & Collect',
        placeOrderButtonText: 'place order',
        newText: 'for FREE CLICK & COLLECT In store & Online'
    };

    const classes = {
        goal: `sp-custom-${ variationId }-1`,
    };

    const { targetPurchaseTypeContainerText, targetPurchaseTypeText } = config;

    const selectors = {
        purchaseTypeSelector: `h2:contains(${ targetPurchaseTypeContainerText }) + div span:contains(${ targetPurchaseTypeText })`,
        placeOrderButtonSelector: '.gdiUC.button-root',
        textSelector: 'span:contains(In Store & Online)',
        newTextSelector: 'span:contains(for FREE CLICK & COLLECT In store & Online)',
    };

    self.init = () => {
        const { newText } = config;
        const { textSelector, newTextSelector } = selectors;
        const { goal } = classes;

        if (variationId) {
            if (Insider.fns.hasParameter('/checkout')) {
                self.setPurchaseType();
            }

            if (Insider.systemRules.call('isOnAfterPaymentPage')) {
                self.checkGoal();
            }

            if (Insider.systemRules.call('isOnProductPage')) {
                if (Insider.dom(newTextSelector).text() === newText) {
                    Insider.campaign.custom.show(variationId);
                } else {
                    self.reset();
                    Insider.fns.onElementLoaded(textSelector, () => {
                        if (!Insider.campaign.isControlGroup(variationId)) {
                            Insider.dom(textSelector).text(newText).addClass(goal);
                        }

                        Insider.campaign.custom.show(variationId);
                    }).listen();
                }
            }
        }
    };

    self.setPurchaseType = () => {
        const { placeOrderButtonSelector, purchaseTypeSelector } = selectors;

        Insider.eventManager.once(`click.place:order:button:${ variationId }`,
            placeOrderButtonSelector, () => {
                const storageName = 'ins-purchase-type-162044';
                let storageValue = false;

                if (Insider.dom(purchaseTypeSelector).exists()) {
                    storageValue = true;
                }

                Insider.storage.localStorage.set({
                    name: storageName,
                    value: storageValue,
                    expires: Insider.dateHelper.ONE_MONTH_AS_DAYS,
                });
            });
    };

    self.checkGoal = () => {
        if (Insider.storage.localStorage.get('ins-purchase-type-161914')) {
            Insider.utils.opt.sendCustomGoal(builderId, clickCollectGoalId, true);
        }
    };

    self.reset = () => {
        const { textSelector } = selectors;
        const { goal } = classes;

        Insider.dom(textSelector)?.removeClass(goal);
    };

    self.init();
})({});
/* OPT-162044 END */
