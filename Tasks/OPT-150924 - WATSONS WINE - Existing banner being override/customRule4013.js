(function (self) {
    const builderId = 153;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const wrapperSelector = `.ins-preview-wrapper-${ variationId }`;
    const customClass = `ins-custom-css-${ variationId }`;

    self.init = function () {
        if (!Insider.campaign.isControlGroup(variationId)) {
            self.reset();
            self.addCustomCss();
        }
    };

    self.reset = function () {
        Insider.dom(`.${ customClass }`).removeClass(customClass);
    };

    self.addCustomCss = function () {
        Insider.fns.onElementLoaded(`${ wrapperSelector } .ins-top-bar-content-wrapper`, function ($element) {
            const heightNumber = $element.height() || 80;

            if (Insider.dom('.plp-top-banner-container').exists()) {
                Insider.dom('.plp-top-banner-container').css('padding-top', `${ heightNumber }px`)
                    .addClass(customClass);
            } else {
                Insider.dom('main > div:visible:first').children().first()
                    .css('padding-top', `${ heightNumber }px`).addClass(customClass);
            }
        }).listen();
    };

    self.init();
})({});

true;
