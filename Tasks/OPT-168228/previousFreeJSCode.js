/* SRTR-18680 START */
(function () {
    if (!Insider.__external.isObservedDefinedSRTR12594) {
        const pageSelectors = '.page-homepage, .page-productDetails, .pageType-CategoryPage, .page-cartPage';

        Insider.__external.isObservedDefinedSRTR12594 = true;
        Insider.__external.oldUrlSRTR12594 = window.location.href;
        Insider.__external.oldCategoryInformation = Insider.dom('.e2-breadcrumbs').text().trim().replace(/\s+/g, ' '); /* OPT-152995 */
        Insider.__external.oldPageClassSRTR18680 = (Insider.dom('body').attr('class') || '').split(' ')
            .map(function (className) {
                return (className.indexOf('page-') === 0 || className.indexOf('pageType-') === 0) && className;
            }).filter(Boolean).join();

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function () {
                let initTypeControl = Insider.__external.oldUrlSRTR12594 !== window.location.href;

                if (Insider.dom(pageSelectors).exists()) {
                    initTypeControl = Insider.__external.oldPageClassSRTR18680 !== (Insider.dom('body')
                        .attr('class') || '').split(' ').map(function (className) {
                        return (className.indexOf('page-') === 0 || className.indexOf('pageType-') === 0) &&
                            className;
                    }).filter(Boolean).join();

                    /* OPT-152995 START */
                    if (!initTypeControl) {
                        initTypeControl = Insider.__external.oldCategoryInformation !==
                            Insider.dom('.e2-breadcrumbs').text().trim().replace(/\s+/g, ' ');
                    }
                    /* OPT-152995 END */
                }

                if (initTypeControl) {
                    Insider.__external.oldUrlSRTR12594 = window.location.href;
                    Insider.__external.oldCategoryInformation = Insider.dom('.e2-breadcrumbs').text().trim()
                        .replace(/\s+/g, ' '); /* OPT-152995 */
                    Insider.__external.oldPageClassSRTR18680 = (Insider.dom('body').attr('class') || '').split(' ')
                        .map(function (className) {
                            return (className.indexOf('page-') === 0 || className.indexOf('pageType-') === 0) &&
                            className;
                        }).filter(Boolean).join();

                    setTimeout(function () {
                        const cartSelectors = '.cart-page__product-summary:visible, e2-is-visible .cart-page__empty-text:visible';
                        const productSelectors = '.pdp__notify-button:visible, [v-slot="in-stock"]:visible';

                        if (Insider.dom(pageSelectors).exists()) {
                            if (Insider.dom('.page-cartPage').exists()) {
                                Insider.fns.onElementLoaded(cartSelectors, function () {
                                    setTimeout(function () {
                                        Insider.logger.log(`${ cartSelectors } exists API Inited`);

                                        Insider.eventManager.dispatch('init-manager:re-initialize');
                                    }, 1000);
                                }).listen();
                            } else if (Insider.dom('.page-productDetails').exists()) {
                                Insider.fns.onElementLoaded(productSelectors, function () {
                                    setTimeout(function () {
                                        Insider.logger.log(`${ productSelectors } exists API Inited`);

                                        Insider.eventManager.dispatch('init-manager:re-initialize');
                                    }, 1000);
                                }).listen();
                            } else {
                                setTimeout(function () {
                                    Insider.logger.log(`${ pageSelectors } exists API Inited`);

                                    Insider.eventManager.dispatch('init-manager:re-initialize');
                                }, 1000);
                            }
                        } else {
                            Insider.logger.log('Url changed API Inited');

                            Insider.eventManager.dispatch('init-manager:re-initialize');
                        }
                    }, 2000);
                }
            });
        });

        Insider.dom('head').nodes.forEach(function (element) {
            observer.observe(element, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeOldValue: true,
                characterData: true,
                characterDataOldValue: true
            });
        });
    }
})({});
/* SRTR-18680 END */

/* OPT-65620 Start */
Insider.__external.sendCustomGoal = function (builderId, goalId, checkGoalExistence) {
    const goalOfCamp = Insider.goalBuilder.getGoalBuildersByBuilderId(builderId)[goalId];
    const variationId = Insider.campaign.userSegment.get()[builderId];
    const storageNameOfGoal = `sp-goal-${ variationId }-${ goalId }`;

    if (typeof goalOfCamp === 'undefined' ||
        checkGoalExistence && Insider.storage.get(storageNameOfGoal, 'localStorage', true) !== null) {
        return false;
    }

    goalOfCamp.goalList[0].selectorString = 'true';

    return Insider.goalBuilder.addGoalTracking();
};
/* OPT-65620 End */

