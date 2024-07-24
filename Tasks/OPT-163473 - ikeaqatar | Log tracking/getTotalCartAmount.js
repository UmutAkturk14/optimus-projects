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

let total = parsePrice(Insider.dom('.price-layout #txtNormaltotalBottom.shoppingListTotalPrice:first')
    .text());

if (total === 0) {
    total = Insider.systemRules.call('getPaidProducts').reduce(function (sum, product) {
        return parseFloat((product.price * product.quantity + sum).toFixed(2));
    }, 0);
}

/* OPT-150356 START */
const isTransactionEmpty = Insider.fns.isEmptyArray(Insider.utils.getDataFromIO('transaction', 'line_items', []));
const totalAmount = isTransactionEmpty
    ? Insider.storageAccessor.totalCartAmount()
    : Insider.utils.getDataFromIO('transaction', 'total', 0)
          - Number(Insider.utils.getDataFromIO('transaction', 'shipping_cost', '0'));

if (!isTransactionEmpty) {
    Insider.storage.localStorage.set({
        name: 'total-cart-amount',
        value: totalAmount
    });
}

return Insider.systemRules.call('isOnCartPage') ? total : totalAmount;
/* OPT-150356 END */
