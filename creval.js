/* OPT-160393 START */
(() => {
    'use strict';

    let userPurchased = 0;

    Insider.storageAccessor.userPurchased().forEach((eachProduct) => {
        const { name, quantity, price } = eachProduct;

        if (Insider.fns.has(name, 'Figurine')) {
            userPurchased += quantity * price;
        }
    });

    return 500 <= userPurchased && userPurchased < 1000;
})({});
/* OPT-160393 END */
