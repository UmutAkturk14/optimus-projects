/* OPT-165312 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 580 : 581;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const classes = {
        join: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
        modifiedElement: `ins-modified-element-${ variationId }`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        partnerBanner: '.experience-component.experience-modules-banner',
        linkElement: '.pd-button-wrapper:first a'
    });

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.buildCSS();
                self.addClass();
                self.setEvents();
            }

            return true;
        }
    };

    self.reset = () => {
        const { style, modifiedElement, join } = selectors;
        const { join: joinClass, modifiedElement: modifiedElementClass } = classes;

        Insider.dom(style).remove();
        Insider.dom(join).removeClass(joinClass);
        Insider.dom(modifiedElement).removeClass(modifiedElementClass);

    };

    self.buildCSS = () => {
        const customStyle =
        `${ selectors.modifiedElement } {
            cursor: pointer;
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.addClass = () => {
        const { modifiedElement, join } = classes;
        const { partnerBanner } = selectors;

        Insider.dom(partnerBanner).addClass(modifiedElement).addClass(join);
    };

    self.setEvents = () => {
        const { modifiedElement, linkElement } = selectors;
        const eventName = isDesktop ? 'click' : 'touchend';
        const redirectionLink = Insider.dom(linkElement).attr('href');

        Insider.eventManager.once(`${ eventName }.redirect:next:page:${ variationId }`, modifiedElement, () => {
            if (!Insider.campaign.getCampaignStorage(variationId)?.joined) {
                Insider.campaign.custom.storeJoinLog(variationId);

                Insider.campaign.updateCampaignCookie({
                    joined: true
                }, Insider.campaign.custom.addCampaignIdPrefix(variationId));
            }

            setTimeout(() => {
                window.location.href = redirectionLink;
            }, 500);
        });
    };

    return self.init();
})({});
/* OPT-165312 END */