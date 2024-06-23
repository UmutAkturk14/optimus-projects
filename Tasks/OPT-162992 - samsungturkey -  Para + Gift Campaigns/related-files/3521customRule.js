/* OPT-162985 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 3521 : 3522;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isOnProductPage = Insider.systemRules.call('isOnProductPage');
    const isOnCategoryPage = Insider.systemRules.call('isOnCategoryPage');
    const isControlGroup = Insider.campaign.isControlGroup(variationId);
    const isOfferPage = Insider.fns.hasParameter('offer');
    let scannedProductsSku = [];
    let isLandscape = window.innerWidth > window.innerHeight;

    const config = {
        header: 'Buy now and get {amount} TL Para Card Amount',
        subHeader: '*Para Card amount will be deliver after 14 Days'
    };

    const productByAmount = {
        QE98QN990CTXTK: '35000',
        QE98Q80CATXTK: '16000',
        QE85QN900CTXTK: '18000',
        QE75QN900CTXTK: '11250',
        QE75QN800CTXTK: '8000',
        QE65QN800CTXTK: '5750',
        QE75QN700CTXTK: '5500',
        QE65QN700CTXTK: '4000',
        QE55QN700CTXTK: '3000',
        QE77S95CATXTK: '7500',
        QE65S95CATXTK: '4500 ',
        QE77S90CATXTK: '7000',
        QE65S90CATXTK: '4000 ',
        QE55S90CATXTK: '3000',
        QE85Q70DATXTK: '4500',
        QE75Q70DATXTK: '3250',
        UE85DU7100UXTK: '3250',
        UE75DU7100UXTK: '2250'
    };

    const attributeKeysWithSku = {
        categoryPage: 'data-modelcode',
        offerPage: 'title'
    };

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        container: `ins-custom-container-${ variationId }`,
        goal: `sp-custom-${ variationId }-1`,
        header: `ins-custom-header-text-${ variationId }`,
        subHeader: `ins-custom-sub-header-text-${ variationId }`,
        customPosition: `ins-custom-position-${ variationId }`,
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        productSkuSelector: isOnCategoryPage ? '[data-modelcode]' : '[title]',
        partnerProductItemOnCategoryPage: '.pd03-product-card__item',
        partnerOptionsButton: '[class*="option"]',
        partnerOptionsTabs: '.cmp-opc-tabs',
        partnerLoadMoreButton: '[class*="view-more"]',
        partnerLoadMoreButtonWithLabel: 'a:contains("Daha fazla göster")',
        pdpDesktopAppendLocation: '.pd-info__sku',
        pdpMobileAppendLocation: '.product-detail-kv',
        partnerProductItemOnOfferPage: '.cmp-prd-card_item-inner',
        partnerOptionSelectorOnCategoryPage: '.option-selector-v2',
        partnerOfferProductContainer: '.cmp-prd-card_item',
        partnerProductBadgeContainerOnOfferPage: '.cmp-prd-card_merchflag'
    });

    self.init = () => {
        if (variationId) {
            setTimeout(() => self.getProductIdsAndCheckSkuList(), 500);

            self.setEvents();
        }
    };

    self.getProductIdsAndCheckSkuList = () => {
        const { productSkuSelector } = selectors;
        const skuAttributeKey = attributeKeysWithSku[isOnCategoryPage ? 'categoryPage' : 'offerPage'];

        scannedProductsSku = [];

        if (isOnCategoryPage || isOfferPage) {
            Insider.dom(productSkuSelector).accessNodes((product) => {
                const productId = Insider.dom(product).attr(skuAttributeKey);

                if (productId && !Insider.fns.has(scannedProductsSku, productId)) {
                    scannedProductsSku.push(productId);
                }
            });
        }

        self.checkSkuList();
    };

    self.checkSkuList = () => {
        const { pdpDesktopAppendLocation, pdpMobileAppendLocation } = selectors;

        const productSkuArray = Insider.fns.keys(productByAmount);

        self.reset();

        if ((isOnCategoryPage || isOfferPage) &&
            productSkuArray.some((element) => Insider.fns.has(scannedProductsSku, element))) {
            if (!isControlGroup) {
                self.buildCSS();
                self.setProductsBadge();
            }

            Insider.campaign.custom.show(variationId);
        } else if (isOnProductPage) {
            const productSku = Insider.systemRules.call('getCurrentProduct').id;

            if (Insider.fns.has(productSkuArray, productSku)) {
                if (!isControlGroup) {
                    self.buildCSS();
                    self.buildHTML((isDesktop || isLandscape) ? pdpDesktopAppendLocation : pdpMobileAppendLocation,
                        productSku);
                }

                Insider.campaign.custom.show(variationId);
            }
        }
    };

    self.reset = () => {
        const { partnerProductBadgeContainerOnOfferPage, style, wrapper } = selectors;

        Insider.dom(partnerProductBadgeContainerOnOfferPage).removeClass(classes.customPosition);
        Insider.dom(`${ style }, ${ wrapper }`).remove();
    };

    self.buildCSS = () => {
        const { wrapper, subHeader, header, customPosition } = selectors;

        let customStyle =
        `${ wrapper } {
            color: black;
            background-color: #dde1fe;
            font-weight: 700;
            text-align: center;
            padding: 2px 0px 2px 0px;
            margin: 0px;
            font-size: 12px;
            position: relative;
            border-radius: 18px 18px 0px 0px;
        }
        ${ header } {
            font-weight: bolder;
            font-size: 11px;
            text-align: left;
            padding-left: 18px;
            font-weight: 900;
        }
        ${ customPosition } {
            position: absolute;
            top: 35px;
        }
        ${ subHeader } {
            font-size: 9px;
            text-align: left;
            padding-left: 18px;
            font-weight: 300;
        }`;

        if (isOnProductPage) {
            customStyle +=
            `${ wrapper } {
                width: max-content !important;
                padding: 5px 20px 5px 0;
                margin-top: 15px;
                border-radius: 12px;
            }
            @media (max-width: 1200px) {
                ${ wrapper } {
                    width: 95% !important;
                    margin: 10px 10px 0px 10px;
                }
            }
            @media (max-width: 1200px) and (orientation: landscape) {
                ${ wrapper } {
                    margin: 15px 0 0 0 !important;
                    border-radius: 12px !important;
                }
            }`;
        } else if (isOnCategoryPage) {
            customStyle +=
            `${ wrapper } {
                width: max-content;
                padding: 5px 8px;
                margin-top: 10px;
                text-align: left;
                border-radius: 18px;
            }
            ${ header } {
                padding-left: 0;
                font-size: 10px;
            }
            ${ subHeader } {
                padding-left: 0;
                font-size: 8px;
            }
            @media (max-width: 1100px) and (orientation: landscape) {
                ${ header } {
                    font-size: 7px;
                }
                ${ subHeader } {
                    font-size: 6px;
                }
            }`;
        } else if (isOfferPage) {
            customStyle +=
            `${ wrapper } {
                position: absolute;
                top: 0;
                width: 100%;
                left: 0;
                z-index: 999;
            }
            @media (max-width: 1100px) and (orientation: landscape) {
                ${ header } {
                    font-size: 8px;
                }
                ${ subHeader } {
                    font-size: 7px;
                }
                ${ customPosition } {
                    top: 23px;
                }
            }`;
        }

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.setProductsBadge = () => {
        const { partnerProductBadgeContainerOnOfferPage, partnerOptionSelectorOnCategoryPage,
            partnerOfferProductContainer, partnerProductItemOnCategoryPage, partnerProductItemOnOfferPage,
            productSkuSelector } = selectors;
        const { categoryPage, offerPage } = attributeKeysWithSku;

        const productSkuArray = Insider.fns.keys(productByAmount);
        let appendLocation;
        let productSelector;
        let attributeKey;

        if (isOnCategoryPage) {
            attributeKey = categoryPage;
            appendLocation = partnerOptionSelectorOnCategoryPage;
            productSelector = partnerProductItemOnCategoryPage;
        } else {
            attributeKey = offerPage;
            appendLocation = partnerProductItemOnOfferPage;
            productSelector = partnerOfferProductContainer;

        }

        Insider.dom(productSelector).accessNodes((product) => {
            const productSku = Insider.dom(product).find(productSkuSelector).attr(attributeKey);

            if (Insider.fns.has(productSkuArray, productSku)) {
                self.buildHTML(Insider.dom(product).find(appendLocation), productSku);

                if (isOfferPage) {
                    Insider.dom(product).find(partnerProductBadgeContainerOnOfferPage)
                        .addClass(classes.customPosition);
                }
            }
        });
    };

    self.buildHTML = (appendLocation, productSku) => {
        const { wrapper, container, subHeader, header, goal } = classes;
        const { subHeader: subHeaderConfig, header: headerConfig } = config;

        const outerHtml =
        `<div class="${ wrapper } ${ goal }">
            <div class="${ container }">
                <div class="${ header }">${ headerConfig.replace('{amount}', productByAmount[productSku]) }</div>
                <div class="${ subHeader }">${ subHeaderConfig }</div>
            </div>
        </div>`;

        if (isOnProductPage) {
            Insider.dom(appendLocation)[(isDesktop || isLandscape) ? 'after' : 'before'](outerHtml);
        } else {
            Insider.dom(appendLocation).append(outerHtml);
        }
    };

    self.setEvents = () => {
        const { partnerLoadMoreButton, partnerOptionsButton, partnerProductItemOnOfferPage,
            partnerLoadMoreButtonWithLabel, partnerOptionSelectorOnCategoryPage, partnerOptionsTabs } = selectors;

        Insider.eventManager.once(`orientationchange.mode:${ variationId }`, window, Insider.fns.throttle(() => {
            setTimeout(() => {
                isLandscape = window.innerWidth > window.innerHeight;

                self.getProductIdsAndCheckSkuList();
            }, 500);
        }, 500));

        Insider.eventManager.once(`pointerup.option:button:${ variationId }`,
            `${ partnerOptionsButton }, ${ partnerOptionsTabs }`, (event) => {
                if (event.isPrimary) {
                    setTimeout(() => self.getProductIdsAndCheckSkuList(), isOnProductPage ? 3500 : 2000);
                }
            });

        Insider.eventManager.once(`pointerup.load:more:button:${ variationId }`,
            `${ partnerLoadMoreButton }, ${ partnerLoadMoreButtonWithLabel }`, (event) => {
                if (event.isPrimary) {
                    const elementToLoadSelector = isOnCategoryPage ? partnerOptionSelectorOnCategoryPage :
                        partnerProductItemOnOfferPage;

                    const productContainerToBeLoadedSelector =
                        `${ elementToLoadSelector }:eq(${ Insider.dom(elementToLoadSelector).length })`;

                    Insider.fns.onElementLoaded(productContainerToBeLoadedSelector, () => {
                        setTimeout(() => self.getProductIdsAndCheckSkuList(), 500);
                    }).listen();
                }
            });
    };

    self.init();
})({});
/* OPT-162985 END */
