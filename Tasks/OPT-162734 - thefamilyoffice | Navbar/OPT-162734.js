/* OPT-162734 START */
((self) => {
    'use strict';

    const builderId = 578;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const classes = {
        badge: `ins-badge-${ variationId }`,
        join: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
        navbarActive: 'css-1t5951b',
        navbarPassive: 'css-1cbouum',
        svgActive: 'css-1vx205z',
        svgPassive: 'css-hjvhmo'
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        navbar: 'nav:not(.chakra-breadcrumb)',
        chakraLink: '.chakra-link',
        accordionItem: '.chakra-accordion__item',
        collapsibleWrapper: '.chakra-collapse',
    });

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.buildCSS();
                self.buildHTML();
                self.addClass();
                self.setEvents();
            }

            return true;
        }
    };

    self.reset = () => {
        const { style, wrapper } = selectors;
        const { /* some stuff */ } = classes;

        Insider.dom(`${ style }, ${ wrapper }`).remove();
    };

    self.buildCSS = () => {
        const { /* some stuff */ } = selectors;

        const customStyle =
        '/* some stuff */';

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const { wrapper, container, product, image, info, title, subtitle, price, addToCart, selection, button, goal } = classes;
        const currentProduct = Insider.systemRules.call('getCurrentProduct');
        const titleText = Insider.dom('[itemprop="name"]').text();
        const subtitleText = Insider.dom('.short-description p').text();

        const html =
        `<div class="${ wrapper }">
            <div class="${ container }">
                <div class="${ product }">
                    <img class="${ image }" src="${ currentProduct.img }" />
                    <div class="${ info }">
                        <div class="${ title }">${ titleText }</div>
                        <div class="${ subtitle }">${ subtitleText }</div>
                        <div class="${ price }">${ currentProduct.price }</div>
                    </div>
                </div>
                <div class="${ addToCart }">
                    <div class="${ selection }"></div>
                    <div class="${ button } ${ goal }">addToCartText</div>
                </div>
            </div>
        </div>`;

        Insider.dom('body').append(html);
    };

    self.addClass = () => {
        const { /* some stuff */ } = selectors;
        const { /* some stuff */ } = classes;
    };

    self.setEvents = () => {
        const { /* some stuff */ } = selectors;

        /* Set events... */
    };

    return self.init();
})({});
/* OPT-162734 END */
