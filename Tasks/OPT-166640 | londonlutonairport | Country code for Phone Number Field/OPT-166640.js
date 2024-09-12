/* OPT-158322 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 846 : 849;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const config = {
        phoneLabelText: 'Phone number',
    };

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        container: `ins-custom-container-${ variationId }`,
        phoneLabelContainer: `ins-phone-label-container-${ variationId }`,
        phoneLabel: `ins-phone-label-${ variationId }`,
        phoneInputContainer: `ins-phone-input-container-${ variationId }`,
        phoneInput: `ins-phone-input-${ variationId }`,
        customExtend: `ins-extend-element-${ variationId }`,
        inputTypingActive: `ins-input-active-${ variationId }`,
        checkIcon: `ins-check-icon-${ variationId }`,
        goal: `sp-custom-${ variationId }-1`,
        countrySelector: `ins-country-selector-${ variationId }` /* OPT-166640 */
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        inputSelector: 'section div.grid .field input',
        postCodeElement: 'section div.grid .field:eq(3)',
        findCarButton: 'button:contains(Find car)'
    });

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.buildCSS();
                self.buildHTML();
                self.setEvents();
            }

            return true;
        }
    };

    self.reset = () => {
        const { style, wrapper, postCodeElement } = selectors;

        Insider.dom(postCodeElement).removeClass(classes.customExtend);

        Insider.dom(`${ style }, ${ wrapper }`).remove();
    };

    self.buildCSS = () => {
        const { container, wrapper, phoneLabelContainer, phoneInputContainer, phoneInput, customExtend,
            inputTypingActive, checkIcon, countrySelector } = selectors;

        const customStyle =
        `${ wrapper } {
            display: grid;
            font-size: .875rem;
            line-height: 1.25rem;
            align-items: flex-start;
            width: 100%;
        }
        ${ container } {
            display: flex;
            flex-direction: column;
            gap: .5rem;
        }
        ${ phoneLabelContainer } {
            color: rgb(64 64 64);
            font-weight: 700;
            display: flex;
        }
        ${ phoneInputContainer } {
            position: relative;
            display: flex; /* OPT-166640 */
        }
        ${ phoneInput } {
            width: 100%;
            padding-top: .75rem;
            padding-bottom: .75rem;
            padding-left: 1rem;
            padding-right: 2.5rem;
            background-color: #fff;
            border-color: rgb(212, 212, 212);
            border-width: 1px;
            font-size: 1rem;
            line-height: 1.5rem;
        }
        ${ phoneInput }:focus {
            border: 1px solid rgb(212, 212, 212);
            box-shadow: none;
        }
        ${ inputTypingActive } {
            border: 3px solid rgb(37, 167, 152) !important;
        }
        ${ customExtend } {
            grid-column: 1 / -1 !important;
        }
        ${ checkIcon } {
            width: 1.5rem;
            height: 100%;
            display: none;
            position: absolute;
            right: 0;
            top: 0;
            padding-right: 2rem;
            align-items: center;
            justify-content: center;
        }
        /* OPT-166640 START */
        ${ countrySelector } {
            padding-right: unset !important;
            width: 40% !important;
            border-color: rgb(212, 212, 212);
            font-size: .875rem;
            line-height: 1.25rem;
        }
        /* OPT-166640 END */
        /* OPT-166140 START */
        ${ phoneInput }::-webkit-outer-spin-button,
        ${ phoneInput }::-webkit-inner-spin-button {
            -webkit-appearance: none !important;
            margin: 0 !important;
        }
        /* OPT-166140 END */
        @media (min-width: 640px) {
            ${ phoneInput } {
                font-size: .875rem;
                line-height: 1.25rem;
            }
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const { container, wrapper, phoneLabelContainer, phoneLabel, phoneInputContainer, phoneInput, checkIcon,
            goal, countrySelector } = classes; /* OPT-166640 */
        const { phoneLabelText } = config;

        self.editPartnerInput();

        const outerHTML =
        `<div class="${ wrapper } ${ goal }">
            <div class="${ container }">
                <div class="${ phoneLabelContainer }">
                    <div class="${ phoneLabel }">${ phoneLabelText }</div>
                </div>
                <div class="${ phoneInputContainer }">
                    <select class="${ countrySelector }"></select> <!-- OPT-166640 -->
                    <input class="${ phoneInput }" type="tel" name="phonenumber" placeholder="Phone number" />
                    <span data-input-icon="circle-check" class="${ checkIcon }">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-check" class="svg-inline--fa fa-circle-check fa-fw text-green-600" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg>
                    </span>
                </div>
            </div>
        </div>`;

        Insider.dom(selectors.postCodeElement).before(outerHTML);

        self.populateCountryList();
    };

    self.editPartnerInput = () => {
        const { postCodeElement, customExtend } = selectors;

        Insider.fns.onElementLoaded(`${ postCodeElement }:has(:not(${ customExtend }))`, () => {
            Insider.dom(postCodeElement).addClass(classes.customExtend);

            self.editPartnerInput();
        }).listen();
    };

    /* OPT-166640 START */
    self.populateCountryList = () => {
        const $countrySelector = Insider.dom(selectors.countrySelector);

        Insider.request.get({
            url: 'https://restcountries.com/v3.1/all?fields=name,idd,flag',
            success: (response) => {
                const data = response;
                const countryList = data
                    .map((country) => {
                        const { idd: { root, suffixes }, name: { common: name }, flag } = country;
                        const code = `${ root }${ suffixes ? suffixes[0] : '' }`;

                        if (!code || code === 'undefined' || isNaN(code) || code > 998) {
                            return null;
                        }

                        return {
                            name,
                            code,
                            flag
                        };
                    })
                    .filter((country) => country !== null);

                countryList.sort((a, b) => self.getNumericCode(a.code) - self.getNumericCode(b.code));

                countryList.forEach(({ code }) => {
                    $countrySelector.append(
                        Insider.dom('<option>').attr('value', code).html(code)
                    );
                });

            },
            parse: true,
            error: (error) => {
                Insider.logger.error('Error fetching country data:', error);
            }
        });
    };

    self.getNumericCode = (code) => parseInt(code.replace(/^\D+/g, ''), 10);
    /* OPT-166640 END */

    self.setEvents = () => {
        const { findCarButton, inputSelector, phoneInput, checkIcon } = selectors;
        const { inputTypingActive } = classes;

        const $phoneInput = Insider.dom(phoneInput);
        const phoneRegex = /(?:[0-9/.]\s?){6,14}[0-9]$/;

        Insider.eventManager.once(`input.typing:phone:input:${ variationId }`, phoneInput, () => {
            /* OPT-166140 START */
            const $currentPhoneInput = Insider.dom(phoneInput);

            $phoneInput.addClass(inputTypingActive);

            $currentPhoneInput.val($currentPhoneInput.val().replace(/[^0-9]/g, ''));
            /* OPT-166140 END */
        });

        Insider.eventManager.once(`focus.focus:phone:input:${ variationId }`, phoneInput, () => {
            Insider.dom(`${ checkIcon }`).css('display', 'none', 'important');

            $phoneInput.addClass(inputTypingActive);
        });

        Insider.eventManager.once(`focusout.focus:out:phone:input:${ variationId }`, phoneInput, () => {
            const phoneValue = Insider.dom(phoneInput).val() ?? '';

            $phoneInput.removeClass(inputTypingActive);

            if (phoneRegex.test(phoneValue)) {
                Insider.dom(checkIcon).css('display', 'grid', 'important');
            }

        });

        Insider.eventManager.once(`mousedown.find:car:${ variationId }`, findCarButton, () => {
            /* OPT-166640 START */
            const phoneNumber = Insider.dom(phoneInput).val() ?? '';
            const countryCode = Insider.dom(selectors.countrySelector).val() ?? '';

            const phone = `${ countryCode }${ phoneNumber }`;
            /* OPT-166640 END */

            const data = {
                name: Insider.dom(`${ inputSelector }:eq(0)`).val() ?? '',
                surname: Insider.dom(`${ inputSelector }:eq(1)`).val() ?? '',
                email: Insider.dom(`${ inputSelector }:eq(2)`).val() ?? '',
                postCode: Insider.dom(`${ inputSelector }:eq(3)`).val() ?? '',
                carReg: Insider.dom(`${ inputSelector }:eq(4)`).val() ?? '',
                phone, /* OPT-166640 */
            };

            self.sendJoinGoal();
            self.sendDataToUcd(data);
        });
    };

    self.sendJoinGoal = () => {
        Insider.campaign.custom.storeJoinLog(variationId);

        Insider.campaign.custom.updateCampaignCookie({
            joined: true
        }, Insider.campaign.custom.addCampaignIdPrefix(variationId));
    };

    self.sendDataToUcd = (data) => {
        const { name, surname, email, postCode, carReg, phone } = data;

        const payload = {
            partner: Insider.partner.name,
            source: isDesktop ? 'email' : 'mobile',
            users: [{
                insider_id: Insider.getUserId(),
                attributes: {
                    em: email,
                    eo: true,
                    na: name,
                    su: surname,
                    pn: phone,
                    c_post_code: postCode,
                    c_car_reg: carReg,
                }
            }]
        };

        Insider.request.post({
            url: 'https://unification.useinsider.com/api/attribute/v2/update',
            method: 'POST',
            data: JSON.stringify(payload),
            error(xhr) {
                Insider.logger.log(xhr.response);
            }
        });
    };

    return self.init();
})({});
/* OPT-158322 END */