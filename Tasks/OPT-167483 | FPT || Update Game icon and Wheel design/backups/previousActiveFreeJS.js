// SD-42580 Start
var countOnCategoryPage = true;
var countOnProductPage = true;
var cookieExpires = 30;
var cookieName = 'ins-categories-visit-count';
var isIncludedCategoryUrlOnCategoryPage = {
    apple: [
        '/dien-thoai/apple-iphone',
        '/may-tinh-bang/apple-ipad',
        '/may-tinh-xach-tay/apple-macbook',
        '/smartwatch/apple',
        '/phu-kien/tv-box',
        '/phu-kien/phu-kien-apple'
    ],
    dienThoai: [
        '/dien-thoai/apple-iphone',
        '/dien-thoai/samsung',
        '/dien-thoai/oppo',
        '/dien-thoai/sony',
        '/dien-thoai/nokia',
        '/dien-thoai/vivo',
        '/dien-thoai/asus',
        '/dien-thoai/huawei',
        '//dien-thoai/masstel',
        '/dien-thoai/meizu',
        '/dien-thoai/mobiistar',
        '/dien-thoai/philips',
        '/dien-thoai/wiko',
        '/dien-thoai/itel',
        '/dien-thoai/tecno',
        '/dien-thoai/xiaomi',
        '/dien-thoai/honor',
        '/dien-thoai/duoi-1-trieu',
        '/dien-thoai/tu-1-3-trieu',
        '/dien-thoai/tu-3-6-trieu',
        '/dien-thoai/tu-6-10-trieu',
        '/dien-thoai/tu-10-15-trieu',
        '/dien-thoai/tren-15-trieu'
    ],
    tablet: [
        '/may-tinh-bang/apple-ipad',
        '/may-tinh-bang/samsung',
        '/may-tinh-bang/lenovo',
        '/may-tinh-bang/masstel',
        '/may-tinh-bang/huawei',
        '/may-tinh-bang/itel',
        '/may-tinh-bang/duoi-2-trieu',
        '/may-tinh-bang/tu-2-trieu-den-5-trieu',
        '/may-tinh-bang/tu-5-trieu-den-8-trieu',
        '/may-tinh-bang/tren-8-trieu'
    ],
    laptop: [
        '/may-tinh-xach-tay',
        '/may-tinh-xach-tay/apple-macbook',
        '/may-tinh-xach-tay/asus',
        '/may-tinh-xach-tay/acer',
        '/may-tinh-xach-tay/dell',
        '/may-tinh-xach-tay/lenovo',
        '/may-tinh-xach-tay/msi',
        '/may-tinh-xach-tay/masstel',
        '/phan-mem/diet-virus',
        '/phan-mem/microsoft-office',
        '/phan-mem/windows',
        '/phan-mem/phan-mem-khac',
        '/may-tinh-xach-tay/duoi-5-trieu',
        '/may-tinh-xach-tay/tu-5-10-trieu',
        '/may-tinh-xach-tay/tu-10-15-trieu',
        '/may-tinh-xach-tay/tu-15-20-trieu',
        '/may-tinh-xach-tay/tu-20-25-trieu',
        '/may-tinh-xach-tay/tu-25-30-trieu',
        '/may-tinh-xach-tay/tren-30-trieu',
    ]
};

var isIncludedCategoryNamesOnProductPage = [
    'điệnthoại',
    'máytínhxáchtay',
    'máytínhbảng',
];

var setCookie = function (name, value) {
    /* OPT-109184 START */
    Insider.storage.localStorage.set({
        name: name,
        value: value,
        expires: cookieExpires
    });
    /* OPT-109184 END */
};

var incrementCategory = function (categoryName) {
    var categoriesCookie = Insider.fns.parse(Insider.storage.localStorage.get(cookieName) || '{}'); /* OPT-109184 */

    if (typeof categoriesCookie[categoryName] !== 'undefined') {
        categoriesCookie[categoryName] = categoriesCookie[categoryName] + 1;
    } else {
        categoriesCookie[categoryName] = 1;
    }

    setCookie(cookieName, JSON.stringify(categoriesCookie));
};

