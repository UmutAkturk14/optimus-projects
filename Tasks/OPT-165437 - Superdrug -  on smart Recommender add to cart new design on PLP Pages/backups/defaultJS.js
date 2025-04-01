let smartRecommender;
const mainWrapper = `.ins-preview-wrapper-${ camp.id } .ins-mobile-web-smart-recommender-main-wrapper`;

const templateConfig = {
    campaign: camp,
    classes: {
        hideRecommenderClass: 'ins-display-none',
    },
    selectors: {
        smartRecommenderMainWrapper: mainWrapper,
        recommendationBody: `${ mainWrapper } .ins-mobile-web-smart-recommender-body`,
        productWrapper: `${ mainWrapper } .ins-mobile-web-smart-recommender-body .ins-mobile-web-smart-recommender-box-item`,
        productItem: `${ mainWrapper } .ins-mobile-web-smart-recommender-box-item .ins-product-content`,
        innerProductWrapper: `${ mainWrapper } .ins-mobile-web-smart-recommender-inner-box`,
        productAttributeWrapper: '.ins-product-attribute-wrapper',
        editableAfterClickText: '.ins-editable-after-click-text',
        addToCartWrapper: `${ mainWrapper } .ins-add-to-cart-wrapper, ${ mainWrapper } .ins-clone-product-div-button`,
        addToWishlistWrapper: `${ mainWrapper } .ins-add-to-wishlist, ${ mainWrapper } .ins-clone-product-div-button`,
        addToCartContent: `${ mainWrapper } .ins-product-add-to-cart`,
        goToProductWrapper: `${ mainWrapper } .ins-go-to-product-button`,
        productImageIconButtonMouseEventTarget: `${ mainWrapper } .ins-product-image-button .ins-mouse-event-target`,
        dropdownContainer: `${ mainWrapper } .ins-product-dropdown-container`,
        productCardDesigner: `${ mainWrapper } .ins-product-card-designer`,
        productCardDesignerItem: `${ mainWrapper } .ins-product-card-designer > .ins-mobile-web-smart-recommender-box-item`,
    },
    settings: {
        isDiscountTypePercentage: '#{{Discount Type}}' !== 'percentage',
        isDiscountPriceNone: '#{{Discount Price}}' === 'ins-hide',
        badgeStatus: '#{{Discount Badge}}' === 'block',
        supportLayout: true,
        newTab: '#{{Open In New Tab}}',
    },
    /* OPT-65906 START */
    hooks: {
        /* OPT-110316 START */
        getEndpoint: {
            self() {
                const categories = [];

                Insider.dom('e2-breadcrumb span.breadcrumb-item').each(function (index, item) {
                    categories.push(Insider.dom(item).text().trim());
                });

                const category = categories[categories.length - 2] || '';

                return category ? `${ this.getEndpoint() }&filter=([category][~][${ category }])` : this.getEndpoint();
            }
        },
        fillGeneralProductContent: {
            after(item) {
                const shadeButtonSelector = '.ins-shade-button';
                const memberPrice = item?.product_attributes?.member_price ?? ''; /* OPT-155246 */

                this.global.itemContainer.find('.ins-rating-on')
                    .css('width', `${ (item.product_attributes.star_rating / 5) * 100 || 0 }%`);
                this.global.itemContainer.find('.ins-promotion-text')
                    .text(item.product_attributes.promotion_text || '');
                this.global.itemContainer.find('.ins-review-count')
                    .text(`(${ item.product_attributes.review_count || 0 })`);
                this.global.itemContainer.find('.ins-promotion-wrapper, .ins-rating, .review-count-wrapper')
                    .attr('href', item.url);
                this.global.itemContainer.find('.ins-member-price-wrapper').text(memberPrice); /* OPT-155246 */

                if (Number(item.product_attributes.color_option_count) > 0) {
                    this.global.itemContainer.find(shadeButtonSelector)
                        .removeClass('ins-hide');
                    this.global.itemContainer.find(`${ shadeButtonSelector } a`)
                        .text(`${ item.product_attributes.color_option_count || 0 } shades`);
                    this.global.itemContainer.find(`${ shadeButtonSelector } a`)
                        .attr('href', item.url);
                    this.global.itemContainer.find('.ins-review-wrapper')
                        .before(this.global.itemContainer.find(shadeButtonSelector).parent());/* OPT-110316 */
                } else {
                    this.global.itemContainer.find(shadeButtonSelector)
                        .addClass('ins-hide');
                    this.global.itemContainer.find('.ins-promotion-wrapper')
                        .after(this.global.itemContainer.find(shadeButtonSelector).parent()); /* OPT-110316 */
                }

                if (item.product_attributes.is_rrp_price) {
                    this.global.itemContainer.find('.ins-price-prefix').text('RRP');
                } else {
                    this.global.itemContainer.find('.ins-price-prefix').text('was');
                }

                if (item.product_attributes.is_restricted_country) {
                    this.global.itemContainer.find('.add-to-cart-text')
                        .text('Not for sale in selected Country');
                    this.global.itemContainer.find('.ins-add-product-to-cart-button, .ins-add-to-cart-wrapper')
                        .addClass('ins_restricted_country');
                } else {
                    this.global.itemContainer.find('.add-to-cart-text')
                        .text('Add to basket');
                    this.global.itemContainer.find('.ins-add-product-to-cart-button, .ins-add-to-cart-wrapper')
                        .removeClass('ins_restricted_country');
                }
            }
        }
        /* OPT-110316 END */

    }
    /* OPT-65906 END */
};

