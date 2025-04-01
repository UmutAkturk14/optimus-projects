/* OPT-153128 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 36 : 37;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const imageURL =  'https://image.useinsider.com/easycl/defaultImageLibrary/Easy%20Main%20Slider-1709608211.png';
    const mobileImageUrl = 'https://image.useinsider.com/easycl/defaultImageLibrary/Easy%20Main%20Slider%20Mobile-1709608463.png';
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
        slideElement: '.easycl-slider-layout-0-x-slide',
        sliderElement: '.easycl-slider-layout-0-x-slide[data-index]',
        bannerElement:
          `.vtex-flex-layout-0-x-flexRow--sliderDesktop
          .easycl${ urlHasParameter }-slider-layout-0-x-slide[data-index="@index"]
          .easycl${ urlHasParameter }-slider-layout-0-x-imageElement,
          .vtex-flex-layout-0-x-flexRow--sliderMobile
          .easycl${ urlHasParameter }-slider-layout-0-x-slide[data-index="@index"]
          .easycl${ urlHasParameter }-slider-layout-0-x-imageElement`
    });

    const bannersConfig = {
        2: { desktopImage: imageURL, mobileImage: mobileImageUrl },
        3: { desktopImage: imageURL, mobileImage: mobileImageUrl },
        4: { desktopImage: imageURL, mobileImage: mobileImageUrl },
        5: { desktopImage: imageURL, mobileImage: mobileImageUrl },
        6: { desktopImage: imageURL, mobileImage: mobileImageUrl },
        7: { desktopImage: imageURL, mobileImage: mobileImageUrl },
        8: { desktopImage: imageURL, mobileImage: mobileImageUrl },
        9: { desktopImage: imageURL, mobileImage: mobileImageUrl },
        10: { desktopImage: imageURL, mobileImage: mobileImageUrl },
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

    self.changeBanner = () => {
        const indexes = Object.keys(bannersConfig);

        Insider.fns.onElementLoaded(selectors.slideElement, (element) => {
            Insider.dom(element).accessNodes((node) => {
                if (indexes.includes(Insider.dom(node).attr('data-index')) && !Insider.dom(node).find(selectors.appendedBanner).exists()) {
                    const config = bannersConfig[Insider.dom(node).attr('data-index')];
                    const bannerHTML = `<img class="${ classes.appendedBanner }" src="${ Insider.dom(node).parents('.vtex-flex-layout-0-x-flexRow--sliderDesktop').exists() ? config.desktopImage : config.mobileImage }" data-index="${ Insider.dom(node).attr('data-index') }">`;
                    const $currentBanner = Insider.dom(node).find('.easycl-slider-layout-0-x-imageElement');

                    $currentBanner.siblings(selectors.appendedBanner).remove();
                    $currentBanner.addClass(classes.hideBanner);
                    $currentBanner.after(bannerHTML).addClass(classes.goal);
                    $currentBanner.closest('a').attr('href', redirectURL);
                }
            });
        }, { infinite: true }).listen();
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
