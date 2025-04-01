function documentTrigger() {
    setTimeout(function () {
        Insider.eventManager.dispatch('cart:amount:update');
    }, 250);
}

function setProductStorage(product, flag) {
    Insider.utils.cart.storeCartProductInformation(product, {
        count: parseInt(product.quantity),
        increase: flag
    });

    let total = Insider.storageAccessor.totalCartAmount();

    total += product.price * product.quantity;

    setTimeout(function () {
        Insider.storage.localStorage.set({
            name: 'total-cart-amount',
            value: parseFloat(total.toFixed(2))
        });

        documentTrigger();
    }, 250);
}

const addItemToCart = function (productId, callback, payload) {
    payload = payload.product;

    const requestUrl = Insider.systemRules.call('isUserLoggedIn') ?
        '/api/v2/mit/users/current/carts/current/entries?lang=it_IT' : '' +
        `/api/v2/mit/users/anonymous/carts/${ Insider.storage.cookie.get('mit-cart')
        }/entries?lang=it_IT`;

    const currency = Insider.systemRules.call('getCurrency');
    const price = (payload.price || {})[currency] || payload.price || 0;

    const productToAdd = {
        id: payload.id || payload.item_id || '',
        name: payload.name || '',
        price,
        originalPrice: (payload.originalPrice || {})[currency] || payload.originalPrice || price,
        img: payload.img || payload.image_url || '',
        url: payload.url || '',
        quantity: payload.quantity || payload.in_stock || 1,
        time: Insider.dateHelper.now()
    };

    window.fetch(requestUrl, {
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json;charset=UTF-8',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin'
        },
        body: JSON.stringify({
            product: {
                code: payload.id || productId
            },
            multiGwp: false,
            quantity: 1
        }),
        referrerPolicy: 'strict-origin-when-cross-origin',
        method: 'POST',
        mode: 'cors',
        credentials: 'include'
    }).then(function (response) {
        return response.body;
    }).then(function (rb) {
        const reader = rb.getReader();

        return new ReadableStream({
            start(controller) {
                function push() {
                    reader.read().then(function ({ done, value }) {
                        if (done) {
                            controller.close();

                            return;
                        }

                        controller.enqueue(value);
                        push();
                    });
                }

                push();
            }
        });
    }).then(function (stream) {
        return new Response(stream, { headers: { 'Content-Type': 'text/html' }}).text();
    }).then(function (result) {
        if (Insider.systemRules.call('isOnCartPage') || Insider.dom('#checkoutPage').exists()) {
            window.location.reload();
        } else {
            const parsedResult = JSON.parse(result || '{}') || {};

            if (parsedResult.statusCode === 'success') {
                const addedQty = parsedResult.quantityAdded || 1;
                const currQty = parseInt(Insider.dom('.minicart__quantity-badge').text().trim());

                Insider.dom('.minicart__quantity-badge').text(currQty + addedQty);

                setProductStorage(productToAdd, true);

                if (Insider.fns.hasParameter('/checkout')) {
                    window.location.reload();
                }
            }
        }
    });
};

Insider.eventManager.once('click.add:to:cart:click', '.product-add-to-cart.pdp__add-to-cart ' +
                            '.add-to-bag:visible', function () {
    Insider.utils.product.setCategory();
    (Insider.targetingModules.setCartTargetingRules || Insider.fns.noop)();
});

return {
    addToBasket(productId, callback, payload) {
        if (productId !== '') {
            addItemToCart(productId, callback, payload);
        }

        (callback || Insider.fns.noop)();
    }
};