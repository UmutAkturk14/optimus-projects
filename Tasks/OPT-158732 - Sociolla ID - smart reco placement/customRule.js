/* ZEN-164411 START */
const builderId = Insider.browser.isDesktop() ? 65 : 60;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
const selectedElement = '.header-with-bar';

Insider.fns.onElementLoaded(selectedElement, () => {
    Insider.campaign.info.show(variationId);
}, { infinite: true }).listen();
/* ZEN-164411 END */