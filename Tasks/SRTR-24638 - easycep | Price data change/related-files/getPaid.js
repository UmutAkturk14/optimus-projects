function parsePrice(stringPrice) {
    let price = 0;

    stringPrice = (stringPrice || '').toString();
    price = stringPrice.replace(/[^0-9.,]/g, '');

    if (price.slice(-3).indexOf(',') !== -1) {
        price = parseFloat(stringPrice.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
    } else if (price.slice(-3).indexOf('.') !== -1) {
        price = parseFloat(stringPrice.replace(/[^0-9.]/g, '')) || 0;
    } else {
        price = parseFloat(stringPrice.replace(/[^0-9]/g, '')) || 0;
    }

    return price;
}

function capitalizeFirstLetter(text) {
    return text.split(' ').map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

let paidProducts = [];
let price = 0;

if (window.location.host === 'easycep.com') {
    Insider.dom('.cartAndCheckout__item').accessNodes(function (productRow) {
        const quantity = parseInt(Insider.dom('.basket-quantity input', productRow).val()) || 1;
        const url = (Insider.dom('.cartAndCheckout__item--title a', productRow).prop('href') || '').split('?')[0];

        price = parseFloat((parsePrice(Insider.dom('.cartAndCheckout__item--price:first', productRow)
            .text()) / quantity).toFixed(2)) || 0;

        price > 0 && paidProducts.push({
            id: url.split('-').slice(-1)[0],
            name: encodeURIComponent(Insider.dom('.cartAndCheckout__item--title:first', productRow).text()
                .trim()),
            price,
            originalPrice: price,
            img: (Insider.dom('.cartAndCheckout__item--img img', productRow).prop('src') || '').split('?')[0],
            url,
            quantity,
            time: Insider.dateHelper.now()
        });
    });
} else {
    /* OPT-88042 START */
    const categories = [];
    const breadCrumbNodes = Insider.dom('.breadcrumb-item').nodes.reverse();
    const id = (Insider.dom(breadCrumbNodes[1]).text().trim() + Insider.dom(breadCrumbNodes[2]).text().trim())
        .replace(/[^A-Za-z0-9.]/g, '').toLowerCase();

    price = parseFloat(Insider.dom('#checkout_price_total').text().trim().replace(/[^0-9]/g, '')) || 0;

    Insider.dom('.breadcrumb-item').accessNodes(function (node) {
        const $element = Insider.dom(node);

        $element.text() && !$element.hasClass('active') ?
            categories.push(capitalizeFirstLetter($element.text().trim())) :
            categories.pop();
    });

    paidProducts = [{
        id: Insider.utils.generateProductId(id),
        name: encodeURIComponent(Insider.dom('h5.card-title').text().trim()),
        cats: categories,
        price,
        originalPrice: price,
        img: Insider.dom('form .img-fluid').prop('src') || '',
        url: Insider.dom(breadCrumbNodes[1]).find('a').prop('href') || '',
        quantity: 1,
        time: Insider.dateHelper.getTime()
    }];
    /* OPT-88042 END */
}

return paidProducts;
