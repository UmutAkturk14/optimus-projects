/* OPT-165817 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 426 : 427;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const campaignConfiguration = {
        initialText: 'Videolu Ürün',
    };

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        goal: `sp-custom-${ variationId }-1`,
        campaignText: `ins-custom-camp-text-${ variationId }`,
        youtubeIcon: `ins-custom-social-youtube-${ variationId }`,
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        appendLocation: '#frm-addbasket',
    });

    const productList = {
        194331: 'https://youtube.com/shorts/Fh6s0Eg9mT8?si=affcB4RvUqVISG6K'
    };

    self.init = () => {
        if (variationId && Insider.systemRules.call('isOnProductPage') &&
        Insider.fns.has(productList, Insider.systemRules.getCurrentProduct().id)) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.buildCSS();
                self.buildHTML();
            }

            Insider.campaign.custom.show(variationId);
        }
    };

    self.reset = () => {
        const { style, wrapper } = selectors;

        Insider.dom(`${ style }, ${ wrapper }`).remove();
    };

    self.buildCSS = () => {
        const { wrapper, campaignText, youtubeIcon } = selectors;

        const customStyle =
        `${ wrapper } {
            align-items: center;
            background-color: #fff;
            border-color: #383838;
            border-radius: 30px;
            border-style: solid;
            border-width: 0.8px;
            border-image-outset: 0;
            border-image-repeat: stretch;
            border-image-slice: 100%;
            border-image-source: none;
            border-image-width: 1;
            box-sizing: border-box;
            cursor: pointer;
            display: flex;
            font-size: 16px;
            font-stretch: 100%;
            font-weight: 400;
            justify-content: center;
            line-height: 20.8px;
            margin: ${ isDesktop ? '-20px auto 0 40px' : '-20px auto 0 auto' };
            padding: 3px 10px;
            text-align: left;
            width: 153px;
            height: 38px;
        }
        ${ youtubeIcon } {
            position: relative;
            display: inline-block;
            color: red;
            width: 34px;
            height: 34px;
            font-size: 34px;
            text-align: left;
        }
        ${ youtubeIcon }::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 75%;
            height: 75%;
            background-image: url('https://image.useinsider.com/greyder/defaultImageLibrary/youtube-1721814373.png');
            background-size: cover;
            background-position: center;
            z-index: 1;
            transform: translate(-50%, -50%);
        }
        ${ campaignText } {
            box-sizing: border-box;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            font-size: 11px;
            font-stretch: 100%;
            font-weight: 400;
            line-height: 14.3px;
            padding-left: 10px;
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const { wrapper, goal, campaignText, youtubeIcon } = classes;
        const { appendLocation } = selectors;
        const { initialText } = campaignConfiguration;

        const videoUrl = productList[Insider.systemRules.call('getCurrentProduct').id];

        const outerHtml =
        `<a href="${ videoUrl }" class="${ wrapper } ${ goal }">
            <span class="${ youtubeIcon }"></span>
            <span class="${ campaignText }">${ initialText }</span>
        </a>`;

        Insider.dom(appendLocation).parent().before(outerHtml);
    };

    self.init();
})({});
/* OPT-165817 END */
