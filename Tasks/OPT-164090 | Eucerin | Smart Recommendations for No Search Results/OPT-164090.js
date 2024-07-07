/* OPT-164090 START */
((self) => {
    'use strict';

    const builderId = Insider.browser.isDesktop() ? 1514 : 1515;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const noItemFound = 'p:contains("ขออภัย เราไม่พบผลลัพธ์สำหรับการค้นหาของคุณ")';

    self.init = () => {
        if (variationId) {
            Insider.fns.onElementLoaded(noItemFound, () => {
                Insider.campaign.info.show(variationId);
            }).listen();
        }
    };

    return self.init();
})({});
/* OPT-164090 END */
