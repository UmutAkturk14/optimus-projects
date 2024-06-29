/* OPT-162992 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 3525 : 3526;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const classes = {
        badge: `ins-badge-${ variationId }`,
        join: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        header: `ins-custom-text-header-${ variationId }`,
        notice: `ins-custom-text-notice-${ variationId }`,
        modelData: 'data-modelcode'
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
        }
        // Testing...
    };

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.buildCSS();
                self.buildHTML();
            }

            return true;
        }
    };

    self.reset = () => {
        const { style, wrapper } = selectors;

        Insider.dom(`${ style }, ${ wrapper }`).remove();
    };

    self.buildCSS = () => {
        const { wrapper, header, notice } = selectors;

        let customStyle =
        `${ header } {
            font-size: 14px !important;
            font-weight: 700;
        }
        ${ notice } {
            font-size: 12px !important;
        }
        @media (max-width: 120px) {
            ${ wrapper } {
                margin: unset !important;
                border-radius: 25vh 25vh 0 0;
            }
        }`;

        if (isDesktop && (Insider.systemRules.call('isOnCategoryPage') || Insider.systemRules.call('isOnProductPage'))) {
            customStyle += `
            ${ wrapper } {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: start;
              background-color: #dae0fd;
              margin: 1vh;
              border-radius: 25vh;
              padding: 0.5vh;
          }`;
        } else if (!isDesktop && Insider.systemRules.call('isOnCategoryPage')) {
            customStyle += `
            ${ wrapper } {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: start;
              background-color: #dae0fd;
              margin-bottom: -16px;
              border-radius: 25vh 25vh 0 0;
              padding: 0.5vh;
              z-index: 9 !important;
              position: relative;
          }`;
        } else if (Insider.fns.hasParameter('/offer') || (!isDesktop && Insider.systemRules.call('isOnProductPage'))) {
            const borderRadius = Insider.fns.hasParameter('/offer') ? '2vh 2vh 0 0' : '2vh 2vh 2vh 2vh';
            const marginBottom = Insider.fns.hasParameter('/offer') && !isDesktop ? '-1.5vh' : '-4.5vh';

            customStyle += `${ wrapper } {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: start;
              background-color: #dae0fd;
              margin-bottom: ${ marginBottom };
              border-radius: ${ borderRadius };
              padding: 0.5vh;
              z-index: 9 !important;
              position: relative;
            }

            ${ header } {
                font-size: 13px !important;
                margin: 0px 10px !important;
            }

            ${ notice } {
                margin: 0px 10px !important;
            }
            `;
        }

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const { wrapper, header, notice, join, modelData } = classes;
        const { categoryPageProducts, categoryPageProductTitle, productPageProductId, productPageImage,
            offerPageProduct, offerPageProductLink } = selectors;
        const currentProductId = Insider.systemRules.call('getCurrentProduct').id;
        const productPageProduct = config[currentProductId];
        const isCategoryPage = Insider.systemRules.call('isOnCategoryPage');
        const isProductPage = Insider.systemRules.call('isOnProductPage');
        const isOfferPage = Insider.fns.hasParameter('/offer');

        const htmlTemplate = (price) => `
          <div class="${ wrapper } ${ join }">
              <p class="${ header }">Buy now and get ${ price } TL Para Card Amount</p>
              <p class="${ notice }">Para card amount will be delivered after 14 days</p>
          </div>`;

        const appendHtml = (location, price, position = 'after') => {
            const html = htmlTemplate(price);

            Insider.dom(location)[position](html);
        };

        if (isCategoryPage) {
            Insider.dom(categoryPageProducts).accessNodes((node) => {
                const $node = Insider.dom(node).find(categoryPageProductTitle);
                const productId = $node.attr(modelData);
                const $productOptions = $node.parent().next();

                if (config[productId]) {
                    const price = config[productId].paraCardAmount;
                    const method = isDesktop ? 'after' : 'prepend';

                    appendHtml(isDesktop ? $productOptions : node, price, method);
                }
            });
        } else if (isProductPage && productPageProduct) {
            const price = productPageProduct.paraCardAmount;
            const appendLocation = isDesktop ? productPageProductId : productPageImage;
            const method = isDesktop ? 'after' : 'before';

            appendHtml(appendLocation, price, method);
        } else if (isOfferPage) {
            Insider.dom(offerPageProduct).accessNodes((node) => {
                const productId = Insider.dom(node).find(offerPageProductLink).attr('title');

                if (config[productId]) {
                    appendHtml(node, config[productId].paraCardAmount, 'prepend');
                }
            });
        }
    };

    return self.init();
})({});
/* OPT-162992 END */
