let smartRecommender;
const mainWrapper = `.ins-preview-wrapper-${ camp.id } .ins-mobile-web-smart-recommender-main-wrapper`;

const templateConfig = {
    campaign: camp,
    classes: {
        hideRecommenderClass: 'ins-display-none',
        /* OPT-165437 START */
        hide: 'ins-invisible',
        shadeWrapper: 'ins-shade-wrapper',
        shadeButton: 'ins-shade-button',
        reviewWrapper: 'ins-review-wrapper',
        rating: 'ins-rating',
        reviewCountWrapper: 'review-count-wrapper',
        reviewCount: 'ins-review-count',
        ratingOn: 'ins-rating-on',
        ratingOff: 'ins-rating-off',
        pricePrefix: 'ins-price-prefix',
        loaderWrapper: 'ins-loader-wrapper',
        restrictedCountry: 'ins_restricted_country'
        /* OPT-165437 END */
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
        /* OPT-165437 START */
        breadcrumbItem: 'e2-breadcrumb span.breadcrumb-item',
        itemTitle: '#ins-layout-block-wrapper-16401899775512',
        discountContainer: '#wrap-price-172189895363001undefined',
        pricePrefix: '.ins-price-prefix',
        ratingOn: '.ins-rating-on',
        shadeWrapper: '.ins-shade-wrapper',
        addToCartText: '.add-to-cart-text',
        addProductToCart: '.ins-add-product-to-cart-button, .ins-add-to-cart-wrapper'
        /* OPT-165437 END */
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
                const { breadcrumbItem } = templateConfig.selectors; /* OPT-165437 */

                const categories = [];

                Insider.dom(breadcrumbItem).each(function (index, item) {
                    categories.push(Insider.dom(item).text().trim());
                });

                const category = categories[categories.length - 2] || '';

                return category ? `${ this.getEndpoint() }&filter=([category][~][${ category }])` : this.getEndpoint();
            }
        },
        fillGeneralProductContent: {
            after(item) {
                const { itemTitle, discountContainer, ratingOn: ratingOnSelector,
                    shadeWrapper: shadeWrapperSelector, addToCartText, addProductToCart,
                    shadeButton: shadeButtonSelector } = templateConfig.selectors;
                const { hide, shadeWrapper, shadeButton, reviewWrapper, rating, reviewCountWrapper, reviewCount,
                    ratingOn, ratingOff, pricePrefix, restrictedCountry } = templateConfig.classes;
                const { url, product_attributes } = item;
                const { color_option_count, review_count, star_rating } = product_attributes;

                const $itemContainer = this.global.itemContainer;
                const pricePrefixText = 'was';

                $itemContainer.find(`.${ shadeWrapper }, .${ reviewWrapper }, .${ pricePrefix }`).remove();

                const shadeHTML =
                `<div class="${ shadeWrapper } ${ hide }">
                    <div class="${ shadeButton }">
                        <a href="${ url }">
                            ${ color_option_count } shades
                        </a>
                    </div>
                </div>`;

                const reviewHTML =
                `<div class="${ reviewWrapper }">
                <a href="${ url }" class="${ rating }">
                    <span class="${ ratingOff }"> ★★★★★ </span>
                    <span class="${ ratingOn }"> ★★★★★ </span>
                </a>
                <a href="${ url }" class="${ reviewCountWrapper }">
                    <span class="${ reviewCount }">(${ review_count })</span>
                </a>`;

                const pricePrefixHTML =
                `<span class="${ pricePrefix }">${ pricePrefixText }</span>`;

                $itemContainer.find(itemTitle).after(reviewHTML).after(shadeHTML);
                $itemContainer.find(discountContainer).before(pricePrefixHTML);

                $itemContainer.find(ratingOnSelector)
                    .css('width', `${ (star_rating / 5) * 100 || 0 }%`);

                if (Number(item.product_attributes.color_option_count) > 0) {
                    $itemContainer.find(shadeWrapperSelector)
                        .removeClass(hide);
                } else {
                    $itemContainer.find(shadeButtonSelector)
                        .addClass(hide);
                }

                if (item.product_attributes.is_restricted_country) {
                    $itemContainer.find(addToCartText)
                        .text('Not for sale in selected Country');
                    $itemContainer.find(addProductToCart)
                        .addClass(restrictedCountry);
                } else {
                    $itemContainer.find(addProductToCart)
                        .removeClass(restrictedCountry);
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




