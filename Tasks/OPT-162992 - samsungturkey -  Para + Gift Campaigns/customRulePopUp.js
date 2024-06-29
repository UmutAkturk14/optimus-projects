/* OPT-162992 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 3547 : 3576;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isOfferPage = Insider.fns.hasParameter('/offer');
    const isCategoryPage = Insider.systemRules.call('isOnCategoryPage');
    const isProductPage = Insider.systemRules.call('isOnProductPage');
    const isControlGroup = Insider.campaign.isControlGroup(variationId);
    const couponStorage = `ins-coupon-code-${ variationId }`;
    const giftStorage = `ins-gift-storage-${ variationId }`;

    const classes = {
        badge: `ins-badge-${ variationId }`,
        join: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        header: `ins-custom-text-header-${ variationId }`,
        notice: `ins-custom-text-notice-${ variationId }`,
        modelData: 'data-modelcode',
        positionRelative: `ins-element-position-relative-${ variationId }`,
        addToCart: `ins-add-to-cart-${ variationId }`,
        hidden: `ins-hidden-element-${ variationId }`,
        infoWrapper: `ins-preview-wrapper-${ variationId }`,
        backgroundUnset: `ins-background-unset-${ variationId }`
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
        offerPageProductLink: '.cmp-prd-card_item-thbnail',
        categoryPageAddToCartButton: '.cta.cta--contained.cta--black.js-cta-addon',
        productPageAddToCartButton: '.cost-box__cta:contains("Satın Al")',
        offerPageAddToCartButton: '.cta.cta--contained.cta--black.cmp-prd-card_cta-btn',
        skipButton: '.ins-skip-button',
        closeButton: '.ins-element-close-button',
        popUpAddToCart: '.ins-custom-add-to-cart-button',
        addCoupon: '.summary-total__btn.summary-total__btn--link.link.ng-star-inserted',
        couponInput: '.cart-voucher.modal__container.ng-star-inserted input',
        couponModal: '.modal',
        couponSubmit: '.cart-voucher.modal__container.ng-star-inserted button[type="submit"]',
        couponModalContainer: '.cart-voucher.modal__container.ng-star-inserted',
        couponModalClose: '.modal__close'
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
        }
    };

    self.init = () => {
        if (variationId) {
            self.reset();
            self.buildCSS();
            self.buildHTML();
            self.addClass();
            self.setEvents();

            if (Insider.systemRules.isOnCartPage()) {
                self.handleCheckoutPage();
            }
        }
    };

    self.reset = () => {
        const { style, wrapper, positionRelative: positionRelativeSelector, addToCart } = selectors;
        const { positionRelative } = classes;

        Insider.dom(`${ style }, ${ wrapper }, ${ addToCart }`).remove();
        Insider.dom(positionRelativeSelector).removeClass(positionRelative);
    };

    self.buildCSS = () => {
        const { wrapper, addToCart, hidden, backgroundUnset } = selectors;
        let customStyle = `
        ${ addToCart } {
            font-size: 1.4vh;
            color: white;
            text-align: center;
            padding: .69444444vw 1.66666667vw .76388889vw 1.66666667vw;
            border-radius: 20px;
            transition: background-color 0.3s ease;
            order: -1;
            font-weight: 600;
            cursor: pointer;
        }
        ${ addToCart }:hover {
            background-color: #595959;
        }
        ${ hidden } {
            display: none !important;
        }
        ${ backgroundUnset } {
            background-color: unset !important;
        }
        @media (max-width: 120px) {
            ${ wrapper } {
                margin: unset !important;
                border-radius: 25vh 25vh 0 0;
            }
        }`;

        const addToCartBaseStyle = `
            background-color: black;
            color: white;
            text-align: center;
            padding: .69444444vw 1.66666667vw .76388889vw 1.66666667vw;
            border-radius: 20px;
            transition: background-color 0.3s ease;
            order: -1;
            font-weight: 600;
            cursor: pointer;`;

        if (isCategoryPage) {
            customStyle += `
            ${ addToCart } {
                ${ addToCartBaseStyle }
                font-size: 1.4vh;
                background-color: black;
            }`;
        } else if (isProductPage) {
            customStyle += `
            @media (min-width: 1200px) {
                ${ addToCart } {
                    font-size: 1.4vh;
                    width: 40%;
                    margin-left: 30%;
                }
            }
            ${ addToCart } {
                ${ addToCartBaseStyle }
                background-color: #007AFF;
                padding: 1.5vh;
            }
            @media (max-width: 1200px) {
                ${ addToCart } {
                    font-size: 1.8vh;
                    padding: 1.5vh;
                    width: 80% !important;
                    margin-left: 10% !important;
                    border-radius: 35px;
                }
            }
            `;
        } else if (isOfferPage) {
            customStyle += `
            ${ addToCart } {
                ${ addToCartBaseStyle }
            }}`;
        }

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const currentProductId = Insider.systemRules.call('getCurrentProduct').id;
        const productPageProduct = config[currentProductId];

        if (isCategoryPage) {
            self.handleAjaxElements('category');
        } else if (isProductPage && productPageProduct) {
            self.handleAjaxElements('product');
        } else if (isOfferPage) {
            self.handleAjaxElements('offer');
        }
    };

    self.addClass = () => {
        if (isOfferPage) {
            const { offerPageProduct, offerPageProductLink } = selectors;
            const { positionRelative } = classes;

            const addDisplayClass = () => {
                Insider.fns.onElementLoaded(offerPageProduct, () => {
                    Insider.dom(offerPageProduct).accessNodes((node) => {
                        const $node = Insider.dom(node);
                        const productId = $node.find(offerPageProductLink).attr('title');

                        if (config[productId]) {
                            $node.addClass(positionRelative);
                        }
                    });
                }).listen();
            };

            addDisplayClass();

            Insider.utils.opt.ajaxListener((url, response, method) => {
                if (method === 'GET' && url.includes('searchapi.samsung.com/')) {
                    setTimeout(() => {
                        addDisplayClass();
                    }, 500);
                }
            });
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

        if (!isControlGroup) {
            Insider.dom(location)[position](html);
        }

        Insider.campaign.custom.show(variationId);
    };

    self.handleAjaxElements = (page) => {
        const { modelData, addToCart, hidden } = classes;
        const { categoryPageProducts, categoryPageProductTitle, offerPageProduct, offerPageProductLink,
            categoryPageAddToCartButton, addToCart: addToCartSelector, productPageAddToCartButton,
            offerPageAddToCartButton } = selectors;
        const currentProductId = Insider.systemRules.call('getCurrentProduct').id;

        const handleCategoryPage = () => {
            Insider.dom(addToCartSelector).remove();

            Insider.fns.onElementLoaded(categoryPageProducts, () => {
                Insider.dom(categoryPageProducts).accessNodes((node) => {
                    const $node = Insider.dom(node).find(categoryPageProductTitle);
                    const productId = $node.attr(modelData);
                    const product = config[productId];
                    const $partnerAddToCart = Insider.dom(node).find(categoryPageAddToCartButton);

                    if (product) {

                        // debugger;
                        const buttonHtml = `
                        <div class="${ addToCart }" data-ins-product-id="${ productId }">Sepete ekle</div>`;

                        $partnerAddToCart.after(buttonHtml);
                        $partnerAddToCart.addClass(hidden);
                    }
                });
            }).listen();
        };

        const handleProductPage = () => {
            Insider.dom(addToCartSelector).remove();

            const buttonHtml = `
            <div class="${ addToCart }" data-ins-product-id="${ currentProductId }">Sepete ekle</div>`;

            Insider.dom(productPageAddToCartButton).addClass(hidden).after(buttonHtml);
        };

        const handleOfferPage = () => {
            Insider.dom(addToCartSelector).remove();

            Insider.fns.onElementLoaded(offerPageProduct, () => {
                Insider.dom(offerPageProduct).accessNodes((node) => {
                    const productId = Insider.dom(node).find(offerPageProductLink).attr('title');
                    const $partnerAddToCart = Insider.dom(node).find(offerPageAddToCartButton);

                    if (config[productId]) {
                        const buttonHtml = `
                      <div class="${ addToCart }" data-ins-product-id="${ productId }">Sepete ekle</div>`;

                        $partnerAddToCart.after(buttonHtml);
                        $partnerAddToCart.addClass(hidden);
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
    };

    self.setEvents = () => {
        const { addToCart, skipButton, infoWrapper, closeButton, popUpAddToCart } = selectors;

        const method = isDesktop ? 'click' : 'mouseup';
        const storageName = `ins-coupon-code-${ variationId }`;
        const couponCode = 'INSIDERTESTTR';

        Insider.eventManager.once(`click.track:add:to:cart:clicks:${ variationId }`, addToCart, async (event) => {
            const productId = Insider.dom(event.target).data('ins-product-id');
            const url = `https://shop.samsung.com/tr/ng/p4v1/addCart?productCode=${ productId }&quantity=1&insTrigger=true`;

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include', /* ATTENTION */
                    headers: {
                        'Accept': 'application/json, text/javascript, */*; q=0.01',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                });

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${ response.statusText }`);
                }

                const data = await response.json();

                Insider.logger.log(data);
                Insider.logger.log(`Success: Add to cart event for product: ${ productId }`);
                debugger;
                Insider.storage.localStorage.set({
                    name: giftStorage,
                    value: { product: config[productId]?.giftProduct ?? '', amount: '5000' }
                });

                Insider.campaign.info.clearVisibleCampaignsByType('ON-PAGE');
                Insider.campaign.webInfo.clearVisibleCampaignsByType('ON-PAGE');

                Insider.campaign.info.show(variationId);
            } catch (error) {
                Insider.logger.log(`Error: ${ error.message }`);
            }
        });

        Insider.eventManager.once(`${ method }.handle:skip:button:${ variationId }`, skipButton, () => {
            Insider.dom(infoWrapper).find(closeButton).click();
        });

        Insider.eventManager.once(`${ method }.handle:add:to:cart:button:${ variationId }`, popUpAddToCart, () => {
            console.log('Dispatchingg pop up add to cart stuff...');

            Insider.storage.localStorage.set({
                name: storageName,
                value: couponCode
            });

            Insider.dom(infoWrapper).find(closeButton).click();
        });
    };

    self.handleCheckoutPage = () => {
        const couponCode = Insider.storage.localStorage.get(couponStorage);

        if (couponCode && Insider.systemRules.call('isOnCartPage')) {
            self.submitCouponCode(couponCode);

            Insider.utils.opt.ajaxListener((url, response, method) => {
                if (method === 'POST' && url.includes('vouchers?voucherId')) {
                    if (response.includes('has been applied')) {
                        self.addCheckoutPageBanner();
                    }
                }
            });
        }
    };

    self.submitCouponCode = (couponCode) => {
        const { backgroundUnset, hidden } = classes;
        const { addCoupon, couponInput, couponModal, couponSubmit, couponModalContainer, couponModalClose } = selectors;
        const $addCouponButton = Insider.dom(addCoupon);

        const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
        });

        const changeEvent = new Event('change', {
            bubbles: true,
            cancelable: true,
        });

        $addCouponButton.click();

        const $couponModal = Insider.dom(couponModal);
        const $couponModalContainer = Insider.dom(couponModalContainer);

        $couponModal.addClass(backgroundUnset);
        $couponModalContainer.addClass(hidden);

        const $couponInput = Insider.dom(couponInput);
        const $couponSubmit = Insider.dom(couponSubmit);
        const $couponInputNode = $couponInput.getNode(0);
        const $couponModalClose = $couponModal.find(couponModalClose);

        $couponInput.val(couponCode);
        $couponInputNode.dispatchEvent(inputEvent);
        $couponInputNode.dispatchEvent(changeEvent);
        $couponSubmit.click();
        $couponModalClose.click()
    };

    self.addCheckoutPageBanner = () => {

    };

    self.init();
})({});
/* OPT-162992 END */
