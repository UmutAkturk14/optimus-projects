/* OPT-165215 START */
((self) => {
    'use strict';

    const builderId = 357;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const classes = {
        join: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
        container: `ins-custom-container-${ variationId }`,
        hidden: `ins-hidden-element-${ variationId }`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        goodsBtnBox: '.goods-btn-box',
        goodsDescBox: '.goods-desc-box',
        modelCutBox: '.model-cut-box',
        materialInfoBox: '.material-info-box',
        checkPointBox: '.check-point-box',
        fitGuideBoxFg00: '.fit-guide-box._fg00',
        fitGuideBoxFg01: '.fit-guide-box._fg01',
        fitGuideBoxFg02: '.fit-guide-box._fg02',
        fitTypeBoxFt00: '.fit-type-box._ft00',
        realSizeguideBox: '.real-sizeguide-box',
        layerBtnBox: '.layer-btn-box',
        styleRecommendBox: '.style-recommend-box',
        goodsSetupBox: '.goods-setup-box',
        recommendBoxThumb02: '.recommend-box._thumb02',
        topImgBox: '.top-img-box',
        rvBanBox: '.rv-ban-box',
        hd: '.hd .toggle__btn',
        viewToggleBox: '.view-toggle-box'
    });

    self.init = () => {
        self.reset();
        self.buildCSS();
        self.order();
        self.addClass();

        return true;
    };

    self.buildCSS = () => {
        const { hidden } = selectors;

        const customStyle =
        `${ hidden } {
            display: none !important;        
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.reset = () => {
        const { style, hidden } = selectors;
        const { hidden: hiddenClass } = classes;

        Insider.dom(style).remove();
        Insider.dom(hidden).removeClass(hiddenClass);
    };

    self.order = () => {
        const { join, container } = classes;
        const { goodsBtnBox, ...otherSelectors } = selectors;

        const orderElements = Insider.fns.keys(otherSelectors).filter((key) =>
            key !== 'goodsBtnBox' && key !== 'hd' && key !== 'rvBanBox' && !Insider.fns.has(classes, key)
        );

        const $goodsBtnBox = Insider.dom(goodsBtnBox);
        const $container = Insider.dom(`<div class="${ join } ${ container }"></div>`);

        orderElements.forEach((key) => {
            $container.append(Insider.dom(selectors[key]));
        });

        $goodsBtnBox.after($container);
    };

    self.addClass = () => {
        const { rvBanBox, hd } = selectors;
        const { hidden } = classes;

        Insider.dom(hd).addClass(hidden);
        Insider.dom(rvBanBox).addClass(hidden);
    };

    return self.init();
})({});
/* OPT-165215 END */