var smartRecommender;
var mainWrapper = '.ins-preview-wrapper-' + camp.id + ' .ins-mobile-web-smart-recommender-main-wrapper';
/* OPT-145245 START */
const userId = Insider.getUserId();
const segmentId = ((Insider.storage.localStorage.get('ins-mikro-segment-id-145245') || {})[userId] || {})
    .secondMicroSegmentId || '0';
const purchasedProductCategories = Insider.storage.localStorage.get(`ins-paid-categories-${ camp.id }`) ?? []; /* OPT-159417 */
/* OPT-145245 END */

/* OPT-152750 START */
const campaignConfig = {
    imgUrl: 'https://image.useinsider.com/teknosa/defaultImageLibrary/Frame%20633-1710139594.png',
    ratingText: 'Değerlendirme'
};
/* OPT-152750 END */
var templateConfig = {
    campaign: camp,
    classes: {
        hideRecommenderClass: 'ins-display-none',
        /* OPT-152750 START */
        reviewWrapper: 'ins-custom-review-wrapper',
        reviewContent: 'ins-custom-review-content',
        starElementClass: 'ins-product-star-element',
        boldTextClass: 'ins-bold-text-element',
        reviewCount: 'ins-product-review-count',
        /* OPT-152750 END */
    },
    selectors: {
        smartRecommenderMainWrapper: mainWrapper,
        recommendationBody: mainWrapper + ' .ins-mobile-web-smart-recommender-body',
        productWrapper: mainWrapper + ' .ins-mobile-web-smart-recommender-body .ins-mobile-web-smart-recommender-box-item',
        productItem: mainWrapper + ' .ins-mobile-web-smart-recommender-box-item .ins-product-content',
        innerProductWrapper: mainWrapper + ' .ins-mobile-web-smart-recommender-inner-box',
        productAttributeWrapper: '.ins-product-attribute-wrapper',
        editableAfterClickText: '.ins-editable-after-click-text',
        addToCartWrapper: mainWrapper + ' .ins-add-to-cart-wrapper, ' + mainWrapper + ' .ins-clone-product-div-button',
        addToWishlistWrapper: mainWrapper + ' .ins-add-to-wishlist, ' + mainWrapper + ' .ins-clone-product-div-button',
        addToCartContent: mainWrapper + ' .ins-product-add-to-cart',
        goToProductWrapper: mainWrapper + ' .ins-go-to-product-button',
        productImageIconButtonMouseEventTarget: mainWrapper + ' .ins-product-image-button .ins-mouse-event-target',
        dropdownContainer: mainWrapper + ' .ins-product-dropdown-container',
        productCardDesigner: mainWrapper + ' .ins-product-card-designer',
        productCardDesignerItem: mainWrapper + ' .ins-product-card-designer > .ins-mobile-web-smart-recommender-box-item',
        /* OPT-152750 START */
        discount: 'div[data-selected-layout="layout-4-18"] .ins-layout-block-wrapper:nth-child(1)',
        productNameAttribute: 'div[data-dynamic-text-value="{name}"]',
        customReviewWrapper: '.ins-custom-review-wrapper',
        starElementSelector: '.ins-product-star-element',
        imageBoxSelector: '.ins-image-box',
        priceSelector: 'div[data-price-type="sale_price"]',
        originalPriceSelector: 'div[data-price-type="original_price"]',
        ratingAttributeSelector: 'div:has(> img.ins-product-star-element)',
        /* OPT-152750 END */
        customBadge: '.ins-custom-badge', /* OPT-159543 */
    },
    settings: {
        isDiscountTypePercentage: '#{{Discount Type}}' !== 'percentage',
        isDiscountPriceNone: '#{{Discount Price}}' === 'ins-hide',
        badgeStatus: '#{{Discount Badge}}' === 'block',
        supportLayout: true,
        newTab: '#{{Open In New Tab}}',
    },
    /* OPT-152750 START */
    hooks: {
        fillGeneralProductContent: {
            after(product) {
                /* OPT-159543 START */
                const { productNameAttribute, customReviewWrapper, starElementSelector, imageBoxSelector,
                priceSelector, originalPriceSelector, discount, ratingAttributeSelector,
                customBadge } = templateConfig.selectors;
                const { reviewWrapper, starElementClass, reviewContent, boldTextClass, reviewCount,
                    hideRecommenderClass } = templateConfig.classes;
                /* OPT-159543 END */
                const { brand, name, rating, product_attributes } = product;
                const { imgUrl, ratingText } = campaignConfig;

                let newName;
                const $templateContainer = this.global.itemContainer;
                const element = $templateContainer.find(productNameAttribute);
                const reviewCountAttribute = product_attributes?.review_count;

                $templateContainer.find(customReviewWrapper).remove();
                $templateContainer.find(starElementSelector).remove();

                if (reviewCountAttribute && rating) {
                    const html =
                    `<div class=${ reviewWrapper }>
                        <img src="${ imgUrl }" class="${ starElementClass }">
                        <div class="${ reviewContent }">
                            <span class="${ boldTextClass }"> ${ rating } </span>
                            <span class="${ reviewCount }">
                                (${ reviewCountAttribute } ${ ratingText })
                            </span>
                        </div>
                    </div>`;

                    $templateContainer.find(imageBoxSelector).after(html).css('margin-bottom', '0');
                } else {
                    $templateContainer.find(imageBoxSelector).css('margin-bottom', '11');
                }

                if (Insider.fns.has(name, brand)) {
                    const modifiedName = name.replace(brand, '').trim();

                    newName = `<span class="${ boldTextClass }">${ brand } </span>
                        ${ modifiedName }`;

                    element.html(`<span>${ newName }</span>`);
                } else {
                    newName = name;
                }

                element.html(`<span>${ newName }</span>`);

                const price = $templateContainer.find(priceSelector).text().trim();
                const originalPrice = $templateContainer.find(originalPriceSelector).text().trim();

                if (price === originalPrice) {
                    $templateContainer.find(discount).css('width', '0', 'important');
                    $templateContainer.find(originalPriceSelector).css('display', 'none', 'important');
                    $templateContainer.find(originalPriceSelector).css('padding', '0px 0px 0px 0px');
                    $templateContainer.find(priceSelector).css('padding', '0px 0px 0px 0px');
                } else {
                    $templateContainer.find(originalPriceSelector).css('display', 'block', 'important');
                    $templateContainer.find(discount).css('width', '20%', 'important');
                    $templateContainer.find(originalPriceSelector).css('padding', '0px 0px 0px 5px');
                    $templateContainer.find(priceSelector).css('padding', '0px 0px 0px 5px');
                }

                $templateContainer.find(productNameAttribute).css('padding', '0px 0px 0px 0px');
                $templateContainer.find(ratingAttributeSelector).css('padding', '0px 0px 0px 0px');

                /* OPT-159543 START */
                if (product_attributes?.kampanya === 'teknoClub' && price !== originalPrice) {
                $templateContainer.find(customBadge).removeClass(hideRecommenderClass);
                } else {
                   $templateContainer.find(customBadge).addClass(hideRecommenderClass);
                }
                /* OPT-159543 END */
            }
        },
        /* OPT-145245 START */
        getEndpoint: {
            self() {
                return `${ this.getEndpoint() }&filter=([product_attributes.micro_segment_rank2][~][${ segmentId }:]*[category][!=][${ purchasedProductCategories.join('||') || '-' }])`;
            }
        },
        generateTemplate: {
            self(endpoint) {
                !this.global.templateConfig.classes && this.hideByState(true);

                Insider.request.get({
                    url: endpoint,
                    success: function (response) {
                        const data = response.data;

                        const getMicroSegmentRank = (product) => ((product.product_attributes || {})
                            .micro_segment_rank2 || []).find(rank => rank.split(':')[0].includes(`${ segmentId }`)); /* OPT-161581 */

                        const sortKey = (item) => parseInt(getMicroSegmentRank(item)?.split(':')[1] ?? ''); /* OPT-148149 */

                        const sortedData = data.sort((acculmator, currentValue) =>
                            (sortKey(acculmator) ?? 0) - (sortKey(currentValue) ?? 0));

                        Insider.request.get({
                            url: `https://recommendationv2.api.useinsider.com/v2/user-based?details=true&locale=${ Insider.systemRules.call('getLocale') }&partnerName=${ Insider.partner.name }&size=15&currency=${ Insider.systemRules.call('getCurrency') }&userId=${ userId }&filter=([category][!=][${ purchasedProductCategories.join('||') || '-'}])`,
                            parse: true,
                            success: function (response) {
                                response.data.forEach((product) => sortedData.push(product));

                                this.hideByState(sortedData.length < 5);
                                this.changeOverlayVisibility(!(sortedData.length < 5));

                                this.global.proxy
                                    .call(this, 'predictiveFeed', 'buildTemplateForProducts', sortedData);
                            }.bind(this),
                            error(error) {
                                Insider.logger.log(`ES6 flag endpoint failed! Error message: ${ error }`);
                            }
                        });
                    }.bind(this),
                    parse: true,
                });
            }
        },
        /* OPT-145245 END */
    }

    /* OPT-152750 END */
};

