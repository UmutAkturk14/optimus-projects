Insider.eventManager.once('click.add:to:cart:click', '#product-addtocart-button', function () {
    Insider.utils.product.setCategory();
    (Insider.targetingModules.setCartTargetingRules || Insider.fns.noop)();
});

return {
    addToBasket(productId, callback, payload) {
        if (productId === Insider.systemRules.call('getCurrentProduct').id &&
        Insider.systemRules.call('isOnProductPage')) {
            Insider.dom('#product-addtocart-button:first').click();
        } else {
            if (typeof (payload || {}).product === 'undefined') {
                Insider.logger.log('Payload parameter required!');
            } else {
                payload = payload.product;

                const productAttributes = payload.product_attributes || {};
                const productMainId = productAttributes.product_main_id || '';
                const data = {
                    product: productMainId,
                    selected_configurable_option: '',
                    related_product: '',
                    item: productMainId,
                    form_key: Insider.storage.cookie.get('form_key') || '',
                    qty: 1
                };

                Insider.request.post({
                    url: `${ window.BASE_URL || '' }checkout/cart/add/uenc/aHR0cHM6Ly9yb3NzbWFubi1rOHMubW5tZ` +
          'WR5YS5jb20vc2Nod2FyemtvcGYta2FwYXRpY2ktcm9vdC1yZXRvdWNoZXIta2FodmVyZW5naS0xMDAtbWwt' +
          `cC1zdDE4MDYwMjU5/product/${ productMainId }/`,
                    data,
                    success() {
                        if (Insider.fns.hasParameter('/checkout/')) {
                            setTimeout(function () {
                                window.location.replace(window.location.pathname);
                            }, 1500);
                        } else {
                            const customerData = window.require('Magento_Customer/js/customer-data');

                            customerData.reload(this.response, true);
                        }
                    }
                });
            }
        }

        (callback || Insider.fns.noop)();
    }
};
