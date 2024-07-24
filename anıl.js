fillGeneralProductContent: {
  after: function (item) {
      var shadeButtonSelector = '.ins-shade-button';
      const memberPrice = item?.product_attributes?.member_price ?? ''; /* OPT-155246 */

      this.global.itemContainer.find('.ins-rating-on')
          .css('width', ((item.product_attributes.star_rating / 5) * 100 || 0) + '%');
      this.global.itemContainer.find('.ins-promotion-text')
          .text(item.product_attributes.promotion_text || '');
      this.global.itemContainer.find('.ins-review-count')
          .text('(' + (item.product_attributes.review_count || 0) + ')');
      this.global.itemContainer.find('.ins-promotion-wrapper, .ins-rating, .review-count-wrapper')
          .attr('href', item.url);
      this.global.itemContainer.find('.ins-member-price-wrapper').text(memberPrice); /* OPT-155246 */

      if (Number(item.product_attributes.color_option_count) > 0) {
          this.global.itemContainer.find(shadeButtonSelector)
              .removeClass('ins-hide');
          this.global.itemContainer.find(shadeButtonSelector + ' a')
              .text((item.product_attributes.color_option_count || 0) + ' shades');
          this.global.itemContainer.find(shadeButtonSelector + ' a')
              .attr('href', item.url);
          this.global.itemContainer.find('.ins-review-wrapper')
              .before(this.global.itemContainer.find(shadeButtonSelector).parent());/* OPT-110316 */
      } else {
          this.global.itemContainer.find(shadeButtonSelector)
              .addClass('ins-hide');
          this.global.itemContainer.find('.ins-promotion-wrapper')
              .after(this.global.itemContainer.find(shadeButtonSelector).parent()); /* OPT-110316 */
      }

      if (item.product_attributes.is_rrp_price) {
          this.global.itemContainer.find('.ins-price-prefix').text('RRP');
      } else {
          this.global.itemContainer.find('.ins-price-prefix').text('was');
      }

      if (item.product_attributes.is_restricted_country) {
          this.global.itemContainer.find('.add-to-cart-text')
              .text('Not for sale in selected Country');
          this.global.itemContainer.find('.ins-add-product-to-cart-button, .ins-add-to-cart-wrapper')
              .addClass('ins_restricted_country');
      } else {
          this.global.itemContainer.find('.add-to-cart-text')
              .text('Add to basket');
          this.global.itemContainer.find('.ins-add-product-to-cart-button, .ins-add-to-cart-wrapper')
              .removeClass('ins_restricted_country');
      }
  }
}
