/* OPT-161545 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId =  isDesktop ? 1169 : 1170;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const language = Insider.systemRules.call('getLang');
    const isEnglish = language === 'en_US';

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        container: `ins-custom-container-${ variationId }`,
        textContainer: `ins-text-container-${ variationId }`,
        text: `ins-text-${ variationId }`,
        header: `ins-header-${ variationId }`,
        image: `ins-image-container-${ variationId }`,
        goal: `sp-custom-${ variationId }-1`,
    };

    const imageConfig = {
        en_US: 'https://image.useinsider.com/ikeaoman/defaultImageLibrary/en-1717101271.png',
        ar_AR: 'https://image.useinsider.com/ikeaoman/defaultImageLibrary/ar-1717101281.png'
    }[language];

    const textConfig = {
        headerText: isEnglish ? 'Unlock Free Delivery' : 'أستمتع بالتوصيل المجاني',
        descriptionText: isEnglish ? 'Buy this product and enjoy free delivery on your whole order' :
            'اشترِ هذا المنتج واستمتع بالتوصيل المجاني لكامل طلبك'
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        productNameContainer: isDesktop ? '.pip-product__buy-module-content' : '.js-price-package.pip-price-package'
    });

    self.init = () => {
        if (variationId && Insider.systemRules.call('getCurrentProduct').price >= 49) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.buildCSS();
                self.buildHtml();
            }

            return true;
        }
    };

    self.reset = () => {
        Insider.dom(`${ selectors.style }, ${ selectors.wrapper }`).remove();
    };

    self.buildCSS = () => {
        const { wrapper, container, image, textContainer } = selectors;

        const customStyle =
        `${ wrapper } {
            position: relative;
            width: 100%;
            height: 55px !important;
            background-color: #ffd80c;
            top: -40px;
            border-radius: 5px;
            color: black;
            font-size: 11px;
            align-items: center;
            display: flex;
        }
        ${ container } {
            display: flex;
            gap: 10px;
            padding: 8px;
        }
        ${ image } {
            width: 30px;
            height: 30px;
            margin-top: 3px;
        }
        ${ textContainer } {
            display: flex;
            flex-direction: column;
        }
        @media (min-width: 1200px) and (max-width: 1250px) {
            ${ wrapper } {
                width: 370px;
                font-size: 12px;
            }
            ${ image } {
                margin-top: 8px;
            }
        }
        @media (min-width: 375px) and (max-width: 414px) {
            ${ image } {
                margin-top: 8px;
            }
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHtml = () => {
        const { wrapper, container, text, image, goal, header, textContainer } = classes;
        const { headerText, descriptionText } = textConfig;

        const outerHtml =
            `<div class="${ wrapper } ${ goal }">
                <div class="${ container }">
                    <img class="${ image }" src="${ imageConfig }"></img>
                    <div class="${ textContainer }">
                        <div class="${ header }">${ headerText }</div>
                        <div class="${ text }">${ descriptionText }</div>
                    </div>
                </div>
            </div>`;

        Insider.dom(selectors.productNameContainer).before(outerHtml);
    };

    return self.init();
})({});
/* OPT-161545 END */
