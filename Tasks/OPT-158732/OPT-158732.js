/* OPT-158732 START */
const builderId = Insider.browser.isDesktop() ? 65 : 60;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
const selectedElement = '.header-with-bar';

if (variationId) {
    if (!Insider.campaign.isControlGroup(variationId)) {
        Insider.fns.onElementLoaded(selectedElement, () => {
            Insider.campaign.info.show(variationId);
        }, { infinite: true }).listen();
    }
}
/* OPT-158732 END */
