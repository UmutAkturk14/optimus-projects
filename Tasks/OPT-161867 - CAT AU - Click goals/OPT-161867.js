/* OPT-161867 START */
const devicePlatform = Insider.browser.getPlatform();
const builderId = {
    web: 106,
    mobile: 107,
    tablet: 108
}[devicePlatform];

const goalIds = {
    web: {
        'WORKWEAR': 33,
        'WORKBOOTS': 34,
        'PANTS': 35,
        'TEE\'S & TOPS': 36
    },
    mobile: {
        'WORKWEAR': 37,
        'WORKBOOTS': 38,
        'PANTS': 39,
        'TEE\'S & TOPS': 40
    },
    tablet: {
        'WORKWEAR': 41,
        'WORKBOOTS': 42,
        'PANTS': 43,
        'TEE\'S & TOPS': 44
    }
}[devicePlatform];

const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
const clickMethod = Insider.browser.isDesktop() ? 'click' : 'touchend';

if (variationId) {
    if (!Insider.campaign.isControlGroup(variationId)) {
        Insider.eventManager.once(`${ clickMethod }:send:custom:goal:${ variationId }`, document, (event) => {
            const targetText = Insider.dom(event.target).text();
            const goalKeys = Insider.fns.keys(goalIds);

            if (Insider.fns.has(goalKeys, targetText)) {
                const goalId = goalIds[targetText];

                Insider.utils.opt.sendCustomGoal(builderId, goalId, true);
            }
        }, true);

    }

    true;
}
/* OPT-161867 END */
