/* OPT-165437 START */
const builderId = 526;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

if (Insider.fns.isFunction(Insider.__external.SetLoader165437)) {
    Insider.__external.SetLoader165437(variationId);
} else {
    Insider.logger.log('Insider.__external.SetLoader165437 is not a function.');
}
/* OPT-165437 END */