var setSliderConfig = function () {
    templateConfig.sliderConfig = {
        elements: {
            previewWrapper: '.ins-preview-wrapper-' + camp.id,
            singleProduct: 'ins-single-product',
            wrapper: mainWrapper + ' .ins-mobile-web-smart-recommender-body-wrapper',
            ul: mainWrapper + ' .ins-mobile-web-smart-recommender-body',
            arrowWrapper: mainWrapper + ' .ins-slider-arrow-wrapper',
            next: mainWrapper + ' .ins-slider-next',
            prev: mainWrapper + ' .ins-slider-prev',
            contentWrapper: '.ins-content-wrapper-' + camp.id,
            productImageBox: mainWrapper + ' .ins-product-box .ins-image-box',
            addToCartText: mainWrapper + ' .add-to-cart-text',
            addToCartIcon: mainWrapper + ' .ins-add-to-cart-icon',
            addToCart: mainWrapper + ' .ins-add-product-to-cart-button',
            productAttributesAndAddToCartWrapper: mainWrapper + ' .wrap-product-attributes-and-add-to-cart',
            innerProductWrapper: mainWrapper + ' .ins-mobile-web-smart-recommender-inner-box',
            productNameWrapper: mainWrapper + ' .ins-product-name-container',
        },
        settings: {
            betweenItemMargin: Number('#{{Card Spacing}}'),
            eachItemWidth: 200,
            itemCount: Insider.dom(templateConfig.selectors.productWrapper).length,
            padding: Number('#{{Padding}}'),
            numberOfRows: '1',
            isResponsiveMode: '#{{Responsive Design}}' === 'true',
            slidingItemCount: Number('#{{Sliding Number}}') || 1,
            isLoopActive: '#{{Slider Loop}}' === 'true',
            widgetSize: '#{{Widget Size}}',
            productCardDimensions: '#{{Product Dimensions}}',
            imageAreaHeight: '200px',
            productNameWidth: '100%',
            isArrowImage: '#{{Arrow Image Checkbox}}' === 'true',
            multipleRowClass: 'multiple-row',
            textActive: 'ins-add-to-cart-text-button-active',
            iconActive: 'ins-add-to-cart-icon-button-active',
            addToCartWithImageClass: 'ins-add-to-cart-button-with-image',
            responsiveModeActiveClass: 'ins-responsive-mode-active',
            arrowWrapperClass: 'ins-arrow-with-border',
            arrowWithBackgroundClass: 'ins-arrow-with-background',
            supportLayout: true,
            feedSize: Number(templateConfig.campaign.predictiveFeedSettings.feedSize),
        },
    };
};