if (countOnProductPage === true && spApi.isOnProductPage()) {
    cookieName = 'ins-product-visit-count';
    var categoryName =
        ((spApi.getProductCategories() || []).shift() || '').replace(/ /g, '').toLowerCase();

    if ((spApi.getProductCategories() || []).indexOf('Apple') !== -1) {
        incrementCategory('apple');
    }

    if (
        typeof categoryName !== 'undefined' &&
        categoryName !== '' &&
        isIncludedCategoryNamesOnProductPage.indexOf(categoryName) !== -1
    ) {
        incrementCategory(categoryName);
    }

    sQuery('.fs-dti-oder.dts-addtocart').on('click', function () {
        setCookie('ins-last-cart-cat', ((spApi.getProductCategories() || []).shift() || ''));
    });
}

if (countOnCategoryPage === true && spApi.isOnCategoryPage()) {
    var categoryUrl = location.pathname;

    if (
        typeof categoryUrl !== 'undefined' &&
        categoryUrl !== '' &&
        isIncludedCategoryUrlOnCategoryPage.apple.includes(categoryUrl)
    ) {
        incrementCategory('apple');
    }

    if (
        typeof categoryUrl !== 'undefined' &&
        categoryUrl !== '' &&
        isIncludedCategoryUrlOnCategoryPage.dienThoai.includes(categoryUrl)
    ) {
        incrementCategory('dienThoai');
    }

    if (
        typeof categoryUrl !== 'undefined' &&
        categoryUrl !== '' &&
        isIncludedCategoryUrlOnCategoryPage.tablet.includes(categoryUrl)
    ) {
        incrementCategory('tablet');
    }

    if (
        typeof categoryUrl !== 'undefined' &&
        categoryUrl !== '' &&
        isIncludedCategoryUrlOnCategoryPage.laptop.includes(categoryUrl)
    ) {
        incrementCategory('laptop');
    }
}
// SD-42580 End

// SD-33124
// In product page, if user clicks buy button wait till modal pop, then set this page as cart page.
spApi.setPaidProducts = function () {
    var cookieDomain = '.' + partner_site.host;
    var pProd = spApi.getPaidProducts();

    sQuery.each(pProd, function (key, value) {
        if (pProd.length > 4) {
            pProd.pop();
        }
    });
    var encodedProducts = JSON.stringify(pProd);
    var date = new Date();
    var minutes = 30;

    date.setTime(date.getTime() + (minutes * 60 * 1000));
    spApi.storageData('paid-products', encodedProducts, {
        expires: date,
        path: '/',
        domain: cookieDomain
    });
};

if (spApi.isOnProductPage()) {
    sQuery('.detail-order a[class*=detail-order]:first, a.detail-order-now').elementLoadComplete(function () {
        sQuery('.detail-order a[class*=detail-order]:first, a.detail-order-now').unbind('click.insider').bind('click.insider', function () {
        	sQuery('.modal-dialog [id*=order-submit]:visible').elementLoadComplete(function () {
        		window.insCartPage = true;
                spApi.setPaidProducts();
        		spApi.reInitOnChange();
        		spApi.conLog('--- CART PAGE RULE TRUE ---');
        		setTimeout(function () {
        			delete window.insCartPage;
        			// For success page, track submit button inside modal
        			var modal = sQuery('.modal-dialog [id*=order-submit]');

        			sQuery('.pd-ftbtn, .ppu_rbnt_submit', modal).on('click', function () {
        				// Make validations, first field name, second field phone, third field email
        				if (!sQuery('.error:visible').exists()) {
        					// Wait till it completes adding order
        					$(document).ajaxComplete(function (e, x, s) {
        						if (s.url.indexOf('/Ajax/Order/AddOrder') > -1) {
        							window.insAfterPaymentPage = true;
        							spApi.reInitOnChange();
        							spApi.conLog('--- SUCCESS PAGE RULE TRUE ---');
        							setTimeout(function () {
        							    delete window.insAfterPaymentPage;
        							}, 3500);
        						}
        					});
        				}
        			});
        		}, 1500);
        	}, { i: 10, t: 5000 });
        });
    });
}

