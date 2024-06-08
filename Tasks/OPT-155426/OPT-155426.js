/* OPT-155426 START */
((self) => {
    'use strict';

    const builderId = 996;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const classes = {
        scrollable: `ins-scrollable-${ variationId }`,
        style: `ins-custom-style-${ variationId }`,
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        breadcrumbParent: 'gb-breadcrumb',
        breadcrumbArea: '#breadcrumb-area'
    });

    self.init = () => {
        if (variationId) {
            Insider.fns.onElementLoaded(selectors.breadcrumbArea, () => {
                if (!Insider.campaign.isControlGroup(variationId)) {
                    self.reset();
                    self.buildCSS();
                    self.addClass();
                }

                self.setEvents();

                Insider.campaign.custom.show(variationId);
            }).listen();
        }
    };

    self.reset = () => {
        const { style, scrollable } = selectors;
        const { scrollable: scrollableClass } = classes;

        Insider.dom(style).remove();
        Insider.dom(scrollable).removeClass(scrollableClass);
    };

    self.buildCSS = () => {
        const { scrollable, breadcrumbArea } = selectors;

        const customStyle =
        `${ scrollable } {
          overflow-x: scroll;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        ${ scrollable }::-webkit-scrollbar {
          display: none;
        }
        ${ scrollable } ${ breadcrumbArea } {
          flex-wrap: unset !important;
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.addClass = () => {
        const { breadcrumbParent } = selectors;
        const { scrollable } = classes;

        Insider.dom(breadcrumbParent).addClass(scrollable);
    };

    self.setEvents = () => {
        const { breadcrumbParent } = selectors;

        Insider.eventManager.once(`touchend.set:join:goal:${ variationId }`, breadcrumbParent, () => {
            if (!Insider.campaign.getCampaignStorage(variationId)?.joined) {
                Insider.campaign.custom.storeJoinLog(variationId);

                Insider.campaign.updateCampaignCookie({
                    joined: true
                }, Insider.campaign.custom.addCampaignIdPrefix(variationId));
            }
        });
    };

    self.init();
})({});
/* OPT-155426 END */
