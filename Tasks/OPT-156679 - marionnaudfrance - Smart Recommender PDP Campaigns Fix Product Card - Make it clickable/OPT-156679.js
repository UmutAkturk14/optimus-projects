/* OPT-156679 START */
const builderId = {
    web: 50,
    mobile: 51,
    tablet: 52
}[Insider.browser.getPlatform()];

const isDesktop = Insider.browser.isDesktop();
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
const clickMethod = isDesktop ? 'click' : 'touchend';

const selectors = {
    productCard: `.ins-preview-wrapper-${ variationId } .ins-${ isDesktop ?
        'web' : 'mobile-web' }-smart-recommender-box-item`,
    imageArea: '.ins-image-area'
};

if (variationId) {
    if (!Insider.campaign.isControlGroup(variationId)) {
        const { productCard, imageArea } = selectors;

        Insider.fns.onElementLoaded(productCard, () => {
            Insider.eventManager.once(`${ clickMethod }.set:click:${ variationId }`, productCard, (event) => {
                event.preventDefault();

                Insider.dom(event.target).closest(productCard).find(imageArea).click();
            });
        }).listen();
    }

    true;
}
/* OPT-156679 END */a
