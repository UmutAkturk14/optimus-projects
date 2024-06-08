/* OPT-156302 START */
(() => {
    'use strict';

    const builderId = Insider.browser.isDesktop() ? 1258 : 1259;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const visitedPageStorageName = `ins-visited-page-url-${ variationId }`;
    const storageName = `ins-visited-products-${ variationId }`;
    const productId = Insider.systemRules.call('getCurrentProduct').id;
    const isProductVisited = (Insider.storage.localStorage.get(storageName) ?? {})[productId];
    const { rawHref, pathname } = Insider.fns.parseURL();
    const { ONE_MONTH_AS_DAYS } = Insider.dateHelper;

    const urlList = [
        '/au-en/shop/printers/hp-envy-6034e-all-in-one-printer-2k4w2a.html',
        '/au-en/shop/printers/hp-envy-6430e-all-in-one-printer-2k5l5a.html',
        '/au-en/shop/printers/hp-officejet-pro-7720-wide-format-all-in-one-printer-y0s18a.html',
        '/au-en/shop/printers/hp-officejet-200-mobile-printer-cz993a-9170.html',
        '/au-en/shop/printers/hp-smart-tank-7305-all-in-one-printer-28b75a.html',
        '/au-en/shop/printers/hp-smart-tank-5106-all-in-one-printer-4a8d1a.html',
        '/au-en/shop/printers/hp-laserjet-m209dwe-printer-6gw62e.html',
        '/au-en/shop/printers/hp-laserjet-mfp-m234sdwe-printer-6gx01e.html',
        '/au-en/shop/printers/hp-laserjet-pro-mfp-m227fdn-printer-g3q79a.html'
    ];

    if (variationId) {
        if (rawHref === Insider.storage.localStorage.get(visitedPageStorageName)) {
            if (Insider.fns.has(urlList, pathname) && !Insider.__external.isApiInit156302) {
                if (!isProductVisited) {
                    Insider.__external.isApiInit156302 = true;

                    Insider.storage.update({
                        name: storageName,
                        value: {
                            [productId]: true
                        },
                        expires: ONE_MONTH_AS_DAYS
                    });
                }

                return isProductVisited;
            }
        } else {
            Insider.__external.isApiInit156302 = false;
        }

        Insider.storage.localStorage.set({
            name: visitedPageStorageName,
            value: rawHref,
            expires: ONE_MONTH_AS_DAYS
        });
    }
})({});
/* OPT-156302 END */
