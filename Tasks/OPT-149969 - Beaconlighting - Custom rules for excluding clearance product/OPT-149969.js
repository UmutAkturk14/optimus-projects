/* ZEN-126381 START */
((self) => {
    'use strict';

    const isMobile = Insider.browser.isMobile();
    const builderId = isMobile ? 971 : 970;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isControlGroup = Insider.campaign.isControlGroup(variationId);
    const isPDP = Insider.systemRules.call('isOnProductPage');
    const listingNode = Insider.fns.parseURL().rawHref.indexOf('/catalogsearch/') > -1 ? '.ais-Hits-item' : '.item.product.product-item';

    const classes = {
        badgeWrapper: `ins-custom-badge-wrapper-${ variationId }`,
        badgeText: `ins-badge-text-${ variationId }`,
        customStyle: `ins-custom-style-${ variationId }`,
        goal: `sp-custom-${ variationId }-1`,
        hide: `ins-display-none-${ variationId }`
    };

    const selectors = Object.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        productElement: '.product-item-info',
        productImageWrapper: 'a.product-item-photo',
        reviewElement: '.stamped-product-reviews-badge',
        saleBage: '.beacon_ple-product_label-image',
        appendedElement: isPDP ? '.product.media .beacon_ple-product_label-container' : listingNode,
        addToCart: '#product-addtocart-button'
    });

    /* OPT149969 START */
    self.init = () => {
        if (variationId && self.checkEligibilityProduct()) {
            if (!isControlGroup) {
                Insider.fns.onElementLoaded(selectors.appendedElement, () => {
                    self.reset();
                    self.buildCSS();
                    self.buildHtml();
                    self.setEvents();
                }).listen();
            }

            return true;
        }
    };

    self.checkEligibilityProduct = () => {
        const isOnClearancePage = Insider.systemRules.call('isOnCategoryPage') && Insider.fns.hasParameter('clearance');
        const isOnProductPage = Insider.systemRules.call('isOnProductPage');
        const SKUs = new Set([
            '121169', '281024', '050331', '011848', '011822', '230255', '159020', '189102', '190672', '210662',
            '210663', '210665', '210666', '229161', '240263', '259110', '259114', '260266', '280102', '280104',
            '159016', '120992', '027061', '027060', '011490', '011296', '011492', '011711', '269613', '269611',
            '269610', '261495', '221065', '189103', '269606', '269605', '269604', '269603', '269419', '261175',
            '261060', '259330', '240190', '239607', '239606', '239605', '239604', '237006', '231207', '230356',
            '221058', '177726', '177725', '170883', '080766', '011861', '011764', '011762', '011721', '050092',
            '050091', '231211', '231210', '221054', '220239', '365133', '250875', '159127', '159030', '149030',
            '140728', '011753', '300863', '010884', '010883', '011781', '259350', '239431', '177641', '177640',
            '159096', '159094', '159091', '157140', '011581', '039151', '210230', '011806', '111950', '299026',
            '299025', '291004', '189177', '299020', '210954', '177648', '177649', '177644', '177645', '160860',
            '170533', '300226', '300229', '089126', '089127', '177655'
        ]);

        return (isOnProductPage && !SKUs.has(Insider.systemRules.call('getCurrentProduct').id)) ||
    (!isOnClearancePage && Insider.systemRules.call('isOnCategoryPage'));
    };
    /* OPT149969 END */

    self.reset = () => {
        Insider.dom(`${ selectors.badgeWrapper }, ${ selectors.customStyle }`).remove();
        Insider.dom(selectors.saleBage).removeClass(classes.hide);
    };

    self.buildCSS = () => {
        const customStyle =
`${ selectors.badgeWrapper } {
    display: flex;
    justify-content: center;
flex-direction: column;
    align-items: center;
    position: absolute;
    right: ${ isMobile ? '14px;' : '0px;' }; /*ZEN*/
    top: ${ !isPDP ? '9px' : '0' };
    ${ !isPDP ? 'left: 5px;' : '' }
    background-color: #ba2e29;
    color: #FFFFFF;
    font-size: 18px;
    z-index: 2;
    height: 75px;
    width: 75px;
    border-radius: 50px;
    ${ isMobile ? 'zoom: 0.6;font-weight: bold; ' : '' }
    ${ (isMobile && isPDP) ? 'zoom: 1 !important;right: 0 !important;' : '' }
}
${ selectors.badgeText } {
    font-size: ${ isMobile ? '14px;' : '22px;' }
    margin-right: 3px;
    ${ (isMobile && isPDP) ? 'font-size: 18px !important;' : '' }
}
${ selectors.hide } {
    display: none !important;
}`;

        Insider.dom('<style>').addClass(classes.customStyle).html(customStyle).appendTo('head');
    };

    self.buildHtml = () => {
        let badgeHTML;
        let iOldPrice;
        let iDiscountPrice;

        if (Insider.dom(selectors.saleBage).exists()) {
            Insider.dom(selectors.saleBage).addClass(classes.hide);
        }

        if (Insider.systemRules.call('isOnCategoryPage')) {
            const products = Insider.dom('.item.product.product-item').nodes || [];

            products.forEach((product) => {
                const $selectedProduct = Insider.dom(product);
                const checkSecond = ($selectedProduct.find('.item-promo_message .price').text() || '') !== '';

                iDiscountPrice = Number($selectedProduct.find('.special-price .price').text().replace('$', '').replace(',', '')) || '';
                iOldPrice = Number($selectedProduct.find('.old-price .price').text().replace('$', '').replace(',', '')) || '';

                let discountPercent = iDiscountPrice !== iOldPrice ?
                    Math.round(100 - iDiscountPrice / iOldPrice * 100) : 0;

                if (discountPercent > 0 && discountPercent !== 100) {
                    discountPercent = (!checkSecond) ? (`${ discountPercent }%`) : (`${ discountPercent }%`);
                    badgeHTML = `<div class="${ classes.badgeWrapper }">`
                            + `<span class="${ classes.badgeText }">${ discountPercent }</span>`
                            + 'OFF</div>';
                    $selectedProduct.find(selectors.productImageWrapper).append(badgeHTML)
                        .addClass(classes.goal);
                }

            });
        } else if (Insider.fns.parseURL().rawHref.indexOf('/catalogsearch/') > -1) {
            const products = Insider.dom('.ais-Hits-item').nodes || [];

            products.forEach((product) => {
                const $selectedProduct = Insider.dom(product);

                iDiscountPrice = Number($selectedProduct.find('.special-price .price').text().replace('$', '').replace(',', '')) || '';
                iOldPrice = Number($selectedProduct.find('.old-price .price').text().replace('$', '').replace(',', '')) || '';
                const discountPercent = iDiscountPrice !== iOldPrice ?
                    Math.round(100 - iDiscountPrice / iOldPrice * 100) : 0;

                if (discountPercent > 0 && discountPercent !== 100) {
                    badgeHTML =
            `<div class="${ classes.badgeWrapper }"
                style="right:unset!important; left:15px!important">` +
                    `<span class="${ classes.badgeText }">${ discountPercent }%</span>OFF` +
            '</div>';
                    $selectedProduct.find(selectors.productImageWrapper).append(badgeHTML);
                }

            });
        } else if (isPDP) {
            const discountPercent = Math.round(100 - Insider.systemRules.call('getCurrentProduct').price / Insider.systemRules.call('getCurrentProduct').originalPrice * 100);
            const outerHtml =
    `<div class="${ classes.badgeWrapper }">` +
        `<span class="${ classes.badgeText }">${ discountPercent }%</span>OFF` +
    '</div>';

            Insider.dom('.product.media .beacon_ple-product_label-container').append(outerHtml);
        }
    };

    self.setEvents = () => {
        Insider.eventManager.once('click.add:to:cart:goal', selectors.addToCart, () => {
            Insider.utils.opt.sendCustomGoal(builderId, 270, true);
        });
    };

    return self.init(); /* OPT149969 */
})({});
/* ZEN-126381 END */
