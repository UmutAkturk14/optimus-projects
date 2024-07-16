function mergeDuplicateProducts(productList) {
    const duplicates = {};

    return productList.map(function (productObject) {
        if (duplicates[productObject.id]) {
            duplicates[productObject.id] += productObject.quantity;
        } else {
            duplicates[productObject.id] = productObject.quantity;

            return productObject;
        }
    }).filter(Boolean).map(function (product) {
        product.quantity = (duplicates[product.id] || product.quantity);

        return product;
    });
}

function parsePrice(stringPrice) {
    let price = 0;

    stringPrice = (stringPrice || '').toString();
    price = stringPrice.replace(/[^0-9.,]/g, '');

    if (price.slice(-3).indexOf(',') !== -1) {
        price = parseFloat(stringPrice.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
    } else if (price.slice(-4).indexOf('.') !== -1) {
        price = parseFloat(stringPrice.replace(/[^0-9.]/g, '')) || 0;
    } else {
        price = parseFloat(stringPrice.replace(/[^0-9]/g, '')) || 0;
    }

    return price;
}

let paidProducts = [];

Insider.dom('[class*=CartList_cartList] [class*=CartItem_cartItemWrapper]').accessNodes((element, key) => {
    /* SRTR-23908 START */
    const quantity = parseInt(Insider.dom('.skapa-wrapper-prefix-quantity-stepper__input', element).val()) || 1;
    const price = parseFloat((parsePrice(Insider.dom('.skapa-wrapper-prefix-price--fixed-size span:first',
        element).text()) / quantity).toFixed(2)) || 0;
    /* SRTR-23908 END */

    price > 0 && paidProducts.push({
        id: (Insider.dom('div', element).attr('product-id') || '').split('_').pop().toLowerCase(),
        name: encodeURIComponent(Insider.dom('[class*=module__name] a:first', element).text().trim()),
        price,
        originalPrice: parsePrice(Insider.dom('.promo-price:first strike:first', element).text()) ||
      parsePrice(Insider.dom('span.skapa-wrapper-prefix-price__sr-text:last', element).text()
          .split('/')[0]) || price,
        img: (Insider.dom('[class*=-image]', element).prop('src') || '').split('?')[0],
        url: (Insider.dom('[class*=link]', element).prop('href') || '').split('?')[0],
        /* SRTR-23908 START */
        cats: (((Insider.utils.getDataFromIO('basket', 'line_items', [])[key] || {}).product || {})
            .taxonomy || []).filter(Boolean),
        quantity,
        /* SRTR-23908 END */
        time: Insider.dateHelper.now()
    });

});

/* OPT-159700 START */
const transactions = [];

(Insider.utils.getDataFromIO('transaction', 'line_items', [])).forEach((item) => {
    const { quantity, product } = item;

    transactions.push({
        id: product?.id,
        name: encodeURIComponent(product?.name ?? ''),
        price: product?.unit_sale_price ?? product?.unit_price,
        originalPrice: product?.unit_price ?? product?.unit_sale_price,
        img: product?.product_image_url ?? '',
        url: product?.url ?? '',
        cats: product?.taxonomy ?? [],
        quantity: Number(quantity) ?? 0,
        time: Insider.dateHelper.now()
    });
});

const purchasedProducts = Insider.storageAccessor.paidProducts();

paidProducts = Insider.fns.isEmptyArray(purchasedProducts) ? transactions : purchasedProducts;

if (transactions.length > 0 && Insider.fns.isEmptyArray(purchasedProducts)) {
    Insider.storage.localStorage.set({
        name: 'paid-products',
        value: transactions,
        expires: Insider.dateHelper.addMinutes(30)
    });
}

return Insider.systemRules.call('isOnCartPage') ? mergeDuplicateProducts(paidProducts) : paidProducts;
/* OPT-159700 END */