if (spApi.isMobileBrowser()) {
    if (spApi.isOnProductPage()) {
        sQuery(document).on('click', '.fm-dt-ulbtnod', function (e) {
        	var data = JSON.parse(spApi.localStorageGet('insLastAddedProducts')) || [];
            var dataKey = spApi.getCurrentProduct().id || 0;

            data.push({
            	key: dataKey,
            	value: window.location.href
            });
            spApi.localStorageSet('insLastAddedProducts', JSON.stringify(data));
        });
    }

    if (spApi.isOnCartPage()) {
        sQuery(document).on('click', '.fm-dt-ulbtnod', function (e) {
        	var data = spApi.localStorageGet('insLastAddedProducts') || [];

            data.push(window.location.href);
            spApi.localStorageSet('insLastAddedProducts', JSON.stringify(data));
        });
        sQuery('.OrderDelete').on('click', function () {
        	var data = JSON.parse(spApi.localStorageGet('insLastAddedProducts')) || [];
        	var dataKey = sQuery(this).parents('.proitem').attr('data-id');

        	data = sQuery(data).map(function (i, v) {
        	    if (v.key !== dataKey) {
        	        return v;
        	    }
        	}).get();
        	spApi.localStorageSet('insLastAddedProducts', JSON.stringify(data));
        });
        sQuery('[data-pay="0"]:visible').elementLoadComplete(function () {
            sQuery('[data-pay="0"]:visible').unbind('click.insider').bind('click.insider', function () {
        	if (sQuery('#CustomerName').val() !== '' && sQuery('#CustomerPhone').val().length == 10) {
        		$(document).ajaxComplete(function (e, x, s) {
        			if (s.url.indexOf('/Home/AddOrderAPI') > -1) {
        				sQuery('*:contains("Đặt hàng thành công!"):visible').elementLoadComplete(function () {
        					window.insAfterPaymentPage = true;
        					spApi.reInitOnChange();
        					setTimeout(function () {
        					    delete window.insAfterPaymentPage;
        					}, 3500);
        				});
        			}
        		});
        	}
            });
        });
    }
}

if (spApi.hasParameter('/tra-gop')) {
    if (spApi.isMobileBrowser()) {
        sQuery('.mtg-tb-btntg').elementLoadComplete(function () {
		    sQuery('.mtg-tb-btntg').unbind('click.insider').bind('click.insider', function () {
                sQuery('#pop-tg:visible').elementLoadComplete(function () {
                    window.insCartPage = true;
                    spApi.setPaidProducts();
                    spApi.reInitOnChange();
                    spApi.conLog('--- CART PAGE RULE TRUE ---');
                    setTimeout(function () {
                        delete window.insCartPage;
                        // For success page, track submit button inside modal
                        var modal = sQuery('#pop-tg:visible');

                        sQuery('.btn.btn-Order', modal).on('click', function () {
                            setTimeout(function () {
                                if (!sQuery('.error:visible').exists()) {
                                    $(document).ajaxComplete(function (e, x, s) {
                                        if (s.url.indexOf('/Ajax/Installment/AddOrderTraGop') > -1) {
                                            window.insAfterPaymentPage = true;
                                            spApi.reInitOnChange();
                                            spApi.conLog('--- SUCCESS RULE TRUE ---');
                                            setTimeout(function () {
										    delete window.insAfterPaymentPage;
                                            }, 3500);
                                        }
                                    });
                                }
                            }, 500);
                        });
                    }, 1500);
                }, { i: 10, t: 5000 });
            });
        });
    } else {
	    sQuery('.tr-dbtnchoise,.tgp-tbbtnc1').elementLoadComplete(function () {
		    sQuery('.tr-dbtnchoise,.tgp-tbbtnc1').unbind('click.insider').bind('click.insider', function () {
                sQuery('.modal-dialog [id*=order-submit]:visible , #TgPopup:visible').elementLoadComplete(function () {
                    window.insCartPage = true;
                    spApi.setPaidProducts();
                    spApi.reInitOnChange();
                    spApi.conLog('--- CART PAGE RULE TRUE ---');
                    setTimeout(function () {
                        delete window.insCartPage;
                        // For success page, track submit button inside modal
                        var modal = sQuery('.modal-dialog [id*=order-submit]:visible, #TgPopup:visible');

                        sQuery('#btn-submit', modal).on('click', function () {
                            setTimeout(function () {
                                if (!sQuery('#err-mess:visible').exists()) {
                                    $(document).ajaxComplete(function (e, x, s) {
                                        if (s.url.indexOf('/Ajax/Installment/AddOrderTraGop') > -1) {
                                            window.insAfterPaymentPage = true;
                                            spApi.reInitOnChange();
                                            spApi.conLog('--- SUCCESS RULE TRUE ---');
                                            setTimeout(function () {
										    delete window.insAfterPaymentPage;
                                            }, 3500);
                                        }
                                    });
                                }
                            }, 500);
                        });
                    }, 1500);
                }, { i: 10, t: 5000 });
            });
	    });
    }
}

//OPT-1678 Start

