console.log({
    isOnMainPage: Insider.systemRules.call('isOnMainPage'),
    isOnProductPage: Insider.systemRules.call('isOnProductPage'),
    isOnCategoryPage: Insider.systemRules.call('isOnCategoryPage'),
    isOnCartPage: Insider.systemRules.call('isOnCartPage'),
    isOnCouponPage: Insider.systemRules.call('isOnCouponPage'),
    isOnAfterPaymentPage: Insider.systemRules.call('isOnAfterPaymentPage'),
    isUserLoggedIn: Insider.systemRules.call('isUserLoggedIn'),
    isOnRegSuccessPage: Insider.systemRules.call('isOnRegSuccessPage'),
    getCurrency: Insider.systemRules.call('getCurrency'),
    getCurrentProduct: Insider.systemRules.call('getCurrentProduct'),
    getLocale: Insider.systemRules.call('getLocale'),
    getLang: Insider.systemRules.call('getLang')
});