// Override slider module for this template
var sliderInit = function (callback) {
    setSliderConfig();

    var settings = templateConfig.sliderConfig.settings;
    var elements = templateConfig.sliderConfig.elements;
    var smartRecommenderSlider = smartRecommender.sliderManager();

    smartRecommenderSlider.setDimensions = function () {
        var recommenderWrapperWidth = Insider.dom(elements.contentWrapper).width();
        var customItemCount = settings.isResponsiveMode
            ? settings.windowItemCount
            : ((recommenderWrapperWidth - 2 * settings.padding) /
                (settings.eachItemWidth + settings.betweenItemMargin));
        var itemCount = (Math.abs(customItemCount) > settings.feedSize
            ? settings.feedSize
            : customItemCount).toString();
        var eachItemWidth = settings.isResponsiveMode
            ? (recommenderWrapperWidth - (2 * settings.padding) - ((itemCount - 1) * settings.betweenItemMargin)) /
            itemCount
            : settings.eachItemWidth;

        smartRecommenderSlider.setSetting('windowItemCount', itemCount);
        smartRecommenderSlider.setSetting('eachItemWidth', eachItemWidth);

        Insider.dom(elements.wrapper).width(recommenderWrapperWidth);
        Insider.dom(templateConfig.selectors.productItem).width(eachItemWidth);

        //Insider.dom(elements.productImageBox).height(settings.imageAreaHeight);
        Insider.dom(elements.productImageBox).height(eachItemWidth); /* OPT-159543 */

        // Shows up images in here to prevent multiple image request on network
        Insider.dom(elements.productImageBox).css('display', 'flex');
        Insider.dom(templateConfig.selectors.productWrapper).width(eachItemWidth);
        Insider.dom(elements.ul)
            .width((eachItemWidth + settings.betweenItemMargin) * settings.itemCount + 2 * settings.padding);
        Insider.dom(templateConfig.selectors.goToProductWrapper).height(settings.goToProductButtonHeight);

        smartRecommenderSlider.setAddToCartDimensions();

        if (settings.isResponsiveMode) {
            Insider.dom(templateConfig.sliderConfig.elements.productNameWrapper)
                .attr('style', 'width:' + settings.productNameWidth + ' !important');
        }

        return smartRecommenderSlider;
    };

    smartRecommenderSlider.setAddToCartDimensions = function () {
        var isAddToCartButtonVisible = Insider.dom(elements.addToCart).visible().length > 0;

        if (!settings.isAddToCartTextButtonActive && isAddToCartButtonVisible) {
            Insider.dom(elements.innerProductWrapper)
                .removeClass(settings.textActive)
                .addClass(settings.iconActive);
        } else {
            Insider.dom(elements.innerProductWrapper)
                .removeClass(settings.iconActive)
                .addClass(settings.textActive);
        }

        if (settings.addToCartButtonHeight) {
            Insider.dom(elements.addToCart).height(settings.addToCartButtonHeight);
        }

        if (settings.addToCartButtonWidth) {
            Insider.dom(elements.addToCart).width(settings.addToCartButtonWidth);
        }

        if (settings.isAddToCartWithImage) {
            Insider.dom(elements.addToCart).addClass(settings.addToCartWithImageClass);
            Insider.dom(elements.addToCartText).parent().remove();
            Insider.dom(elements.addToCartIcon).remove();
        }
    };

    smartRecommenderSlider.construct = function () {
        Insider.dom(smartRecommenderSlider.elements.wrapper)
            .toggleClass(settings.responsiveModeActiveClass, smartRecommenderSlider.settings.isResponsiveMode);

        Insider.dom(elements.ul).attr('data-current', 0);
        smartRecommenderSlider.setArrowIcons();
        smartRecommenderSlider.setDimensions();
        smartRecommenderSlider.bindMobileEvents();
        smartRecommenderSlider.checkRtlStatus();

        return smartRecommenderSlider;
    };

    smartRecommenderSlider.construct();

    if (callback instanceof Function) {
        callback(smartRecommenderSlider);
    }

    return smartRecommenderSlider;
};

templateConfig.functions = {
    sliderInit: sliderInit,
    cloneProductDivJs: new Function(''),
    setSliderConfig: setSliderConfig,
};

var templateInit = function () {
    smartRecommender = new Insider.campaign.smartRecommender();
    smartRecommender.init(templateConfig);
};

if (typeof Insider.campaign.smartRecommender === 'undefined') {
    Insider.request.script({
        charset: 'UTF-8',
        src: Insider.__external.EITRI_URL + 'ins-smart-recommender.js',
        success: templateInit,
    });
} else {
    templateInit();
}

Insider.eventManager.on('framelessInited' + camp.id, templateInit);
