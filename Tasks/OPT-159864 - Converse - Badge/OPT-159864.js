/* OPT-159864 START */
((self) => {
    'use strict';

    const builderId = Insider.browser.isDesktop() ? 148 : 149;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const currentProductId = Insider.systemRules.call('getCurrentProduct').id.split('_')[0];

    const classes = {
        badge: `ins-badge-${ variationId }`,
        join: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        creditOnlineTag: '.ins-preview-wrapper-201'
    });

    const badgeConfig = {
        text: '20% Off With Code : CONKARTINI20',
        productList: [
            '46453', '50048', '46421', '46456', '46450', '41063', '54204', '56621', '56616', '59090', '59020', '59070',
            '22890', '22882', '52459', '52418', '61459', '61396', '61401', '45561', '61479', '61454', '61385', '61474',
            '61526', '58995', '59065', '52474', '59095', '59080', '59105', '59060', '59055', '52786', '45566', '51898',
            '51922', '59100', '52489', '56631', '56586', '59075', '56564', '56601', '56642', '53841', '45565', '56575',
            '1847', '44004', '51022', '62629', '62665', '54350', '54346'
        ]
    };

    self.init = () => {
        if (variationId && Insider.fns.has(badgeConfig.productList, currentProductId)) {
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
        const { badge, wrapper } = selectors;

        const customStyle =
        `${ badge } {
            font-family: Montserrat;
            color: #4cb829;
            font-size: 12px;
        }
        ${ wrapper } {
            width: 100%;
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const { badge, join, wrapper } = classes;
        const { creditOnlineTag } = selectors;

        const html =
        `<div class="${ wrapper }">
            <p class="${ badge } ${ join }">
              ${ badgeConfig.text }
            </p>
        </div`;

        Insider.fns.onElementLoaded(creditOnlineTag, () => {
            Insider.dom(creditOnlineTag).before(html);
        }).listen();
    };

    return self.init();
})({});
/* OPT-159864 END */