const setSliderConfig = function () {
    templateConfig.sliderConfig = {
        elements: {
            previewWrapper: `.ins-preview-wrapper-${ camp.id }`,
            singleProduct: 'ins-single-product',
            wrapper: `${ mainWrapper } .ins-mobile-web-smart-recommender-body-wrapper`,
            ul: `${ mainWrapper } .ins-mobile-web-smart-recommender-body`,
            arrowWrapper: `${ mainWrapper } .ins-slider-arrow-wrapper`,
            next: `${ mainWrapper } .ins-slider-next`,
            prev: `${ mainWrapper } .ins-slider-prev`,
            contentWrapper: `.ins-content-wrapper-${ camp.id }`,
            productImageBox: `${ mainWrapper } .ins-product-box .ins-image-box`,
            addToCartText: `${ mainWrapper } .add-to-cart-text`,
            addToCartIcon: `${ mainWrapper } .ins-add-to-cart-icon`,
            addToCart: `${ mainWrapper } .ins-add-product-to-cart-button`,
            productAttributesAndAddToCartWrapper: `${ mainWrapper } .wrap-product-attributes-and-add-to-cart`,
            innerProductWrapper: `${ mainWrapper } .ins-mobile-web-smart-recommender-inner-box`,
            productNameWrapper: `${ mainWrapper } .ins-product-name-container`,
        },
        settings: {
            betweenItemMargin: Number('#{{Card Spacing}}'),
            eachItemWidth: Number('#{{Card Width}}'),
            itemCount: Insider.dom(templateConfig.selectors.productWrapper).length,
            windowItemCount: Number('#{{Display Product Number}}') || Number(templateConfig.campaign.predictiveFeedSettings.feedSize),
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
const sliderInit = function (callback) {
    setSliderConfig();

    const { settings } = templateConfig.sliderConfig;
    const { elements } = templateConfig.sliderConfig;
    const smartRecommenderSlider = smartRecommender.sliderManager();

    smartRecommenderSlider.setDimensions = function () {
        const recommenderWrapperWidth = Insider.dom(elements.contentWrapper).width();
        const customItemCount = settings.isResponsiveMode
            ? settings.windowItemCount
            : ((recommenderWrapperWidth - 2 * settings.padding) /
                (settings.eachItemWidth + settings.betweenItemMargin));
        const itemCount = (Math.abs(customItemCount) > settings.feedSize
            ? settings.feedSize
            : customItemCount).toString();
        const eachItemWidth = settings.isResponsiveMode
            ? (recommenderWrapperWidth - (2 * settings.padding) - ((itemCount - 1) * settings.betweenItemMargin)) /
            itemCount
            : settings.eachItemWidth;

        smartRecommenderSlider.setSetting('windowItemCount', itemCount);
        smartRecommenderSlider.setSetting('eachItemWidth', eachItemWidth);

        Insider.dom(elements.wrapper).width(recommenderWrapperWidth);
        Insider.dom(templateConfig.selectors.productItem).width(eachItemWidth);

        Insider.dom(elements.productImageBox).height(settings.imageAreaHeight);
        // Shows up images in here to prevent multiple image request on network
        Insider.dom(elements.productImageBox).css('display', 'flex');
        Insider.dom(templateConfig.selectors.productWrapper).width(eachItemWidth);
        Insider.dom(elements.ul)
            .width((eachItemWidth + settings.betweenItemMargin) * settings.itemCount + 2 * settings.padding);
        Insider.dom(templateConfig.selectors.goToProductWrapper).height(settings.goToProductButtonHeight);

        smartRecommenderSlider.setAddToCartDimensions();

        if (settings.isResponsiveMode) {
            Insider.dom(templateConfig.sliderConfig.elements.productNameWrapper)
                .attr('style', `width:${ settings.productNameWidth } !important`);
        }

        return smartRecommenderSlider;
    };

    smartRecommenderSlider.setAddToCartDimensions = function () {
        const isAddToCartButtonVisible = Insider.dom(elements.addToCart).visible().length > 0;

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
    sliderInit,
    cloneProductDivJs: new Function(''),
    setSliderConfig,
};

const templateInit = function () {
    smartRecommender = new Insider.campaign.smartRecommender();
    smartRecommender.init(templateConfig);
};

if (typeof Insider.campaign.smartRecommender === 'undefined') {
    Insider.request.script({
        charset: 'UTF-8',
        src: `${ Insider.__external.EITRI_URL }ins-smart-recommender.js`,
        success: templateInit,
    });
} else {
    templateInit();
}

Insider.eventManager.on(`framelessInited${ camp.id }`, templateInit);
