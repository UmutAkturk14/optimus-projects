/* OPT-169586 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId  = isDesktop ? 21 : 22;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const discountedProductList = [];
    const currentBadgeText = '24 Saatte Kargo';
    const newBadgeText = 'Hızlı Teslimat';
    const isOnCategoryPage = Insider.systemRules.call('isOnCategoryPage');

    const classes = {
        join: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
        noBackground: `ins-modified-badge-${ variationId }`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        partnerBadge: `span:contains("${ currentBadgeText }"), 
            .m-cargoTag:contains("${ currentBadgeText }"), 
            .m-basket__fastDelivery:contains("${ currentBadgeText }")`,
        discountedProduct: `.o-productList__item:contains("${ currentBadgeText }"), 
            .o-productDetail__topBadge:contains("${ currentBadgeText }"), 
            .o-productCard:contains("${ currentBadgeText }"),
            .m-cargoTag:contains("${ currentBadgeText }"),
            .m-basket__fastDelivery:contains("${ currentBadgeText }")`,
        popUpModal: '.o-modal__body, .modal__content:visible',
        popUpProductDesc: '.m-productCard__desc, .o-productCard__content--desc, .m-productInformation__desc',
        popUpAddToCart: '#addBasket, .m-productBasket__addBtn, #stickyAddBasket',
        badgeText: `span:contains("${ currentBadgeText }"), .m-cargoTag__text:contains("${ currentBadgeText }")`,
        newBadgeText: `span:contains("${ newBadgeText }")`,
        successPopUp: '.m-notification.success'
    });

    const goalConfig = {
        redirectionToProductPage: 11,
        addToCartCategory: 9,
        addToCartProduct: 10
    };

    self.init = () => {
        if (variationId) {
            const { discountedProduct, join } = selectors;

            Insider.fns.onElementLoaded(discountedProduct, () => {
                if (!Insider.campaign.isControlGroup(variationId)) {
                    self.reset();
                    self.buildCSS();
                    self.addClass();
                    self.setBadgeText();
                }

                self.setEvents();

                Insider.campaign.custom.show(variationId);
            }).listen();

            Insider.fns.onElementLoaded(join, () => {
                Insider.campaign.custom.show(variationId);
            }).listen();
        }
    };

    self.reset = () => {
        const { style, noBackground, join: joinSelector, newBadgeText: newBadgeTextSelector } = selectors;
        const { noBackground: noBackgroundSelector, join } = classes;

        Insider.dom(style).remove();
        Insider.dom(noBackgroundSelector).removeClass(noBackground);
        Insider.dom(joinSelector).removeClass(join);
        Insider.dom(newBadgeTextSelector).text(currentBadgeText);
    };

    self.buildCSS = () => {
        const customStyle =
        `${ selectors.noBackground } {
            background-color: unset !important;
            color: #000 !important;
        }
        ${ selectors.noBackground } p {
            color: #000 !important;
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.addClass = () => {
        const { partnerBadge, discountedProduct } = selectors;
        const { noBackground, join } = classes;

        Insider.dom(partnerBadge).addClass(noBackground);
        Insider.dom(discountedProduct).addClass(join);
    };

    self.setBadgeText = () => {
        const { discountedProduct, badgeText } = selectors;

        if (isOnCategoryPage) {
            Insider.fns.onElementLoaded(discountedProduct, () => {
                Insider.dom(discountedProduct).find(badgeText).text(newBadgeText);
            }).listen();
        } else {
            Insider.fns.onElementLoaded(badgeText, () => {
                Insider.dom(badgeText).text(newBadgeText);
            }).listen();
        }
    };

    self.setEvents = () => {
        const { discountedProduct, popUpModal, popUpAddToCart, popUpProductDesc, join } = selectors;
        const { redirectionToProductPage, addToCartProduct, addToCartCategory } = goalConfig;

        const modifiedDiscountedProduct = discountedProduct.replace(new RegExp(currentBadgeText, 'g'), newBadgeText);
        const eligibleProduct = `${ modifiedDiscountedProduct }, ${ discountedProduct }`;
        const clickMethod = isDesktop ? 'click' : 'touchend';

        Insider.fns.onElementLoaded(eligibleProduct, () => {
            Insider.dom(eligibleProduct).accessNodes(($node) => {
                discountedProductList.push(Insider.dom($node).find(popUpProductDesc).text().trim());
            });
        }).listen();

        Insider.eventManager.once(`${ clickMethod }.send:join:log:${ variationId }`, join, () => {
            if (!Insider.campaign.getCampaignStorage(variationId)?.joined) {
                Insider.campaign.custom.storeJoinLog(variationId);

                Insider.campaign.updateCampaignCookie({
                    joined: true
                }, Insider.campaign.custom.addCampaignIdPrefix(variationId));
            }
        });

        if (isOnCategoryPage) {
            Insider.eventManager.once(`${ clickMethod }.discounted:product:${ variationId }`, eligibleProduct,
                () => {
                    setTimeout(() => {
                        if (!Insider.dom(popUpModal).exists()) {
                            Insider.utils.opt.sendCustomGoal(builderId, redirectionToProductPage, true);
                        }
                    }, 100);
                });

            Insider.eventManager.once(`${ clickMethod }.add:to:cart:category:${ variationId }`,
                popUpAddToCart, () => {
                    const productDescription = Insider.dom(popUpModal).find(popUpProductDesc).text();

                    if (Insider.fns.has(discountedProductList, productDescription)) {
                        Insider.utils.opt.sendCustomGoal(builderId, addToCartCategory, true);
                    }
                });
        } else {
            Insider.eventManager.once(`${ clickMethod }.add:to:cart:pdp:${ variationId }`, popUpAddToCart, () => {
                Insider.utils.opt.sendCustomGoal(builderId, addToCartProduct, true);
            });
        }
    };

    self.init();
})({});
/* OPT-169586 END */