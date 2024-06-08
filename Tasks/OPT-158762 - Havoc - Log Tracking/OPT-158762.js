/* OPT-158762 START */
const salesLog = {
    name: 'ins-sales-log-tracking',
    expireTime: 3,
    track(id, data) {
        this.storageData = this.getLocalStorage();
        this.lastLog = (this.storageData[this.storageData.length - 1] || {});
        this.lastData = (this.lastLog.data || [])[0] || '{}';
        this.log = {
            id,
            path: window.location.pathname,
            cas: Insider.storageAccessor.totalCartAmount(),
            pps: (Insider.storageAccessor.paidProducts() || []).length,
            ca: Insider.systemRules.call('getTotalCartAmount'),
            pp: (Insider.systemRules.call('getPaidProducts') || []).length
        };

        if (!Insider.fns.isUndefined(data)) {
            this.log.data = [data];
        }

        if (this.isSameLastLog(id, data)) {
            this.log.lc = this.lastLog.lc + 1 || 2;
            this.storageData[this.storageData.length - 1] = this.log;
        } else {
            this.storageData.push(this.log);
        }

        Insider.storage.localStorage.set({
            name: this.name,
            value: this.storageData,
            expires: this.expireTime
        });
    },
    getLocalStorage() {
        return Insider.storage.localStorage.get(this.name) || [];
    },
    isSameLastLog(id, data) {
        this.isSameId = this.lastLog.id === id;
        this.isSameCAS = this.lastLog.cas === Insider.storageAccessor.totalCartAmount();
        this.isSamePPS = this.lastLog.pps === (Insider.storageAccessor.paidProducts() || []).length;
        this.isSameCA = this.lastLog.ca === Insider.systemRules.call('getTotalCartAmount');
        this.isSamePP = this.lastLog.pp === (Insider.systemRules.call('getPaidProducts') || []).length;
        this.isSameData = Insider.fns.stringify((this.lastLog.data || [])[0]) === Insider.fns.stringify(data);

        return this.isSameId && this.isSameData && this.isSameCAS && this.isSamePPS && this.isSameCA && this.isSamePP;
    }
};
/* OPT-158762 END */

const isCartPage = Insider.systemRules.call('isOnCartPage');
const currency = Insider.systemRules.call('getCurrency');
const preferredCurrency = Insider.currencyService.to;

function decodeHtml(html) {
    return Insider.dom('<div>').html(html).text();
}

function documentTrigger() {
    setTimeout(function () {
        Insider.eventManager.dispatch('cart:amount:update');
    }, 250);
}

function removeDuplicates(array) {
    const uniqueElements = {};
    const uniqueArray = [];

    for (let i = 0;
        i < array.length;
        i++) {
        const key = array[i];

        if (!uniqueElements[key]) {
            uniqueElements[key] = true;
            uniqueArray.push(array[i]);
        }
    }

    return uniqueArray;
}

function getFormattedProductObject(product) {
    const price = parseFloat(((parseFloat(product.discounted_price || product.price) || 0) / 100).toFixed(2)) || 0;
    const visitedProducts = JSON.parse(Insider.storage.localStorage.get('ins-shopify-products-info') || '{}').value || {};
    const cats = (visitedProducts[product.product_id] || {}).taxonomy || [];

    return { cats: removeDuplicates(cats).slice(0, 50), exchange: `from ${ currency } to ${ preferredCurrency }`, id: (product.id || '').toString().trim(), name: encodeURIComponent(decodeHtml((product.product_title || '').trim())), notConvertedPrice: price, price, originalPrice: parseFloat(((parseFloat(product.price_original || product.original_price) || 0) / 100).toFixed(2)) || price, img: (product.image || '').split('?')[0], url: window.location.origin + (product.url || ''), quantity: product.quantity || 1, time: Insider.dateHelper.now() };
}

