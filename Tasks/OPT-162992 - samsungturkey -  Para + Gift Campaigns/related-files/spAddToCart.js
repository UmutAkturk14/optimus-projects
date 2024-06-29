/* SRTR-24724 START */
Insider.eventManager.once('click.add:to:cart:click',
    'a[an-ac*=addToCart], .hubble-price-bar__price-cta [an-ac*=feature]',
    function () {
        Insider.utils.product.setCategory();
        (Insider.targetingModules.setCartTargetingRules || Insider.fns.noop)();
    });

return {
    addToBasket: (productId, callback, payload) => {
        if (Insider.systemRules.call('isOnProductPage') &&
productId === Insider.systemRules.call('getCurrentProduct').id) {
            Insider.dom('a[an-ac*=addToCart]:visible, .hubble-price-bar__price-cta [an-ac*=feature]').first()
                .click();
        } else {
            if (typeof (payload || {}).product === 'undefined') {
                Insider.logger.log('Payload parameter required!');
            } else {
                payload = payload.product;

                const currency = Insider.systemRules.call('getCurrency');
                const price = (payload.price || {})[currency] || payload.price || 0;
                const product = {
                    id: payload.id || payload.item_id || '',
                    name: payload.name || '',
                    price,
                    originalPrice: (payload.originalPrice || {})[currency] || payload.originalPrice ||
(payload.original_price || {})[currency] || payload.original_price || price,
                    img: payload.img || payload.image_url || '',
                    url: payload.url || '',
                    quantity: payload.quantity || payload.in_stock || 1,
                    time: Insider.dateHelper.now()
                };

                if (window.location.pathname.indexOf('checkout') === -1 &&
typeof window.jQuery !== 'undefined') {
                    window.jQuery.get({
                        url: `https://shop.samsung.com/tr/ng/p4v1/addCart?productCode=${ productId
                        }&quantity=1&insTrigger=true`,
                        headers: {
                            'Accept': 'application/json, text/javascript, */*; q=0.01',
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        xhrFields: {
                            withCredentials: true
                        },
                        success: (addResponse) => {
                            if (Insider.systemRules.call('isOnCartPage')) {
                                window.location.reload();
                            } else {
                                const latestCartCount = addResponse.cartCount || 0;

                                if (addResponse.resultCode === '0000') {
                                    Insider.__external.lastAddedProductSrtr24724 = product;

                                    if (Insider.dom('.cart-in-number.gnb-cart-count').exists()) {
                                        const childElement = document.createElement('span');

                                        childElement
                                            .appendChild(document.createTextNode('Ürün Sayısı : '));
                                        childElement.className = !Insider.browser.isMobile() ? 'hidden' :
                                            'blind';

                                        Insider.dom('.cart-in-number.gnb-cart-count')
                                            .append(childElement);
                                        Insider.dom('.cart-in-number.gnb-cart-count')
                                            .text(latestCartCount);
                                        Insider.dom('.cart-in-number.gnb-cart-count')
                                            .css('display', 'block');
                                        Insider.dom('.js-has-carturl').removeClass('js-layer-open');
                                        Insider.dom('.js-has-carturl').attr('href',
                                            Insider.dom('.js-has-carturl').attr('data-cart-url') || '');
                                        Insider.dom('.js-has-carturl').removeAttr('data-div-id');
                                        Insider.dom('.js-has-carturl').removeAttr('data-target-popup');
                                    }
                                }
                            }
                        }
                    });
                }

                (callback || Insider.fns.noop)();
            }
        }
    }
};
/* SRTR-24724 END */
