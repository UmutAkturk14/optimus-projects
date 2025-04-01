/* OPT-158513 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 775 : 776; /* OPT-158513 */
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const classes = {
        outOfStock: `ins-out-of-stock-${ variationId }`,
        cloneElement: `ins-clone-element-${ variationId }`,
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        /* OPT-158513 START */
        resultDataWrapper: `.ins-preview-wrapper-${ variationId } .ins-eureka-main-wrapper #search-result-${ isDesktop ?
            '1605095398' :
            '1605095322' } ul`
        /* OPT-158513 END */
    });

    self.setMutationObserver = () => {
        if (variationId) {
            const { cloneElement, resultDataWrapper } = selectors;

            Insider.__external.SearchListObserver158513 = new MutationObserver(() => { /* OPT-158513 */
                Insider.dom(cloneElement).remove();

                setTimeout(self.createOutOfStockElement, 300);
            });

            Insider.__external.SearchListObserver158513.disconnect(); /* OPT-158513 */

            Insider.fns.onElementLoaded(resultDataWrapper, ($element) => {
                Insider.__external.SearchListObserver158513.observe($element.nodes[0], { /* OPT-158513 */
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
/* OPT-158513 END */
