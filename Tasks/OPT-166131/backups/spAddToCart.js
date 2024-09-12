/* SRTR-24953 START */
const eventName = Insider.browser.isMobile() ? 'touchstart' : 'mousedown';
const selector = '[class*=--product-buy-components-container] button:contains(Comprar)';

Insider.eventManager.off(`${ eventName }.add:to:cart:click`, selector)
    .on(`${ eventName }.add:to:cart:click`, selector, function () {
        Insider.utils.product.setCategory();
        (Insider.targetingModules.setCartTargetingRules || Insider.fns.noop)();
    });

return {
    addToBasket: (productId, callback, payload) => {
        if (productId === Insider.systemRules.call('getCurrentProduct').id &&
        Insider.systemRules.call('isOnProductPage')) {
            Insider.dom('[class*=--product-buy-components-container] button:contains(Comprar):first').click();
        } else {
            if (typeof (payload || {}).product === 'undefined') {
                Insider.logger.log('Payload parameter required!');
            } else {
                payload = payload.product;

                const orderForm = ((window.vtexjs || {}).checkout || {}).orderForm ||
              JSON.parse(Insider.storage.localStorage.get('orderform') || '{}') || {};
                const productAlreadyCart = (orderForm.items || []).filter((addedProduct) => addedProduct.id === productId);
                const isAddToCart = productAlreadyCart.length === 0 ? 'addToCart' : 'updateItems';
                let variablesCrypt = {
                    allowedOutdatedData: ['paymentData'],
                    items: [{
                        id: parseInt(productId),
                        index: 0,
                        options: [],
                        quantity: 1,
                        seller: (payload.product_attributes || {}).seller_id || '1'
                    }],
                    marketingData: {}
                };
                let shaKey = '68d73608692d2549b50e697da4b346de15e6c237f2027d5d417ed9036a76e38e';

                if (isAddToCart === 'updateItems') {
                    variablesCrypt = {
                        orderItems: [{
                            uniqueId: (productAlreadyCart[0] || {}).uniqueId,
                            quantity: (productAlreadyCart[0] || {}).quantity + 1
                        }]
                    };
                    shaKey = '876b60f0f402e2c7507049e2db64824c212f7e693d0d3f40ebb1aa9d2ef4b030';
                }

                const postData = {
                    extensions: {
                        persistedQuery: {
                            provider: 'vtex.checkout-graphql@0.x',
                            sender: 'vtex.checkout-resources@0.x',
                            sha256Hash: shaKey,
                            version: 1
                        },
                        variables: window.btoa(JSON.stringify(variablesCrypt))
                    },
                    operationName: isAddToCart,
                    variables: {}
                };

                window.fetch('/_v/private/graphql/v1', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                }).then((response) => response.json()).then(() => {
                    window.location.reload();
                });
            }
        }

        (callback || Insider.fns.noop)();
    }
};
/* SRTR-24953 END */