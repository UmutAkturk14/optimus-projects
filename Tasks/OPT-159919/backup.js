let smartRecommender;
const mainWrapper = `.ins-preview-wrapper-${ camp.id } .ins-web-smart-recommender-main-wrapper`;
const templateConfig = {
    campaign: camp,
    classes: {
        hideRecommenderClass: 'ins-display-none',
    },
    selectors: {
        smartRecommenderMainWrapper: mainWrapper,
        recommendationBody: `${ mainWrapper } .ins-web-smart-recommender-body`,
        productWrapper: `${ mainWrapper } .ins-web-smart-recommender-body .ins-web-smart-recommender-box-item`,
        productItem: `${ mainWrapper } .ins-web-smart-recommender-box-item .ins-product-content`,
        innerProductWrapper: `${ mainWrapper } .ins-web-smart-recommender-inner-box`,
        productAttributeWrapper: '.ins-product-attribute-wrapper',
        editableAfterClickText: '.ins-editable-after-click-text',
        addToCartWrapper: `${ mainWrapper } .ins-add-to-cart-wrapper, ${ mainWrapper } .ins-clone-product-div-button`,
        addToWishlistWrapper: `${ mainWrapper } .ins-add-to-wishlist, ${ mainWrapper } .ins-clone-product-div-button`,
        addToCartContent: `${ mainWrapper } .ins-product-add-to-cart`,
        goToProductWrapper: `${ mainWrapper } .ins-go-to-product-button`,
        productImageIconButtonMouseEventTarget: `${ mainWrapper } .ins-product-image-button .ins-mouse-event-target`,
        dropdownContainer: `${ mainWrapper } .ins-product-dropdown-container`,
        productCardDesigner: `${ mainWrapper } .ins-product-card-designer`,
        productCardDesignerItem: `${ mainWrapper } .ins-product-card-designer > .ins-web-smart-recommender-box-item`,
    },
    settings: {
        badgeStatus: '#{{Discount Badge}}' === 'block',
        supportLayout: true,
        newTab: '#{{Open In New Tab}}',
    },

    hooks: { /* OPT-66469 START */
        /* OPT-158212 START */
        getEndpoint: {
            self() {
                const currentPath = Insider.fns.parseURL().pathname;
                let filteredGender = '';
                const categories = {
                    damskie: 'women',
                    meskie: 'men'
                };

                Insider.fns.keys(categories).some((category) => {
                    if (Insider.fns.has(currentPath, category)) {
                        filteredGender = categories[category];

                        return true;
                    }
                });

                return `${ this.getEndpoint() }${ (filteredGender && this.global.isOnApi)
                    ? `&filter=([product_attributes.product_gender][=][${ filteredGender }])` : '' }`;
            }
        },
        /* OPT-158212 END */
        fillGeneralProductContent: {
            self(item) {
                const discountOffSelector = '[data-element-name="@discount_percentage_off"] > span';
                const priceSelector = '.ins-product-price';
                const displayNoneClass = 'display-none';
                const priceColorClass = 'price-with-discount';

                this.global.itemContainer.find('.ins-product-box')
                    .attr('href', this.global.isOnApi ? item.url : 'javascript:void(0);');
                this.global.itemContainer.find('.ins-go-to-product-button')
                    .attr('data-product-link', this.global.isOnApi ? item.url : 'javascript:void(0)');
                this.global.itemContainer.find('.ins-image-area')
                    .attr('src', item.image_url);
                this.global.itemContainer.find('.ins-product-name').text(item.name);
                this.global.itemContainer.find('.ins-add-to-cart-wrapper').attr('ins-product-id', item.item_id);

                if (item.discount.PLN !== 0) {
                    this.global.itemContainer.find(priceSelector).addClass(priceColorClass);
                    this.global.itemContainer.find(discountOffSelector).removeClass(displayNoneClass);
                } else {
                    this.global.itemContainer.find(priceSelector).removeClass(priceColorClass);
                    this.global.itemContainer.find(discountOffSelector).addClass(displayNoneClass);
                }

                debugger;

                const logoHTML = '<div class="ins-manufacturer-logo"><img></div>';

                this.global.itemContainer.find('.ins-product-name').append(logoHTML);

                this.global.itemContainer.find('.ins-manufacturer-logo > img').attr('src', (item.product_attributes || {}).brand_logo_image); /* QH-67778 */
            },
            after(item) {
                this.global.itemContainer.find('.ins-product-name').text(item.name);
            }
        }
    } /* OPT-66469 END */
};

const setSliderConfig = function () {
    templateConfig.sliderConfig = {
        elements: {
            previewWrapper: `.ins-preview-wrapper-${ camp.id }`,
            singleProduct: 'ins-single-product',
            wrapper: `${ mainWrapper } .ins-web-smart-recommender-body-wrapper`,
            ul: `${ mainWrapper } .ins-web-smart-recommender-body`,
            arrowWrapper: `${ mainWrapper } .ins-slider-arrow-wrapper`,
            next: `${ mainWrapper } .ins-slider-next`,
            prev: `${ mainWrapper } .ins-slider-prev`,
            contentWrapper: `.ins-content-wrapper-${ camp.id }`,
            productImageBox: `${ mainWrapper } .ins-product-box .ins-image-box`,
            addToCartText: `${ mainWrapper } .add-to-cart-text`,
            addToCartIcon: `${ mainWrapper } .ins-add-to-cart-icon`,
            addToCart: `${ mainWrapper } .ins-add-product-to-cart-button`,
            productAttributesAndAddToCartWrapper: `${ mainWrapper } .wrap-product-attributes-and-add-to-cart`,
            innerProductWrapper: `${ mainWrapper } .ins-web-smart-recommender-inner-box`,
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

        if (smartRecommenderSlider.isMultipleRow()) {
            Insider.dom(elements.ul).width('100%').addClass(settings.multipleRowClass);
            Insider.dom(elements.arrowWrapper).remove();
            const maxVisibleProductCount = Math.floor(settings.windowItemCount) *
                smartRecommenderSlider.settings.numberOfRows;

            Insider.dom(templateConfig.selectors.productWrapper).each(function (index, element) {
                if (index >= maxVisibleProductCount) {
                    Insider.dom(element).attr('style', 'display: none !important');
                }
            });
        }

        return smartRecommenderSlider;
    };

    smartRecommenderSlider.setAddToCartDimensions = function () {
        if (!settings.isAddToCartTextButtonActive) {
            Insider.dom(elements.innerProductWrapper)
                .removeClass(settings.textActive)
                .addClass(settings.iconActive);
        } else {
            Insider.dom(elements.innerProductWrapper)
                .removeClass(settings.iconActive)
                .addClass(settings.textActive);
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
        smartRecommenderSlider.bindWebEvents();
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
