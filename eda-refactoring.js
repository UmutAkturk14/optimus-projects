((self) => {
    'use strict';

    const builderIds = {
        football: 2912,
        basketball: 2913
    };

    self.init = () => {
        self.setEvents();

        return true;
    };

    self.setEvents = () => {
        //Ürüne girdiğinde son ziyaret edilen ürünün üzerine kaydeder overwrite
        const lastVisitedCategory = Insider.storage.localStorage.get('ins-default-attributes')?.last_visited_product_name ?? '';
        const firstVisitedCategory = Insider.storage.session.get('ins-first-visited-product');

        if (Insider.systemRules.isOnProductPage() && lastVisitedCategory) {
            Insider.storage.localStorage.set({
                name: 'ins-last-visited-product',
                value: lastVisitedCategory.trim().toLowerCase(),
            });
        }

        //Bir üründe isen ve bu ürüne ilk defa giriyorsan
        if (Insider.systemRules.isOnProductPage() && !firstVisitedCategory) {
            Insider.storage.session.set({
                name: 'ins-first-visited-product',
                value: lastVisitedCategory.trim().toLowerCase(),
                expires: 5 //buraya ne yazalım? sessionda application da göstermiyor localdeki gibi expires
            });
        }

        if (Insider.systemRules.isOnMainPage()) {
            const footballVariationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderIds['football']);
            const basketballVariationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderIds['basketball']);

            if (firstVisitedCategory) {

                if (Insider.fns.has(firstVisitedCategory.trim().toLowerCase(), 'futbol')) {
                    //basketi kaldırmak gerekir miC???
                    Insider.campaign.custom.show(footballVariationId);
                    variationId = footballVariationId;
                } else if (Insider.fns.has(firstVisitedCategory.trim().toLowerCase(), 'basketbol')) {
                    Insider.campaign.custom.show(basketballVariationId);
                    variationId = basketballVariationId;
                }
            } else if (lastVisitedCategory) {

                // Eğer sessionStorage'da bir değer yoksa (yeni session), localStorage'deki son ziyaret edilen kategoriye bak
                if (Insider.fns.has(lastVisitedCategory.trim().toLowerCase(), 'futbol')) {
                    Insider.campaign.custom.show(footballVariationId);
                    variationId = footballVariationId;
                } else if (Insider.fns.has(lastVisitedCategory.trim().toLowerCase(), 'basketbol')) {
                    Insider.campaign.custom.show(basketballVariationId);
                    variationId = basketballVariationId;
                }
            }
        }
    };

    self.init();
})({});

`https://winsider.atlassian.net/browse/OPT-156120`;
