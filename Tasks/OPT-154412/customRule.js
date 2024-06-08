/* ZEN-131140 START */
(function (self) {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 2565 : 2566; /* ZEN-140503 */
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isControlGroup = Insider.campaign.isControlGroup(variationId);
    const isVariationDefined = !Insider.fns.isUndefined(variationId);

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        goal: `sp-custom-${ variationId }-1`,
    };

    const selectors = Object.keys(classes).reduce(function (createdSelector, key) {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {});

    /* ZEN-140503 START */
    const config = {
        products: [{
            index: 5,
            image: isDesktop ? 'https://email-static.useinsider.com/f940abcdc21d4566ac97b97fb4e8650f/lib/pluginId_f940abcdc21d4566ac97b97fb4e8650f_ombre_images/001_661x881_wygodnep%C5%82atnosci.jpg' :
                'https://email-static.useinsider.com/f940abcdc21d4566ac97b97fb4e8650f/lib/pluginId_f940abcdc21d4566ac97b97fb4e8650f_ombre_images/001_281x375_wygodnep%C5%82atnosci.jpg',
            link: 'https://ombre.pl/pol-payments.html'
        },
        {
            index: 16,
            image: isDesktop ? 'https://email-static.useinsider.com/f940abcdc21d4566ac97b97fb4e8650f/lib/pluginId_f940abcdc21d4566ac97b97fb4e8650f_ombre_images/003_661x881_elegancja_na_wyciagniecie_reki.jpg' :
                'https://email-static.useinsider.com/f940abcdc21d4566ac97b97fb4e8650f/lib/pluginId_f940abcdc21d4566ac97b97fb4e8650f_ombre_images/003_281x375_elegancja_na_wyciagniecie_reki.jpg',
            link: 'https://ombre.pl/PRE-SPRING-ccms-pol-594.html'
        },
        {
            index: 23,
            image: isDesktop ? 'https://email-static.useinsider.com/f940abcdc21d4566ac97b97fb4e8650f/lib/pluginId_f940abcdc21d4566ac97b97fb4e8650f_ombre_images/002_661x881_znajdz_swoj_idealny_rozmiar.jpg' :
                'https://email-static.useinsider.com/f940abcdc21d4566ac97b97fb4e8650f/lib/pluginId_f940abcdc21d4566ac97b97fb4e8650f_ombre_images/002_281x375_znajdz_swoj_idealny_rozmiar.jpg',
            link: 'https://ombre.pl/Jak-dobrac-rozmiar-cterms-pol-76.html'
        },
        {
            index: 27,
            image: isDesktop ? 'https://email-static.useinsider.com/f940abcdc21d4566ac97b97fb4e8650f/lib/pluginId_f940abcdc21d4566ac97b97fb4e8650f_ombre_images/004_661x881_special_offer_rabaty_do_70.jpg' :
                'https://email-static.useinsider.com/f940abcdc21d4566ac97b97fb4e8650f/lib/pluginId_f940abcdc21d4566ac97b97fb4e8650f_ombre_images/004_281x375_special_offer_rabaty_do_70.jpg',
            link: 'https://ombre.pl/pol_m_Wyprzedaz-6250.html'
        }]
    };
    /* ZEN-140503 END */

    self.init = function () {
        Insider.fns.onElementLoaded('.product', function () {
            if (!isControlGroup && isVariationDefined) {
                self.reset();
                self.buildCSS();
                self.buildHTML();
            }
        }).listen();
    };

    self.reset = function () {
        Insider.dom(`${ selectors.style }, ${ selectors.wrapper }`).remove();
    };

    self.buildCSS = function () {
        const customStyle =
          `${ selectors.wrapper } {` +
          'background: 0;' +
          'padding: 1.5rem 2.5px;' +
          `}${
              selectors.container } {` +
          'display: flex;' +
          '}';

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    /* ZEN-140503 START */
    self.buildHTML = function () {
        config.products.forEach(function (product) {
            const outerHTML =
          `<div class="${ classes.wrapper } product col-6 col-sm-4 col-xl-3 pt-3 pb-5 pb-md-3 mb-3">` +
              `<a href="${ product.link }" class="${ classes.goal }">` +
                  `<img src="${ product.image }">` +
              '</a>' +
          '</div>';

            Insider.dom(`.product:eq(${ product.index })`).after(outerHTML);
        });
    };
    /* ZEN-140503 END */

    self.init();
})({});

true;
/* ZEN-131140 END */
