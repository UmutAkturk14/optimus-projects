/* OPT-157083 START */
const builderId = 1323;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
const goalID = 222;

const itemIDs = ['465961', '465960', '406884', '406885', '412098', '406886'];

const paidProductIDs = Insider.systemRules.getPaidProducts().map((product) => product.id);

if (variationId) {
    if (!Insider.campaign.isControlGroup(variationId)) {
        if (itemIDs.some((item) => Insider.fns.has(paidProductIDs, `000000000000${ item }`))) {
            Insider.utils.opt.sendCustomGoal(builderId, goalID, true);
        }
    }

    Insider.campaign.info.show(variationId);
}
/* OPT-157083 END */
