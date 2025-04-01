/* OPT-164268 START */
(() => {
    'use strict';

    const builderId = 8;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const requestText = 'timeline';
    const basketCount = `.ins-preview-wrapper-${ variationId } .ins-dynamic-element-tag.ins-dynamic-attribute`;

    self.init = () => {
        if (variationId) {
            self.showCampaign();
        }
    };

    self.showCampaign = () => {
        Insider.logger.log('Showing the campaign...');
        Insider.campaign.info.show(variationId);

        Insider.fns.onElementLoaded(basketCount, (node) => {
            node.text(Math.floor(Math.random() * 6) + 5);
        }).listen();

        Insider.utils.opt.ajaxListener((url, response, method) => {
            if (method === 'GET' && Insider.fns.has(url, requestText)) {
                self.showCampaign();
            }
        });
    };

    self.init();
})({});
/* OPT-164268 END */