/* OPT-83052 START */
Insider.__external.changeLocationConfig = function (options) {
    const activeVariationId = Insider.campaign.userSegment.segments[options.builderId];

    if (!activeVariationId) {
        return false;
    }

    function changeLocation(variationId) {
        const camp = Insider.campaign.get(variationId) || {};
        const ps = camp.pageSettings || camp.ps || {};
        const locationConfig = ps.locationConfig || {};

        if (options.selectedElement) {
            locationConfig.selectedElement = options.selectedElement;
        }

        if (options.insertAction) {
            locationConfig.insertAction = options.insertAction;
        }
    }

    Insider.campaign.isControlGroup(activeVariationId)
        ? changeLocation(Insider.campaign.getFirstVariationByBuilderId(options.builderId).vi)
        : changeLocation(activeVariationId);

    return true;
};
/* OPT-83052 END */

/* OPT-91641 START */
Insider.__external.ajaxListener = function (callback) {
    'use strict';

    const oldOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function (method, url) {
        this.addEventListener('readystatechange', function () {
            if (this.responseType !== 'arraybuffer' && this.responseType !== 'blob' &&
                this.readyState === 4 && this.status === 200 && typeof callback === 'function') {
                callback(url, this.response, method);
            }
        });

        oldOpen.apply(this, arguments);
    };
};

Insider.__external.ajaxListener(function (url, response, method) {
    if (url.indexOf('https://recommendationv2.api.useinsider.com/') > -1 && method === 'GET') { /* OPT-127374 */
        const recommendedProducts = (JSON.parse(response || '{}') || {}).data || [];
        const recommendedProductIds = recommendedProducts.map(function (product) {
            return product.item_id;
        });
        let desiredRecommenderSelector = '';

        recommendedProductIds.forEach(function (id) {
            desiredRecommenderSelector += `[data-recommended-items*=${ id }]`;
        });

        setTimeout(function () {
            Insider.fns.onElementLoaded(desiredRecommenderSelector, function () {
                let eventLabel = 'category grid page';

                if (Insider.systemRules.call('isOnMainPage')) {
                    eventLabel = 'homepage';
                } else if (Insider.systemRules.call('isOnProductPage')) {
                    eventLabel = 'product detail page';
                }

                setTimeout(() => { /* OPT-133065 */
                    Insider.dom(desiredRecommenderSelector).find('[ins-product-id]').nodes.forEach(function (element) {
                        const $addToCartElement = Insider.dom(element);
                        const productId = $addToCartElement.attr('ins-product-id');
                        const productInformation = recommendedProducts.filter(function (product) {
                            return product.item_id === productId;
                        })[0] || {};

                        if (Insider.fns.isObject(productInformation.product_attributes)) {
                            const isMultipleVariation = Number(productInformation.product_attributes.variation_count) > 1;
                            let partnerAddToCartHTML = '';

                            if (isMultipleVariation) {
                                partnerAddToCartHTML =
                                '<e2-action-button ' +
                                    'class-modifier="button--primary add-to-bag button__text--truncated swiper-slide" ' +
                                    'class="ins-element-link" ' +
                                    'action-type="minipdp.SHOW_PRODUCT_DETAILS" ' +
                                    'data-name="product-details-popup" ' +
                                    `data-code="${ productId }" ` +
                                    `data-event-label="${ eventLabel }" ` +
                                    `data-product-list="${ eventLabel }" ` +
                                    'size="medium" ' +
                                    'full-width ' +
                                    'no-arrow>' +
                                    '<span class="add-to-bag__button-text">' +
                                        '<i class="icon icon-basket"></i> Aggiungi al carrello' +
                                    '</span>' +
                                '</e2-action-button>';
                            } else {
                                partnerAddToCartHTML =
                                '<e2-add-to-bag ' +
                                    'show-as-popup ' +
                                    'always-dispatch-event ' +
                                    `data-category="${ productInformation.product_attributes.data_category || '' }" ` +
                                    `data-list="${ eventLabel }" ` +
                                    `event-label="${ eventLabel }" ` +
                                    `product-code="${ productId }" ` +
                                    'product-qty="1"' +
                                    'class-modifier="button--text-props-inherited" ' +
                                    'class="ins-element-link">' +
                                    '<span v-slot="in-stock" class="add-to-bag__button-text">' +
                                        '<i class="icon icon-basket"></i> Aggiungi al carrello' +
                                    '</span>' +
                                '</e2-add-to-bag>';
                            }

                            $addToCartElement.parents('.ins-dynamic-wrap-area')
                                .find('.ins-product-attribute-wrapper').css('display', 'block');

                            $addToCartElement.parents('.ins-action-buttons-wrapper')
                                .find('e2-action-button, e2-add-to-bag').remove();

                            $addToCartElement.hide().before(partnerAddToCartHTML);
                        }
                    });
                }, 500);
            }).listen();
        }, 200);
    }
});
/* OPT-91641 END */

