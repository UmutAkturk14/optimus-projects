/* SRTR-23462 START */
let totalPaid = Insider.storageAccessor.totalCartAmount();

if (Insider.systemRules.call('isOnCartPage')) {
    totalPaid = Insider.utils.opt.parsePrice(Insider.dom('[data-interaction-id=monthly-totals-price-' +
                                                       'including-discount]:first').text(), ',') ||
    Insider.utils.opt.parsePrice(Insider.dom('[data-interaction-id=monthly-totals-' +
                                             'price-excluding-discount]:first').text(), ',');

    if (totalPaid <= 0) {
        totalPaid = Insider.systemRules.call('getPaidProducts').reduce((sum, product) => parseFloat((product.price * product.quantity + sum).toFixed(2)), 0);
    }
}

return totalPaid;
/* SRTR-23462 END */
