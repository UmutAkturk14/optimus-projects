/* ZEN-131140 START */
(function (self) {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 2795 : 2796; /* OPT-154412 */
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isControlGroup = Insider.campaign.isControlGroup(variationId);
    const isVariationDefined = !Insider.fns.isUndefined(variationId);

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        goal: `sp-custom-${ variationId }-1`,
        image: `ins-custom-image-${ variationId }` /* OPT-154412 */
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
            link: 'https://ombre.pl/' /* OPT-154412 */
        },
        {
            index: 16,
            image: isDesktop ? 'https://email-static.useinsider.com/f940abcdc21d4566ac97b97fb4e8650f/lib/pluginId_f940abcdc21d4566ac97b97fb4e8650f_ombre_images/003_661x881_elegancja_na_wyciagniecie_reki.jpg' :
                'https://email-static.useinsider.com/f940abcdc21d4566ac97b97fb4e8650f/lib/pluginId_f940abcdc21d4566ac97b97fb4e8650f_ombre_images/003_281x375_elegancja_na_wyciagniecie_reki.jpg',
            link: 'https://ombre.pl/' /* OPT-154412 */
        },
        {
            index: 23,
            image: isDesktop ? 'https://email-static.useinsider.com/f940abcdc21d4566ac97b97fb4e8650f/lib/pluginId_f940abcdc21d4566ac97b97fb4e8650f_ombre_images/002_661x881_znajdz_swoj_idealny_rozmiar.jpg' :
                'https://email-static.useinsider.com/f940abcdc21d4566ac97b97fb4e8650f/lib/pluginId_f940abcdc21d4566ac97b97fb4e8650f_ombre_images/002_281x375_znajdz_swoj_idealny_rozmiar.jpg',
            link: 'https://ombre.pl/' /* OPT-154412 */
        },
        {
            index: 27,
            image: isDesktop ? 'https://email-static.useinsider.com/f940abcdc21d4566ac97b97fb4e8650f/lib/pluginId_f940abcdc21d4566ac97b97fb4e8650f_ombre_images/004_661x881_special_offer_rabaty_do_70.jpg' :
                'https://email-static.useinsider.com/f940abcdc21d4566ac97b97fb4e8650f/lib/pluginId_f940abcdc21d4566ac97b97fb4e8650f_ombre_images/004_281x375_special_offer_rabaty_do_70.jpg',
            link: 'https://ombre.pl/' /* OPT-154412 */
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
        /* OPT-154412 START */
        const { wrapper, container, image } = selectors;
        const imageHeight = isDesktop ? '100%' : '96%';

        const customStyle =
        `${ wrapper } {
            background: 0;
        }
        ${ container } {
            display: flex;
        }
        ${ image } {
            height: ${ imageHeight };
        }`;
        /* OPT-154412 END */

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    /* ZEN-140503 START */
    self.buildHTML = function () {
        const { wrapper, goal, image: imageClass } = classes; /* OPT-154412 */

        config.products.forEach(function (product) {
            const { image, link, index } = product; /* OPT-154412 */

            const outerHTML =
        `<div class="${ wrapper } product col-6 col-sm-4 col-xl-3 pt-3 pb-5 pb-md-3 mb-3">` +
            `<a href="${ link }" class="${ goal }">` +
                `<img src="${ image }" class="${ imageClass }">` + /* OPT-154412 */
            '</a>' +
        '</div>';

            Insider.dom(`.product:eq(${ index })`).after(outerHTML);
        });
    };
    /* ZEN-140503 END */

    self.init();
})({});

true;
/* ZEN-131140 END */
