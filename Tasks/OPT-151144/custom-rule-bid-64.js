/* OPT-151144 START */
setTimeout(() => {
    const builderId = 64;
    const selectedElement = '.product__detail';
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    Insider.__external.changeLocationConfig({
        builderId,
        selectedElement,
        insertAction: 'after'
    });

    Insider.campaign.info.show(variationId);
}, 1000);

false;
/* OPT-151144 END */
// https://jumbo.inone.useinsider.com/mobile-versus/142/design
// https://jumbo.inone.useinsider.com/mobile-versus/143/design
