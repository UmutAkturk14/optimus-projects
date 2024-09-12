/* OPT-166269 START */
(() => {
    'use strict';

    const builderId = 1;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const partnerModalSelector = !Insider.browser.isMobile() ? '#informUsModalCenter:visible'
        : '#informUsResponsiveModalCenter:visible';

    if (variationId) {
        if (!Insider.campaign.isControlGroup(variationId)) {
            Insider.fns.onElementLoaded(partnerModalSelector, () => {
                Insider.dom(`${ partnerModalSelector }, .modal-backdrop`).addClass(`ins-hide-${ variationId }`).hide();
            }).listen();
        }

        Insider.campaign.info.show(variationId);
    }
})({});
/* OPT-166269 END */