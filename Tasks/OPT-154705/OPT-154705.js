/* OPT-154705 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 3708 : 3709;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const campaignIdsToHide = ['3586', '3587', '3398', '3494', '3559', '3560'];

    const classes = {
        badge: `ins-badge-${ variationId }`,
        join: `sp-custom-${ variationId }-1`,
        hide: `ins-hide-banner-${ variationId }`,
        style: `ins-custom-style-${ variationId }`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        addToCartButton: `.ins-add-to-cart-${ variationId }`
    });

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.buildCSS();
                self.setEvents();
            }

            return true;
        }
    };

    self.reset = () => {
        Insider.dom(selectors.hide).removeClass(classes.hide);
    };

    self.buildCSS = () => {
        const customStyle =
        `${ selectors.hide } {
            display: none !important;
        }`;

        Insider.dom('<style>').html(customStyle).appendTo('head');
    };

    self.setEvents = () => {
        Insider.eventManager.once(`${ isDesktop ? 'click' : 'touchend' }.hide:banners:${ variationId }`,
            selectors.addToCartButton, () => {
                const variationIds = campaignIdsToHide.map((builderIdToHide) =>
                    Insider.campaign.userSegment.getActiveVariationByBuilderId(builderIdToHide)
                );

                const visibleVariationIds = variationIds.filter((variationIdToHide) =>
                    Insider.fns.hasOwn(Insider.campaign.shownCampaigns, variationIdToHide)
                );

                visibleVariationIds.forEach((variationIdToHide) => {
                    const campaignWrapperSelector = `.ins-custom-wrapper-${ variationIdToHide }`;

                    Insider.dom(campaignWrapperSelector).addClass(classes.hide);
                });
            });
    };

    return self.init();
})({});
/* OPT-154705 END */
