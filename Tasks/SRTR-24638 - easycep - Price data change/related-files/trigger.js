function documentTrigger() {
    setTimeout(function () {
        Insider.eventManager.dispatch('cart:amount:update');
    }, 250);
}

function parsePrice(stringPrice) {
    let price = 0;

    stringPrice = (stringPrice || '').toString(); price = stringPrice.replace(/[^0-9.,]/g, '');

    if (price.slice(-3).indexOf(',') !== -1) {
        price = parseFloat(stringPrice.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
    } else if (price.slice(-3).indexOf('.') !== -1) {
        price = parseFloat(stringPrice.replace(/[^0-9.]/g, '')) || 0;
    } else {
        price = parseFloat(stringPrice.replace(/[^0-9]/g, '')) || 0;
    }

    return price;
}

function compareProductListAndEventTrigger(newList, oldList) {
    const dispatchEvent = function (data, bool) {
        Insider.eventManager.dispatch('cart:count:update', { product: data, isAddedToCart: bool }); Insider.storage.localStorage.set({ name: 'ins-temp-product-list', value: Insider.utils.cart.getCartProductStorage() });
    }; const removedProducts = oldList.filter(function (oldProduct) {
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
                    newProduct.quantity = quantityUpdatedProduct.quantity - newProduct.quantity; dispatchEvent(newProduct, false);
                } else {
                    newProduct.quantity = newProduct.quantity - quantityUpdatedProduct.quantity; dispatchEvent(newProduct, true);
                }
            }
        } else {
            dispatchEvent(newProduct, true);
        }
    });
}

function updateFromMiniCart() {
    if (Insider.dom('.header__top--basketItems').exists() || Insider.dom('.header__top--basketCountText:first').text().trim() === 'Sepetinizde Ürün Bulunmuyor') {
        const oldProductList = Insider.storage.localStorage.get('ins-temp-product-list') || []; const productList = []; let totalCartAmount = 0; let totalQuantity = 0;

        Insider.dom('.header__top--basketItem').accessNodes(function (productRow) {
            const quantity = parseInt(Insider.dom('.header__top--basketItemPrice:first', productRow).text()) || 1; const price = parseFloat((parsePrice(Insider.dom('.header__top--basketItemPrice:last', productRow).text()) / quantity).toFixed(2)) || 0; const url = (Insider.dom('.header__top--basketItemTitle a', productRow).prop('href') || '').split('?')[0];

            if (price > 0) {
                productList.push({ id: url.split('-').slice(-1)[0], name: encodeURIComponent(Insider.dom('.header__top--basketItemTitle a:first', productRow).text().trim()), price, originalPrice: price, img: (Insider.dom('.header__top--basketItemImg img', productRow).prop('src') || '').split('?')[0], url, quantity, time: Insider.dateHelper.now() }); totalQuantity += quantity; totalCartAmount += price * quantity;
            }
        }); Insider.utils.cart.storeCartProductStorage({ totalQuantity, productList }); Insider.storage.localStorage.set({ name: 'paid-products', value: productList }); Insider.storage.localStorage.set({ name: 'total-cart-amount', value: parseFloat(totalCartAmount.toFixed(2)) || 0 }); documentTrigger(); compareProductListAndEventTrigger(productList, oldProductList);
    }
}

function updateFromIO() {
    if (typeof ((window.insider_object || {}).basket || {}).line_items !== 'undefined') {
        const oldProductList = Insider.storage.localStorage.get('ins-temp-product-list') || []; let totalQuantity = 0; let totalCartAmount = 0; const productList = []; const pageTotal = parseFloat((parsePrice(Insider.dom('#orderSummary .cartAndCheckout__summaryContent' + '--priceText:first').text()) - parsePrice(Insider.dom('#orderSummary .cartAndCheckout__' + 'summaryContent--summary tr:contains(Kargo):first').text())).toFixed(2)) || 0;

        (Insider.utils.getDataFromIO('basket', 'line_items') || []).map(function (insiderObject) {
            const productObject = insiderObject.product || {}; const price = parseFloat((parseFloat((productObject.unit_sale_price || 0).toString().replace('.', '')) || 0).toFixed(2)) || 0; const quantity = parseInt(insiderObject.quantity) || 1;

            if (price > 0) {
                productList.push({ id: (productObject.id || '').toString().trim(), name: encodeURIComponent((productObject.name || '').trim()), price, originalPrice: parseFloat((parseFloat((productObject.unit_price || 0).toString().replace('.', '')) || 0).toFixed(2)) || price, img: (productObject.product_image_url || '').split('?')[0], url: (productObject.url || '').split('?')[0], quantity, time: Insider.dateHelper.now() }); totalQuantity += quantity; totalCartAmount += price * quantity;
            }
        }); Insider.utils.cart.storeCartProductStorage({ totalQuantity, productList }); Insider.storage.localStorage.set({ name: 'paid-products', value: productList }); Insider.storage.localStorage.set({ name: 'total-cart-amount', value: pageTotal || parseFloat(totalCartAmount.toFixed(2)) || 0 }); documentTrigger(); compareProductListAndEventTrigger(productList, oldProductList);
    }
}

