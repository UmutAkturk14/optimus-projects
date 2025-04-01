/* OPT-163889 START */
((self) => {
    'use strict';

    const builderId = 1223;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    let lastScrollTop = 0;
    let isCampaignDisplayed = false;
    const $window = Insider.dom(window);

    const classes = {
        badge: `ins-badge-${ variationId }`,
        join: `sp-custom-${ variationId }-1`,
        hidden: `ins-hidden-element-${ variationId }`,
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        container: `ins-custom-container-${ variationId }`,
        imageWrapper: `ins-custom-image-wrapper-${ variationId }`,
        productInfo: `ins-custom-product-info-${ variationId }`,
        priceInfo: `ins-custom-price-info-${ variationId }`,
        addToCartWrapper: `ins-custom-add-to-cart-wrapper-${ variationId }`,
        addToCart: `ins-custom-add-to-cart-${ variationId }`,
        image: `ins-custom-product-image-${ variationId }`,
        productWrapper: `ins-custom-product-wrapper-${ variationId }`,
        productBrand: `ins-custom-product-brand-${ variationId }`,
        productNameOne: `ins-custom-product-name-1-${ variationId }`,
        productNameTwo: `ins-custom-product-name-2-${ variationId }`,
        discountedPrice: `ins-custom-discounted-price-${ variationId }`,
        discountedPriceContainer: `ins-custom-discounted-price-container-${ variationId }`,
        discountedPriceWrapper: `ins-custom-discounted-price-wrapper-${ variationId }`,
        brandImage: `ins-custom-brand-image-${ variationId }`,
        originalPriceWrapper: `ins-custom-original-price-wrapper-${ variationId }`,
        quantityController: `ins-custom-quantity-controller-${ variationId }`,
        quantityChange: `ins-custom-quantity-change-${ variationId }`,
        quantityDecrease: `ins-custom-quantity-decrease-${ variationId }`,
        quantityIncrease: `ins-custom-quantity-increase-${ variationId }`,
        quantityInput: `ins-custom-quantity-input-${ variationId }`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        pageHeader: '.page-header',
        partnerAddToCartButton: '.action.primary.tocart',
        notification: '.ins-preview-wrapper-notification-center',
        backToTopButton: '#mnm-back-to-top',
        partnerQuantityController: '.box-tocart input',
        footer: 'footer'
    });

    self.init = () => {
        if (variationId) {
            const { partnerAddToCartButton } = selectors;

            Insider.eventManager.once(`scroll.handle:campaign:${ variationId }`, window, Insider.fns.throttle(() => {
                const scrollDirection = self.checkScrollDirection();
                const includeHeader = scrollDirection === 'up';
                const isVisible = self.isElementInView(partnerAddToCartButton, includeHeader);

                if (!isVisible) {
                    if (!Insider.campaign.isControlGroup(variationId) && !isCampaignDisplayed) {
                        self.buildCampaign();
                    }

                    Insider.campaign.custom.show(variationId);
                    isCampaignDisplayed = true;
                }
            }, 100));
        }
    };

    self.buildCampaign = () => {
        self.reset();
        self.buildCSS();
        self.buildHTML();
        self.setEvents();
    };

    self.reset = () => {
        const { style, wrapper } = selectors;

        Insider.dom(`${ style }, ${ wrapper }`).remove();
    };

    self.buildCSS = () => {
        const { wrapper, hidden, container, imageWrapper, productInfo, priceInfo, addToCart, productWrapper, image,
            productBrand, productNameOne, productNameTwo, discountedPriceWrapper, brandImage, originalPriceWrapper,
            discountedPrice, discountedPriceContainer, addToCartWrapper, quantityController, quantityChange,
            quantityDecrease, quantityIncrease } = selectors;

        const customStyle = `
        ${ wrapper } {
            position: fixed;
            bottom: 0;
            width: 100vw;
            height: 15vh;
            background-color: #fdf9f7;
            z-index: 999;
            display: flex;
            justify-content: center;
            box-shadow: rgba(0, 0, 0, 0.19) 0px 3px 3px 0px;
        }
        ${ container } {
            width: 90vw;
            display: flex;
        }
        ${ priceInfo } {
            margin-left: 12vw;
            display: flex;
            width: 20vw;
            justify-content: center;
            align-items: center;
        }
        ${ originalPriceWrapper } span {
            font-size: 18px;
        }
        ${ quantityChange } {
            display: flex;
        }
        ${ quantityChange } input {
            width: 2vw;
        }
        ${ brandImage } {
            margin-left: 3vw;
            height: 50%;
            width: 50%;
        }
        ${ addToCartWrapper } {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        ${ addToCart } {
            background-color: #B8002C;
            color: #fff;
            padding: .5vw 2vw;
            border-radius: 2vw;
            font-weight: 600;
            cursor: pointer;
            width: 7vw;
        }
        ${ quantityController } {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 15vw;
        }
        ${ discountedPrice } {
            color: #B8002C;
            font-weight: 600;
            font-size: 24px !important;
            margin-left: 2vw;
        }
        ${ discountedPriceContainer } {
            margin-left: 1vw;
        }
        ${ quantityChange } input, ${ quantityChange } button, quantityInput {
            border: none;
            background-color: #fff;
            box-shadow: none !important;
        }
        ${ quantityIncrease }, ${ quantityDecrease } {
            transition: none;
            -webkit-tap-highlight-color: transparent;
        }
        ${ quantityDecrease } {
            border-radius: 20px 0 0 20px !important;
        }
        ${ quantityIncrease } {
            border-radius: 0 20px 20px 0 !important;
        }
        ${ discountedPriceWrapper } {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 1vw;
            border: 1px solid #000;
            padding: 2vh 3vw 2vh 1vw;
            width: auto;
        }
        ${ discountedPriceWrapper } p {
            width: 11vw;
            font-size: 16px;
        }
        ${ imageWrapper } {
            width: 20vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        ${ image } {
            height: 90% !important;
        }
        ${ productBrand } {
            font-size: 2rem;
            font-weight: 700;
        }
        ${ productNameOne } {
            font-size: 1.5rem;
        }
        ${ productNameTwo } {
            font-size: 1.5rem;
        }
        ${ productWrapper } {
            display: flex;
        }
        ${ productInfo } {
            display: flex;
            flex-direction: column;
            gap: 0.5vh;
            justify-content: center;
        }
        ${ hidden } {
            display: none !important;
        }
        `;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const { join, wrapper, container, imageWrapper, productInfo, priceInfo, addToCart,
            image, productWrapper, productBrand, productNameOne, productNameTwo, discountedPrice,
            discountedPriceWrapper, originalPriceWrapper, brandImage, discountedPriceContainer, addToCartWrapper,
            quantityController, quantityChange, quantityDecrease, quantityIncrease, quantityInput } = classes;
        const { wrapper: wrapperSelector, footer } = selectors;
        const currentProduct = Insider.systemRules.getCurrentProduct();
        const customAttributes = Insider.getCustomProductAttributes();
        const { img, price, originalPrice } = currentProduct;
        const { brand, product_name1, product_name2 } = customAttributes;
        const brandImageLink = 'https://www.rossmann.com.tr/rossmann-card.svg';

        const html = `
        <div class="${ wrapper } ${ join }">
            <div class="${ container }">
                <div class="${ productWrapper }">
                    <div class="${ imageWrapper }">
                        <img class="${ image }" src="${ img }">
                    </div>
                    <div class="${ productInfo }">
                        <span class="${ productBrand }">${ brand }</span>
                        <span class="${ productNameOne }"> ${ product_name1 }</span>
                        <span class="${ productNameTwo }">${ product_name2 }</span>
                    </div>
                    <div class="${ priceInfo }">
                        <div class="${ originalPriceWrapper }">
                            <span>${ originalPrice },00TL</span>
                        </div>
                        <div class="${ discountedPriceWrapper }">
                            <img class="${ brandImage }" src="${ brandImageLink }">
                            <div class="${ discountedPriceContainer }">
                                <p>Rossman Card ile<p>
                                <p class="${ discountedPrice }">${ price },00TL</p>
                            </div>
                        </div>
                    </div>
                    <div class="${ addToCartWrapper }">
                      <div class="${ quantityController }">
                        <div class="${ quantityChange }">
                            <button class="${ quantityDecrease }">-</button>
                                <input class="${ quantityInput }" type="number" name="qty" id="qty" value="1"
                                    class="qty-input" readonly>
                            <button class="${ quantityIncrease }">+</button>
                        </div>
                      </div>
                      <div class="${ addToCart }">
                          <span>Sepete Ekle</span>
                      </div>
                    </div>
                </div>

            </div>
        </div>`;

        if (Insider.dom(wrapperSelector).length === 0) {
            Insider.dom(footer).append(html);
        }
    };

    self.setEvents = () => {
        const { hidden } = classes;
        const { wrapper, notification, backToTopButton, partnerAddToCartButton, addToCart, quantityDecrease,
            quantityIncrease, quantityInput, partnerQuantityController } = selectors;

        const $wrapper = Insider.dom(wrapper);
        const $notification = Insider.dom(notification);
        const $backToTopButton = Insider.dom(backToTopButton);
        const $quantityInput = Insider.dom(quantityInput);
        const $partnerQuantityController = Insider.dom(partnerQuantityController);
        const $partnerAddToCartButton = Insider.dom(partnerAddToCartButton);

        Insider.eventManager.once(`scroll.handle:wrapper:${ variationId }`, window, Insider.fns.throttle(() => {
            const scrollDirection = self.checkScrollDirection();
            const includeHeader = scrollDirection === 'up';
            const isVisible = self.isElementInView(partnerAddToCartButton, includeHeader);

            $wrapper.toggleClass(hidden, isVisible);
            $notification.toggleClass(hidden, !isVisible);
            $backToTopButton.toggleClass(hidden, !isVisible);
        }, 100));

        Insider.eventManager.once(`click.track:increase:button:${ variationId }`, quantityIncrease, () => {
            const currentQuantity = Number($quantityInput.val());
            const newValue = currentQuantity + 1;

            $quantityInput.val(newValue);
        });

        Insider.eventManager.once(`click.track:decrease:button:${ variationId }`, quantityDecrease, () => {
            const currentQuantity = Number($quantityInput.val());

            if (currentQuantity > 1) {
                const newValue = currentQuantity - 1;

                $quantityInput.val(newValue);
            }
        });

        Insider.eventManager.once(`click.track:add:to:cart:${ variationId }`, addToCart, () => {
            $partnerQuantityController.val($quantityInput.val());
            $partnerAddToCartButton.click();
            $partnerQuantityController.val(1);
            $quantityInput.val(1);
        });
    };

    self.isElementInView = (elementSelector, includeHeader) => {
        const { pageHeader } = selectors;
        const $element = Insider.dom(elementSelector);
        const elementTop = $element.offset().top;
        const elementBottom = elementTop + $element.outerHeight();

        let viewportTop = $window.scrollTop();
        const viewportBottom = viewportTop + $window.height();

        if (includeHeader) {
            const headerHeight = Insider.dom(pageHeader).outerHeight();

            viewportTop += headerHeight;
        }

        return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    self.checkScrollDirection = () => {
        const scrollTop = $window.scrollTop();
        const direction = scrollTop > lastScrollTop ? 'down' : 'up';

        lastScrollTop = scrollTop;

        return direction;
    };

    self.init();
})({});
/* OPT-163889 END */
