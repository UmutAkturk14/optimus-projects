/* OPT-161796 START */
const builderId = 2660;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
const eventName = `scroll.change:height:${ variationId }`;

if (variationId) {
    Insider.eventManager.once(eventName, window, Insider.fns.throttle(() => {
        if (Insider.dom(window).scrollTop() >= 500) {
            Insider.campaign.info.show(variationId);

            Insider.eventManager.off(eventName, window);
        }
    }, 500));
}
/* OPT-161796 END */