/* OPT-149911 START */
(() => {
    'use strict';

    const bestSellerStorageName = 'ins-best-seller-visited-products-149911';
    const generalStorageName = 'ins-general-visited-products-149911';

    const setStorage = (storageName, value) => {
        Insider.storage.localStorage.set({
            name: storageName,
            value,
            expires: Insider.dateHelper.addDay(14)
        });
    };

    if (Insider.systemRules.call('isOnProductPage')) {
        const { id: productId, quantity } = Insider.systemRules.call('getCurrentProduct');
        const bestSellerProducts = Insider.storage.localStorage.get(bestSellerStorageName) ?? [];
        const generalProducts = Insider.storage.localStorage.get(generalStorageName) ?? [];

        if (quantity !== 0) {
            if (Insider.fns.has(Insider.dom('.product-badge:visible').text(), 'Best Seller')) {
                if (Insider.fns.has(bestSellerProducts, productId)) {
                    bestSellerProducts.splice(bestSellerProducts.indexOf(productId), 1);
                } else {
                    if (bestSellerProducts.length === 3) {
                        bestSellerProducts.shift();
                    }
                }

                bestSellerProducts.push(productId);

                setStorage(bestSellerStorageName, bestSellerProducts);
            }

            if (Insider.fns.has(generalProducts, productId)) {
                generalProducts.splice(generalProducts.indexOf(productId), 1);
            } else {
                if (generalProducts.length === 6) {
                    generalProducts.shift();
                }
            }

            generalProducts.push(productId);

            setStorage(generalStorageName, generalProducts);
        }
    }
})({});
/* OPT-149911 END */

/* OPT-152510 START */
(() => {
    'use strict';

    const eventStorageName = 'ins-preferred-category152510';

    if (Insider.storage.localStorage.get(eventStorageName) === null) {
        const payload = {
            partner_name: Insider.partner.name,
            insider_id: Insider.getUserId(),
            events: {
                product_detail_page_view: {
                    params: ['data_category']
                }
            }
        };

        Insider.request.post({
            url: 'https://cronus.useinsider.com/api/inone/get-contact-profile',
            data: payload,
            parse: true,
            success(response) {
                const eventData = response?.data?.events?.product_detail_page_view ?? []; /* OPT-152995 */

                const wordsToCheck = {
                    fragrance: ['perfume', 'scent', 'profumi', 'deodoranti', 'idee regalo - profumi'],
                    makeup: ['make-up', 'lipgloss'],
                    skincare: ['skin-care', 'trattamenti', 'skincare', 'creme corpo', 'corpo & bagno', 'viso', 'trattamenti viso', 'corpo']
                };

                const wordCounts = {};

                Insider.fns.keys(wordsToCheck).forEach((category) => {
                    wordCounts[category] = 0;
                });

                eventData.forEach((item) => {
                    const categories = item.data_category.toLowerCase().split('/');

                    Object.entries(wordsToCheck).forEach(([category, words]) => {
                        if (categories.some((cat) => words.includes(cat))) {
                            wordCounts[category]++;
                        }
                    });
                });

                const winnerCategory = Insider.fns.keys(wordCounts).reduce((a, b) =>
                    (wordCounts[a] > wordCounts[b] ? a : b));

                Insider.storage.localStorage.set({
                    name: eventStorageName,
                    value: winnerCategory,
                    expires: 14,
                });
            },
            error(err) {
                Insider.logger.log(err);
            }
        });
    }
})({});
/* OPT-152510 END */

/* OPT-152995 START */
Insider.fns.onElementLoaded('#insider-worker', () => {
    Insider.dom('#insider-worker').appendTo('html');
}).listen();
/* OPT-152995 END */