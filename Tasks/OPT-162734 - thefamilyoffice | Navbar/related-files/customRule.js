/* ZEN-169115 START */
(function (self) {
    'use strict';

    const builderId = 578;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isControlGroup = Insider.campaign.isControlGroup(variationId);

    const classes = {
        header: `ins-custom-item-${ variationId }-1`,
    };

    const selectors = Insider.fns.keys(classes).reduce(function (createdSelector, key) {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        headerMenuSelector: '.chakra-accordion__item:first',
        item: '.chakra-accordion__item:eq(1)'
    });

    self.init = () => {
        if (variationId) {
            if (!isControlGroup) {
                Insider.fns.onElementLoaded(selectors.headerMenuSelector, () => {
                    setTimeout(() => {
                        self.reset();
                        self.addClass();
                    }, 100);
                }).listen();
            }

            self.sendCustomGoal();
        }
    };

    self.reset = () => {
        const { headerMenuSelector } = selectors;
        const { header } = classes;

        Insider.dom(headerMenuSelector).removeClass(`${ header }`);
    };

    self.addClass = () => {
        const { headerMenuSelector, item } = selectors;
        const { header } = classes;

        Insider.dom(item).after(Insider.dom(headerMenuSelector).addClass(`${ header }`));
    };

    self.sendCustomGoal = () => {
        const { headerMenuSelector } = selectors;

        Insider.eventManager.once(`click.hamberger:menu:${ variationId }`, headerMenuSelector, () => {
            Insider.utils.opt.sendCustomGoal(builderId, 49, true);
        });
    };

    self.init();
})({});

true;
/* ZEN-169115 END */
