/* ZEN-141492 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 1168 : 1169; /* OPT-157171 */
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isControlGroup = Insider.campaign.isControlGroup(variationId);

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        container: `ins-custom-container-${ variationId }`,
        normalText: `ins-custom-normal-text-${ variationId }`, /* ZEN-153939 */
        goal: `sp-custom-${ variationId }-1`,
    };

    const selectors = Object.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        /* OPT-150537 START */
        productBadge: '.stamped-product-reviews-badge',
        productPhoto: '.product.photo.product-item-photo'
        /* OPT-150537 END */
    });

    self.init = () => {
        /* OPT-150537 START */
        if (variationId && Insider.systemRules.call('isOnCategoryPage')) {
            self.checkList(self.getProductIDs());
        }
        /* OPT-150537 END */
    };

    /* OPT-150537 START */
    self.getProductIDs = () => {
        const { productPhoto, productBadge } = selectors;

        const productIds = [];

        Insider.dom(productPhoto).accessNodes((product) => {
            const productId = Insider.dom(product).parent().find(productBadge).attr('data-sku');

            if (productId) {
                productIds.push(String(productId));
            }
        });

        return productIds;
    };

    self.checkList = (productIds) => {
        const requestData = {
            partnerName: 'beaconlighting',
            lists: {
                productSkuIds_OPT158865: productIds /* OPT-158865 */
            }
        };

        Insider.request.post({
            url: 'https://cronus.useinsider.com/api/inone/product-list/check',
            data: requestData,
            success: (response) => {
                if (response.success === true) {
                    if (response.data['productSkuIds_OPT158865']?.length > 0) { /* OPT-158865 */
                        if (!isControlGroup) {
                            self.reset();
                            self.buildCSS();
                            self.buildHTML(response.data['productSkuIds_OPT158865']); /* OPT-158865 */
                        }

                        Insider.campaign.custom.show(variationId);
                    }
                }
            },
            error: (error) => {
                Insider.logger.log(`${ error } - variationId: ${ variationId }`);
            },
            parse: true,
        });
    };
    /* OPT-150537 END */

    self.reset = () => {
        Insider.dom(`${ selectors.wrapper } , ${ selectors.style }`).remove();
    };

    self.buildCSS = () => {
        const customStyle =
      `${ selectors.wrapper } {
          color: white;
          background-color: black;
          font-weight: 700;
          text-align: center;
          padding: 2px 0px 2px 0px;
          margin: 0px;
          font-size: 12px;
      }
      ${ selectors.normalText } {
          font-weight: 500 !important; /* ZEN-153939 */
      }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = (productIds) => {
        const { wrapper, container, normalText, goal } = classes;

        const outerHtml =
      `<div class="${ wrapper }">` +
          `<div class="${ container }">` +
              `<p class="${ wrapper }">20% OFF^&nbsp;
                  <span class="${ normalText }">BEACON VIP EXCLUSIVE</span>
              </p>` +
          '</div>' +
      '</div>'; /* ZEN-153939 */

        /* OPT-150537 START */
        Insider.dom(selectors.productPhoto).accessNodes((product) => {
            const productId = Insider.dom(product).parent().find(selectors.productBadge).attr('data-sku');

            if (Insider.fns.has(productIds, productId)) {
                Insider.dom(product).addClass(goal).after(outerHtml);
            }
        });
        /* OPT-150537 END */
    };

    self.init();
})({});
/* ZEN-141492 END */
