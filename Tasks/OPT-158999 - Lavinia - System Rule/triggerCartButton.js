/* OPT-158999 START */
function documentTrigger() {
    setTimeout(function () {
        Insider.eventManager.dispatch('cart:amount:update');

    }, 250);

}

function compareProductListAndEventTrigger(newList, oldList) {
    const dispatchEvent = function (data, bool) {
        if (!(Insider.systemRules.call('isOnCartPage') && Insider.utils.cart.getCartProductStorage().length === 0 && (Insider.__external.isCartRefreshOpt158999 || false))) {
            Insider.eventManager.dispatch('cart:count:update', { product: data, isAddedToCart: bool });

        } Insider.storage.localStorage.set({ name: 'ins-temp-product-list', value: Insider.utils.cart.getCartProductStorage() });

    };
    const removedProducts = oldList.filter(function (oldProduct) {
        return newList.filter(function (newProductControl) {
            return oldProduct.id === newProductControl.id;

        }).length === 0;

    });

    if (Insider.utils.cart.getCartProductStorage().length > 0) {
        removedProducts.map(function (removedProduct) {
            dispatchEvent(removedProduct, false);

        });

    } else if (removedProducts.length > 0) {
        dispatchEvent(removedProducts[0], false);

    } newList.map(function (newProduct) {
        const isOldListContainsNewProduct = oldList.filter(function (oldProduct) {
            return oldProduct.id === newProduct.id;

        }).length > 0;

        if (isOldListContainsNewProduct) {
            const quantityUpdatedProduct = oldList.filter(function (oldProduct) {
                return oldProduct.id === newProduct.id && oldProduct.quantity !== newProduct.quantity;

            })[0] || {};

            if (quantityUpdatedProduct.id) {
                if (quantityUpdatedProduct.quantity > newProduct.quantity) {
                    newProduct.quantity = quantityUpdatedProduct.quantity - newProduct.quantity;
                    dispatchEvent(newProduct, false);

                } else {
                    newProduct.quantity = newProduct.quantity - quantityUpdatedProduct.quantity;
                    dispatchEvent(newProduct, true);

                }
            }
        } else {
            dispatchEvent(newProduct, true);

        }
    });

}

function setStorage(totalQuantity, totalAmount, productList) {
    const oldProductList = Insider.storage.localStorage.get('ins-temp-product-list') || [];

    productList = Insider.utils.opt.mergeDuplicateProducts(productList);
    Insider.utils.cart.storeCartProductStorage({ totalQuantity, productList });
    Insider.storage.localStorage.set({ name: 'paid-products', value: productList });
    Insider.storage.localStorage.set({ name: 'total-cart-amount', value: parseFloat(totalAmount.toFixed(2)) || 0 });
    documentTrigger();
    compareProductListAndEventTrigger(productList, oldProductList);

}

function updateFromInsiderObject() {
    const productList = [];
    let totalQuantity = 0;
    const totalCartAmount = parseFloat(((parseFloat(Insider.utils.getDataFromIO('basket', 'total')) || 0) - (parseFloat(Insider.utils.getDataFromIO('basket', 'shipping_cost')) || 0)).toFixed(2)) || 0;

    Insider.utils.getDataFromIO('basket', 'line_items', []).map(function (productRow) {
        const productObject = productRow.product || {};
        const price = parseFloat((parseFloat(productObject.unit_sale_price) || parseFloat(productObject.unit_price) || 0).toFixed(2)) || 0;
        const originalPrice = parseFloat((parseFloat(productObject.unit_price) || 0).toFixed(2)) || price;
        const quantity = parseInt(productRow.quantity) || 1;
        const productName = document.createElement('div');

        productName.innerHTML = (productObject.name || '').toString().replace(/\s+/g, ' ').trim();

        if (price > 0) {
            productList.push({ id: (productObject.id || '').toString().trim(),
                name: encodeURIComponent(Insider.dom(productName).text().trim()),
                price,
                originalPrice: originalPrice < price ? price : originalPrice,
                img: (productObject.product_image_url || '').split('?')[0],
                url: (productObject.url || '').split('?')[0],
                cats: (productObject.taxonomy || []).filter(Boolean).reduce(function (previous, current) {
                    if (previous.indexOf(current) === -1) {
                        previous.push(current);
                    }

                    return previous;

                }, []), quantity, time: Insider.dateHelper.now() });

            totalQuantity += quantity;

        }
    });
    setStorage(totalQuantity, totalCartAmount, productList);
}

