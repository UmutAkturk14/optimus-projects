/* OPT-164169 START */
((self) => {
    'use strict';

    const builderId = 2381;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const requestUrls = {
        add: 'https://api.percentil.com/cart/add/product',
        remove: 'https://api.percentil.com/cart/remove/product'
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
            self.reset();
            self.buildCSS();
            self.checkCampaignVisibility();
        }
    };

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
        const { add, remove } = requestUrls;
        const { wrapper, progressText } = selectors;
        let isCampaignDisplayed = false;

        Insider.utils.opt.ajaxListener((url, response, method) => {
            if (method === 'POST' && (url === add || url === remove)) {
                setTimeout(() => {
                    const basketTotal = Insider.utils.getDataFromIO('basket', 'total');

                    if (basketTotal > 30 && !Insider.dom(wrapper).exists() && !isCampaignDisplayed) {
                        Insider.campaign.info.show(variationId);

                        if (basketTotal > 55) {
                            Insider.fns.onElementLoaded(progressText, (text) => {
                                text.addClass(classes.hidden);
                            }).listen();
                        }

                        isCampaignDisplayed = true;
                    }
                }, 500);
            }
        });
    };

    self.init();
})({});
/* OPT-164169 END */
