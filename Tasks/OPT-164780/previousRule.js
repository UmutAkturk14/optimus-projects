/* OPT-155406 START */
((self) => {
    'use strict';

    const builderId = Insider.browser.isDesktop() ? 4124 : 4137; /* OPT-163051 */
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const partnerModalSelector = '#uxs_8exdhh223rfe2oyu8epw7nfo_container';

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        hide: `ins-custom-hide-${ variationId }`
    };

    self.init = () => {
        if (variationId) {
            Insider.fns.onElementLoaded(partnerModalSelector, () => {
                if (!Insider.campaign.isControlGroup(variationId)) {
                    self.reset();
                    self.buildCSS();
                    self.hidePartnerModal();
                }
            }).listen();

            return true;
        }
    };

    self.reset = () => {
        const { style, hide } = classes;

        Insider.dom(`.${ style }`).remove();
        Insider.dom(partnerModalSelector).removeClass(hide);
    };

    self.buildCSS = () => {
        const { style, hide } = classes;

        const customStyle =
        `.${ hide } {
            display: none !important;
        }`;

        Insider.dom('<style>').addClass(style).html(customStyle).appendTo('head');
    };

    self.hidePartnerModal = () => {
        Insider.dom(partnerModalSelector).addClass(classes.hide);
    };

    return self.init();
})({});
/* OPT-155406 END */