function updateCartStorageFromIO(lineItems, oldProductList) {
    const productList = [];

    lineItems.forEach(function (item) {
        const price = item.product.unit_sale_price || item.product.unit_price || 0;

        if (price > 0) {
            productList.push({ cats: removeDuplicates(item.product.taxonomy).slice(0, 50), exchange: `from ${ currency } to ${ preferredCurrency }`, id: item.product.id || '', img: item.product.product_image_url || '', name: encodeURIComponent(decodeHtml(item.product.name || '')), originalPrice: item.product.unit_price || price || 0, notConvertedPrice: price || 0, price: price || 0, quantity: item.quantity || 1, time: Insider.dateHelper.now(), url: item.product.url || '', });
        }
    });
    /* OPT-158762 START */
    salesLog.track('update-cart-storage-from-io', {
        productListLength: (productList ?? []).length,
        oldProductListLength: (oldProductList ?? []).length,
        lineItemsLength: lineItems.length
    });
    /* OPT-158762 END */
    setCartStorages(productList, oldProductList);
}

function setCartStorages(productList, oldProductList) {
    productList = Insider.currencyService.getConvertedPrice(currency, preferredCurrency, productList);
    let totalCartAmount = 0;
    let totalQuantity = 0;

    productList.forEach(function (product) {
        totalQuantity += product.quantity;
        totalCartAmount += product.quantity * product.price;
    });
    Insider.utils.cart.storeCartProductStorage({ totalQuantity, productList });
    Insider.storage.localStorage.set({ name: 'paid-products', value: productList });
    Insider.storage.localStorage.set({ name: 'total-cart-amount', value: parseFloat(totalCartAmount.toFixed(2)) || 0 });
    Insider.storage.localStorage.set({ name: 'ins-temp-product-list', value: productList });
    documentTrigger();

    /* OPT-158762 START */
    salesLog.track('set-cart-storages', {
        totalCartAmount,
        totalQuantity,
        ppLength: (Insider.storage.localStorage.get('paid-products') || []).length,
        tcaLength: (Insider.storage.localStorage.get('total-cart-amount') || -1),
        tplLength: (Insider.storage.localStorage.get('ins-temp-product-list') || []).length,
        productListLength: (productList ?? []).length,
        oldProductListLength: (oldProductList ?? []).length
    });
    /* OPT-158762 END */

    if (!(isCartPage && !Insider.__external.shopifyCartUpdated && productList.length === 0)) {
        compareProductListAndEventTrigger(productList, oldProductList);
    } Insider.__external.shopifyCartUpdated = true;
}

function resetCartStorages() {
    /* OPT-158762 START */
    salesLog.track('reset-cart-storage-inited', true);
    /* OPT-158762 END */
    Insider.utils.cart.storeCartProductStorage({ totalQuantity: 0, productList: []});
    Insider.storage.localStorage.set({ name: 'total-cart-amount', value: 0 });
    Insider.storage.localStorage.set({ name: 'paid-products', value: []});
    Insider.storage.localStorage.set({ name: 'ins-temp-product-list', value: []});
    documentTrigger();
}

function compareProductListAndEventTrigger(newList, oldList) {
    newList.forEach(function (newItem) {
        const isExists = oldList.some(function (oldItem, index) {
            if (newItem.id === oldItem.id) {
                const quantityChange = newItem.quantity - oldItem.quantity;

                if (quantityChange !== 0) {
                    newItem.quantity = quantityChange > 0 ? quantityChange : quantityChange * -1;
                    Insider.eventManager.dispatch('cart:count:update', { product: newItem, isAddedToCart: quantityChange > 0 });
                } oldList.splice(index, 1);

                return true;
            }
        });

        if (!isExists) {
            Insider.eventManager.dispatch('cart:count:update', { product: newItem, isAddedToCart: true });
        }
    });
    oldList.forEach(function (oldItem) {
        Insider.eventManager.dispatch('cart:count:update', { product: oldItem, isAddedToCart: false });
    });

    /* OPT-158762 START */
    salesLog.track('compare-product-list', {
        newListLength: (newList ?? []).length,
        oldListLength: (oldList ?? []).length
    });
    /* OPT-158762 END */
}

