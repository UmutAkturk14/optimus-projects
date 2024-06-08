/* OPT-157083 START */
const builderId = 1323;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
const goalID = 223;

const productIDs = ['000000000000465961', '000000000000465960', '000000000000406884', '000000000000406885',
    '000000000000412098', '000000000000406886'];

const paidProductIDs = Insider.systemRules.call('getPaidProducts').map((product) => product.id);

if (variationId) {
    if (!Insider.campaign.isControlGroup(variationId)) {
        if (productIDs.some((productID) => Insider.fns.has(paidProductIDs, productID))) {
            Insider.utils.opt.sendCustomGoal(builderId, goalID, false);
        }
    }

    Insider.campaign.info.show(variationId);
}
/* OPT-157083 END */
