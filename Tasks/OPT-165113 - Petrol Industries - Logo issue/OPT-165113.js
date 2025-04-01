/* OPT-165113 START */
((self) => {
    'use strict';

    const builderId = 192;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const logoText = 'Since 1989';
    const redirectionUrl = 'https://petrolindustries.com/';

    const classes = {
        badge: `ins-badge-${ variationId }`,
        join: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
        modifiedLogo: `ins-modified-logo-${ variationId }`,
        addedText: `ins-custom-added-text-${ variationId }`,
        modifiedNavbar: `ins-modified-navbar-${ variationId }`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        partnerLogo: 'a[href="/"]:first',
        partnerNavbar: '#shopify-section-header > div > div:first'
    });

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.buildCSS();
                self.buildHTML();
                self.addClass();
            }

            return true;
        }
    };

    self.reset = () => {
        const { style, addedText, modifiedLogo: modifiedLogoSelector,
            modifiedNavbar: ModifiedNavbarSelector } = selectors;
        const { modifiedLogo, modifiedNavbar, join } = classes;

        Insider.dom(`${ style }, ${ addedText }`).remove();
        Insider.dom(modifiedLogo).attr('href', '/');
        Insider.dom(modifiedLogoSelector).removeClass(modifiedLogo);
        Insider.dom(ModifiedNavbarSelector).removeClass(join).removeClass(modifiedNavbar);
    };

    self.buildCSS = () => {
        const { addedText, modifiedLogo, modifiedNavbar } = selectors;

        const customStyle =
        `${ addedText } {
            position: absolute;
            width: 80%;
            text-align: center;
        }
        ${ modifiedLogo } {
            position: relative;
        }
        ${ modifiedNavbar } {
            height: 9vh !important;
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const { partnerLogo, modifiedLogo } = selectors;
        const { join, addedText } = classes;

        const html =
        `<p class="${ addedText } ${ join }">
            ${ logoText }
        </p>`;

        Insider.dom(partnerLogo).append(html);
        Insider.dom(modifiedLogo).attr('href', redirectionUrl);
    };

    self.addClass = () => {
        const { partnerLogo, partnerNavbar, modifiedNavbar: ModifiedNavbarSelector } = selectors;
        const { modifiedLogo, modifiedNavbar, join } = classes;

        Insider.dom(partnerLogo).addClass(modifiedLogo);
        Insider.dom(partnerNavbar).addClass(modifiedNavbar);
        Insider.dom(ModifiedNavbarSelector).addClass(join);
    };

    return self.init();
})({});
/* OPT-165113 END */