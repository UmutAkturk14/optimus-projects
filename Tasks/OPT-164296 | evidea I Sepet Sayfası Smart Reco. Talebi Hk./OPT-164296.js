/* OPT-164296 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 2204 : 2205;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const kargoBaremi = 700;
    const addedProduct = '.basket-item-added__content:visible';
    const storageName = `ins-free-delivery-parameters-${ variationId }`;

    self.init = () => {
        if (variationId) {
            self.checkCampaignVisibility();
        }
    };

    self.checkCampaignVisibility = () => {
        const cartAmount = Insider.systemRules.call('getTotalCartAmount');

        if (cartAmount > 0 && kargoBaremi > cartAmount) {
            const priceDifference = kargoBaremi - cartAmount;
            const priceParameters = {
                lowest: priceDifference,
                highest: priceDifference * 10
            };

            Insider.storage.update({
                name: storageName,
                value: priceParameters,
            });

            Insider.campaign.info.show(variationId);
        } else {
            Insider.fns.onElementLoaded( addedProduct, () => {
                self.checkCampaignVisibility();
            }).listen();
        }
    };

    self.init();
})({});
/* OPT-164296 END */
