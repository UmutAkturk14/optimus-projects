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
    const hasVariants = Number(payload.product_attributes.variation_count) > 1; /* OPT-168228 */

    const productToAdd = {
        id: payload.id || payload.item_id || '',
        name: payload.name || '',
        price,
        data_category: payload.data_category || '', /* OPT-168228 */
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
                /* OPT-168228 START */
                const $basketIcon = Insider.dom('.minicart__basket');
                const $miniCart = Insider.dom('.minicart__quantity-badge');
                const { id, data_category } = productToAdd;

                if ($miniCart.exists()) {
                    const currQty = parseInt($miniCart.text().trim());

                    $miniCart.text(currQty + addedQty);
                } else {
                    const miniCartHTML =
                    '<div class="minicart__quantity-badge minicart__quantity-badge--quantity-decades" bis_skin_checked="1"> 1 </div>';

                    $basketIcon.append(miniCartHTML);
                }

                handleSuccessCard(hasVariants, id, data_category);
                /* OPT-168228 END */

                setProductStorage(productToAdd, true);

                if (Insider.fns.hasParameter('/checkout')) {
                    window.location.reload();
                }
            }
        }
    });
};

/* OPT-168228 START */
const handleSuccessCard = (boolean, productId, data_category = '') => {
    let eventLabel = '';

    if (Insider.systemRules.call('isOnMainPage')) {
        eventLabel = 'homepage';
    } else if (Insider.systemRules.call('isOnProductPage')) {
        eventLabel = 'product detail page';
    }

    let partnerAddToCartHTML = '';

    if (boolean) {
        partnerAddToCartHTML =
        '<e2-action-button ' +
            'class-modifier="button--primary add-to-bag button__text--truncated swiper-slide" ' +
            'class="ins-element-link" ' +
            'action-type="minipdp.SHOW_PRODUCT_DETAILS" ' +
            'data-name="product-details-popup" ' +
            `data-code="${ productId }" ` +
            `data-event-label="${ eventLabel }" ` +
            `data-product-list="${ eventLabel }" ` +
            'size="medium" ' +
            'full-width ' +
            'no-arrow>' +
            '<span class="add-to-bag__button-text">' +
                '<i class="icon icon-basket"></i> Aggiungi al carrello' +
            '</span>' +
        '</e2-action-button>';
    } else {
        partnerAddToCartHTML =
        '<e2-add-to-bag ' +
            'show-as-popup ' +
            'always-dispatch-event ' +
            `data-category="${ data_category }" ` +
            `data-list="${ eventLabel }" ` +
            `event-label="${ eventLabel }" ` +
            `product-code="${ productId }" ` +
            'product-qty="1"' +
            'class-modifier="button--text-props-inherited" ' +
            'class="ins-element-link">' +
            '<span v-slot="in-stock" class="add-to-bag__button-text">' +
                '<i class="icon icon-basket"></i> Aggiungi al carrello' +
            '</span>' +
        '</e2-add-to-bag>';
    }

    Insider.dom('body').append(partnerAddToCartHTML);

    setTimeout(() => {
        if (boolean) {
            Insider.dom('e2-action-button:last button').click();
        } else {
            Insider.dom('e2-add-to-bag:last button').click();
        }
    }, 500);
};
/* OPT-168228 END */

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