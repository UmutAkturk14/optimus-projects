/* OPT-154729 START */
const isDesktop = Insider.browser.isDesktop();
const builderId = isDesktop ? 875 : 876;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
const goalId = 17;
const applySuccessfulSelector = 'body > div.container.main-content > div > div > h2:contains("Your application was sent to")';

if (variationId) {
    Insider.fns.onElementLoaded(applySuccessfulSelector, () => {
        if (!Insider.campaign.isControlGroup(variationId)) {
            Insider.utils.opt.sendCustomGoal(builderId, goalId, false);
        }

        Insider.campaign.custom.show(variationId);
    }).listen();
}

false;
/* OPT-154729 END */
