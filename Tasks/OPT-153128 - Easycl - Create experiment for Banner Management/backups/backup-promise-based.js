/* OPT-153128 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 36 : 37;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const imageURL = isDesktop ?
        'https://image.useinsider.com/easycl/defaultImageLibrary/Easy%20Main%20Slider-1709608211.png' : 'https://image.useinsider.com/easycl/defaultImageLibrary/Easy%20Main%20Slider%20Mobile-1709608463.png';
    const checkCurrentWebsite = Insider.fns.hasParameter('qa');
    const redirectURL = 'https://www.easy.cl/2594?map=productClusterIds';

    const classes = {
        goal: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
        hideBanner: `ins-hide-banner-${ variationId }`,
        bannerStyle: `ins-banner-style-${ variationId }`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        resetBanner: `.ins-reset-banner-${ variationId }`
    });

    const banners = [
        { index: 2, image: imageURL },
        { index: 3, image: imageURL },
        { index: 4, image: imageURL },
        { index: 5, image: imageURL },
        { index: 6, image: imageURL },
        { index: 7, image: imageURL },
        { index: 8, image: imageURL },
        { index: 9, image: imageURL }
    ];

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.buildCSS();
                self.changeBanners();
                self.setEvents();
            }

            return true;
        }
    };

    self.reset = () => {
        const { hideBanner, bannerStyle, style } = classes;

        Insider.dom(`${ hideBanner }, ${ bannerStyle }`).removeClass(`${ hideBanner } ${ bannerStyle }`);
        Insider.dom(`style.${ style }`);
    };

    self.changeBanners = async (index = 0) => {
        if (index >= banners.length) {
            return;
        }

        const { resetBanner, bannerStyle } = selectors;
        const { hideBanner, goal } = classes;
        const banner = banners[index];
        const bannerElement = checkCurrentWebsite ?
            `.easyclqa-slider-layout-0-x-slide[data-index="${ banner.index }"] .easyclqa-slider-layout-0-x-imageElement` :
            `.easycl-slider-layout-0-x-slide[data-index="${ banner.index }"] .easycl-slider-layout-0-x-imageElement`;

        try {
            await new Promise((resolve, reject) => {
                Insider.fns.onElementLoaded(bannerElement, () => {
                    if (Insider.dom(bannerElement).attr('src') !== banner.image) {
                        Insider.dom(bannerElement).accessNodes((node) => {
                            Insider.dom(node).siblings(resetBanner).remove();
                            Insider.dom(node).addClass(hideBanner);
                            Insider.dom(node).after(`<img class="ins-reset" src="${ banner.image }">`)
                                .next(`img${ resetBanner }`)
                                .addClass(bannerStyle);
                            Insider.dom(node).closest('a').attr('href', redirectURL).addClass(goal);
                        });

                        resolve();
                    } else {
                        resolve();
                    }
                }).listen();
            });
        } catch (error) {
            Insider.logger.log('Error updating banner:', error);
        }

        await self.changeBanners(index + 1);
    };

    self.buildCSS = () => {
        const { hideBanner, bannerStyle } = classes;

        const customStyle =
          `.${ hideBanner } {
            display: none;
          }

          .${ bannerStyle } {
            max-height:1000px;
            width: 100%;
          }`;

        Insider.fns.onElementLoaded('head', () => {
            setTimeout(() => {
                Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
            }, 1000);
        }).listen();
    };

    self.setEvents = () => {
        Insider.eventManager.once(`${ isDesktop ? 'click' : 'touchend' }.prevent:default:redirection:${ variationId }`, '.easycl-slider-layout-0-x-imageElementLink.vtex-store-components-3-x-imageElementLink', (event) => {
            event.preventDefault();

            if (event.currentTarget.href === redirectURL) {
                Insider.campaign.info.storeJoinLog(variationId);
            }

            window.location.href = event.currentTarget.href;
        });
    };

    return self.init();
})({});
/* OPT-153128 END */
