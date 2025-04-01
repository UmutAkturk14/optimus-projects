/* ZEN-173296 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 578 : 579;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isControlGroup = Insider.campaign.isControlGroup(variationId);
    const isVariationDefined = !Insider.fns.isUndefined(variationId);
    const getLink = Insider.dom('.pd-button-wrapper:first').find('a').attr('href');

    const classes = {
        wrapper: `sp-custom-${ variationId }-1`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        partnerSelector: '.experience-component.experience-modules-banner'
    });

    self.init = () => {
        if (!isControlGroup && isVariationDefined && Insider.systemRules.call('isOnMainPage')) {
            self.reset();
            self.buildHTML();
            self.buildCSS();
            self.setEvents();
        }

        return true;
    };

    self.reset = () => {
        Insider.dom(selectors.partnerSelector).removeClass(classes.wrapper);
    };

    self.buildHTML = () => {
        Insider.dom(selectors.partnerSelector).addClass(classes.wrapper);
    };

    self.buildCSS = () => {
        const { wrapper } = selectors;

        const customStyle =
        `${ wrapper } {
            cursor: pointer;
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.setEvents = () => {
        const eventName = isDesktop ? 'click' : 'touchend';
        const { partnerSelector } = selectors;

        Insider.eventManager.once(`${ eventName }.action:send:nextpage:${ variationId }`, partnerSelector, () => {
            Insider.campaign.info.storeJoinLog(variationId);
            window.location.href = getLink;
        });
    };

    return self.init();
})({});
/* ZEN-173296s END */