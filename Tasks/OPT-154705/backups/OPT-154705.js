/* OPT-154705 START */
const isDesktop = Insider.browser.isDesktop();
const builderId = isDesktop ? 3708 : 3709;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
const storage = `ins-clicked-add-to-cart-${ variationId }`;
const addToCartButton = `.ins-add-to-cart-${ variationId }`;

if (variationId) {
    if (!Insider.campaign.isControlGroup(variationId)) {
        Insider.eventManager.once(`${ isDesktop ? 'click' : 'touchend' }.set:storage:${ variationId }`,
            addToCartButton, () => {
                Insider.storage.localStorage.set({
                    name: storage,
                    value: true,
                });
            });
    }

    true;
}
/* OPT-154705 END */
