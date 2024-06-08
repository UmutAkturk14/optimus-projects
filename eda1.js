/* OPT-156120 START */
((self) => {
    'use strict';

    const footballBuilderId = 2912;
    const basketballBuilderId = 2913;
    const footballVariationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(footballBuilderId);
    const basketballVariationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(basketballBuilderId);
    const firstVisitedStorage = `ins-first-visited-category-${ footballVariationId }`;
    const lastVisitedStorage = `ins-last-visited-category-${ footballVariationId }`;
    const lastVisitedStorageData = Insider.storage.localStorage.get(lastVisitedStorage);
    const lastVisitedCategory = Insider.storage.localStorage.get('ins-default-attributes')?.last_visited_category_name;
    const firstVisitedCategory = Insider.storage.session.get(`ins-first-visited-category-${ footballVariationId }`);

    self.init = () => {
        if ((footballVariationId || basketballVariationId) && Insider.systemRules.call('isOnCategoryPage') &&
          (Insider.fns.has(lastVisitedCategory, 'Futbol') || Insider.fns.has(lastVisitedCategory, 'Basketbol'))) {
            self.setLastVisitedCategory();
        } else if (Insider.systemRules.call('isOnMainPage')) {
            if (firstVisitedCategory) {
                self.showCampaign(firstVisitedCategory);
            } else if (lastVisitedCategory) {
                self.showCampaign(lastVisitedCategory);
            }
        }
    };

    self.setLastVisitedCategory = () => {
        if (!firstVisitedCategory) {
            Insider.storage.session.set({
                name: firstVisitedStorage,
                value: lastVisitedStorageData ?? lastVisitedCategory,
            });
        }

        Insider.storage.localStorage.set({
            name: lastVisitedStorage,
            value: lastVisitedCategory,
            expires: Insider.dateHelper.addDay(365),
        });
    };

    self.showCampaign = (category) => {
        if (Insider.fns.has(category, 'Futbol')) {
            Insider.campaign.custom.show(footballVariationId);
        } else if (Insider.fns.has(category, 'Basketbol')) {
            Insider.campaign.custom.show(basketballVariationId);
        }
    };

    self.init();
})({});
/* OPT-156120 END */
