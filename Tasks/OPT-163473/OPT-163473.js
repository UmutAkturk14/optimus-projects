function dT() {
    setTimeout(() => {
        Insider.eventManager.dispatch('cart:amount:update');
    }, 250);
}

function pP(st) {
    let p = 0;

    st = (st || '').toString(); p = st.replace(/[^0-9.,]/g, '');

    if (p.slice(-3).indexOf(',') !== -1) {
        p = parseFloat(st.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
    } else if (p.slice(-4).indexOf('.') !== -1) {
        p = parseFloat(st.replace(/[^0-9.]/g, '')) || 0;
    } else {
        p = parseFloat(st.replace(/[^0-9]/g, '')) || 0;
    }

    return p;
}

function sSet(name, val) {
    Insider.storage.localStorage.set({ name, value: val });
}

function sGet(name) {
    return Insider.storage.localStorage.get(name);
}

const tca = 'total-cart-amount'; const insT = 'ins-temp-product-list'; const clc = 'click.insClick'; const aC = 'ins-after-payment-refresh-control'; const t = Insider.dateHelper.now();

function c(nList, oList) {
    const dispatchEvent = function (data, bool) {
        if (!(Insider.systemRules.call('isOnCartPage') && Insider.utils.cart.getCartProductStorage().length === 0 && (Insider.__external.isRefSrtr18394 || false))) {
            Insider.eventManager.dispatch('cart:count:update', { product: data, isAddedToCart: bool });
        } sSet(insT, Insider.utils.cart.getCartProductStorage());
    }; const removedPs = oList.filter(function (oldP) {
        return nList.filter(function (newProduct) {
            return oldP.id === newProduct.id;
        }).length === 0;
    });

    removedPs.map(function (removedProduct) {
        dispatchEvent(removedProduct, false);
    }); nList.map(function (nP) {
        const isOldListContainsNewProduct = oList.filter(function (oldProduct) {
            return oldProduct.id === nP.id;
        }).length > 0;

        if (isOldListContainsNewProduct) {
            const upP = oList.filter(function (oldProduct) {
                return oldProduct.id === nP.id && oldProduct.quantity !== nP.quantity;
            })[0] || {};

            if (upP.id) {
                if (upP.quantity > nP.quantity) {
                    nP.quantity = upP.quantity - nP.quantity; dispatchEvent(nP, false);
                } else {
                    nP.quantity = nP.quantity - upP.quantity; dispatchEvent(nP, true);
                }
            }
        } else {
            dispatchEvent(nP, true);
        }
    });
}

function setStorage(totalQty, totalAmount, productL) {
    const oldProductList = Insider.storage.localStorage.get('ins-temp-product-list') || [];

    productL = Insider.utils.opt.mergeDuplicateProducts(productL); Insider.utils.cart.storeCartProductStorage({ totalQuantity: totalQty, productList: productL }); sSet('paid-products', productL); sSet('total-cart-amount', parseFloat(totalAmount.toFixed(2)) || 0); dT(); c(productL, oldProductList);
}

function s(p) {
    const ps = Insider.storageAccessor.cartProductList(); let tA = Insider.storageAccessor.totalCartAmount(); const pL = ps.productList || []; let tQ = ps.totalQuantity || 0;

    pL.push(p); tA += p.price * p.quantity; tQ += p.quantity; setStorage(tQ, tA, pL);
}

function cUp() {
    setTimeout(() => {
        const oldPList = sGet(insT) || [];

        Insider.utils.cart.updateCartCount(); Insider.utils.cart.updateCartCookies(); dT(); c(Insider.systemRules.call('getPaidProducts'), oldPList);
    }, 1000);
}

function urlSplit(url) {
    return url.split('-').slice(-1)[0].split('&')[0].replace(/\//g, '');
}

function fetchListener(callback) {
    const orjFetch = window.fetch;

    window.fetch = function () {
        const ftch = orjFetch.apply(this, arguments); let url = '';

        ftch.then(function (res) {
            res = res.clone(); url = res.url || '';

            return new Response(res.body).text();
        }).then(function (res) {
            callback(url, res);
        });

        return ftch;
    };
} /* SRTR-23911 START */

if (!(Insider.__external.isApiInit23911 || false)) {
    Insider.__external.isApiIni23911 = true; Insider.utils.opt.ajaxListener(function (url) {
        if (url.indexOf('updateitemassembly') && Insider.fns.hasParameter('checkout')) {
            setTimeout(() => {
                sSet(tca, parseFloat((pP(Insider.dom('.cart-total .order-total:first').text()) - pP(Insider.dom('.cart-total-right .product-price:eq(1)').text())).toFixed(2)) || Insider.storageAccessor.totalCartAmount() || 0); dT();
            }, 1000);
        } else if (url.indexOf('cart/cart/item') !== -1 && !Insider.systemRules.call('isOnCartPage')) {
            (Insider.__external.adPsSrtr18394 || []).map(function (p) {
                p.price > 0 && s(p);
            }); Insider.__external.adPsSrtr18394 = [];
        }
    }); fetchListener(function (url) {
        if (url.indexOf('cart/cart') !== -1 && Insider.systemRules.call('isOnCartPage')) {
            cUp();
        }
    }); Insider.eventManager.on(clc, '.pip-btn[data-test-target=add-to-cart-button], .pip-buy-module__buttons', function () {
        const cP = Insider.systemRules.call('getCurrentProduct');

        cP.originalPrice = cP.price;

        if (Insider.systemRules.call('isOnProductPage')) {
            const q = parseInt(Insider.dom('#upsell__quantity-selection').val()) || 0;

            cP.time = t;

            if (q > 0 && Insider.dom('.pip-upsell').exists()) {
                const el = Insider.dom('.pip-upsell .pip-product-compact'); const prc = pP(Insider.dom(el).attr('data-price'));

                if (prc > 0 && cP.price > 0) {
                    const url = Insider.dom('a[class*=wrapper-link]', el).prop('href') || ''; const p = { id: urlSplit(url), name: encodeURIComponent((Insider.dom(el).attr('data-product-name') || '').trim()), price: prc, originalPrice: pP(Insider.dom('[class*=price--secon] .pip-price__integer', el).text()) || prc, img: (Insider.dom('[class*=image-wrap] img', el).prop('src') || '').split('?')[0], url, cats: [], quantity: q, time: t };

                    Insider.__external.adPsSrtr18394 = [cP, p];
                }
            } else if (cP.price > 0) {
                Insider.__external.adPsSrtr18394 = [cP];
            }
        }
    }); Insider.eventManager.on(clc, '[class*=pip-product-compact__], .button__add-to-cart', function () {
        Insider.__external.pAddSrtr18394 = false; const el = window.location.pathname.indexOf('search/visual-search') !== -1 ? Insider.dom(this).closest('.search-grid__item.product-fragment') : Insider.dom(this).closest('.pip-product-compact'); const prc = pP(window.getComputedStyle((Insider.dom('.pip-price', el).nodes[0] || document.createElement('div')), ':after').getPropertyValue('content')) || pP(Insider.dom(el).attr('data-price')) || pP(Insider.dom('.price-package__price:first', el).text()) || pP(Insider.dom('.pip-temp-price__nowrap:first', el).text());

        if (prc > 0) {
            const url = Insider.dom('a', el).prop('href') || ''; const p = { id: urlSplit(url), name: encodeURIComponent((Insider.dom(el).attr('data-product-name') || '').trim()), price: prc, originalPrice: pP(Insider.dom('[class*=through] .pip-price__integer:first', el).text()) || prc, img: (Insider.dom('[class*=image__image], img', el).attr('srcset') || '').trim().split(',')[0].split(' ')[0].split('?')[0], url, cats: [], quantity: 1, time: t };

            Insider.__external.adPsSrtr18394 = [p];
        }
    }); Insider.eventManager.on(clc, '.plp-btn.plp-btn--small', function () {
        Insider.__external.pAddSrtr18394 = false; const el = Insider.dom(this).closest('.plp-fragment-wrapper'); const prc = pP(Insider.dom('.plp-price__nowrap:first', el).text());

        if (prc > 0) {
            const url = Insider.dom('a', el).prop('href') || ''; const p = { id: urlSplit(url), name: encodeURIComponent(Insider.dom('.notranslate:first', el).text().trim()), price: prc, originalPrice: prc, img: (Insider.dom('img', el).prop('src') || '').split('?')[0], url, cats: [], quantity: 1, time: t };

            Insider.__external.adPsSrtr18394 = [p];
        }
    }); /* SRTR-23911 END */

    if (Insider.systemRules.call('isOnCartPage')) {
        Insider.eventManager.on(clc, '.cart-item-removal-button', function () {
            cUp();
        });
    }

    if (window.location.pathname.indexOf('favourites') !== -1) {
        Insider.eventManager.on(clc, '[class*=addToCartWrapper] [class*=prefix-btn__inner]', function () {
            Insider.__external.pAddSrtr18394 = false; const el = Insider.dom(this).closest('section[class*=RecommendationItem]'); const qty = parseInt(Insider.dom('input[class*=quantity]', el).val()) || 1; const prc = parseFloat((pP(Insider.dom('[class*=price-module__current-price] span:first', el).text()) / qty).toFixed(2)) || 0;

            if (prc > 0) {
                const url = Insider.dom('a', el).prop('href') || ''; const p = { id: urlSplit(url), name: encodeURIComponent(Insider.dom('[class*=productTitle]', el).text().trim()), price: prc, originalPrice: prc, img: Insider.dom('[class*=fix-image]', el).attr('src') || '', url, cats: [], quantity: qty, time: t };

                s(p);
            }
        }); Insider.eventManager.on(clc, '[class*=ListProduct_main] [data-testid=add-to-bag-button]', function () {
            Insider.__external.pAddSrtr18394 = false; const el = Insider.dom(this).closest('section[class*=ListProduct_product]'); const qty = parseInt(Insider.dom('input[class*=quantity]', el).val()) || 1; const prc = parseFloat((pP(Insider.dom('[class*=price-module__current-price] span:first', el).text()) / qty).toFixed(2)) || 0;

            if (prc > 0) {
                const url = Insider.dom('a', el).prop('href') || ''; const p = { id: urlSplit(url), name: encodeURIComponent(Insider.dom('[class*=productTitle]', el).clone().children().remove().end().text().trim()), price: prc, originalPrice: prc, img: Insider.dom('[class*=fix-image]', el).attr('src') || '', url, cats: [], quantity: qty, time: t };

                s(p);
            }
        }); Insider.eventManager.on(clc, '[class*=Summary_addToCartButton]', function () {
            Insider.__external.pAddSrtr18394 = false; Insider.dom('[class*=ListProduct_product]').accessNodes(function (e) {
                const qty = parseInt(Insider.dom('input[class*=quantity]', e).val()) || 1; const prc = parseFloat((pP(Insider.dom('[class*=fix-price__integer]', e).text()) / qty).toFixed(2)) || 0;

                if (prc > 0) {
                    const url = Insider.dom('a', e).prop('href') || ''; const p = { id: urlSplit(url), name: encodeURIComponent(Insider.dom('[class*=productTitle]', e).text().trim()), price: prc, originalPrice: prc, img: Insider.dom('[class*=fix-image]', e).attr('src') || '', url, cats: [], quantity: qty, time: t };

                    s(p);
                }
            });
        });
    }
}

if (Insider.systemRules.call('isOnCartPage')) {
    Insider.__external.isRefSrtr18394 = true; cUp();
}

if (Insider.systemRules.call('isOnAfterPaymentPage')) {
    Insider.eventManager.once('visibilitychange.ins:refresh:after:payment', document, function () {
        if (document.visibilityState === 'hidden') {
            sSet(aC, true); setStorage(0, 0, []);
        } else {
            Insider.storage.remove(aC);
        }
    });
} else if (Insider.utils.getDataFromIO('page', 'type').toLowerCase() !== 'confirmation' && (Insider.storage.localStorage.get(aC) || false)) {
    Insider.storage.remove(aC);
}