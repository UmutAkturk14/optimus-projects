/* OPT-152571 START */
((self) => {
    'use strict';

    const builderId = Insider.browser.isDesktop() ? 483 : 484;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const selectors = {
        selectStoreButton: '#wrap-button-1503346604',
        selectStoreWrapper: '.pdp-store-select-wrapper',
        sideMenuContainer: '.ins-side-menu-container',
        partnerButton: '.select-store',
        wrapper: '.pdp-action-wrapper'
    };

    self.init = () => {
        if (variationId && self.isPageEligible()) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.setEvents();
                self.sendGoals();
            }

            return true;
        }
    };

    self.isPageEligible = () => {
        const storeName = 'store-name';
        const clickAndCollect = 'click-and-collect';

        const isWrapperPresent = Insider.dom(selectors.wrapper).exists();
        const dataLayerAttribute = dataLayer.find((element) => element?.[storeName])?.[storeName] ?? {};

        const eligible = Insider.fns.has([null, ''], dataLayerAttribute[clickAndCollect]);

        return isWrapperPresent && eligible;
    };

    self.setEvents = () => {
        const { selectStoreButton, selectStoreWrapper, partnerButton } = selectors;

        Insider.eventManager.once(`click.select:store:button:popup:${ variationId }`, selectStoreButton, () => {
            Insider.dom(`${ selectStoreWrapper } ${ partnerButton }`).click();
        });
    };

    self.sendGoals = () => {
        Insider.eventManager.once(`click.send:side:bar:goal:${ variationId }`, selectors.sideMenuContainer, () => {
            Insider.utils.opt.sendCustomGoal(builderId, 102, true);
        });

        Insider.eventManager.once(`click.send:button:click:goal:${ variationId }`, selectors.selectStoreButton, () => {
            Insider.utils.opt.sendCustomGoal(builderId, 104, true);
        });
    };

    return self.init();
})({});
/* OPT-152571 END */
