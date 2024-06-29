/* OPT-162992 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 3525 : 3526;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isOfferPage = Insider.fns.hasParameter('/offer');
    const isCategoryPage = Insider.systemRules.call('isOnCategoryPage');
    const isProductPage = Insider.systemRules.call('isOnProductPage');
    const classes = {
        badge: `ins-badge-${ variationId }`,
        join: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        header: `ins-custom-text-header-${ variationId }`,
        notice: `ins-custom-text-notice-${ variationId }`,
        modelData: 'data-modelcode',
        positionRelative: `ins-element-position-relative-${ variationId }`
    };
    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        categoryPageAppendLocation: '.option-selector-v2__swiper-container',
        categoryPageProducts: '.pd03-product-finder__content-item.pd03-product-finder__content-item-view.js-pfv2-product-card',
        categoryPageProductTitle: '.pd03-product-card__product-name a',
        productPageProductId: '.pd-info__sku',
        productPageImage: '.first-image',
        offerPageProduct: '.cmp-prd-card_item',
        offerPageProductLink: '.cmp-prd-card_item-thbnail'
    });
    const config = {
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
        },
        // Testing...
        'UE65DU7000UXTK': {
            giftProduct: 'HW-LS60D/TK',
            paraCardAmount: '4,500'
        },
        'UE65DU7200UXTK': {
            giftProduct: 'HW-LS60D/TK',
            paraCardAmount: '6,500'
        },
        'QE65Q80DATXTK': {
            giftProduct: 'HW-LS60D/TK',
            paraCardAmount: '7,500'
        },
        'SM-S928BZTQTUR': {
            giftProduct: 'HW-LS60D/TK',
            paraCardAmount: '5,000'
        },
        'QE65Q60DAUXTK': {
            giftProduct: 'HW-LS60D/TK',
            paraCardAmount: '5,000'
        },
        'UE65CU8100UXTK': {
            giftProduct: 'HW-LS60D/TK',
            paraCardAmount: '5,000'
        }
        // Testing...
    };

    self.init = () => {
        if (variationId) {
            const currentProductId = Insider.systemRules.call('getCurrentProduct').id;
            const productPageProduct = config[currentProductId];

            if (isCategoryPage) {
                self.handleAjaxElements('category');
            } else if (isProductPage && productPageProduct) {
                self.handleAjaxElements('product');
            } else if (isOfferPage) {
                self.handleAjaxElements('offer');
            }
        }
    };
    self.showCampaign = () => {
        if (!Insider.campaign.isControlGroup(variationId)) {
            self.reset();
            self.buildCSS();
            self.addClass();
        }
        Insider.campaign.custom.show(variationId);
    };
    self.reset = () => {
        const { style, wrapper, positionRelative: positionRelativeSelector } = selectors;
        const { positionRelative } = classes;

        Insider.dom(`${ style }, ${ wrapper }`).remove();
        Insider.dom(positionRelativeSelector).removeClass(positionRelative);
    };
    self.buildCSS = () => {
        const { wrapper, header, notice, positionRelative } = selectors;
        let customStyle = `
        ${ header } {
            font-size: 14px !important;
            font-weight: 700;
        }
        ${ notice } {
            font-size: 12px !important;
        }
        ${ positionRelative } {
            position: relative;
        }
        @media (max-width: 120px) {
            ${ wrapper } {
                margin: unset !important;
                border-radius: 25vh 25vh 0 0;
            }
        }`;
        const wrapperBaseStyle = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: start;
            background-color: #dae0fd;
            padding: 0.5vh;`;

        if (isDesktop && (isCategoryPage || isProductPage)) {
            customStyle += `
            ${ wrapper } {
                ${ wrapperBaseStyle }
                margin: 1vh;
                border-radius: 25vh;
            }
          `;
        } else if (!isDesktop && isCategoryPage) {
            customStyle += `
            ${ wrapper } {
                ${ wrapperBaseStyle }
                margin-bottom: -12px;
                border-radius: 25vh 25vh 0 0;
                z-index: 9 !important;
                position: relative;
            }
          `;
        } else if (isOfferPage && isDesktop) {
            customStyle += `
            ${ wrapper } {
                ${ wrapperBaseStyle }
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
            const borderRadius = isOfferPage ? '2vh 2vh 0 0' : '2vh';

            customStyle += `
            ${ wrapper } {
                ${ wrapperBaseStyle }
                margin-bottom: -1.5vh;
                border-radius: ${ borderRadius };
                z-index: 9 !important;
                position: relative;
            }
            ${ header } {
                font-size: 13px !important;
                margin: 0px 10px !important;
            }
            ${ notice } {
                margin: 0px 10px !important;
            }`;
        }
        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };
    self.addClass = () => {
        if (isOfferPage) {
            const { offerPageProduct, offerPageProductLink } = selectors;
            const { positionRelative } = classes;

            Insider.fns.onElementLoaded(offerPageProduct, () => {
                Insider.dom(offerPageProduct).accessNodes((node) => {
                    const $node = Insider.dom(node);
                    const productId = $node.find(offerPageProductLink).attr('title');

                    if (config[productId]) {
                        $node.addClass(positionRelative);
                    }
                });
            }).listen();
        }
    };
    self.appendHtml = (location, price, position = 'after') => {
        const { wrapper, header, notice, join, } = classes;
        const htmlTemplate = (productPrice) => `
        <div class="${ wrapper } ${ join }">
            <p class="${ header }">Buy now and get ${ productPrice } TL Para Card Amount</p>
            <p class="${ notice }">Para card amount will be delivered after 14 days</p>
        </div>`;
        const html = htmlTemplate(price);

        Insider.dom(location)[position](html);
        Insider.campaign.custom.show(variationId);
    };
    self.handleAjaxElements = (page) => {
        const { modelData } = classes;
        const { categoryPageProducts, categoryPageProductTitle, productPageProductId, productPageImage,
            offerPageProduct, offerPageProductLink, wrapper } = selectors;
        const currentProductId = Insider.systemRules.call('getCurrentProduct').id;
        const productPageProduct = config[currentProductId];
        let isProducExists = false;
        const handleCategoryPage = () => {
            Insider.dom(wrapper).remove();
            Insider.fns.onElementLoaded(categoryPageProducts, () => {
                Insider.dom(categoryPageProducts).accessNodes((node) => {
                    const $node = Insider.dom(node).find(categoryPageProductTitle);
                    const productId = $node.attr(modelData);
                    const $productOptions = $node.parent().next();
                    const product = config[productId];

                    if (product) {
                        const price = product.paraCardAmount;
                        const method = isDesktop ? 'after' : 'prepend';

                        isProducExists = true;
                        self.appendHtml(isDesktop ? $productOptions : node, price, method);
                    }
                });
            }).listen();
        };
        const handleProductPage = () => {
            Insider.dom(wrapper).remove();
            const price = productPageProduct.paraCardAmount;
            const appendLocation = isDesktop ? productPageProductId : productPageImage;
            const method = isDesktop ? 'after' : 'before';

            isProducExists = true;
            self.appendHtml(appendLocation, price, method);
        };
        const handleOfferPage = () => {
            Insider.fns.onElementLoaded(offerPageProduct, () => {
                Insider.dom(offerPageProduct).accessNodes((node) => {
                    const productId = Insider.dom(node).find(offerPageProductLink).attr('title');

                    if (config[productId]) {
                        isProducExists = true;
                        self.appendHtml(node, config[productId].paraCardAmount, 'prepend');
                    }
                });
            }).listen();
        };
        const handleAjaxRequest = (func) => {
            func();
            Insider.utils.opt.ajaxListener((url, response, method) => {
                if (method === 'GET' && url.includes('searchapi.samsung.com/')) {
                    setTimeout(() => {
                        func();
                    }, 500);
                }
            });
        };

        if (page === 'category') {
            handleAjaxRequest(handleCategoryPage);
        } else if (page === 'product') {
            handleAjaxRequest(handleProductPage);
        } else if (page === 'offer') {
            handleAjaxRequest(handleOfferPage);
        }

        if (isProducExists) {
            self.showCampaign(products);
        }
    };

    return self.init();
})({});
/* OPT-162992 END */