if (spApi.isOnProductPage() && (sQuery('a.fs-dti-tgop').exists() || sQuery('a.mf-dtbtn-tgop').exists())) {
    var unusualaddToCartButton = sQuery('a.fs-dti-tgop') || sQuery('a.mf-dtbtn-tgop');

    sQuery(document).on('click', unusualaddToCartButton, function () {
        var currentProduct = spApi.getCurrentProduct();

        spApi.storageData('paid-products', currentProduct);
    });
}
//OPT-1678 End

// OPT-5823 Start
if (spApi.isOnCartPage()) {
    sQuery('.OrderDelete').off('click.insReinit').on('click.insReinit', function () {
        var waitDeletingAllItems = setInterval(function () {
            if (sQuery('img[src*="null.png"]').exists()) {
                spApi.reInitOnChange();
                spApi.isWebPushInitialized = false;

                clearInterval(waitDeletingAllItems);
            }
        }, 10);

        setTimeout(function () {
            clearInterval(waitDeletingAllItems);
        }, 5000);
    });
}
// OPT-5825 End

if (spApi.isOnProductPage()) {
    var productImg = spApi.getCurrentProduct().img || '';

    spApi.storageData('ins-last-viewed-product-img-url', productImg);
}

spApi.listenAjaxRequest = function (callback) {
    var originalOpenFunction = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function (method, url) {
        originalOpenFunction.apply(this, arguments);

        this.addEventListener('readystatechange', function () {
            if (this.readyState === 4 && this.status === 200 &&
                typeof callback === 'function') {
                try {
                    callback(url, this.response, method);
                } catch (error) {
                    spApi.conLog('Something is crashed, Event:' + error);
                }
            }
        });
    };
};

/* SRTR-2022 Start */
/**Geliştirici Notu: Mobil sitede kupon alanına ait buton yok.
 *  Bu durum için couponInputListener fonksiyonu yazıldı! */
var dummyCouponButton = sQuery('<a class="ins-dummy-coupon-button" style="display: none;"></a>');

sQuery('#discount-code').closest('form').append(dummyCouponButton);
sQuery('#discount-code').off('.insKeyup .insKeypress').on('keyup.insKeyup keypress.insKeypress', function () {
    sQuery('.ins-dummy-coupon-button').trigger('click');
});
/* SRTR-2022 End */

/* SRTR-3764 Start */
spApi.setCookie = function (key, value) {
    /* OPT-109184 START */
    Insider.storage.localStorage.set({
        name: key,
        value: value,
        expires: 1
    });
    /* OPT-109184 END */
};

spApi.parseJSON = function (text) {
    var _flag = typeof text === 'string' ? /^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@')
        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
        .replace(/(?:^|:|,)(?:\s*\[)+/g, '')) : false;

    return _flag ? JSON.parse(text) : [];
};

spApi.deleteItemFromStorage = function (itemId, isTemp) {
    var totalAmount = 0;
    var storageData = {};

    if (isTemp) {
        storageData = JSON.parse(spApi.storageData('ins-temp-cart-product-list') ||
            '{"totalQuantity": 0, "productList": []}');

    } else {
        storageData = JSON.parse(spApi.storageData('ins-cart-product-list') ||
            '{"totalQuantity": 0, "productList": []}');
    }

    storageData.productList = storageData.productList.filter(function (product) {
        return product.id !== itemId;
    });

    storageData.totalQuantity = 0;

    storageData.productList.map(function (product) {
        storageData.totalQuantity += parseInt(product.quantity) || 1;
        totalAmount += (parseInt(product.quantity) || 1) * (parseFloat(product.price) || 1);
    });

    if (isTemp) {
        spApi.storageData('ins-temp-cart-product-list', storageData);

    } else {
        spApi.storeCartProductStorage(storageData);
        spApi.storageData('total-cart-amount', (parseFloat(totalAmount.toFixed(2)) || 0));
    }

    spApi.documentTrigger();
};

spApi.updateAllFromProductList = function (productListArray, timeOut) {
    var totalQuantity = 0;
    var totalAmount = 0;

    productListArray = (productListArray || []).filter(Boolean);

    timeOut = parseInt(timeOut) || 1000;
    setTimeout(function () {
        spApi.storeCartProductStorage({
            productList: (productListArray || []).map(function (product) {
                totalQuantity += parseFloat(product.quantity) || 0;
                totalAmount += parseFloat(product.quantity * product.price) || 0;

                return product;
            }),
            totalQuantity: totalQuantity
        });
        spApi.storageData('total-cart-amount', parseFloat(totalAmount.toFixed(2)) || 0);
        spApi.documentTrigger();
    }, timeOut);

    return true;
};

