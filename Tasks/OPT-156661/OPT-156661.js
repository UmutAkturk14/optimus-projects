/* OPT-156661 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 40 : 41;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const storageName = `ins-visited-cart-page-${ variationId }`;
    const shouldShowCampaign = Insider.storage.localStorage.get(storageName)
        && !Insider.systemRules.call('isOnCartPage');

    const classes = {
        join: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
        animatedElement: `ins-shake-element-${ variationId }`,
        animate: `ins-shake-${ variationId }`,
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        cartCountBubble: isDesktop ? '.sc-iXRnGQ.dCrDUK .sc-dlyeST.hHudOq' : '.sc-fzmOIZ .sc-dlyeST.hHudOq',
        cartButton: isDesktop ? '.sc-iXRnGQ.dCrDUK' : '.sc-fzmOIZ.bBAgDJ',
        cartAsideElement: '.sc-jMAIzZ.fOcerO'
    });

    self.init = () => {
        if (variationId) {
            clearInterval(Insider.__external.BubbleAnimationInterval156661);

            self.setStorage();

            if (shouldShowCampaign) {
                if (!Insider.campaign.isControlGroup(variationId)) {
                    self.reset();
                    self.buildCSS();
                    self.setAnimation();
                }

                if (Insider.dom(selectors.cartCountBubble).exists()) {
                    Insider.campaign.custom.show(variationId);
                }

                self.sendGoal();
            }
        }
    };

    self.setStorage = () => {
        if (Insider.systemRules.call('isOnCartPage') && Insider.systemRules.call('getCartCount') > 0) {
            Insider.storage.localStorage.set({
                name: storageName,
                value: true,
            });
        }
    };

    self.reset = () => {
        const { join, animatedElement } = classes;
        const { style, join: joinSelector, animatedElement: animatedElementSelector } = selectors;

        Insider.dom(style).remove();
        Insider.dom(joinSelector).removeClass(join);
        Insider.dom(animatedElementSelector).removeClass(animatedElement);
    };

    self.buildCSS = () => {
        const { animate } = classes;
        const { animatedElement } = selectors;

        const customStyle =
        `@keyframes ${ animate } {
            0% { transform: translateY(0); }
            25% { transform: translateY(-5px); }
            50% { transform: translateY(5px); }
            75% { transform: translateY(-5px); }
            100% { transform: translateY(0); }
        }
        ${ animatedElement } {
            animation: ${ animate } 0.5s 2;
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.setAnimation = () => {
        const { cartCountBubble, cartButton } = selectors;
        const { animatedElement, join } = classes;

        if (Insider.dom(cartCountBubble).exists()) {
            Insider.__external.BubbleAnimationInterval156661 = setInterval(() => {
                Insider.dom(cartCountBubble).toggleClass(animatedElement);
            }, 2000);

            Insider.dom(cartButton).addClass(join);
        }
    };

    self.sendGoal = () => {
        const { cartAsideElement } = selectors;

        if (isDesktop) {
            Insider.fns.onElementLoaded(cartAsideElement, () => {
                Insider.campaign.custom.storeJoinLog(variationId);

                Insider.campaign.updateCampaignCookie({
                    joined: true
                }, Insider.campaign.custom.addCampaignIdPrefix(variationId));
            }).listen();
        }
    };

    return self.init();
})({});
/* OPT-156661 END */
