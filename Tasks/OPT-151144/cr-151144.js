/* OPT-151144 START */
setTimeout(() => {
    const builderId = 143;
    const selectedElement = '.product__detail--mobile-tab';
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const camps = [
        Insider.campaign.userSegment.getActiveVariationByBuilderId(62),
        Insider.campaign.userSegment.getActiveVariationByBuilderId(69)
    ];

    if (variationId && !Insider.campaign.isControlGroup(variationId)) {
        Insider.fns.onElementLoaded(camps.map((camp) => `.ins-preview-wrapper-${ camp }`).join(', '), () => {
            if (Insider.fns.isFunction(Insider.__external.changeLocationConfig)) {
                Insider.__external.changeLocationConfig({
                    builderId,
                    selectedElement,
                    insertAction: 'after'
                });

                Insider.campaign.info.show(variationId);
            } else {
                Insider.logger.log('Insider.__external.changeLocationConfig is not found');
            }
        }).listen();
    }
}, 1000);
/* OPT-151144 END */

/* OPT-151144 START */
setTimeout(() => {
    const builderId = 143;
    const selectedElement = '.product__detail--mobile-tab';
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    if (variationId && !Insider.campaign.isControlGroup(variationId)) {
        Insider.fns.onElementLoaded('.ins-preview-wrapper-140, .ins-preview-wrapper-125', () => {
            if (Insider.fns.isFunction(Insider.__external.changeLocationConfig)) {
                Insider.__external.changeLocationConfig({
                    builderId,
                    selectedElement,
                    insertAction: 'after'
                });

                Insider.campaign.info.show(variationId);
            } else {
                Insider.logger.log('Insider.__external.changeLocationConfig is not found');
            }
        }).listen();
    }
}, 1000);
/* OPT-151144 END */