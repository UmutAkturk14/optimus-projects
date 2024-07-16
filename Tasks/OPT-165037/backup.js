/* OPT-164169 START */
Insider.__external.PurchaseProgressionCampaigns164169 = (variationId) => {
    ((self) => {
        'use strict';

        const isControlGroup = Insider.campaign.isControlGroup(variationId);
        const storageName = `ins-removed-product-${ variationId }`; /* OPT-165037 */
        const requestParameters = {
            add: 'add',
            remove: 'remove'
        };

        const classes = {
            hidden: `ins-hidden-element-${ variationId }`,
            style: `ins-custom-style-${ variationId }`,
            wrapper: `ins-preview-wrapper-${ variationId }`
        };

        const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
            createdSelector[key] = `.${ classes[key] }`, createdSelector
        ), {
            progressText: '.ins-progress-text-row'
        });

        self.init = () => {
            if (variationId) {
                if (self.checkPageEligibility()) { /* OPT-165037 */
                    if (!isControlGroup) {
                        self.reset();
                        self.buildCSS();
                    }

                    setTimeout(() => {
                        self.checkCampaignVisibility();
                    }, 2000);
                    /* OPT-165037 START */
                } else if (Insider.systemRules.call('isOnCartPage')) {
                    self.handleCartPage();
                } /* OPT-165037 END */
            }
        };

        self.checkPageEligibility = () => Insider.systemRules.call('isOnProductPage') || Insider.systemRules.call('isOnCategoryPage'); /* OPT-165037 */

        self.reset = () => {
            Insider.dom(selectors.style).remove();
        };

        self.buildCSS = () => {
            const customStyle =
            `${ selectors.hidden } {
                display: none !important;
            }`;

            Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
        };

        self.checkCampaignVisibility = () => {
            const { add } = requestParameters;
            const { wrapper } = selectors;
            let isCampaignDisplayed = false;

            /* OPT-165037 START */
            if (Insider.storage.localStorage.get(storageName) && Insider.systemRules.call('getTotalCartAmount') > 30) {
                self.showCampaignAndClearStorage();
            }
            /* OPT-165037 END */

            Insider.utils.opt.ajaxListener((url, response, method) => {
                if (method === 'POST' && Insider.fns.has(url, add)) {
                    setTimeout(() => { /* OPT-165037 START */
                        if (self.getBasketAmount() > 30 && !Insider.dom(wrapper).exists() && !isCampaignDisplayed) {
                            self.showCampaignAndClearStorage();
                            /* OPT-165037 END */

                            isCampaignDisplayed = true;
                        }
                    }, 2000);
                }
            });
        };
        /* OPT-165037 START */
        self.handleCartPage = () => {
            Insider.utils.opt.ajaxListener((url, response, method) => {
                if (method === 'DELETE' && Insider.fns.has(url, requestParameters.remove)) {
                    Insider.storage.update({ name: storageName, value: true });
                }
            });
        };

        self.getBasketAmount = () => {
            const { total: basketTotal, shipping_cost: shippingCost } = window.insider_object?.basket ?? {};

            return basketTotal - shippingCost;
        };

        self.showCampaignAndClearStorage = () => {
            if (self.checkPageEligibility()) {
                Insider.campaign.info.show(variationId);
                Insider.storage.localStorage.remove(storageName);

                if (self.getBasketAmount() > 55 && !isControlGroup) {
                    Insider.fns.onElementLoaded(selectors.progressText, ($text) => {
                        $text.addClass(classes.hidden);
                    }).listen();
                }
            }
        };
        /* OPT-165037 END */

        self.init();
    })({});
};

true;
/* OPT-164169 END */