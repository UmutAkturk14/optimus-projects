/* OPT-152571 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 483 : 484;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const classes = {
        wrapper: 'pdp-action-wrapper',
        storeName: 'store-name',
        clickAndCollect: 'click-and-collect'
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        selectStoreButton: '#wrap-button-1503346604',
        selectStoreWrapper: '.pdp-store-select-wrapper',
        sideMenuContainer: '.ins-side-menu-container',
        partnerButton: '.select-store'
    });

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId) && isPageEligible()) {
                self.setEvents();

                return true;
            }
        }
    };

    const isPageEligible = () => {
        const { storeName, clickAndCollect } = classes;

        const isWrapperPresent = Insider.dom(selectors.wrapper).length > 0;
        const dataLayerAttribute = dataLayer.filter((element) => element[storeName])[0][storeName];
        const eligible = Insider.fns.has([null, ''], dataLayerAttribute[clickAndCollect]);

        return isWrapperPresent && eligible;
    };

    self.setEvents = () => {
        const { selectStoreButton, selectStoreWrapper, sideMenuContainer, partnerButton } = selectors;

        Insider.eventManager.once(`click.select:store:button:popup:${ variationId }`, selectStoreButton, () => {
            Insider.dom(`${ selectStoreWrapper } ${ partnerButton }`).click();
        });

        Insider.fns.onElementLoaded(selectors.wrapper, () => {
            Insider.campaign.info.show(variationId);
        }).listen();

        const sendGoals = () => {
            Insider.eventManager.once(`click.send:side:bar:goal:${ variationId }`, sideMenuContainer, () => {
                Insider.utils.opt.sendCustomGoal(builderId, 102, true);
            });

            Insider.eventManager.once(`click.send:button:click:goal:${ variationId }`, selectStoreButton, () => {
                Insider.utils.opt.sendCustomGoal(builderId, 104, true);
            });
        };

        sendGoals();
    };

    return self.init();
})({});
/* OPT-152571 END */
