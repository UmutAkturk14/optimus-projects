/* OPT-153261 START */
((self) => {
    'use strict';

    const builderId = 94;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const selectors = {
        couponText: '#ins-assist-desc'
    };

    const textByVariationId = {
        240: '消費滿$3500即享現折$300優惠！',
        241: '消費滿$2500即享現折$200優惠！',
    }[variationId];

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.setText();
            }

            return true;
        }
    };

    self.setText = () => {
        const { couponText } = selectors;

        Insider.fns.onElementLoaded(couponText, () => {
            Insider.dom(couponText).text(textByVariationId);
        }).listen();
    };

    return self.init();
})({});
/* OPT-153261 END */
