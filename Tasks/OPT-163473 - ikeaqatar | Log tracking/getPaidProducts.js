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

const paidProducts = [];

Insider.dom('[class*=CartList_cartList] [class*=CartItem_cartItemWrapper]')
    .accessNodes(function (element, key) {
        /* SRTR-23911 START */
        const quantity = parseInt(Insider.dom('.skapa-wrapper-prefix-quantity-stepper__input', element).val()) ||
      1;
        const price = parseFloat((parsePrice(Insider.dom('.skapa-wrapper-prefix-price--fixed-size span:first',
            element).text()) / quantity).toFixed(2)) || 0;
        /* SRTR-23911 END */

        price > 0 && paidProducts.push({
            id: (Insider.dom('div', element).attr('product-id') || '').split('_').pop().toLowerCase(),
            name: encodeURIComponent(Insider.dom('[class*=module__name] a:first', element).text().trim()),
            price,
            originalPrice: parseFloat((parsePrice(Insider.dom('[class*=skapa-wrapper-prefix-price-module__' + /* SRTR-24571 */
                                                      'comparison-price] span:last', element).text()) / quantity).toFixed(2)) ||
    parsePrice(Insider.dom('.promo-price:first strike:first', element).text()) ||
    parsePrice(Insider.dom('.productPrice:first', element).text()) || price,
            img: (Insider.dom('[class*=-image]', element).prop('src') || '').split('?')[0],
            url: (Insider.dom('[class*=link]', element).prop('href') || '').split('?')[0],
            /* SRTR-23911 START */
            cats: (((Insider.utils.getDataFromIO('basket', 'line_items', [])[key] || {}).product || {})
                .taxonomy || []).filter(Boolean),
            quantity,
            /* SRTR-23911 END */
            time: Insider.dateHelper.now()
        });
    });

return mergeDuplicateProducts(paidProducts);