spApi.arrayHasId = function (array, findValue) {
    var hasValue = false;

    for (var index = 0; index < array.length; index++) {
        if (array[index].id === findValue) {
            hasValue = true;
            break;
        }
    }

    return hasValue;
},

spApi.documentTrigger = function () {
    setTimeout(function () {
        sQuery(document).trigger('changingCartCount');
        sQuery(document).trigger('cartAmountUpdated');
    }, 250);
};

spApi.parsePrice = function (str) {
    str = (str || '').toString();

    var price = 0;

    price = str.replace(/[^0-9.,]/g, '');

    if (price.slice(-3).indexOf(',') !== -1) {
        price = parseFloat(str.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
    } else if (price.slice(-3).indexOf('.') !== -1) {
        price = parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
    } else {
        price = parseFloat(str.replace(/[^0-9]/g, '')) || 0;
    }

    return price;
};

spApi.setProductStorage = function (product, flag) {
    var _total = spApi.getTotalCartAmount();

    spApi.storeCartProductInformation(product, {
        count: parseInt(product.quantity),
        increase: flag
    });
    spApi.storageData('total-cart-amount', parseFloat((_total + product.price *
        parseInt(product.quantity)).toFixed(2)));
    spApi.documentTrigger();

    return true;
};

spApi.getStorageTypeCurrentProduct = function () {
    var currentProduct = spApi.getCurrentProduct();

    currentProduct.time = spApi.getTime();
    delete currentProduct.cats;

    return currentProduct;
};

spApi.ajaxListener = function (callback) {
    var originalOpenFunction = XMLHttpRequest.prototype.open;

    if (typeof spApi.insTriggerCartButtonInitialized === 'undefined') {
        XMLHttpRequest.prototype.open = function (method, url) {
            originalOpenFunction.apply(this, arguments);
            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4 && this.status === 200) {
                    if (typeof callback === 'function') {
                        try {
                            callback(url, this.responseText, method);
                        } catch (error) {
                            spApi.conLog('Something is crashed, Event:' + error);
                        }
                    }
                }
            });
        };

        spApi.insTriggerCartButtonInitialized = true;
    }
};

/* SRTR-3764 End */

/* OPT-95995 START */
Insider.__external.sendCustomGoal = function (builderId, goalId, checkGoalExistence) {
    var goalOfCamp = Insider.goalBuilder.getGoalBuildersByBuilderId(builderId)[goalId];
    var variationId = Insider.campaign.userSegment.get()[builderId];
    var storageNameOfGoal = 'sp-goal-' + variationId + '-' + goalId;

    if (typeof goalOfCamp === 'undefined' ||
        (checkGoalExistence && Insider.storage.get(storageNameOfGoal, 'localStorage', true) !== null)) {
        return false;
    }

    goalOfCamp.goalList[0]['selectorString'] = 'true';

    Insider.goalBuilder.addGoalTracking();
};
/* OPT-95995 END */

/* OPT-127086 START */
Insider.__external.ShowRecommender127086 = function (builderId, device) {
    setTimeout(function () {
        /* OPT-132447 START */
        var variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
        var isDesktop = device === 'web';

        if (isDesktop ? !Insider.__external.isDesktopRecoVisible : !Insider.__external.isMobileRecoVisible) {
            var isRecommenderVisible = !!Object.values(Insider.campaign.shownCampaigns).filter(function (campaign) {
                return campaign.pa === (isDesktop ? 'web-' : '') + 'smart-recommender' &&
                    !Insider.campaign.isControlGroup(campaign.id) &&
                    Insider.dom((((Insider.campaign.get(variationId) || {}).pageSettings || {})
                        .locationConfig || {}).selectedElement || '').exists() &&
                    ((Insider.campaign.get(variationId) || {}).lang || [])
                        .indexOf(Insider.systemRules.call('getLang')) > -1;
            }).length;

            if (isRecommenderVisible) {
                Insider.campaign.info.show(variationId);

                if (isDesktop) {
                    Insider.__external.isDesktopRecoVisible = true;
                } else {
                    Insider.__external.isMobileRecoVisible = true;
                }
            }
        }
        /* OPT-132447 END */
    }, 1000);

};
/* OPT-127086 END */