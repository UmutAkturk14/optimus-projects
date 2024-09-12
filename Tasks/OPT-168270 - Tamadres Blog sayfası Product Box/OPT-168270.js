hooks: {
    fillGeneralProductContent: {
        self: function (item) {
            this.global.itemContainer.find('.ins-product-box')
                .attr('href', this.global.isOnApi ? item.url : 'javascript:void(0);');
            this.global.itemContainer.find('.ins-go-to-product-button')
                .attr('data-product-link', this.global.isOnApi ? item.url : 'javascript:void(0)');
            this.global.itemContainer.find('.ins-image-box').css('background-image', 'url("' + item.image_url + '")');
            this.global.itemContainer.find('.ins-product-name').text('Dynamic Name');
            this.global.itemContainer.find('.ins-add-to-cart-wrapper').attr('ins-product-id', item.item_id);
        },
        after: function (item) {
            this.global.itemContainer.find('.ins-product-name').text('Dyna ' + item.name);
        }
    }
}