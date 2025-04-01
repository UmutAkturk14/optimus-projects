// Social Proof
/* OPT-164268 START */
(() => {
    'use strict';

    const builderId = 8;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const appendLocation = '.swatch.Color.product-color.clearfix';

    if (variationId) {
        Insider.fns.onElementLoaded(appendLocation, () => {
            Insider.campaign.info.show(variationId);
        }).listen();
    }
})({});
/* OPT-164268 END */

// Shopping Trigger
/* OPT-164268 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 13 : 14;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const classes = {
        hidden: `ins-hidden-element-${ variationId }`,
        style: `ins-custom-style-${ variationId }`,
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        cartItem: '.cart-drawer-list .row .grid-list-40',
        partnerCart: '.cart-shipping'
    });

    self.init = () => {
        if (variationId) {
            Insider.fns.onElementLoaded(selectors.cartItem, () => {
                if (!Insider.campaign.isControlGroup(variationId)) {
                    self.reset();
                    self.buildCSS();
                    self.addClass();
                }

                Insider.campaign.info.show(variationId);
            }).listen();
        }
    };

    self.reset = () => {
        const { style, hidden: hiddenSelector } = selectors;
        const { hidden } = classes;

        Insider.dom(style).remove();
        Insider.dom(hiddenSelector).removeClass(hidden);
    };

    self.buildCSS = () => {
        const { hidden } = selectors;

        const customStyle =
      `${ hidden } {
          display: none !important;
      }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.addClass = () => {
        Insider.dom(selectors.partnerCart).addClass(classes.hidden);
    };

    return self.init();
})({});
/* OPT-164268 END */
