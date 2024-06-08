/* OPT-158999 START */
const selector = '.action.primary.tocart';
const pathname = window.location.pathname.replace(/^\/[a-z]{2}-[a-z]{2}\//, '');

Insider.eventManager.once('click.add:to:cart:click', selector, () => {
    Insider.logger.log('Test Added to cart');
    Insider.utils.product.setCategory()
    (Insider.targetingModules.setCartTargetingRules || Insider.fns.noop)();
});

return {
    addToBasket(productId, callback, payload) {
        if (!payload || typeof payload.product === 'undefined') {
            Insider.logger.log('Payload parameter required!');

            return;
        }

        if (productId === Insider.systemRules.call('getCurrentProduct').id &&
        Insider.systemRules.call('isOnProductPage')) {
            payload = payload.product;
            const locale = Insider.systemRules.call('getLang').toLowerCase().replace('_', '-');

            Insider.request.post({
                url: `https://www.lavinia.com/${ locale }/amasty_cart/cart/add/`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    productId,
                    quantity: payload.quantity || 1
                }),
                success(response) {
                    Insider.logger.log('Product successfully added to cart:', response);

                    if (typeof callback === 'function') {
                        callback(response);
                    }
                },
                error(error) {
                    Insider.logger.log('Failed to add product to cart:', error);
                }
            });
        } else {
            Insider.logger.log('Cannot add to basket on current page:', pathname);
        }
    }
};

/* OPT-158999 END */
