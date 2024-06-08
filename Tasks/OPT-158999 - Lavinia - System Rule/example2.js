/* SRTR-23602 START */
/* SRTR-24047 START */
const eventName = Insider.browser.isMobile() ? 'touchstart' : 'mousedown';
const selector = '.product-form__submit, #footer-buynow_normal, #footer-buynow';

Insider.eventManager.off(`${ eventName }.add:to:cart:click`, selector)
    .on(`${ eventName }.add:to:cart:click`, selector, function () {
        /* SRTR-24047 END */
        Insider.utils.product.setCategory();
        (Insider.targetingModules.setCartTargetingRules || Insider.fns.noop)();
    });

return {
    addToBasket: (productId, callback, payload) => {
        if (productId === Insider.systemRules.call('getCurrentProduct').id &&
        Insider.systemRules.call('isOnProductPage')) {
            Insider.dom('.sticky-container .product-form__submit:first').click();
        } else {
            if (typeof (payload || {}).product === 'undefined') {
                Insider.logger.log('Payload parameter required!');
            } else {
                window.fetch('/cart/add.js', {
                    method: 'post',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        items: [{
                            id: productId,
                            quantity: '1'
                        }]
                    }),
                }).then((response) => {
                    response.json().then((responseJson) => {
                        const mpn_handle = typeof window.jQuery && window.jQuery('#mpn_handle').val();
                        const shopify_rec = `Shopify Rec :: ${ mpn_handle }`;
                        let exphone_fa = [];

                        if (JSON.parse(localStorage.getItem('cart')) !== null) {
                            exphone_fa = JSON.parse(localStorage.getItem('cart'));
                        }

                        for (let i = 0; i < responseJson.items.length; i++) {
                            const item_cart_fa = {};

                            item_cart_fa['cart_item_id'] = responseJson.items[i].key;
                            item_cart_fa['cart_item_list_name'] = shopify_rec;
                            item_cart_fa['cart_item_mpn'] = responseJson.items[i].sku;
                            exphone_fa.push(item_cart_fa);
                        }

                        localStorage.setItem('cart', JSON.stringify(exphone_fa));
                    });

                    typeof window.jQuery && window.jQuery.get(`${ (window.routes || {}).cart_url }?view=minicart`,
                        (itemData) => {
                            const item_count = window.jQuery(itemData)
                                .find('#cart-notification-button .count:first').text();

                            if (window.jQuery('.cart-count-bubble').length > 0) {
                                window.jQuery('.cart-count-bubble span').text(item_count);
                            } else {
                                window.jQuery('#cart-icon-bubble')
                                    .append('<div class="cart-count-bubble"><span></span></div>');
                                window.jQuery('.cart-count-bubble span').text(item_count);
                            }

                            window.jQuery('#cart-notification').text('');

                            const textreplace = '<div id="min-cart-replace"></div>';

                            window.jQuery('#cart-notification').append(textreplace);
                            window.jQuery('#cart-notification').replaceWith(itemData);
                            window.jQuery('#cart-notification').addClass('minicart-active');
                        });

                    window.jQuery('.button-cart-frequent').attr('aria-disabled', false);
                    window.jQuery('.button-cart-frequent').removeClass('loading');
                    window.jQuery('.loading-overlay__spinner-frequent').addClass('hidden');

                    if (window.location.href.indexOf('/cart') > -1) {
                        window.location.reload();
                    }
                });
            }
        }

        (callback || Insider.fns.noop)();
    }
};
/* SRTR-23602 END */
