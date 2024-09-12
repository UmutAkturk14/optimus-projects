/* OPT-159596 START */
((self) => {
    'use strict';

    const builderId = Insider.browser.isDesktop() ? 49 : 50;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    /* OPT-166022 START */
    let isDisplayed = false;
    let isHovered = false;
    /* OPT-166022 END */

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-wrapper-${ variationId }`,
        tooltipContainer: `ins-tooltip-container-${ variationId }`,
        alertIconWrapper: `ins-alert-icon-${ variationId }`, /* OPT-161513 */
        closeButton: `ins-close-button-${ variationId }`,
        attributeDiv: `ins-attribute-div-${ variationId }`, /* OPT-165686 */
        goal: `sp-custom-${ variationId }-1`,
        hide: `ins-custom-hidden-element-${ variationId }` /* OPT-166022 */
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        /* OPT-166022 START */
        appendLocation: '.payment-widget__confirm:last',
        flightItem: 'ke-revenue-flight-item',
        flightPrice: '.flight-n__price-num'
        /* OPT-166022 END */
    });

    const config = {
        /* OPT-161513 START */
        alertIcon: '<svg fill=none height=24 viewBox="0 0 24 24"width=24 xmlns=http://www.w3.org/2000/svg><g clip-path=url(#clip0_4859_7207)><path d="M3.75 12C3.75 7.45108 7.45194 3.75 12 3.75C16.5481 3.75 20.25 7.45108 20.25 12C20.25 16.5485 16.548 20.25 12 20.25C7.45197 20.25 3.75 16.5485 3.75 12Z"stroke=#00256C stroke-width=1.5 /><path d="M12.436 14.156H11.008L10.708 8.432H12.736L12.436 14.156ZM10.684 16.16C10.684 15.792 10.784 15.536 10.984 15.392C11.184 15.24 11.428 15.164 11.716 15.164C11.996 15.164 12.236 15.24 12.436 15.392C12.636 15.536 12.736 15.792 12.736 16.16C12.736 16.512 12.636 16.768 12.436 16.928C12.236 17.08 11.996 17.156 11.716 17.156C11.428 17.156 11.184 17.08 10.984 16.928C10.784 16.768 10.684 16.512 10.684 16.16Z"fill=#00256C /></g><defs><clipPath id=clip0_4859_7207><rect fill=white height=24 width=24 /></clipPath></defs></svg>',
        closeButtonIcon: '<svg fill=none height=16 viewBox="0 0 16 16"width=16 xmlns=http://www.w3.org/2000/svg><path d="M2.6665 2.66667L12.9279 13.3333"stroke=#00256C stroke-linecap=square stroke-width=1.5 /><path d="M12.9282 2.66667L2.66683 13.3333"stroke=#00256C stroke-linecap=square stroke-width=1.5 /></svg>',
        /* OPT-161513 END */
        scrollLimit: (document?.documentElement?.scrollTop ?? 0) / 2, //Insider.dom('body').height() / 2
        scrollEventName: `scroll.change:height:${ variationId }`,
        tooltip: {
            text: '회원으로 진행하고 마일리지 적립하세요!', /* OPT-161513 */
            design: {
                fontColor: '#00256C',
                fontSize: '14px',
                fontWeight: 'normal',
                fontFamily: 'Noto Sans',
                backgroundColor: '#E6F9FF',
                boxShadow: '0 4px 0 0 rgba(0, 0, 0, 0.1)'
            }
        },
        storageName: 'ins-one-way-close-button-164192', /* OPT-164192 */
    };

    self.init = () => {
        if (variationId && self.checkIO() && !Insider.storage.localStorage.get(config.storageName)) { /* OPT-164192 */
            // self.reset();
            self.checkCampaignEligibility(); /* OPT-166022 */
        }
    };

    self.checkIO = () => {
        const insiderObject = window.insider_object;
        const userCustom = insiderObject?.user?.custom[0] ?? insiderObject.user.custom ?? {};
        const productCustom = insiderObject?.product?.custom[0] ?? insiderObject?.product?.custom ?? {};

        return Insider.fns.has(userCustom?.homepage_country, 'kr') &&
            Insider.fns.has(userCustom?.homepage_language, 'ko') &&
            Insider.fns.has(productCustom?.book_flight_type, 'international');
    };

    self.reset = () => {
        const { style, attributeDiv } = selectors;

        Insider.dom(`${ style }, ${ attributeDiv }`).remove();
    };

    /* OPT-166022 START */
    self.checkCampaignEligibility = () => {
        const { flightItem, flightPrice, attributeDiv } = selectors;

        Insider.eventManager.once(`click.track:flight:item:clicks:${ variationId }`, flightItem, (event) => {
            const $flight = Insider.dom(event.target);

            if ($flight.find(flightPrice).exists() && !isDisplayed) {
                self.showAndHideCampaign();

                Insider.fns.onElementLoaded(attributeDiv, () => {
                    const $attributeDiv = Insider.dom(attributeDiv);

                    $flight.closest(flightItem).append($attributeDiv);
                }).listen();
            }
        });
    };
    /* OPT-166022 END */

    /* OPT-165686 START */
    self.buildSpecialHTML = () => {
        const { attributeDiv, goal } = classes;
        const { attributeDiv: attribute, appendLocation } = selectors;

        const outerHTML = `<div class="${ attributeDiv } ${ goal }" aria-live="polite" role="status"></div>`;

        if (!Insider.dom(attribute).exists()) {
            Insider.dom(appendLocation).before(outerHTML);
        }
    };
    /* OPT-165686 END */

    self.buildCSS = () => {
        const { style, tooltipContainer, wrapper, closeButton, alertIconWrapper, hide } = selectors; /* OPT-166022 */
        const { fontColor, fontSize, fontWeight, fontFamily, backgroundColor, boxShadow } = config.tooltip.design;

        const customStyle =
        /* OPT-161513 START */
        `${ wrapper }, ${ alertIconWrapper }, ${ closeButton } {
            display: flex;
            align-items: center;
        }
        /* OPT-161513 END */
        ${ wrapper }  {
            bottom: 96px;
            z-index: 9;
            /* OPT-163185 START */
            right: 50%;
            transform: translateX(50%);
            width: auto;
            /* OPT-163185 END */
            position: fixed; /* OPT-166022 */
            /* OPT-161513 START */
            height: 48px;
            justify-content: space-between;
            /* OPT-161513 END */
            border-radius: 15px;
            text-align: center;
            letter-spacing: -1px;
            /* gap: 8px; OPT-163185 */
            color: ${ fontColor };
            font-size: ${ fontSize };
            font-weight: ${ fontWeight };
            font-family: ${ fontFamily };
            background-color: ${ backgroundColor };
            /* box-shadow: ${ boxShadow }; OPT-161513 */
        }
        /* OPT-161513 START */
        ${ alertIconWrapper } {
            height: 42px;
            width: 42px;
            justify-content: center;
        }
        ${ tooltipContainer } {
            /* top: 13px;
            position: relative;
            height: 22px; */
            font-weight: normal;
        }
        /* OPT-161513 START */
        ${ closeButton } {
            height: 100%;
            margin-right: 12px;
            width: 36px;
            justify-content: end;
            cursor: pointer;
            /* OPT-165686 START */
            background-color: ${ backgroundColor };
            border: none;
            /* OPT-165686 END */
            cursor: pointer; /* OPT-166022 */
        }
        /* OPT-166022 START */
        ${ hide } {
            display: none !important;
        }
        /* OPT-166022 END */
        @media only screen and (max-width: 1050px) {
            ${ wrapper } {
                /* OPT-163185 START */
                max-width: 290px !important;
                width: max-content;
                right: unset;
                transform: unset;
                /* OPT-163185 END */
                bottom: 138px;
                left: 19px;
                height: max-content;
            }
            ${ tooltipContainer } {
                padding: 12px 16px;
                text-align: start;
            }
        }
        @media only screen and (max-width: 900px) and (orientation: portrait) {
            ${ wrapper } {
                align-items: start;
            }
            ${ closeButton } {
                height: unset;
                padding-top: 12px;
            }
            /* OPT-161513 END */
        }`;

        if (!Insider.dom(style).exists()) {
            Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
        }
    };

    self.buildHTML = () => {
        /* OPT-161513 START */
        const { tooltipContainer, wrapper, goal, closeButton, alertIconWrapper } = classes;
        const { tooltip, closeButtonIcon, alertIcon } = config;
        /* OPT-165686 START */
        const partnerSpanText = '닫기';
        const partnerSpecialClass = '_hidden';
        /* OPT-165686 END */

        const outerHTML =
        `<div class="${ wrapper } ${ goal }">
            ${ Insider.browser.isMobile() ? '' : `<div class="${ alertIconWrapper }">${ alertIcon }</div>` }
            <div class="${ tooltipContainer }">${ tooltip.text }</div>
            <!-- OPT-165686 START -->
            <button type="button" class="${ closeButton }">
                <span class="${ partnerSpecialClass }">${ partnerSpanText }</span>
                ${ closeButtonIcon }
            </button>
            <!-- OPT-165686 END -->
        </div>`;

        /* OPT-161513 END */
        /* OPT-165686 START */
        if (!Insider.dom(wrapper).exists()) {
            Insider.dom(selectors.attributeDiv).append(outerHTML);
        }
        /* OPT-165686 END*/
    };

    self.setEvents = () => {
        /* OPT-166022 START */
        const { closeButton, wrapper } = selectors;
        const { hide } = classes;
        /* OPT-166022 END */

        Insider.eventManager.once(`click.close:button:${ variationId }`, closeButton, () => {
            Insider.utils.opt.sendCustomGoal(builderId, 2, true);

            /* OPT-164192 START */
            Insider.storage.localStorage.set({
                name: config.storageName,
                value: true,
                expires: Insider.dateHelper.addDay(1)
            });
            /* OPT-164192 END */

            Insider.dom(wrapper).addClass(hide); /* OPT-166022 */
        });
    };

    /* OPT-166022 START */
    self.showAndHideCampaign = () => {
        const { wrapper } = selectors;
        const { hide } = classes;

        if (!Insider.campaign.isControlGroup(variationId)) {
            self.buildSpecialHTML();
            self.buildCSS();
            self.buildHTML();
            self.setEvents();

        }

        Insider.campaign.custom.show(variationId);

        self.checkHoverStatus();

        setTimeout(() => {
            if (!isHovered) {
                Insider.dom(wrapper).addClass(hide);
            } else {
                const $wrapper = document.querySelector(wrapper);

                $wrapper.addEventListener('mouseleave', Insider.fns.throttle(() => {
                    Insider.dom(wrapper).addClass(hide);
                }, 200));
            }
        }, 3000);

        isDisplayed = true;
    };

    self.checkHoverStatus = () => {
        const { wrapper } = selectors;

        const $wrapper = document.querySelector(wrapper);

        $wrapper.addEventListener('mouseenter', Insider.fns.throttle(() => {
            isHovered = true;
        }, 200));

        $wrapper.addEventListener('mouseleave', Insider.fns.throttle(() => {
            isHovered = false;
        }, 200));
    };
    /* OPT-166022 END */

    self.init();
})({});
/* OPT-159596 END */