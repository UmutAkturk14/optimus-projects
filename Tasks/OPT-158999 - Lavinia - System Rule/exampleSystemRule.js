/* SRTR-19990 START */
const selectors = '.MuiStack-root .MuiButton-containedSizeLarge'; /* OPT-155643 */
const pathname = window.location.pathname.replace(/\//g, '');

Insider.eventManager.once('click.add:to:cart:click', selectors, function () {
    Insider.logger.log('Test Added to cart');
    Insider.utils.product.setCategory();
    (Insider.targetingModules.setCartTargetingRules || Insider.fns.noop)();
});

return {
    addToBasket(productId, callback, payload) {
        if (productId === Insider.systemRules.call('getCurrentProduct').id &&
            Insider.systemRules.call('isOnProductPage')) {
            Insider.dom('#product-information .buy-button a[onclick]:first,' +
                ' #product-information a.buy-button:first').click();
        } else {
            if (typeof (payload || {}).product === 'undefined') {
                Insider.logger.log('Payload parameter required!');
            } else if (pathname !== 'shipping-address.ep' || pathname !== 'delivery-options.ep' ||
                pathname !== 'billing-and-review.ep') {
                payload = payload.product;

                /* OPT-155643 START */
                const desktopCartSelector =  '.MuiStack-root .MuiTypography-body2:contains(Item)';
                const mobileCartSelector =  '.MuiBadge-badge:visible';

                Insider.request.post({
                    url: 'https://www.booktopia.com.au/api/customer/cart?version=2',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                    credentials: 'include',
                    parse: true,
                    data: Insider.fns.stringify({
                        uidPk: productId,
                        quantity: 1
                    }),
                    success() {
                        Insider.request.get({
                            url: 'https://www.booktopia.com.au/api/customer/cart?detail=true',
                            parse: true,
                            success(response) {
                                const { totalCartItemsCount } = response.data;
                                const desktopCartText = totalCartItemsCount > 1 ? ' Items' : ' Item';

                                Insider.dom(`${ desktopCartSelector }, ${ mobileCartSelector }`)
                                    .text(`${ totalCartItemsCount }${ Insider.browser.isDesktop() ?
                                        desktopCartText : '' }`);
                            },
                            error(xhr) {
                                Insider.logger.log(xhr);
                            },
                        });
                    },
                    error(error) {
                        Insider.logger.log(error);
                    },
                });
                /* OPT-155643 END */

                if (Insider.systemRules.call('isOnCartPage')) {
                    Insider.fns.onElementLoaded('#add-cart-popup, #addToCart-notification', function () {
                        setTimeout(function () {
                            window.location.reload();
                        }, 2000);
                    }).listen();
                }
            }
        }

        (callback || Insider.fns.noop)();
    }
};
/* SRTR-19990 END */
