/* OPT-164169 START */
((self) => {
    'use strict';

    const builderId = 2381;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const selectors = {
        wrapper: `.ins-preview-wrapper-${ variationId }`,
        addToCart: '.cartAddProduct, #product-buy'
    };

    self.init = () => {
        if (variationId) {
            self.checkCampaignVisibility();
        }
    };

    self.checkCampaignVisibility = () => {
        Insider.eventManager.once(`click.track:add:to:cart:${ variationId }`, selectors.addToCart, () => {

        });
    };

    self.init();
})({});
/* OPT-164169 END */
// https://api.percentil.com/cart/add/product

/* OPT-164169 START */
((self) => {
    'use strict';

    const builderId = 2381;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const selectors = {
        wrapper: `.ins-preview-wrapper-${ variationId }`,
        addToCart: '.cartAddProduct, #product-buy'
    };

    self.init = () => {
        if (variationId) {
            self.checkCampaignVisibility();
        }
    };

    self.checkCampaignVisibility = () => {
        Insider.utils.opt.ajaxListener((url, response, method) => {
            if (method === 'POST' && Insider.fns.has(url, 'add')) {
                setTimeout(() => {
                    if (Insider.utils.getDataFromIO('basket', 'total') > 30 && !Insider.dom(wrapper)) {
                        debugger;
                        Insider.campaign.info.show(variationId);
                    }
                }, 500);
            }
        });
    };

    self.init();
})({});
/* OPT-164169 END */
// https://api.percentil.com/cart/add/product
