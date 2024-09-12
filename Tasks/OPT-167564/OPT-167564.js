/* OPT-167564 START */
((self) => {
    'use strict';

    const builderId = 1;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const classes = {
        hide: `ins-custom-hide-${ variationId }`,
        setScroll: `ins-custom-set-scroll-${ variationId }`,
        style: `ins-custom-style-${ variationId }`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        partnerModal: '#informUsModalCenter:visible',
        partnerModalMobile: '#informUsResponsiveModalCenter:visible',
        body: 'body',
        modalBackdrop: '.modal-backdrop'
    });

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.buildCSS();
                self.addClass();
            }

            Insider.campaign.info.show(variationId);
        }
    };

    self.reset = () => {
        const { hide, setScroll } = selectors;
        const { hide: hideClass, setScroll: setScrollClass } = classes;

        Insider.dom(hide).removeClass(hideClass);
        Insider.dom(setScroll).removeClass(setScrollClass);
    };

    self.buildCSS = () => {
        const { hide, setScroll } = selectors;

        const customStyle =
        `${ hide } {
            display: none !important;
        }
        ${ setScroll } {
            overflow: auto !important;
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.addClass = () => {
        const { partnerModal, partnerModalMobile, body, modalBackdrop } = selectors;
        const { hide, setScroll } = classes;
        const modal = !Insider.browser.isMobile() ? partnerModal : partnerModalMobile;

        Insider.fns.onElementLoaded(modal, () => {
            const $modal = Insider.dom(modal);
            const $body = Insider.dom(body);
            const $modalBackdrop = Insider.dom(modalBackdrop);

            $modal.addClass(hide);
            $modalBackdrop.addClass(hide);
            $body.addClass(setScroll);
        }).listen();
    };

    return self.init();
})({});
/* OPT-167564 END */