if (!(Insider.__external.isApiInitedOpt158999 || false)) {
    Insider.__external.isApiInitedOpt158999 = true;
    Insider.utils.opt.ajaxListener(function (url, response) {
        if (url.indexOf('/api/customer/cart?detail=true') !== -1 && !Insider.systemRules.call('isOnCartPage') && !Insider.systemRules.call('isOnAfterPaymentPage')) {
            const jsonResponse = JSON.parse(response || '{}') || {};
            const { cartItems } = jsonResponse.data || {};

            if (jsonResponse.success === true && Insider.fns.isArray(cartItems)) {
                const paidProducts = [];
                let totalQuantity = 0;
                let totalCartAmount = 0;

                cartItems.map(function (cartItem) {
                    const price = Insider.utils.opt.parsePrice((cartItem.salePrice || {}).moneyValueTo2dp, '.');
                    const name = document.createElement('div');
                    const quantity = parseInt(cartItem.quantity) || 1;

                    name.innerHTML = (cartItem.displayName || '').toString().replace(/\s+/g, ' ').trim();

                    if (price > 0) {
                        paidProducts.push({ id: (cartItem.uidPk || '').toString().trim(), name: encodeURIComponent(Insider.dom(name).text().trim()), price, originalPrice: Insider.utils.opt.parsePrice((cartItem.listPrice || {}).moneyValueTo2dp, '.') || price, img: (cartItem.imageUrl || '').split('?')[0], url: `${ window.location.origin }/${ (cartItem.productUrl || '').split('?')[0] }`, cats: (cartItem.defaultCategory || []).filter(Boolean).reduce(function (previous, current) {
                            if (previous.indexOf(current) === -1) {
                                previous.push(current);

                            }

                            return previous;

                        }, []), quantity, time: Insider.dateHelper.now() });
                        totalQuantity += quantity;
                        totalCartAmount += quantity * price;

                    }
                });
                setStorage(totalQuantity, totalCartAmount, paidProducts);

            }
        } else if (url.indexOf('/add-to-cart.ep') !== -1 && !Insider.systemRules.call('isOnCartPage') && !Insider.systemRules.call('isOnAfterPaymentPage')) {
            const responseHtml = document.createElement('div');

            responseHtml.innerHTML = response;

            if (Insider.dom('script:contains(window.insider_object.basket)', responseHtml).exists()) {
                window.eval(Insider.dom('script:contains(window.insider_object.basket):first', responseHtml).text());

            } setTimeout(function () {
                updateFromInsiderObject();

            }, 2000);

        } else if ((url.indexOf('shoppingCartAjaxController') !== -1 || url.indexOf('api/customer/cart') !== -1) && Insider.systemRules.call('isOnCartPage') && !Insider.systemRules.call('isOnAfterPaymentPage')) {
            setTimeout(function () {
                const oldProductList = Insider.storage.localStorage.get('ins-temp-product-list') || [];

                Insider.utils.cart.updateCartCount();
                Insider.utils.cart.updateCartCookies();
                documentTrigger();
                compareProductListAndEventTrigger(Insider.systemRules.call('getPaidProducts'), oldProductList);

            }, 1000);

        }
    });

} setTimeout(function () {
    if (!Insider.systemRules.call('isOnCartPage') && !Insider.systemRules.call('isOnAfterPaymentPage')) {
        if (typeof (window.insider_object || {}).basket !== 'undefined') {
            updateFromInsiderObject();

        }
    }
}, 2000);

if (Insider.systemRules.call('isOnCartPage')) {
    Insider.__external.isCartRefreshOpt158999 = true;
    Insider.utils.cart.updateCartCount();
    Insider.utils.cart.updateCartCookies();
    documentTrigger();
    setTimeout(function () {
        const oldProductList = Insider.storage.localStorage.get('ins-temp-product-list') || [];

        compareProductListAndEventTrigger(Insider.systemRules.call('getPaidProducts'), oldProductList);
        setTimeout(function () {
            delete Insider.__external.isCartRefreshOpt158999;

        }, 500);

    }, 500);

}

if (Insider.systemRules.call('isUserLoggedIn') !== Insider.storage.localStorage.get('ins-last-logged-in-status') && !Insider.systemRules.call('isOnCartPage') && !Insider.systemRules.call('isOnAfterPaymentPage')) {
    if (!Insider.systemRules.call('isUserLoggedIn') && Insider.storage.localStorage.get('ins-last-logged-in-status') !== null) {
        setTimeout(function () {
            setStorage(0, 0, []);

        }, 500);

    } Insider.storage.localStorage.set({ name: 'ins-last-logged-in-status', value: Insider.systemRules.call('isUserLoggedIn') });

}

if (Insider.systemRules.call('isOnAfterPaymentPage')) {
    Insider.eventManager.once('visibilitychange.ins:refresh:after:payment', document, function () {
        if (document.visibilityState === 'hidden') {
            Insider.storage.set({ name: 'ins-after-payment-refresh-control', value: true });
            setStorage(0, 0, []);

        } else {
            Insider.storage.remove('ins-after-payment-refresh-control');

        }
    });

} else if (Insider.utils.getDataFromIO('page', 'type').toLowerCase() !== 'confirmation' && (Insider.storage.localStorage.get('ins-after-payment-refresh-control') || false)) {
    Insider.storage.remove('ins-after-payment-refresh-control');

}

/* OPT-158999 END */
