/* OPT-151398 START */
((self) => {
    'use strict';

    const builderId = 550;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const hideClass =  `ins-hide-star-area-${ variationId }`;

    const selectors = {
        addCommentArea: '.fl.add-comment',
        starArea: '.fl.ultStar',
    };

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.buildCSS();
                self.addClass();
            }

            return true;
        }
    };

    self.reset = () => {
        const { starArea, addCommentArea } = selectors;

        Insider.dom(`${ starArea }, ${ addCommentArea }`).removeClass(hideClass);
    };

    self.buildCSS = () => {
        const customStyle =
    `.${ hideClass } {
        display: none;
      }`;

        Insider.dom('<style>').addClass(hideClass).html(customStyle).appendTo('head');
    };

    self.addClass = () => {
        const { starArea, addCommentArea } = selectors;
        const productsToHide = (product) => product.innerText === '(0)' || product.innerText === '(0 Değerlendirme)';

        if (Insider.fns.has(Insider.dom(`${ starArea }:first`).text(), '0 Değerlendirme')) {
            Insider.dom(addCommentArea).addClass(hideClass);
        }

        Insider.dom(starArea).filter(productsToHide).addClass(hideClass);
    };

    return self.init();
})({});
/* OPT-151398 END */
