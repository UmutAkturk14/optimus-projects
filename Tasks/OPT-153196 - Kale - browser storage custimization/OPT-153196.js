/* OPT-153196 START */
const builderId = 927;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
const storageName = `ins-is-closed-campaign-${ variationId }`;

if (Insider.storage.localStorage.get(storageName) === null
    && (Insider.storage.localStorage.get(`sp-camp-${ variationId }`) || {}).closed) {
    Insider.storage.localStorage.set({
        name: storageName,
        value: true,
        expires: Insider.dateHelper.addDay(360)
    });
}

if (!Insider.storage.localStorage.get(storageName)) {
    setTimeout(() => {
        Insider.campaign.info.clearVisibleCampaignsByType('ON-PAGE');

        Insider.campaign.info.show(variationId);
    }, 500);
}
/* OPT-153196 END */

/* OPT-153196 START */
const builderId = 927;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
const storageName = `ins-is-closed-campaign-${ variationId }`;
const isClosedStorage = !!Insider.storage.localStorage.get(storageName);

if (variationId && !isClosedStorage) {
    if (Insider.storage.localStorage.get(`sp-camp-${ variationId }`)?.closed) {
        Insider.storage.localStorage.set({
            name: storageName,
            value: true,
            expires: Insider.dateHelper.addDay(360)
        });
    }

    setTimeout(() => {
        Insider.campaign.info.clearVisibleCampaignsByType('ON-PAGE');

        Insider.campaign.info.show(variationId);
    }, 500);
}
/* OPT-153196 END */
