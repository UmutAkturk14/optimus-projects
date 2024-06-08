/* OPT-161361 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 1250 : 1251;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const bannerImageURL = 'https://image.useinsider.com/sporthink/defaultImageLibrary/sportssomething-1717094176.png';

    const classes = {
        banner: `ins-banner-${ variationId }`,
        join: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-banner-wrapper-${ variationId }`,
        image: `ins-custom-banner-image-${ variationId }`,
        imageWrapper: `ins-custom-image-wrapper-${ variationId }`,
        container: `ins-custom-container-${ variationId }`,
        sideContainer: `ins-custom-side-container-${ variationId }`,
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), { appendLocation: '.brands' });

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.buildCSS();
                self.buildHTML();
            }

            return true;
        }
    };

    self.reset = () => {
        const { style, wrapper } = selectors;

        Insider.dom(`${ style }, ${ wrapper }`).remove();
    };

    self.buildCSS = () => {
        const { wrapper, image, container, sideContainer, imageWrapper } = selectors;

        let wrapperHeightMobile = '35vh';

        if (window.innerHeight > 900) {
            wrapperHeightMobile = '30vh';
        } else if (window.innerHeight < 700) {
            wrapperHeightMobile = '40vh';
        }

        const customStyle =
        `${ wrapper } {
            display: flex;
            height: 70vh !important;
            gap: 10px;
        }
        ${ container } {
            width: 30% !important;
            height: auto;
        }
        ${ image } {
            height: 100% !important;
            object-fit: cover;
            width: 97%;
            border-radius: 16px;
        }
        ${ imageWrapper } {
            height: 100%;
        }
        ${ sideContainer } {
            width: 70% !important;
            height: 100%;
        }
        @media only screen and (max-width: 1200px) {
            ${ sideContainer } {
                width: 50% !important;
            }
        }
        @media only screen and (orientation: portrait) {
            ${ container } {
                width: 50%;
            }
            ${ wrapper } {
                height: ${ wrapperHeightMobile } !important;
            }
            ${ container } {
                width: 100% !important;
                height: auto;
            }
        }
        @media only screen and (orientation: landscape) and (max-width: 1200px) {
            ${ wrapper } {
                height: 100vh !important;
            }
            ${ container } {
                width: 50% !important;
            }
            ${ imageWrapper } {
                width: 100%;
                height: 100vh;
            }
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const { wrapper, container, image, sideContainer, imageWrapper, join } = classes;
        const { appendLocation } = selectors;

        const html =
        `<div class="${ wrapper }">
            <div class="${ container }">
                <div class="${ imageWrapper }">
                    <img class="${ image } ${ join }" src="${ bannerImageURL }" />
                </div>
            </div>
            <div class="${ sideContainer }"></div>
        </div>`;

        Insider.dom(appendLocation).after(html);
    };

    return self.init();
})({});
/* OPT-161361 END */
