/* OPT-159374 START */
const builderId = 32;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

if (variationId && !Insider.campaign.isControlGroup(variationId)) {
    Insider.eventManager.once(`click.display:camp:${ variationId }`, 'footer .view-facilities.button', () => {
        Insider.campaign.info.show(variationId);
    });
}
/* OPT-159374 END */