if (!(Insider.__external.ajaxListenerSrtr16433 || false)) {
    Insider.__external.ajaxListenerSrtr16433 = function (callback) {
        'use strict';

        const oldOpen = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function (method, url) {
            this.addEventListener('readystatechange', function () {
                if (this.responseType !== 'arraybuffer' && this.responseType !== 'blob' && this.readyState === 4 && this.status === 200 && typeof callback === 'function') {
                    callback(url, method, this.response);
                }
            }); oldOpen.apply(this, arguments);
        };
    }; Insider.__external.ajaxListenerSrtr16433(function (url) {
        if ((url.indexOf('basket/update') !== -1 || url.indexOf('basket/remove') !== -1) && Insider.systemRules.call('isOnCartPage')) {
            setTimeout(function () {
                const oldProductList = Insider.storage.localStorage.get('ins-temp-product-list') || [];

                Insider.utils.cart.updateCartCount(); Insider.utils.cart.updateCartCookies(); documentTrigger(); compareProductListAndEventTrigger(Insider.systemRules.call('getPaidProducts'), oldProductList);
            }, 1500);
        } else if ((url.indexOf('coupons/apply') !== -1 || url.indexOf('coupons/remove') !== -1) && ((Insider.fns.hasParameter('/checkout') && !Insider.fns.hasParameter('/checkout/success')) || Insider.systemRules.call('isOnCartPage'))) {
            setTimeout(function () {
                Insider.storage.localStorage.set({ name: 'total-cart-amount', value: Insider.systemRules.call('getTotalCartAmount') });
            }, 1500);
        } else if ((url.indexOf('basket/add') !== -1 || url.indexOf('basket/update') !== -1 || url.indexOf('basket/remove') !== -1) && !Insider.systemRules.call('isOnCartPage')) {
            setTimeout(function () {
                updateFromMiniCart();
            }, 2000);
        }
    });
}

if (Insider.fns.hasParameter('/checkout') && !Insider.fns.hasParameter('/checkout/success')) {
    setTimeout(function () {
        updateFromIO();
    }, 2500);
}

if (document.referrer.indexOf('login') !== -1 || Insider.systemRules.call('isOnMainPage')) {
    setTimeout(function () {
        updateFromMiniCart();
    }, 2000);
}

if (Insider.systemRules.call('isOnCartPage')) {
    Insider.utils.cart.updateCartCount(); Insider.utils.cart.updateCartCookies(); documentTrigger(); setTimeout(function () {
        const oldProductList = Insider.storage.localStorage.get('ins-temp-product-list') || [];

        compareProductListAndEventTrigger(Insider.systemRules.call('getPaidProducts'), oldProductList);
    }, 500);
}

if (Insider.systemRules.call('isOnAfterPaymentPage')) {
    Insider.eventManager.once('visibilitychange.ins:refresh:after:payment', document, function () {
        if (document.visibilityState === 'hidden') {
            Insider.storage.set({ name: 'ins-after-payment-refresh-control', value: true }); Insider.utils.cart.storeCartProductStorage({ totalQuantity: 0, productList: []}); Insider.storage.localStorage.set({ name: 'total-cart-amount', value: 0 }); Insider.storage.localStorage.set({ name: 'paid-products', value: []}); Insider.storage.localStorage.set({ name: 'ins-temp-product-list', value: []}); documentTrigger();
        } else {
            Insider.storage.remove('ins-after-payment-refresh-control');
        }
    });
} else if (Insider.utils.getDataFromIO('page', 'type').toLowerCase() !== 'confirmation' && (Insider.storage.localStorage.get('ins-after-payment-refresh-control') || false)) {
    Insider.storage.remove('ins-after-payment-refresh-control');
}
