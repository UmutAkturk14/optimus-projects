(function anonymous(
) {
    return Insider.utils.getDataFromIO('basket', 'currency') || Insider.utils.getDataFromIO('product', 'currency') || Insider.utils.getDataFromIO('transaction', 'currency') || Insider.currencyService.to;
});
