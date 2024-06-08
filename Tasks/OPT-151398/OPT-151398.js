/* OPT-151398 START */
((self) => {
    'use strict';

    const builderId = 550;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const classes = {
        hide: `ins-hide-star-area-${ variationId }`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        addCommentArea: '.fl.add-comment',
        starArea: '.fl.ultStar',
    });

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
        const { hide } = classes;

        Insider.dom(`${ starArea }, ${ addCommentArea }`).removeClass(hide);
        Insider.dom(`style.${ hide }`).remove();
    };

    self.buildCSS = () => {
        const { hide } = selectors;

        const customStyle =
        `${ hide } {
          display: none;
        }`;

        Insider.dom('<style>').addClass(classes.hide).html(customStyle).appendTo('head');
    };

    self.addClass = () => {
        const { starArea, addCommentArea } = selectors;
        const { hide } = classes;
        const noCommentTexts = ['(0 Değerlendirme)', '(0)', '(0 Değerlendirme)'];

        if (Insider.fns.has(noCommentTexts, Insider.dom(`${ starArea }:first`).text().trim())) {
            Insider.dom(addCommentArea).addClass(hide);
        }

        Insider.dom(starArea).filter((product) => Insider.fns.has(noCommentTexts, product.innerText)).addClass(hide);
    };

    return self.init();
})({});
/* OPT-151398 END */
