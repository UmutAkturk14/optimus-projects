self.feed = {
    prepareProducts(data) {
        if (camp.id !== 0) {
            sQuery(selectors.mainWrapper).hide();
        }

        const productHtml = sQuery(selectors.mainWrapper)
            .find(selectors.versusBoxFirstItem)
            .clone()[0].outerHTML;

        sQuery(selectors.mainWrapper).find(selectors.versusBox).remove();

        let addToCartButtonId = 1508331698331;
        const mobileVersusBody = sQuery(selectors.mainWrapper).find(selectors.mobileVersusBody);

        data.forEach(function (item) {
            mobileVersusBody.append(
                self.feed.dynamicReplacement(productHtml, item, self.helpers.getSalePrice(item), addToCartButtonId)
            );

            addToCartButtonId++;
        });
    },
    dynamicReplacement(productHtml, item, salePrice, addToCartButtonId) {
        const itemContainer = sQuery(productHtml);
        /* OPT-160249 START */
        const { productBrand, newBadge } = selectors;
        const hiddenBadgeClass = 'ins-hidden-badge';
        /* OPT-160249 END */

        if (self.helpers.isUrlEncoded(item.url)) {
            item.url = decodeURIComponent(item.url);
        }

        itemContainer.find(selectors.productBox).attr('href', camp.id !== 0 ? item.url : 'javascript:void(0);');
        itemContainer.find(selectors.imageBox).css('background-image', `url("${ item.img }")`);
        itemContainer.find(selectors.productName).text(decodeURIComponent(item.name));
        itemContainer.find(selectors.productPrice).text(formatPrice({
            price: item.notConvertedPrice || item.price || '',
            currency,
            currencySymbol: embeddedCurrencySymbol,
        }));
        itemContainer.find(selectors.productDiscount).text(formatPrice({
            price: item.originalPrice,
            currency,
            currencySymbol: embeddedCurrencySymbol,
        }));
        itemContainer.find(selectors.productDiscountPercentage).text(self.helpers.getDiscountPercentage(item));
        itemContainer.find(selectors.productDiscount)
            .css('display', self.helpers.getOriginalPriceVisibility(item, salePrice));
        itemContainer.find(selectors.addToCartWrapper).attr('ins-product-id', item.id);
        itemContainer.html(itemContainer.html().replace('1508331698331', addToCartButtonId.toString()));
        /* OPT-160249 START */
        itemContainer.find(productBrand).text(item.brand);

        const hasNewBadge = (item.productAttributes || {}).has_new_badge || false;

        if (hasNewBadge) {
            itemContainer.find(newBadge).removeClass(hiddenBadgeClass);
            itemContainer.find(newBadge).text(item.productAttributes.product_badge);
        }
        /* OPT-160249 END */

        self.helpers.checkDiscountPercentage(itemContainer, item);

        return itemContainer[0].outerHTML;
    }
};
