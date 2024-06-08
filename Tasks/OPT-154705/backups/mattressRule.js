/* OPT-154705 START */
const bannerBuilderId = Insider.browser.isDesktop() ? 3708 : 3709;
const bannerVariationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(bannerBuilderId);
const storage = `ins-clicked-add-to-cart-${ bannerVariationId }`;

Insider.fns.isFalsy(Insider.storage.localStorage.get(storage));
/* OPT-154705 */
