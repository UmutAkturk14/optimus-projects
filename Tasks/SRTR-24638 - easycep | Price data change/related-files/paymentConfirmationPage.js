const ioControl = Insider.utils.getDataFromIO('page', 'type').toLowerCase() === 'confirmation';
let result = ioControl;

/* SRTR-21367 START */
if (ioControl) {
    const productList = [];
    let totalQuantity = 0;
    const transactionData = (window.insider_object || {}).transaction || {};
    const totalAmount = parseFloat(((parseFloat((transactionData.total || 0).toString().replace('.', '')) || 0) -
                                (parseFloat((transactionData.shipping_cost || 0).toString().replace('.', '')) || 0)).toFixed(2)) || 0;
    let alternativeTotal = 0;

    (transactionData.line_items || []).map(function (cartItem) {
        const productObject = cartItem.product || {};
        const price = parseFloat((parseFloat((productObject.unit_sale_price || 0).toString().replace('.', '')) ||
                            0).toFixed(2)) || 0;
        const originalPrice = parseFloat((parseFloat((productObject.unit_price || 0).toString()
            .replace('.', '')) || 0).toFixed(2)) || price;
        const quantity = parseInt(cartItem.quantity) || 1;
        const productName = document.createElement('div');

        productName.innerHTML = (productObject.name || '').trim().replace(/\s+/g, ' ');

        if (price > 0) {
            productList.push({
                id: (productObject.id || '').toString().trim(),
                name: encodeURIComponent(Insider.dom(productName).text().trim()),
                price,
                originalPrice: originalPrice < price ? price : originalPrice,
                img: (productObject.product_image_url || '').split('?')[0],
                url: (productObject.url || '').split('?')[0],
                cats: (cartItem.taxonomy || []).filter(Boolean),
                quantity,
                time: Insider.dateHelper.now()
            });

            totalQuantity += quantity;
            alternativeTotal += quantity * price;
        }
    });

    Insider.utils.cart.storeCartProductStorage({
        totalQuantity,
        productList
    });

    Insider.storage.localStorage.set({
        name: 'paid-products',
        value: productList
    });

    Insider.storage.localStorage.set({
        name: 'total-cart-amount',
        value: totalAmount || parseFloat(alternativeTotal.toFixed(2)) || 0
    });

    setTimeout(function () {
        Insider.eventManager.dispatch('cart:amount:update');
    }, 250);
}
/* SRTR-21367 END */

if (window.location.host === 'easycep.com') {
    result = (ioControl && !(Insider.storage.localStorage.get('ins-after-payment-refresh-control') || false) &&
            window.performance.navigation.type !== 2) || Insider.fns.hasParameter('insTestAfterPayment');
}

return result;
