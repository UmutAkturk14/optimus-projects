/* OPT-153196 START */
var builderId = Insider.browser.isDesktop() ? 596 : 597;
var variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
var storageName = 'ins-is-closed-campaign-opt-153196';

if (Insider.storage.localStorage.get(storageName) === null
    && (Insider.storage.localStorage.get('sp-camp-' + variationId) || {}).closed) {
    Insider.storage.localStorage.set({
        name: storageName,
        value: false,
        expires: Insider.dateHelper.addDay(365)
    });
}

Insider.storage.localStorage.get(storageName) === null;
/* OPT-153196 END */