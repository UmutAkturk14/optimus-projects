/* OPT-157629 START */
((self) => {
    'use strict';

    const builderId = 106;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.setEvents();
            }

            if (Insider.systemRules.call('getCartCount') === 0) {
                return true;
            }
        }
    };

    self.setEvents = () => {
        Insider.eventManager.once(`mousedown.send:join:log:${ variationId }`, `.ins-preview-wrapper-${ variationId }`,
            () => {
                if (!(Insider.storage.localStorage.get(`sp-camp-${ variationId }`) ?? {}).joined) {
                    Insider.campaign.info.storeJoinLog(variationId);
                    Insider.campaign.info.updateCampaignCookie({ joined: true }, variationId);
                }
            });

        Insider.eventManager.once(`click.show:campaign:${ variationId }`, 'button[title="Open Cart"]', () => {
            if (Insider.systemRules.call('getCartCount') === 0) {
                Insider.campaign.info.show(variationId);
            }
        });

        Insider.eventManager.once(`cart:amount:update.toggle:wrapper:${ variationId }`, () => {
            const $wrapper = Insider.dom(`.ins-preview-wrapper-${ variationId }`);

            $wrapper.hide();

            if (Insider.systemRules.call('getCartCount') === 0) {
                Insider.campaign.info.show(variationId);

                $wrapper.show();
            }
        });
    };

    return self.init();
})({});
/* OPT-157629 END */
