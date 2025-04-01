/* OPT-148889 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 232 : 233; /* OPT-157602 */
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isControlGroup = Insider.campaign.isControlGroup(variationId);
    const isOnProductPage = Insider.systemRules.call('isOnProductPage');
    const isOnCategoryPage = Insider.systemRules.call('isOnCategoryPage');
    const isOnMainPage = Insider.systemRules.call('isOnMainPage');
    /* OPT-157602 START */
    const searchKeywords = Insider.systemRules.call('getSearchKeyWords');
    const category = searchKeywords ? searchKeywords : Insider.systemRules.call('getCategories')?.[0] ?? '';
    /* OPT-157602 END */
    const lastVisitedStorage = `ins-last-visited-category-${ variationId }`;

    const selectors = {
        addToCartButton: '#product-addtocart-button',
        banner: '.homepage-promo-banner'
    };

    const categoryNames = ['BUILT-fit', 'Unisex', 'Workwear', 'Matchy Matchy'];

    const config = {
        'BUILT-fit': {
            image: 'https://image.useinsider.com/lowes/defaultImageLibrary/1b5d439b-fcc4-4479-b7cc-2fe2c51dd0cb-1706178300.png',
            href: 'https://www.lowes.com.au/built-n-fit',
            clickGoal: 22,
            productPageGoal: 26,
            categoryPageGoal: 31,
            addToCartGoal: 39,
            purchasedGoal: 43
        },
        'Unisex': {
            image: 'https://image.useinsider.com/lowes/defaultImageLibrary/Unisex%20banner_1-20240123-013129-1706178500.jpeg',
            href: 'https://www.lowes.com.au/unisex/',
            clickGoal: 23,
            productPageGoal: 27,
            categoryPageGoal: 32,
            addToCartGoal: 40,
            purchasedGoal: 44
        },
        'Workwear': {
            image: 'https://image.useinsider.com/lowes/defaultImageLibrary/Workwear_1920x360px%20%282%29-1712925932.jpeg',
            href: 'https://www.lowes.com.au/workwear',
            clickGoal: 24,
            productPageGoal: 28,
            categoryPageGoal: 33,
            addToCartGoal: 41,
            purchasedGoal: 45
        },
        'Matchy Matchy': {
            image: 'https://image.useinsider.com/lowes/defaultImageLibrary/25c5e5a4-a114-4e1a-a54f-a5f65fcd87bb-1706178278.png',
            href: 'https://www.lowes.com.au/matchy-matchy/',
            clickGoal: 25,
            productPageGoal: 29,
            categoryPageGoal: 34,
            addToCartGoal: 42,
            purchasedGoal: 46
        },
    };

    self.init = () => {
        if (variationId) {
            self.setGoals();

            if (isOnCategoryPage || isOnProductPage || searchKeywords) { /* OPT-157602 */
                self.setVisitedTime();
                self.setLastVisitedCategories();
            } else if (isOnMainPage) {
                return self.checkVisibility();
            }
        }
    };

    self.setGoals = () => {
        const { banner, addToCartButton } = selectors;

        if (!isControlGroup) {
            const doesSpGoalExist = !!Insider.storage.localStorage
                .get(`sp-goal-${ variationId }-${ (config[category]?.clickGoal ?? '') }`);

            if (isOnMainPage) {
                Insider.fns.onElementLoaded(banner, () => {
                    Insider.eventManager.once(`click.banner:${ variationId }`, banner, () => {
                        self.sendGoal(config[Insider.dom(banner).attr('category')].clickGoal);

                        self.setJoinGoal();
                    });
                }).listen();
            } else if (doesSpGoalExist) {
                const { productPageGoal, addToCartGoal, categoryPageGoal } = config[category];

                if (Insider.fns.has(categoryNames, category)) {
                    if (isOnProductPage) {
                        self.sendGoal(productPageGoal);

                        Insider.eventManager.once(`click.add:to:card:${ variationId }`, addToCartButton, () => {
                            Insider.eventManager.once(`cart:amount:update.cart:update:${ variationId }`, () => {
                                self.sendGoal(addToCartGoal);
                            });
                        });
                    } else if (isOnCategoryPage) {
                        self.sendGoal(categoryPageGoal);
                    }
                }
            } else if (Insider.systemRules.call('isOnAfterPaymentPage')) {
                Insider.systemRules.call('getPaidProducts').forEach((product) => {
                    categoryNames.forEach((categoryName) => {
                        const { clickGoal, purchasedGoal } = config[categoryName];

                        if (Insider.fns.has(product.cats, categoryName) && !!Insider.storage.localStorage
                            .get(`sp-goal-${ variationId }-${ clickGoal }`) ) {
                            self.sendGoal(purchasedGoal);
                        }
                    });
                });
            }
        } else if (isOnMainPage) {
            Insider.fns.onElementLoaded(banner, () => {
                Insider.eventManager.once(`click.banner:${ variationId }`, banner, () => {
                    self.setJoinGoal();
                });
            }).listen();
        }
    };

    self.sendGoal = (goalId) => {
        Insider.utils.opt.sendCustomGoal(builderId, goalId, true);
    };

    self.setJoinGoal = () => {
        Insider.campaign.custom.storeJoinLog(variationId);

        Insider.campaign.custom.updateCampaignCookie({
            joined: true
        }, Insider.campaign.custom.addCampaignIdPrefix(variationId));
    };

    self.setVisitedTime = () => {
        if (Insider.fns.has(categoryNames, category)) {
            const visitedCategory = `ins-visited-${ category }-${ variationId }`;

            const visitedTime = Insider.storage.localStorage.get(visitedCategory) ?? [];

            if (visitedTime.length > 1) {
                visitedTime.shift();
            }

            visitedTime.push(Insider.dateHelper.getTime());

            self.setStorage(visitedCategory, visitedTime);
        }
    };

    self.setStorage = (name, value) => {
        Insider.storage.localStorage.set({
            name,
            value,
            expires: 30
        });
    };

    self.setLastVisitedCategories = () => {
        if (Insider.fns.has(categoryNames, category)) {

            const lastVisitedCategories = Insider.storage.localStorage.get(lastVisitedStorage) ?? [];
            const categoryIndex = lastVisitedCategories.indexOf(category);

            if (categoryIndex > -1) {
                lastVisitedCategories.splice(categoryIndex, 1);
            }

            lastVisitedCategories.unshift(category);

            self.setStorage(lastVisitedStorage, lastVisitedCategories);
        }
    };

    self.checkVisibility = () => (Insider.storage.localStorage.get(lastVisitedStorage) ?? []).some((categoryName) => {
        const timeArray = Insider.storage.localStorage.get(`ins-visited-${ categoryName }-${ variationId }`) ?? [];
        /* OPT-157602 START */
        const shouldShowCampaign = isDesktop ? true
            : Math.floor((timeArray[1] - timeArray[0]) / Insider.dateHelper.ONE_DAY_AS_MILLISECONDS) < 31;

        if ((timeArray.length === isDesktop ? 1 : 2) && shouldShowCampaign) {
            /* OPT-157602 END */
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.buildCampaign(categoryName);
            }

            return true;
        }

        return false;
    });

    self.buildCampaign = (categoryName) => {
        const { image, href } = config[categoryName];
        const { banner } = selectors;

        Insider.dom(`${ banner } img`).attr('src', image);
        Insider.dom(`${ banner } a`).attr('href', href);
        Insider.dom(banner).attr('category', categoryName);
    };

    return self.init();
})({});
/* OPT-148889 END */
