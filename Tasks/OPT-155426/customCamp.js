/* OPT-153128 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 47 : 48;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const urlHasParameter = Insider.fns.hasParameter('qa') ? 'qa' : '';

    const config = {
        desktopImageURL: 'https://image.useinsider.com/easycl/defaultImageLibrary/D%20Mascotas-1711173341.png',
        mobileImageURL: 'https://image.useinsider.com/easycl/defaultImageLibrary/M%20Mascotas-1711173349.png',
        redirectURL: 'https://www.easy.cl/2594?map=productClusterIds'
    };

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
        clickWrapper: `.easycl${ urlHasParameter }-slider-layout-0-x-imageElementLink.vtex-store-components-3-x-imageElementLink`,
        slideElement: `.easycl${ urlHasParameter }-slider-layout-0-x-slide`,
        sliderElement: `.easycl${ urlHasParameter }-slider-layout-0-x-slide[data-index]`
    });

    const bannersConfig = {
        1: { desktopImage: config.desktopImageURL, mobileImage: config.mobileImageURL },
        2: { desktopImage: config.desktopImageURL, mobileImage: config.mobileImageURL },
        3: { desktopImage: config.desktopImageURL, mobileImage: config.mobileImageURL },
        4: { desktopImage: config.desktopImageURL, mobileImage: config.mobileImageURL },
        5: { desktopImage: config.desktopImageURL, mobileImage: config.mobileImageURL },
        6: { desktopImage: config.desktopImageURL, mobileImage: config.mobileImageURL },
        7: { desktopImage: config.desktopImageURL, mobileImage: config.mobileImageURL },
        8: { desktopImage: config.desktopImageURL, mobileImage: config.mobileImageURL },
        9: { desktopImage: config.desktopImageURL, mobileImage: config.mobileImageURL },
        10: { desktopImage: config.desktopImageURL, mobileImage: config.mobileImageURL },
        11: { desktopImage: config.desktopImageURL, mobileImage: config.mobileImageURL }
    };

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.buildCSS();
                self.changeBanner();
                self.setEvents();
            }

            return true;
        }
    };

    self.reset = () => {
        const { hideBanner, bannerStyle, style, appendedBanner } = classes;

        Insider.dom(`${ hideBanner }, ${ bannerStyle }`).removeClass(`${ hideBanner } ${ bannerStyle }`);
        Insider.dom(`${ style }, ${ appendedBanner }`).remove();
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

    self.changeBanner = () => {
        const { appendedBanner: appendedBannerSelector, slideElement } = selectors;
        const { appendedBanner: appendedBannerClass, hideBanner, goal } = classes;

        const indexes = Insider.fns.keys(bannersConfig);

        Insider.fns.onElementLoaded(slideElement, (element) => {
            Insider.dom(element).accessNodes((node) => {
                const dataIndex = Insider.dom(node).attr('data-index');

                if (indexes.includes(dataIndex) && !Insider.dom(node).find(appendedBannerSelector).exists()) {
                    const bannerConfig = bannersConfig[dataIndex];
                    const currentBannerSelector = `.easycl${ urlHasParameter }-slider-layout-0-x-imageElement`;
                    const $currentBanner = Insider.dom(node).find(currentBannerSelector);

                    const srcURL = Insider.dom(node).parents('.vtex-flex-layout-0-x-flexRow--sliderDesktop').exists() ?
                        bannerConfig.desktopImage : bannerConfig.mobileImage;

                    const bannerHTML = `<img class="${ appendedBannerClass }" src="${ srcURL }"
                    data-index="${ dataIndex }">`;

                    $currentBanner.siblings(appendedBannerSelector).remove();
                    $currentBanner.addClass(hideBanner);
                    $currentBanner.after(bannerHTML).addClass(goal);
                    $currentBanner.closest('a').attr('href', config.redirectURL);
                }
            });
        }, { infinite: true }).listen();
    };

    self.setEvents = () => {
        const { clickWrapper } = selectors;
        let isTouchMove = false;

        const setRedirection = (event) => {
            event.preventDefault();
            setTimeout(() => {
                window.location.href = event.currentTarget.href;
            }, 1000);
        };

        Insider.eventManager.once(`touchstart.check:touchstart:${ variationId }`, clickWrapper, () => {
            isTouchMove = false;
        });

        Insider.eventManager.once(`touchmove.check:touchmove:${ variationId }`, clickWrapper, () => {
            isTouchMove = true;
        });

        if (isDesktop) {
            Insider.eventManager.once(`click.set:redirection:${ variationId }`, clickWrapper, setRedirection);
        } else {
            Insider.eventManager.once(`touchend.set:redirection:${ variationId }`, clickWrapper, (event) => {
                if (!isTouchMove) {
                    setRedirection(event);

                    Insider.campaign.custom.storeJoinLog(variationId);

                    Insider.campaign.custom.updateCampaignCookie({
                        joined: true
                    }, Insider.campaign.custom.addCampaignIdPrefix(variationId));
                }
            });
        }
    };

    return self.init();
})({});
/* OPT-153128 END */
