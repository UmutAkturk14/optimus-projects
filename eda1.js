/* OPT-160439 START */
((self) => {
    'use strict';

    const builderId = 627;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const storageName = 'ins-is-user-abandoned-subscription-160439';

    self.init = () => {
        if (variationId) {
            if (Insider.fns.hasParameter('/subscriptions/checkout/') && Insider.systemRules.call('isUserLoggedIn') && !Insider.fns.hasParameter('https://www.danmurphys.com.au/subscriptions/checkout/SUBMDMRWS/red-velvet') && !Insider.fns.hasParameter('https://www.danmurphys.com.au/subscriptions/checkout/SUBMDMWWS/classic-whites')) {
                self.exitIntent();
            }
        }
    };

    self.exitIntent = () => {
        if (!Insider.storage.localStorage.get(`sp-camp-${ variationId }`)) {
            Insider.browser.isMobile() ? self.onFastScroll() : self.onExitIntend();
        }
    };

    self.onFastScroll = () => {
        let isExitIntended = false;

        Insider.utils.onFastScroll(() => {
            if (!isExitIntended) {
                Insider.campaign.info.show(variationId);
            }

            isExitIntended = true;
        });
    };

    self.onExitIntend = () => {
        Insider.utils.onExitIntended({ id: variationId }, () => {
            Insider.campaign.info.show(variationId);
        });
    };

    return self.init();
})({});
/* OPT-160439 END */

return !!Insider.storage.localStorage.get('ins-status-abandoned-subscription-161758');
