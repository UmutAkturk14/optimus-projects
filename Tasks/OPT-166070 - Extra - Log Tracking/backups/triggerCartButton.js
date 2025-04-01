const salesLog = { name: 'ins-sales-log-tracking', expireTime: 3, track(t, e) {
    this.storageData = this.getLocalStorage(), this.lastLog = this.storageData[this.storageData.length - 1] || {}, this.lastData = (this.lastLog.data || [])[0] || '{}', this.log = { id: t, path: window.location.pathname, cas: Insider.storageAccessor.totalCartAmount(), pps: (Insider.storageAccessor.paidProducts() || []).length, ca: Insider.systemRules.call('getTotalCartAmount'), pp: (Insider.systemRules.call('getPaidProducts') || []).length }, Insider.fns.isUndefined(e) || (this.log.data = [e]), this.isSameLastLog(t, e) ? (this.log.lg = this.lastLog.lg + 1 || 2, this.storageData[this.storageData.length - 1] = this.log) : this.storageData.push(this.log), Insider.storage.localStorage.set({ name: this.name, value: this.storageData, expires: this.expireTime });
}, getLocalStorage() {
    return Insider.storage.localStorage.get(this.name) || [];
}, isSameLastLog(t, e) {
    return this.isSameId = this.lastLog.id === t, this.isSameCAS = this.lastLog.cas === Insider.storageAccessor.totalCartAmount(), this.isSamePPS = this.lastLog.pps === (Insider.storageAccessor.paidProducts() || []).length, this.isSameCA = this.lastLog.ca === Insider.systemRules.call('getTotalCartAmount'), this.isSamePP = this.lastLog.pp === (Insider.systemRules.call('getPaidProducts') || []).length, this.isSameData = Insider.fns.stringify((this.lastLog.data || [])[0]) === Insider.fns.stringify(e), this.isSameId && this.isSameData && this.isSameCAS && this.isSamePPS && this.isSameCA && this.isSamePP;
} };

function documentTrigger() {
    setTimeout((function () {
        Insider.eventManager.dispatch('cart:amount:update');
    }), 250);
}

function mergeDuplicateProducts(t) {
    const e = {};

    return t.map((function (t) {
        if (!e[t.id]) {
            return e[t.id] = t.quantity, t;
        } e[t.id] += t.quantity;
    })).filter(Boolean).map((function (t) {
        return t.quantity = e[t.id] || t.quantity, t;
    }));
}

function compareProductListAndEventTrigger(t, e) {
    const r = function (t, e) {
        Insider.systemRules.call('isOnCartPage') && 0 === Insider.utils.cart.getCartProductStorage().length && Insider.__external.isCartRefreshSrtr19611 || Insider.eventManager.dispatch('cart:count:update', { product: t, isAddedToCart: e }), Insider.storage.localStorage.set({ name: 'ins-temp-product-list', value: Insider.utils.cart.getCartProductStorage() });
    }; const s = e.filter((function (e) {
        return 0 === t.filter((function (t) {
            return e.id === t.id;
        })).length;
    }));

    Insider.utils.cart.getCartProductStorage().length > 0 ? s.map((function (t) {
        r(t, !1);
    })) : s.length > 0 && r(s[0], !1), t.map((function (t) {
        if (e.filter((function (e) {
            return e.id === t.id;
        })).length > 0) {
            const s = e.filter((function (e) {
                return e.id === t.id && e.quantity !== t.quantity;
            }))[0] || {};

            s.id && (s.quantity > t.quantity ? (t.quantity = s.quantity - t.quantity, r(t, !1)) : (t.quantity = t.quantity - s.quantity, r(t, !0)));
        } else {
            r(t, !0);
        }
    }));
}

function setStorage(t, e, r) {
    const s = Insider.storage.localStorage.get('ins-temp-product-list') || [];

    r = mergeDuplicateProducts(r), Insider.utils.cart.storeCartProductStorage({ totalQuantity: t, productList: r }), Insider.storage.localStorage.set({ name: 'paid-products', value: r }), Insider.storage.localStorage.set({ name: 'total-cart-amount', value: parseFloat(e.toFixed(2)) || 0 }), documentTrigger(), compareProductListAndEventTrigger(r, s);
}

function setProductStorage(t) {
    const e = Insider.storageAccessor.cartProductList(); let r = Insider.storageAccessor.totalCartAmount(); const s = e.productList || []; let a = e.totalQuantity || 0;

    s.push(t), r += t.price * t.quantity, setStorage(a += t.quantity, r, s);
}

