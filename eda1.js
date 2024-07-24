hooks: {
    generateTemplate: {
        self: function (endpoint) {
            this.manageTemplateVisibility('hide');
            Insider.request.get({
                url: endpoint,
                success: function (response) {
                    console.log('replaced getProductsToBuildTemplate');
                    if (this.insufficientProductCount(response)) {
                        endpoint = 'https://recommendation.api.useinsider.com/10000181/tr_TR/most/purchased/product?details=true&size=10&country=KG&city=Bishkek&currency=TRY&';
                        this.generateTemplate(endpoint); //if you want to call not hooked function you can directly call it like this way.
                        return false;
                    }
                    this.manageTemplateVisibility('show');
                    this.global.proxy.call(this, 'predictiveFeed', 'buildTemplateForProducts', response.data);
                }.bind(this),
                parse: true,
            });
        }
    }
}
