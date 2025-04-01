/* OPT-155640 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 1699 : 1700;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const classes = {
        outOfStock: `ins-out-of-stock-${ variationId }`,
        cloneElement: `ins-clone-element-${ variationId }`,
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        resultDataWrapper: `.ins-preview-wrapper-${ variationId } .ins-eureka-main-wrapper #search-result-${ isDesktop ?
            '1605095392' :
            '1605095322' } ul`
    });

    self.setMutationObserver = () => {
        if (variationId) {
            const { cloneElement, resultDataWrapper } = selectors;

            Insider.__external.SearchListObserver155640 = new MutationObserver(() => {
                Insider.dom(cloneElement).remove();

                setTimeout(self.createOutOfStockElement, 300);
            });

            Insider.__external.SearchListObserver155640.disconnect();

            Insider.fns.onElementLoaded(resultDataWrapper, ($element) => {
                Insider.__external.SearchListObserver155640.observe($element.nodes[0], {
                    childList: true
                });
            }).listen();
        }
    };

    self.createOutOfStockElement = () => {
        const { cloneElement } = classes;
        const { resultDataWrapper, outOfStock } = selectors;

        const $productListElement = Insider.dom(resultDataWrapper);
        const $cloneProductListElement = $productListElement.clone().addClass(cloneElement);
        const $outOfStockProducts = $cloneProductListElement.find(outOfStock);

        $cloneProductListElement.css('display', 'none', 'important');
        $cloneProductListElement.find(`li:not(${ outOfStock })`).css('display', 'none', 'important');

        $productListElement.after($cloneProductListElement);

        setTimeout(() => {
            if ($outOfStockProducts.exists()) {
                $outOfStockProducts.css('display', 'flex', 'important');
                $cloneProductListElement.css('display', 'flex', 'important');
            }
        }, 150);
    };

    self.setMutationObserver();
})({});

true;
/* OPT-155640 END */
