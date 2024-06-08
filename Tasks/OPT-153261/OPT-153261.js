/* OPT-153261 START */
const builderId = 94;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
const couponTextSelector = '#ins-assist-desc';

const textByVariationId = {
    240: '消費滿$3500即享現折$300優惠！',
    241: '消費滿$2500即享現折$200優惠！',
}[variationId];

if (variationId) {
    if (!Insider.campaign.isControlGroup(variationId)) {
        Insider.fns.onElementLoaded(couponTextSelector, () => {
            Insider.dom(couponTextSelector).text(textByVariationId);
        }).listen();
    }

    true;
}
/* OPT-153261 END */
