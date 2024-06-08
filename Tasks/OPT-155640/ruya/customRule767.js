/* OPT-139976 START */
const isMobile = Insider.browser.isMobile();
const builderId =  isMobile ? 1700 : 1699; /* OPT-155640 */
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

/* const relativePosition =
(((Insider.campaign.get(variationId).pageSettings || {}).locationConfig || {}).relativePosition || {});

relativePosition.element = '#search-field'; OPT-155640 */

if (variationId) {
    if (isMobile) {
        Insider.eventManager.once(`touchend.search:icon:mobile:${ variationId }`, '#search-field', () => {
            Insider.campaign.info.show(variationId);
        });
    } else {
        Insider.campaign.info.show(variationId);
    }
}

false;
/* OPT-139976 END */
