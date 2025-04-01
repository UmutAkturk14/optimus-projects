/* OPT-152571 START */
((self) => {
    'use strict';

    const builderId = Insider.browser.isDesktop() ? 483 : 484;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    /* OPT-153828 START */
    const classes = {
        openedCard: 'ins-opened',
        closedCard: 'ins-closed'
    };

    const selectors = Object.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        previewWrapper: `.ins-preview-wrapper-${ variationId }`,
        centerHeader: '.center-header',
        /* OPT-153828 END */
        /* OPT-152571 START */
        selectStoreButton: '#wrap-button-1503346604',
        sideMenuContainer: '.ins-side-menu-container',
        wrapper: '.pdp-action-wrapper',
        selectStoreInputArea: '#storeSelector'
        /* OPT-152571 END */
    });

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
        const { selectStoreButton, selectStoreInputArea, previewWrapper, centerHeader,
            openedCard: openedCardSelector } = selectors; /* OPT-153828 */
        const { closedCard, openedCard } = classes;

        Insider.eventManager.once(`click.select:store:button:popup:${ variationId }`, selectStoreButton, () => {
            /* OPT-153828 START */
            const offset = Insider.dom(selectStoreInputArea).offset();
            const targetHeight = Insider.dom(centerHeader).outerHeight() + 10;

            Insider.dom(selectStoreInputArea).focus();
            Insider.dom(`${ previewWrapper } ${ openedCardSelector }`).removeClass(openedCard).addClass(closedCard);
            Insider.dom('html, body').scrollTop(offset.top - targetHeight);
            /* OPT-153828 END */
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
