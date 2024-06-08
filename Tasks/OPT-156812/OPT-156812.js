/* OPT-156812 START */
fillGeneralProductContent: {
  after(product) {
      const { originalPrice, discountPrice, dynamicBadge } = templateConfig.selectors;
      const { hide, oldPrice, precision, currencySymbol: currencyClass, strikeThrough,
          priceLabel: priceLabelClass } = templateConfig.classes;
      const { discount, omnibus_price, original_price, price } = product;

      const $itemContainer = this.global.itemContainer;
      const $originalPrice = $itemContainer.find(originalPrice);
      const $discountPrice = $itemContainer.find(discountPrice);

      const basePrice = product.original_price[Insider.systemRules.call('getCurrency')];
      const consultantPrice = product.product_attributes.consultant_price;
      const pcPerksPrice = product.product_attributes.pc_perks_price;

      const priceByCustomerType = {
          'Preferred Customer': pcPerksPrice,
          'Consultant': consultantPrice
      };

      $itemContainer.find('.ins-product-price').text(`$${ priceByCustomerType[insider_object.user.custom.customer_type] ?? basePrice }`);

      debugger;

  }
}
/* OPT-156812 END */

/* OPT-156812 START */
fillGeneralProductContent: {
  after(product) {
      const { originalPrice, discountPrice, dynamicBadge } = templateConfig.selectors;
      const { hide, oldPrice, precision, currencySymbol: currencyClass, strikeThrough,
          priceLabel: priceLabelClass } = templateConfig.classes;
      const { discount, omnibus_price, original_price, price } = product;

      const $itemContainer = this.global.itemContainer;
      const $originalPrice = $itemContainer.find(originalPrice);
      const $discountPrice = $itemContainer.find(discountPrice);
      const consultantPrice = product.product_attributes.consultant_price ?? product.price[Insider.systemRules.call('getCurrency')];

      $itemContainer.find('.ins-product-price').text.replace(/\d+(\.\d+)?/, consultantPrice);
  }
}
/* OPT-156812 END */
