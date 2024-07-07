/* OPT-162992 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 3525 : 3526;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isOfferPage = Insider.fns.hasParameter('/offer');
    const isCategoryPage = Insider.systemRules.call('isOnCategoryPage');
    const isProductPage = Insider.systemRules.call('isOnProductPage');
    const isControlGroup = Insider.campaign.isControlGroup(variationId);

    const classes = {
        badge: `ins-badge-${ variationId }`,
        join: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        header: `ins-custom-text-header-${ variationId }`,
        notice: `ins-custom-text-notice-${ variationId }`,
        modelData: 'data-modelcode',
        positionRelative: `ins-element-position-relative-${ variationId }`,
        wrapperBaseStyle: `ins-custom-wrapper-base-style-${ variationId }`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        categoryPageProducts: '.pd03-product-finder__content-item.pd03-product-finder__content-item-view.js-pfv2-product-card',
        categoryPageProductTitle: '.pd03-product-card__product-name a',
        productPageProductId: '.pd-info__sku',
        productPageImage: '.first-image',
        offerPageProduct: '.cmp-prd-card_item',
        offerPageProductLink: '.cmp-prd-card_item-thbnail'
    });

    const config = {
        skuList: {
            'QE98QN90DATXTK': {
                giftProduct: 'HW-Q990D/TK',
                paraCardAmount: '15,000'
            },
            'QE85QN900DTXTK': {
                giftProduct: 'HW-Q990D/TK',
                paraCardAmount: '15,000'
            },
            'QE75QN900DTXTK': {
                giftProduct: 'HW-Q990D/TK',
                paraCardAmount: '15,000'
            },
            'QE75QN800DTXTK': {
                giftProduct: 'HW-Q990D/TK',
                paraCardAmount: '15,000'
            },
            'QE65QN800DTXTK': {
                giftProduct: 'HW-Q990D/TK',
                paraCardAmount: '15,000'
            },
            'QE77S95DATXTK': {
                giftProduct: 'HW-Q800D/TK',
                paraCardAmount: '8,000'
            },
            'QE65S95DATXTK': {
                giftProduct: 'HW-Q800D/TK',
                paraCardAmount: '8,000'
            },
            'QE85QN90DATXTK': {
                giftProduct: 'HW-Q600C/TK',
                paraCardAmount: '5,000'
            },
            'QE75QN90DATXTK': {
                giftProduct: 'HW-Q600C/TK',
                paraCardAmount: '5,000'
            },
            'QE65QN90DATXTK': {
                giftProduct: 'HW-Q600C/TK',
                paraCardAmount: '5,000'
            },
            'QE55QN90DATXTK': {
                giftProduct: 'HW-Q600C/TK',
                paraCardAmount: '5,000'
            },
            'QE85QN85DBTXTK': {
                giftProduct: 'HW-Q600C/TK',
                paraCardAmount: '5,000'
            },
            'QE75QN85DBTXTK': {
                giftProduct: 'HW-Q600C/TK',
                paraCardAmount: '5,000'
            },
            'QE65QN85DBTXTK': {
                giftProduct: 'HW-Q600C/TK',
                paraCardAmount: '5,000'
            },
            'QE55QN85DBTXTK': {
                giftProduct: 'HW-Q600C/TK',
                paraCardAmount: '5,000'
            },
            'QE75LS03DAUXTK': {
                giftProduct: 'HW-LS60D/TK',
                paraCardAmount: '4,500'
            },
            'QE65LS03DAUXTK': {
                giftProduct: 'HW-LS60D/TK',
                paraCardAmount: '4,500'
            },
            'QE55LS03DAUXTK': {
                giftProduct: 'HW-LS60D/TK',
                paraCardAmount: '4,500'
            },
            'HW-Q990D/TK': {
                giftProduct: '',
                paraCardAmount: '2,500'
            },
            'HW-LS60D/TK': {
                giftProduct: '',
                paraCardAmount: '1,000'
            }
        },
        texts: {
            paraGift: 'Buy now and get #PRICE TL Para Card Amount',
            delivery: 'Para card amount will be delivered after 14 days'
        },
        urls: {
            request: 'searchapi.samsung.com/'
        }
    };

    self.init = () => {
        if (variationId) {
            if (!isControlGroup) {
                self.reset();
                self.buildCSS();
            }

            self.handlePageContent();
        }
    };

    self.reset = () => {
        const { style, wrapper, positionRelative: positionRelativeSelector } = selectors;
        const { positionRelative } = classes;

        Insider.dom(`${ style }, ${ wrapper }`).remove();
        Insider.dom(positionRelativeSelector).removeClass(positionRelative);
    };

    self.buildCSS = () => {
        const { wrapper, header, notice, positionRelative, wrapperBaseStyle } = selectors;
        let customStyle =
        `${ header } {
            font-size: 14px !important;
            font-weight: 700;
        }
        ${ notice } {
            font-size: 12px !important;
        }
        ${ positionRelative } {
            position: relative;
        }
        ${ wrapperBaseStyle } {
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: start;
            background-color: #dae0fd;
            padding: 0.5vh;
        }
        @media (max-width: 120px) {
            ${ wrapper } {
                margin: unset !important;
                border-radius: 25vh 25vh 0 0;
            }
        }`;

        if (isDesktop && (isCategoryPage || isProductPage)) {
            customStyle +=
            `${ wrapper } {
                margin: 1vh;
                border-radius: 25vh;
                width: ${ isCategoryPage ? '100%' : '25vw' };
            }
            ${ wrapper } p {
                margin-left: 1vw;
            }`;
        } else if (!isDesktop && isCategoryPage) {
            customStyle +=
            `${ wrapper } {
                margin-bottom: -12px;
                border-radius: 25vh 25vh 0 0;
                z-index: 9 !important;
                position: relative;
            }
            ${ wrapper } p {
                margin-left: 5vw;
            }
            ${ header } {
                font-size: 16px !important
            }`;
        } else if (isOfferPage && isDesktop) {
            customStyle +=
            `${ wrapper } {
                border-radius: 2vh 2vh 0 0;
                z-index: 9 !important;
                position: absolute;
                width: 92.7%;
                top: -1.2vh;
            }
            ${ header } {
                font-size: 13px !important;
                margin: 0px 10px !important;
            }
            ${ notice } {
                margin: 0px 10px !important;
            }`;
        } else if (isOfferPage || (!isDesktop && isProductPage)) {
            customStyle +=
            `${ wrapper } {
                margin-bottom: -1.5vh;
                border-radius: ${ isOfferPage ? '2vh 2vh 0 0' : '2vh' };
                z-index: 9 !important;
                position: relative;
            }
            ${ header } {
                font-size: 18px !important;
                margin: 0px 10px !important;
            }
            ${ notice } {
                margin: 0px 10px !important;
            }`;
        }

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.appendHtml = (location, price, position = 'after') => {
        const { wrapper, header, notice, join, wrapperBaseStyle } = classes;
        const { paraGift, delivery } = config.texts;

        const htmlTemplate = (productPrice) => `
        <div class="${ wrapper } ${ wrapperBaseStyle } ${ join }">
            <p class="${ header }">${ paraGift.replace('#PRICE', productPrice) }</p>
            <p class="${ notice }">${ delivery }</p>
        </div>`;

        if (!isControlGroup) {
            Insider.dom(location)[position](htmlTemplate(price));
        }

        Insider.campaign.custom.show(variationId);
    };

    self.handlePageContent = () => {
        let pageType;
        const pageHandlers = {
            product: self.handleProductPage,
            category: self.handleCategoryPage,
            offer: self.handleOfferPage
        };

        if (isOfferPage) {
            pageType = 'offer';
        } else if (isCategoryPage) {
            pageType = 'category';
        } else if (isProductPage) {
            pageType = 'product';
        }

        if (pageType) {
            pageHandlers[pageType]();

            Insider.utils.opt.ajaxListener((url, response, method) => {
                if (method === 'GET' && Insider.fns.has(url, config.urls.request)) {
                    setTimeout(() => {
                        pageHandlers[pageType]();
                    }, 500);
                }
            });
        }
    };

    self.handleCategoryPage = () => {
        const { modelData } = classes;
        const { categoryPageProducts, categoryPageProductTitle, wrapper } = selectors;

        Insider.dom(wrapper).remove();

        Insider.dom(categoryPageProducts).accessNodes((node) => {
            const $node = Insider.dom(node).find(categoryPageProductTitle);
            const productId = $node.attr(modelData);
            const $productOptions = $node.parent().next();
            const product = config.skuList[productId];

            if (product) {
                const price = product.paraCardAmount;
                const method = isDesktop ? 'after' : 'prepend';

                self.appendHtml(isDesktop ? $productOptions : node, price, method);
            }
        });
    };

    self.handleProductPage = () => {
        const { productPageProductId, productPageImage, wrapper } = selectors;
        const currentProductId = Insider.systemRules.call('getCurrentProduct').id;
        const productPageProduct = config.skuList[currentProductId];

        if (productPageProduct) {
            const price = productPageProduct?.paraCardAmount ?? '';
            const appendLocation = isDesktop ? productPageProductId : productPageImage;
            const method = isDesktop ? 'after' : 'before';

            Insider.dom(wrapper).remove();

            self.appendHtml(appendLocation, price, method);
        }
    };

    self.handleOfferPage = () => {
        const { offerPageProduct, offerPageProductLink } = selectors;
        const { positionRelative } = classes;
        const { skuList } = config;

        Insider.dom(offerPageProduct).accessNodes((node) => {
            const $node = Insider.dom(node);
            const productId = $node.find(offerPageProductLink).attr('title');

            if (skuList[productId]) {
                self.appendHtml(node, skuList[productId].paraCardAmount, 'prepend');
                $node.addClass(positionRelative);
            }
        });
    };

    return self.init();
})({});
/* OPT-162992 END */
