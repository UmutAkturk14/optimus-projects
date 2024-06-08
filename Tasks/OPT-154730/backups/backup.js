/* OPT-154730 START */
const isDesktop = Insider.browser.isDesktop();
const builderId = isDesktop ? 849 : 850;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
const goalId = 358;
const applySuccessfulSelector = 'body > div.container.main-content > div > div > h2';

Insider.fns.onElementLoaded(applySuccessfulSelector, () => {
    if (Insider.fns.has(Insider.dom(applySuccessfulSelector).text(), isDesktop ?
        'Your application was sent to' : 'Your Application has been send to')) {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                Insider.utils.opt.sendCustomGoal(builderId, goalId, false);

                Insider.campaign.custom.show(variationId);
            }

            true;
        }
    }
}).listen();

false;
/* OPT-154730 END */