function updateFromResponse(t) {
    const e = JSON.parse(t || '{}') || {}; const r = e.carrinho || e; const s = []; let a = 0; let i = 0;

    void 0 !== r.itens && ((r.itens || []).map((function (t) {
        const e = parseInt(t.quantidade) || 1; const r = parseFloat((parseFloat(t.precoVenda) || 0).toFixed(2)) || 0; const n = (t.idSku || '').toString().trim(); const o = document.createElement('div');

        o.innerHTML = (t.nome || '').trim(), r > 0 && (s.push({ id: n, name: encodeURIComponent(Insider.dom(o).text().trim()), price: r, originalPrice: parseFloat((parseFloat(t.precoTabela) || 0).toFixed(2)) || r, img: (t.urlImagem || '').split('?')[0], url: (t.urlDetalhes || '').split('?')[0] || `https://produto.pontofrio.com.br/${ n }`, quantity: e, time: Insider.dateHelper.now() }), a += e, i += r * e);
    })), setStorage(a, i, s));
}

function fetchListener(t) {
    const e = window.fetch;

    window.fetch = function () {
        const r = e.apply(this, arguments); let s = '';

        return r.then((function (t) {
            return t = t.clone(), s = t.url || '', t.text();
        })).then((function (e) {
            t(s, e);
        })), r;
    };
}

if (Insider.__external.ajaxListenerSrtr19611 || (Insider.__external.ajaxListenerSrtr19611 = function (t) {
    'use strict';

    const e = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function (r, s) {
        this.addEventListener('readystatechange', (function () {
            'arraybuffer' !== this.responseType && 'blob' !== this.responseType && 4 === this.readyState && 200 === this.status && 'function' === typeof t && t(s, r, this.response);
        })), e.apply(this, arguments);
    };
}, Insider.__external.ajaxListenerSrtr19611((function (t, e, r) {
    -1 === t.indexOf('Carrinho.svc/AlterarQuantidadeSku') && -1 === t.indexOf('Carrinho.svc/CarrinhoSku') && -1 === t.indexOf('/api/v2/carrinho') || !Insider.systemRules.call('isOnCartPage') ? -1 === t.indexOf('/itens') || -1 === t.indexOf('carrinho') && -1 === t.indexOf('checkout') || Insider.systemRules.call('isOnCartPage') || Insider.systemRules.call('isOnAfterPaymentPage') || (salesLog.track('ajax-listener', { responseLength: r.length }), updateFromResponse(r)) : setTimeout((function () {
        const t = Insider.storage.localStorage.get('ins-temp-product-list') || [];

        Insider.utils.cart.updateCartCount(), Insider.utils.cart.updateCartCookies(), salesLog.track('ajax-listener-cart', { oldProductListLength: t.length, paidProductsLength: Insider.systemRules.call('getPaidProducts').length }), documentTrigger(), compareProductListAndEventTrigger(Insider.systemRules.call('getPaidProducts'), t);
    }), 2e3);
})), fetchListener((function (t, e) {
    -1 === t.indexOf('/itens') || -1 === t.indexOf('carrinho') || Insider.systemRules.call('isOnCartPage') || Insider.systemRules.call('isOnAfterPaymentPage') || (salesLog.track('feth-listener', { responseLength: e.length }), updateFromResponse(e));
}))), Insider.systemRules.call('isOnProductPage')) {
    const currentProduct = Insider.systemRules.call('getCurrentProduct');

    delete currentProduct.cats, currentProduct.time = Insider.dateHelper.now(), Insider.storage.localStorage.set({ name: 'ins-last-current-product', value: currentProduct });
}

if (-1 !== window.location.pathname.toLowerCase().indexOf('servicos') && (0 === window.location.host.indexOf('carrinho') || -1 !== window.location.pathname.indexOf('/carrinho') && 0 === window.location.host.indexOf('m.')) && !Insider.systemRules.call('isOnCartPage')) {
    const newProduct = Insider.storage.localStorage.get('ins-last-current-product') || {};

    Insider.storage.localStorage.set({ name: 'ins-last-current-product', value: null }), setTimeout((function () {
        newProduct.price > 0 && setProductStorage(newProduct);
    }), 1e3);
}Insider.systemRules.call('isOnCartPage') && (Insider.__external.isCartRefreshSrtr19611 = !0, Insider.utils.cart.updateCartCount(), Insider.utils.cart.updateCartCookies(), documentTrigger(), setTimeout((function () {
    const t = Insider.storage.localStorage.get('ins-temp-product-list') || [];

    salesLog.track('cart-page', { oldProductListLength: t.length, paidProductsLength: Insider.systemRules.call('getPaidProducts').length }), compareProductListAndEventTrigger(Insider.systemRules.call('getPaidProducts'), t);
}), 500), setTimeout((function () {
    Insider.__external.isCartRefreshSrtr19611 = !1;
}), 1500)), Insider.systemRules.call('isOnAfterPaymentPage') ? Insider.eventManager.once('visibilitychange.ins:refresh:after:payment', document, (function () {
    'hidden' === document.visibilityState ? (Insider.storage.set({ name: 'ins-after-payment-refresh-control', value: !0 }), setStorage(0, 0, [])) : Insider.storage.remove('ins-after-payment-refresh-control');
})) : 'confirmation' !== Insider.utils.getDataFromIO('page', 'type').toLowerCase() && Insider.storage.localStorage.get('ins-after-payment-refresh-control') && Insider.storage.remove('ins-after-payment-refresh-control');