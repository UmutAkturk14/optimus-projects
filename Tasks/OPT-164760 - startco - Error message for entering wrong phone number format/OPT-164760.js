/* OPT-164760 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 918 : 919;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const errorMessage = 'Please note by not entering a valid mobile phone number, you may not receive SMS communications.';
    const isControlGroup = Insider.campaign.isControlGroup(variationId);

    const classes = {
        join: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        error: `ins-custom-error-${ variationId }`,
        hidden: `ins-hidden-element-${ variationId }`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        phoneInput: '#BillingAddress_Phone'
    });

    self.init = () => {
        if (variationId) {
            if (!isControlGroup) {
                self.reset();
                self.buildCSS();
            }

            self.setEvents();
        }
    };

    self.reset = () => {
        const { style, wrapper } = selectors;

        Insider.dom(`${ style }, ${ wrapper }`).remove();
    };

    self.buildCSS = () => {
        const { error, wrapper, hidden } = selectors;

        const customStyle =
        `${ wrapper } {
            color: #c4122e !important;
        }
        ${ error } {
            font-family: SourceSansPro-Bold", Helvetica, Arial, sans-serif;
            color: #c4122e !important;
        }
        ${ hidden } {
            display: none !important;
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.setEvents = () => {
        const { phoneInput, wrapper } = selectors;
        const { hidden } = classes;
        const validPattern = /^(04|614|\+614)/;
        let isCampaignShown = false;

        Insider.eventManager.once(`keyup.listen:phone:input:${ variationId }`, phoneInput, () => {
            const phoneNumber = Insider.dom(phoneInput).val();

            if (phoneNumber.length > 3) {
                if (!validPattern.test(phoneNumber)) {
                    if (!isControlGroup) {
                        if (!isCampaignShown) {
                            self.showMessage();

                            isCampaignShown = true;
                        } else {
                            Insider.dom(wrapper).removeClass(hidden);
                        }
                    }

                    Insider.campaign.custom.show(variationId);
                }
            } else if (!isControlGroup) {
                Insider.dom(wrapper).addClass(hidden);
            }
        });
    };

    self.showMessage = () => {
        const { wrapper, join, error } = classes;
        const { phoneInput } = selectors;

        const html =
        `<div class="${ wrapper } ${ join }">
            <p class="${ error }">${ errorMessage }</p>
        </div>`;

        Insider.dom(phoneInput).after(html);
    };

    return self.init();
})({});
/* OPT-164760 END */