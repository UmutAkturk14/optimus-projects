/* OPT-161221 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 3525 : 3526;
    const smartRecommenderBuilderId = isDesktop ? 3547 : 3548;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isCategoryPage = Insider.systemRules.call('isOnCategoryPage');

    const skuGroups = {
        neo8k: {
            products: [
                'QE98QN90DATXTK',
                'QE85QN900DTXTK',
                'QE75QN900DTXTK',
                'QE75QN800DTXTK',
                'QE65QN800DTXTK',
            ],
            bonusAmount: '15,000 TL',
            paraCardHeadText: 'Buy now and get free sound bar or 15,000 TL Paracard Amount',
            giftSku: 'HW-Q990D/TK'
        },
        oled: {
            products: [
                'QE77S95DATXTK',
                'QE65S95DATXTK',
            ],
            bonusAmount: '8,000 TL',
            paraCardText: 'Buy now and get free sound bar or 8,000 TL Paracard Amount',
            giftSku: 'HW-Q990D/TK' /* 'HW-Q800D/TK' Product is missing */
        },
        neoQled4k: {
            products: [
                'QE85QN90DATXTK',
                'QE75QN90DATXTK',
                'QE65QN90DATXTK',
                'QE55QN90DATXTK',
                'QE85QN85DBTXTK',
                'QE75QN85DBTXTK',
                'QE65QN85DBTXTK',
                'QE55QN85DBTXTK',
            ],
            bonusAmount: '5,000 TL',
            paraCardText: 'Buy now and get free sound bar or 5,000 TL Paracard Amount',
            giftSku: 'HW-Q600C/TK'
        },
        theFrame: {
            products: [
                'QE75LS03DAUXTK',
                'QE65LS03DAUXTK',
                'QE55LS03DAUXTK',
            ],
            bonusAmount: '4,500 TL',
            paraCardText: 'Buy now and get free sound bar or 4,500 TL Paracard Amount',
            giftSku: 'HW-LS60D/TK'
        },
        soundbarModelQ: {
            products: [
                'HW-Q990D/TK',
            ],
            bonusAmount: '2,500 TL',
            paraCardText: 'Buy now and get free sound bar or 2,500 TL Paracard Amount',
            giftSku: ''
        },
        soundbarModelL: {
            products: [
                'HW-LS60D/TK',
            ],
            bonusAmount: '1,000 TL',
            paraCardText: 'Buy now and get free sound bar or 1,000 TL Paracard Amount',
            giftSku: ''
        },
    };

    const config = {
        headText: 'Buy now and get free sound bar or 15,000 TL Paracard Amount',
        deliveryText: '*Para Card amount will be deliver after 14 Days',
        skuAttribute: 'data-modelcode',
        giftIdAttribute: `data-ins-gift-id-${ variationId }`,
        bonusAmountAttribute: `data-ins-bonus-amount-${ variationId }`
    };

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        container: `ins-custom-container-${ variationId }`,
        categoryProduct: `ins-category-product-${ variationId }`,
        moveFromTop: `ins-move-from-top-${ variationId }`,
        goal: `sp-custom-${ variationId }-1`,
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        appendLocationProduct: isDesktop ? '.code' : '.highlights',
        appendLocationCategory: '.list__item.js-product-wrapper',
        addToCart: '[data-an-tr="add-to-cart"]',
        viewMore: '.btn-load-more',
        badgeContainer: '.guarantee-badge-container',
        categoryAddToCart: '.list__item-btn.js-variant-link',
        popUp: '.basket-item-added.opened'
    });

    self.buildCampaign = () => {
        const { giftGroups, appendLocationElements, insertAction } = self.getAppendElementsWithGroups();

        if (variationId && giftGroups.length) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.buildCSS();

                giftGroups.forEach((giftGroup, index) => {
                    self.buildHTML(giftGroup, appendLocationElements[index], insertAction);
                });

                self.setEvents();
            }

            return true;
        }
    };

    self.getAppendElementsWithGroups = () => {
        const { appendLocationCategory, addToCart, appendLocationProduct } = selectors;
        let giftGroups = [];
        let appendLocationElements = [];
        let insertAction = 'prepend';

        if (isCategoryPage) {
            Insider.dom(appendLocationCategory).accessNodes((product) => {
                const $product = Insider.dom(product);
                const elementSku = $product.attr(config.skuAttribute);

                Insider.fns.objectValues(skuGroups).some((group) => {
                    if (Insider.fns.has(group.products, elementSku)) {

                        giftGroups = [...giftGroups, group];
                        appendLocationElements = [...appendLocationElements, $product];

                        return true;
                    }
                });
            });
        } else {
            Insider.fns.objectValues(skuGroups).some((group) => {
                const $addToCart = Insider.dom(addToCart);

                if (Insider.fns.has(group.products, $addToCart.attr(config.skuAttribute))) {
                    giftGroups = [...giftGroups, group];
                    appendLocationElements = [...appendLocationElements, Insider.dom(appendLocationProduct)];

                    insertAction = 'before';

                    return true;
                }
            });
        }

        return { giftGroups, appendLocationElements, insertAction };
    };

    self.reset = () => {
        const { style, wrapper } = selectors;

        Insider.dom(`${ style }, ${ wrapper }`).remove();
    };

    self.buildCSS = () => {
        const { wrapper, container, categoryProduct, moveFromTop } = selectors;

        const customStyle =
        `${ wrapper } {
            display: flex;
            padding: 10px;
            background-color: #DEE1FE;
            border-radius: 20px;
            margin-top: 0;
            margin-bottom: 20px;
        }
        ${ container } {
            display: flex;
            flex-direction: column;
        }
        ${ container } h1 {
            font-size: 12px;
            font-weight: bold;
        }
        ${ container } span {
            font-size: 10px;
        }
        ${ categoryProduct } {
            border-top-right-radius: 20px !important;
            border-top-left-radius: 20px !important;
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
            margin-bottom: 0 !important;
            left: -16px;
            position: relative;
            width: calc(100% + 32px);
        }
        ${ moveFromTop } {
            top: 110px !important;
        }
        @media screen and (max-width: 500px) {
            ${ wrapper } {
                margin-top: 10px;
                margin-bottom: 0px;
            }
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = (giftGroup, $appendElement, insertAction) => {

        const { paraCardText, giftSku, bonusAmount } = giftGroup;
        const { wrapper, container, goal, moveFromTop, categoryProduct } = classes;
        const { badgeContainer, wrapper: wrapperSelector } = selectors;
        const { deliveryText, giftIdAttribute, bonusAmountAttribute } = config;

        const outerHtml =
        `<div class="${ wrapper } ${ goal }">
            <div class="${ container }" ${ giftIdAttribute }="${ giftSku }" ${ bonusAmountAttribute }="${ bonusAmount ?? '' }">
                <h1>${ paraCardText ?? '' }</h1>
                <span>${ deliveryText }</span>
            </div>
        </div>`;

        $appendElement[insertAction](outerHtml);

        if (isCategoryPage) {
            $appendElement.find(badgeContainer).addClass(moveFromTop);

            Insider.dom(wrapperSelector).addClass(categoryProduct);
        }
    };

    self.setEvents = () => {
        const { viewMore, categoryAddToCart, appendLocationCategory, popUp, wrapper } = selectors;
        const { giftIdAttribute, bonusAmountAttribute } = config;

        Insider.eventManager.once(`click.show:more:product:${ variationId }`, viewMore, () => {
            setTimeout(() => {
                self.buildCampaign();
            }, 2000);
        });

        if (isCategoryPage) {
            Insider.eventManager.once(`click.add:from:category:page:${ variationId }`, `${ categoryAddToCart }`,
                (event) => {
                    if (Insider.dom(event.target).closest(appendLocationCategory).find(wrapper).exists()) {
                        event.preventDefault();
                        event.stopImmediatePropagation();

                        const $appendWrapper = Insider.dom(event.target).closest(appendLocationCategory);

                        const giftId = $appendWrapper.find(`[${ giftIdAttribute }]`).attr(giftIdAttribute);
                        const bonusAmount = $appendWrapper.find(`[${ bonusAmountAttribute }]`)
                            .attr(bonusAmountAttribute);

                        if (giftId) {
                            Insider.__external.giftId161221 = giftId;
                            Insider.__external.bonusAmount161221 = bonusAmount;

                            Insider.campaign.info.show(Insider.campaign.userSegment
                                .getActiveVariationByBuilderId(smartRecommenderBuilderId));
                        }
                    }

                });
        } else {
            Insider.fns.onElementLoaded(popUp, () => {
                const giftId = Insider.dom(`[${ giftIdAttribute }]`).attr(giftIdAttribute);
                const bonusAmount = Insider.dom(`[${ bonusAmountAttribute }]`).attr(bonusAmountAttribute);

                if (giftId) {
                    Insider.__external.giftId161221 = giftId;
                    Insider.__external.bonusAmount161221 = bonusAmount;

                    Insider.campaign.webInfo.clearVisibleCampaignsByType('ON-PAGE');
                    Insider.campaign.info.clearVisibleCampaignsByType('ON-PAGE');

                    Insider.campaign.info.show(Insider.campaign.userSegment
                        .getActiveVariationByBuilderId(smartRecommenderBuilderId));
                }

            }).listen();
        }
    };

    return self.buildCampaign();
})({});
/* OPT-161221 END */