Insider.eventManager.once('ins:shopify:cart:update', window, Insider.fns.debounce(function (event) {
    const response = typeof event.detail === 'object' ? event.detail : (JSON.parse(event.detail) || {});
    const oldProductList = (Insider.storageAccessor.cartProductList() || {}).productList || [];

    if (response.items) {
        let items = response.items || [];
        const newProductList = [];

        items = items.forEach(function (item) {
            if (item.price > 0) {
                newProductList.push(getFormattedProductObject(item));
            }
        });
        setCartStorages(newProductList, oldProductList);
    }
}, 1000));
Insider.eventManager.once('ins:shopify:product:add', window, Insider.fns.debounce(function (event) {
    let response = typeof event.detail === 'object' ? event.detail : (JSON.parse(event.detail) || {});

    if (!response.id) {
        if (!(response.items || [])[0].id) {
            return;
        } response = (response.items || [])[0];
    } const product = getFormattedProductObject(response);

    if (product.price <= 0) {
        return;
    } const oldProductList = (Insider.storageAccessor.cartProductList() || {}).productList || [];
    let hasProductAddedPreviously = false;
    const newProductList = oldProductList.map(function (item) {
        if (product.id === item.id) {
            hasProductAddedPreviously = true;
            item = product;
        }

        return item;
    });

    if (!hasProductAddedPreviously) {
        newProductList.push(product);
    } setCartStorages(newProductList, oldProductList);
}, 1000));

if (!Insider.systemRules.call('isOnAfterPaymentPage')) {
    if (!Insider.__external.ajaxListenerShopify) {
        Insider.__external.ajaxListenerShopify = function (callback) {
            'use strict';

            const oldOpen = XMLHttpRequest.prototype.open;

            XMLHttpRequest.prototype.open = function (method, url) {
                this.addEventListener('readystatechange', function () {
                    if (this.responseType !== 'arraybuffer' && this.responseType !== 'blob' && this.readyState === 4 && this.status === 200 && typeof callback === 'function') {
                        callback(url, method, this.response);
                    }
                });
                oldOpen.apply(this, arguments);
            };
        };
        Insider.__external.ajaxListenerShopify(function (url, method, response) {
            if (url.indexOf('/add.js') > -1) {
                Insider.eventManager.dispatch('ins:shopify:product:add', response);
            } else if (url.indexOf('/cart.js') > -1 || url.indexOf('/change.js') > -1 || url.indexOf('/update.js') > -1 || url.indexOf('/clear.js') > -1) {
                Insider.eventManager.dispatch('ins:shopify:cart:update', response);
            }
        });
    }

    if (!Insider.__external.fetchListenerShopify) {
        Insider.__external.listenFetchRequest = function (callback) {
            const originalFetchFunction = window.fetch;

            window.fetch = function (url, options) {
                const response = originalFetchFunction.apply(this, arguments);

                try {
                    response.then(function (val) {
                        return val.clone().text();
                    }).then(function (data) {
                        callback(url, data, options);
                    });
                } catch (error) {
                    Insider.errorBag.add({ className: '', methodName: 'listenFetchRequest:freeJS', stack: error, });
                }

                return response;
            };
        };
        Insider.__external.listenFetchRequest(function (url, response) {
            if (url.indexOf('/cart.js') > -1 || url.indexOf('/change.js') > -1 || url.indexOf('/update.js') > -1 || url.indexOf('/clear.js') > -1) {
                Insider.eventManager.dispatch('ins:shopify:cart:update', response);
            } else if (url.indexOf('cart/add') > -1) {
                Insider.eventManager.dispatch('ins:shopify:product:add', response);
            }
        });
    }
}

if (isCartPage) {
    const oldProductList = Insider.storage.localStorage.get('ins-temp-product-list') || (Insider.storageAccessor.cartProductList() || {}).productList || [];

    Insider.utils.cart.updateCartCount();
    Insider.utils.cart.updateCartCookies();
    setTimeout(function () {
        updateCartStorageFromIO(Insider.utils.getDataFromIO('basket', 'line_items', []), oldProductList);
    }, 250);
}
