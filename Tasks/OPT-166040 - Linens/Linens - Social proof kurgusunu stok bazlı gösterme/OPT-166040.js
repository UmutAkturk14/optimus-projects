/* OPT-166040 START */
((self) => {
    'use strict';

    const builderId = 6752;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const campaignTextSelector = `.ins-preview-wrapper-${ variationId } .ins-dynamic-attribute-popup`;

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.setCampaignText();
            }

            return true;
        }
    };

    self.setCampaignText = () => {
        Insider.fns.onElementLoaded(campaignTextSelector, () => {
            const stock = Insider.utils.getDataFromIO('product', 'stock', 0);
            const newText = `Acele et, son ${ stock } adet kaldı!`;

            Insider.dom(campaignTextSelector).text(newText);
        }).listen();
    };

    return self.init();
})({});
/* OPT-166040 END */
