/* OPT-153128 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 36 : 37;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const imageURL = isDesktop ?
        'https://image.useinsider.com/easycl/defaultImageLibrary/Easy%20Main%20Slider-1709608211.png' : 'https://image.useinsider.com/easycl/defaultImageLibrary/Easy%20Main%20Slider%20Mobile-1709608463.png';
    const urlHasParameter = Insider.fns.hasParameter('qa') ? 'qa' : '';
    const redirectURL = 'https://www.easy.cl/2594?map=productClusterIds';

    const classes = {
        goal: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
        hideBanner: `ins-hide-banner-${ variationId }`,
        bannerStyle: `ins-banner-style-${ variationId }`,
        appendedBanner: `ins-appended-banner-${ variationId }`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        resetBanner: `.ins-reset-banner-${ variationId }`,
        clickWrapper: '.easycl-slider-layout-0-x-imageElementLink.vtex-store-components-3-x-imageElementLink',
        bannerElement:
      `.vtex-flex-layout-0-x-flexRow--sliderDesktop
      .easycl${ urlHasParameter }-slider-layout-0-x-slide[data-index="@index"]
      .easycl${ urlHasParameter }-slider-layout-0-x-imageElement,

      .vtex-flex-layout-0-x-flexRow--sliderMobile
      .easycl${ urlHasParameter }-slider-layout-0-x-slide[data-index="@index"]
      .easycl${ urlHasParameter }-slider-layout-0-x-imageElement`
    });

    const banners = [
        { index: 2, image: imageURL },
        { index: 3, image: imageURL },
        { index: 4, image: imageURL },
        { index: 5, image: imageURL },
        { index: 6, image: imageURL },
        { index: 7, image: imageURL },
        { index: 8, image: imageURL },
        { index: 9, image: imageURL },
        { index: 10, image: imageURL }
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
        const { hideBanner, bannerStyle, style, appendedBanner } = classes;

        Insider.dom(`${ hideBanner }, ${ bannerStyle }`).removeClass(`${ hideBanner } ${ bannerStyle }`);
        Insider.dom(style).remove();
        Insider.dom(appendedBanner).remove();
    };

    self.buildCSS = () => {
        const { hideBanner, bannerStyle } = selectors;

        const customStyle =
    `${ hideBanner } {
      display: none;
    }
    ${ bannerStyle } {
      max-height:1000px;
      width: 100%;
    }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.changeBanners = (index = 0) => {
        if (index >= banners.length) {
            return;
        }

        const { resetBanner, bannerStyle } = selectors;
        const { hideBanner, goal, appendedBanner } = classes;
        const banner = banners[index];
        const bannerElement = selectors.bannerElement.replace(/@index/g, banner.index);

        Insider.fns.onElementLoaded(bannerElement, () => {
            if (Insider.dom(bannerElement).attr('src') !== banner.image) {
                Insider.dom(bannerElement).accessNodes((node) => {
                    const $currentBanner = Insider.dom(node);
                    const bannerHTML = `<img class="${ appendedBanner }" src="${ banner.image }">`;

                    $currentBanner.siblings(resetBanner).remove();
                    $currentBanner.addClass(hideBanner);
                    $currentBanner.after(bannerHTML).next(`img${ resetBanner }`).addClass(bannerStyle);
                    $currentBanner.closest('a').attr('href', redirectURL).addClass(goal);
                });
            }

            self.changeBanners(index + 1);
        }).listen();
    };

    self.setEvents = () => {
        let isTouchMove = false;

        const setRedirection = (event) => {
            event.preventDefault();

            setTimeout(() => {
                window.location.href = event.currentTarget.href;
            }, 1000);
        };

        Insider.eventManager.once(`touchstart.check:touchstart:${ variationId }`, selectors.clickWrapper, () => {
            isTouchMove = false;
        });

        Insider.eventManager.once(`touchmove.check:touchmove:${ variationId }`, selectors.clickWrapper, () => {
            isTouchMove = true;
        });

        if (isDesktop) {
            Insider.eventManager.once(`click.set:redirection:${ variationId }`, selectors.clickWrapper, setRedirection);
        } else {
            Insider.eventManager.once(`touchend.set:redirection:${ variationId }`, selectors.clickWrapper, (event) => {
                if (!isTouchMove) {
                    setRedirection(event);

                    Insider.campaign.custom.storeJoinLog(variationId);
                }
            });
        }
    };

    return self.init();
})({});
/* OPT-153128 END */
