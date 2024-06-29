var smartRecommender;
var mainWrapper = '.ins-preview-wrapper-' + camp.id + ' .ins-mobile-web-smart-recommender-main-wrapper';

var templateConfig = {
    campaign: camp,
    classes: {
        hideRecommenderClass: 'ins-display-none',
        paparaCardDelivery: 'ins-paparacard-delivery-warning' /* OPT-162992 */
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
        /* OPT-162992 START */
        closeButton: `${ mainWrapper } .ins-element-close-button`,
        skipButton: `${ mainWrapper } .ins-skip-button`,
        imageBox: '.ins-image-area',
        textWrapper: '#wrap-text-1454703450644',
        productName: '#ins-dynamic-text-1647932539333:first',
        paraCreditAddToCart: '.ins-add-to-cart-button'
        /* OPT-162992 END */
    },
    settings: {
        isDiscountTypePercentage: '#{{Discount Type}}' !== 'percentage',
        isDiscountPriceNone: '#{{Discount Price}}' === 'ins-hide',
        badgeStatus: '#{{Discount Badge}}' === 'block',
        supportLayout: true,
        newTab: '#{{Open In New Tab}}',
    },
    /* OPT-162992 START */
    hooks: {
        getEndpoint: {
            self() {
                let endpoint = this.getEndpoint();
                const giftId = Insider.storage.localStorage.get(`ins-gift-storage-${ camp.id }`)?.product ?? '';

                if (giftId) {
                    endpoint += `&filter=([item_id][=][${ giftId }])`;
                }

                return endpoint;
            }
        },
        generateTemplate: {
            after(endpoint) {
                this.hideByState(true);

                Insider.request.get({
                    url: endpoint,
                    success: function (response) {
                        if (this.insufficientProductCount(response)) {
                            this.hideByState(true);

                            return false;
                        }

                        const { imageBox, textWrapper, productName, paraCreditAddToCart, productWrapper } = templateConfig.selectors;
                        const { hideRecommenderClass, paparaCardDelivery } = templateConfig.classes;

                        Insider.fns.onElementLoaded(`.ins-preview-wrapper-${ camp.id } .ins-recommender-body .ins-mobile-web-smart-recommender-box-item`, () => {

                            const bonusAmount = Insider.storage.localStorage.get(`ins-gift-storage-${ camp.id }`)?.paraCardAmount ?? '';
                            const nameText = `${ bonusAmount } Papara card amount`;
                            const $paraCreditContainer = Insider.dom(Insider.dom(productWrapper)
                                .clone().getNode(0));

                            const paraCreditImage = 'https://image.useinsider.com/samsungturkey/defaultImageLibrary/no-image-icon-23485-1717093346.png';

                            $paraCreditContainer.find(imageBox).attr('src', paraCreditImage);
                            $paraCreditContainer.find(textWrapper).css('width', '225px', 'important');
                            $paraCreditContainer.find(productName).css('text-align', 'center')
                                .css('font-size', '22px', 'important').text(nameText);
                            $paraCreditContainer.find(`.ins-product-price, ${ paraCreditAddToCart }`).addClass(hideRecommenderClass);
                            $paraCreditContainer.find('#ins-layout-block-wrapper-16401899775513').remove();

                            $paraCreditContainer.find('.ins-action-buttons-wrapper:eq(0)').after(`
                                <div class="ins-custom-add-to-cart-button">
                                    <span>Sepete Ekle</span>
                                </div>
                                <span class="${ paparaCardDelivery }">
                                    *Paparacard amount will be deliver after 14 days of the delivery
                                </span>
                            `);

                            $paraCreditContainer.find('.ins-add-to-cart-button').remove();

                            Insider.dom(`${ mainWrapper } .ins-web-smart-recommender-body`).css('width', '750px');
                            Insider.dom(productWrapper).before($paraCreditContainer);

                            this.hideByState(false);
                        }).listen();
                    }.bind(this),
                    parse: true,
                });
            }
        },
    }
    /* OPT-162992 END */
};

/**
 * Sets the visible product count according to selected device orientation mode
 * @returns {number}
 */
var getWindowItemCount = function () {
    var isLandscape = templateConfig.campaign.locationConfig.windowWidth >
        templateConfig.campaign.locationConfig.windowHeight;
    var productCount = isLandscape
        ? Number('#{{Card Count in Landscape Mode.mobile}}')
        : Number('#{{Card Count in Portrait Mode.mobile}}');

    if (templateConfig.campaign.platform === 'tablet') {
        productCount = isLandscape
            ? Number('#{{Card Count in Landscape Mode.tablet}}')
            : Number('#{{Card Count in Portrait Mode.tablet}}');
    }

    return Number(productCount) || Number(templateConfig.campaign.predictiveFeedSettings.feedSize);
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
            windowItemCount: Number(getWindowItemCount()),
            padding: Number('#{{Padding}}'),
            numberOfRows: '1',
            isResponsiveMode: '#{{Responsive Design}}' === 'true',
            slidingItemCount: Number('#{{Sliding Number}}') || 1,
            isLoopActive: '#{{Slider Loop}}' === 'true',
            widgetSize: '#{{Widget Width}}',
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
        var itemCount = Math.abs(customItemCount) > settings.feedSize ? settings.feedSize : customItemCount;
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
        smartRecommenderSlider.setWrapperHeight();

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

const nextArrow = '.ins-slider-arrow-wrapper.ins-element-content.ins-arrow-with-border';
const prevArrow = '.ins-slider-arrow-wrapper.ins-arrow-with-border:first';
const productFirst = '.ins-mobile-web-smart-recommender-box-item:first';

Insider.dom(prevArrow).addClass('ins-display-none');
Insider.dom('.ins-slider-arrow-element:first').addClass('ins-visibility-hidden');

Insider.eventManager.once(`click.on:next:arrow:${ camp.id }`, '.ins-slider-arrow-element:first', () => {
    Insider.dom(nextArrow).removeClass('ins-display-none');
    Insider.dom(prevArrow).addClass('ins-display-none');

    Insider.dom(productFirst).removeClass('ins-display-none');
    Insider.dom('.ins-slider-arrow-element:first').addClass('ins-visibility-hidden');
    Insider.dom('.ins-slider-arrow-element:last').removeClass('ins-visibility-hidden');
});

Insider.eventManager.once(`click.on:prev:arrow:${ camp.id }`, '.ins-slider-arrow-element:last', () => {
    Insider.dom(nextArrow).addClass('ins-display-none');
    Insider.dom(prevArrow).removeClass('ins-display-none');

    Insider.dom('.ins-slider-arrow-element:first').removeClass('ins-visibility-hidden');
    Insider.dom('.ins-slider-arrow-element:last').addClass('ins-visibility-hidden');

    Insider.dom(productFirst).addClass('ins-display-none');
});
