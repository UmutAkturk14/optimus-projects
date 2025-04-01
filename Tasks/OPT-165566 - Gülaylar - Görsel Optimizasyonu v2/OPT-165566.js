/* OPT-165566 START */
((self) => {
    'use strict';

    const builderId = 3278;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const appendLocation = Insider.campaign.get(variationId)?.pageSettings?.locationConfig?.selectedElement ?? '';

    self.init = () => {
        if (variationId) {
            if (self.getPositionEligibility()) {
                Insider.campaign.info.show(variationId);
            } else {
                self.setEvents();
            }
        }
    };

    self.getPositionEligibility = () => {
        const $window = Insider.dom(window);
        const $appendElement = Insider.dom(appendLocation);

        return $appendElement.offset().top < ($window.scrollTop() + $window.height() + 100);
    };

    self.setEvents = () => {
        Insider.eventManager.once(`scroll.on:scroll:${ variationId }`, window, Insider.fns.throttle(() => {
            if (self.getPositionEligibility()) {
                Insider.campaign.info.show(variationId);
            }
        }, 1000));
    };

    self.init();
})({});
/* OPT-165566 END */