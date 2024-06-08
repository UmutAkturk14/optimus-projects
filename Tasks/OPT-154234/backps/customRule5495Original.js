/* OPT-134094 START */
const customBannerClassPrefix = 'ins-custom-banner';

Insider.fns.onElementLoaded(`div[class^="${ customBannerClassPrefix }"]`, () => {
    const $elements = Insider.dom(`div[class^="${ customBannerClassPrefix }"]`).nodes;

    const builderIds = $elements
        .flatMap((element) => element.className.split(' '))
        .filter((className) => className.startsWith(`${ customBannerClassPrefix }-`))
        .map((className) => {
            const variationId = className.replace(`${ customBannerClassPrefix }-`, '');

            return Insider.campaign.getBuilderIdByVariationId(variationId);
        })
        .sort((a, b) => a - b);

    if (builderIds.length > 0) {
        builderIds.shift();

        builderIds.forEach((builderId) => {
            const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

            Insider.dom(`.ins-custom-banner-${ variationId }`).css('display', 'none');
        });
    }
}).listen();

true;
/* OPT-134094 END */