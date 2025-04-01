/* OPT-145560 START */
((self) => {
    'use strict';

    const builderIds = {
        web: '497',
        tablet: '504',
        mobile: '498'
    }[Insider.browser.getPlatform()];

    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderIds);
    const isOnProductPage = Insider.systemRules.call('isOnProductPage');
    const isControlGroup = Insider.campaign.isControlGroup(variationId);
    const discountText = 'EXTRA 20% OFF';
    const isTablet = Insider.browser.isTablet();

    const classes = {
        badge: `ins-discounted-badge-${ variationId }`,
        text: `ins-discounted-badge-text-${ variationId }`,
        style: `ins-custom-badge-style-${ variationId }`,
        hide: `ins-custom-hide-${ variationId }`,
        moveIcon: `ins-custom-move-icon-${ variationId }`,
        join: `sp-custom-${ variationId }-1`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        productList: '#searchspring-init .grid',
        productPageProductImage: Insider.browser.isDesktop() ? '.product_media' : '#mobile-slide-images',
        categoryPagePrice: '.price.text-error-content',
        productCard: '#searchspring-init .product_card_item',
        categoryPageProductImage: '.product-card__image',
        categorySaleBadge: '#searchspring-init .product_card_item span:contains(Sale)',
        productSaleBadge: '#product-gallery span:contains(Sale)',
        tabletProductImage: '#product-gallery .product_media:first',
        zoomIcon: '.btn-zoom-image'
    });

    self.init = () => {
        if (variationId) {
            const { productPageProductImage, productCard, tabletProductImage } = selectors;

            Insider.fns.onElementLoaded(`${ productPageProductImage }, ${ productCard }, ${ tabletProductImage }`,
                () => {
                    self.reset();
                    self.setCss();

                    if (isOnProductPage) {
                        self.setProductPageDiscount();
                        isTablet && self.setEvent();
                    }

                    if (Insider.systemRules.call('isOnCategoryPage')) {
                        self.setCategoryPageDiscount();
                        self.setObserver();
                    }
                }).listen();
        }
    };

    self.reset = () => {
        const { badge, hide, style, zoomIcon } = selectors;
        const { hide: hideClass, moveIcon } = classes;

        Insider.dom(`${ badge }, ${ style }`).remove();

        Insider.fns.isObject(Insider.__external.mutationObserver145560) &&
          Insider.__external.mutationObserver145560.disconnect();

        Insider.dom(hide).removeClass(hideClass);
        Insider.dom(zoomIcon).removeClass(moveIcon);
    };

    self.setCss = () => {
        const { badge, text, hide, moveIcon } = selectors;

        let styleText =
      `${ badge } {
          height: 70px;
          width: 70px;
          border-radius: 100% !important;
          text-align: center;
          display: flex;
          position: absolute;
          z-index: 2;
          background-color: #5c626e;
          align-content: center;
          justify-content: center;
          align-items: center;
          bottom: 10px;
          left: 10px;
          cursor: pointer;
      }
      ${ text } {
          font-family: new-atten,sans-serif;
          line-height: 22px;
          font-size: 15px;
          text-align: center;
          font-weight: 700;
          color: #FFF;
          display: flex;
          justify-content: center;
          align-items: center;
      }
      ${ hide } {
          display: none !important;
      }`;

        if (isOnProductPage) {
            styleText +=
          `${ badge } {
              left: 5px !important;
          }
          ${ moveIcon } {
              bottom: 85px !important;
          }
          <!-- ZEN-151943 START -->
          @media only screen and (min-width: 768px) and (max-width: 1024px) {
              ${ badge } {
                  height: 100px;
                  width: 100px;
                  bottom: 20px !important;
                  left: 20px !important;
              }
          }
          <!-- ZEN-151943 END -->
          @media only screen and (min-width: 320px) and (max-width: 950px) {
              ${ badge } {
                  bottom: 45px !important;
              }
          }`;
        }

        Insider.dom('<style>').addClass(classes.style).html(styleText).appendTo('head');
    };

    self.setProductPageDiscount = () => {
        const { productPageProductImage, zoomIcon, tabletProductImage } = selectors;

        const getCurrentProduct = Insider.systemRules.call('getCurrentProduct');
        const $firstProductImage = isTablet ?
            Insider.dom(tabletProductImage) : Insider.dom(`${ productPageProductImage }:first`); /* OPT-150287 */

        if (getCurrentProduct.price !== getCurrentProduct.originalPrice) {
            if (!isControlGroup) {
                self.buildHtml($firstProductImage);

                $firstProductImage.find(zoomIcon).addClass(classes.moveIcon);
            }

            self.showCampaign();
        }
    };

    self.setEvent = () => {
        Insider.eventManager.once(`resize.action:element:${ variationId }`, window, () => {
            Insider.dom(selectors.badge).remove();

            self.setProductPageDiscount();
        });
    };

    self.setCategoryPageDiscount = () => {
        const { categoryPagePrice, productCard, categoryPageProductImage } = selectors;

        Insider.dom(productCard).accessNodes((item) => {
            if (Insider.dom(item).find(categoryPagePrice).exists()) {
                !isControlGroup && self.buildHtml(Insider.dom(item).find(categoryPageProductImage));

                self.showCampaign();
            }
        });
    };

    self.buildHtml = ($selector) => {
        const { badge, join, text } = classes;

        const discountBadgeHtml =
      `<div class="${ badge } ${ join }">
          <div class="${ text }">${ discountText }</div>
      </div>`;

        $selector.prepend(discountBadgeHtml);

        self.removePartnerBadge();
    };

    self.showCampaign = () => {
        Insider.campaign.custom.show(variationId);
    };

    self.removePartnerBadge = () => {
        const { productSaleBadge, categorySaleBadge } = selectors;

        Insider.dom(isOnProductPage ? productSaleBadge : categorySaleBadge).addClass(classes.hide);
    };

    self.setObserver = () => {
        const { productList } = selectors;

        Insider.__external.mutationObserver145560 = new MutationObserver(() => {
            self.setCategoryPageDiscount();
        });

        Insider.dom(productList).exists() &&
      Insider.__external.mutationObserver145560.observe(Insider.dom(productList).nodes[0], {
          attributes: true,
          childList: true
      });
    };

    self.init();
})({});
/* OPT-145560 END */
