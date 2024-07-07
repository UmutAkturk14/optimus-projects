/* OPT-164268 START */
(() => {
    'use strict';

    const builderId = 8;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const selectors = {
        appendLocation: '.swatch.Color.product-color.clearfix',
        attribute: '.ins-preview-wrapper-20 .ins-dynamic-element-tag.ins-dynamic-attribute'
    };

    if (variationId) {
        const { appendLocation, attribute } = selectors;

        Insider.fns.onElementLoaded(appendLocation, () => {
            Insider.campaign.info.show(variationId);

            setTimeout(() => {
                Insider.dom(attribute).text('7');
            }, 200);
        }).listen();
    }
})({});
/* OPT-164268 END */
