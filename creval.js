var smartRecommender;
var mainWrapper = '.ins-preview-wrapper-' + camp.id + ' .ins-mobile-web-smart-recommender-main-wrapper';
/* OPT-164296 START */
const currency = Insider.systemRules.call('getCurrency');
const storageName = `ins-free-delivery-parameters-${camp.id}`;
let { lowest: lowestPrice = 0, highest: highestPrice = 0 } = Insider.storage.localStorage.get(storageName) ?? {};
/* OPT-164296 END */

var templateConfig = {
    campaign: camp,
    classes: {
        hideRecommenderClass: 'ins-display-none',
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
        /* OPT-164296 START */
        discountContainer: '#ins-layout-block-wrapper-17205098299710undefined',
        priceContainer: '#ins-layout-block-wrapper-17205098299711undefined',
        priceTags: '#price-172050982997110undefined, #price-172050982997111undefined',
        discountedPriceContainer: '#ins-wrap-block-172050982997110undefined'
        /* OPT-164296 END */
    },
    settings: {
        isDiscountTypePercentage: '#{{Discount Type}}' !== 'percentage',
        isDiscountPriceNone: '#{{Discount Price}}' === 'ins-hide',
        badgeStatus: '#{{Discount Badge}}' === 'block',
        supportLayout: true,
        newTab: '#{{Open In New Tab}}',
    },
    /* OPT-164296 START */
    hooks: {
        getEndpoint: {
            self() {
                if ((highestPrice - lowestPrice) < 10) {
                    lowestPrice = 5;
                    highestPrice = 25;
                }

                return `${ this.getEndpoint() }&filter=[price.${ currency }][><][${ lowestPrice }:${ highestPrice }]`;
            }
        },
        fillGeneralProductContent: {
            after(product) {
                const $itemContainer = Insider.dom(this.global.itemContainer);
                const { discountContainer, priceContainer, priceTags,
                    discountedPriceContainer } = templateConfig.selectors;
                const $discountContainer = $itemContainer.find(discountContainer);
                const $priceContainer = $itemContainer.find(priceContainer);
                const $priceTags = $itemContainer.find(priceTags);
                const $discountedPriceContainer = $itemContainer.find(discountedPriceContainer);

                if (product.discount[currency]) {
                    $discountContainer.after($priceContainer);
                    $priceTags.css('text-align', 'right', 'important');
                    $discountedPriceContainer.css('visibility', 'visible', 'important');
                } else {
                    $priceContainer.after($discountContainer);
                    $priceTags.css('text-align', 'left', 'important');
                    $discountedPriceContainer.css('visibility', 'hidden', 'important');
                }
            },
        }
    }
    /* OPT-164296 END */
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
