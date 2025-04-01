/* OPT-151330 START */
((self) => {
    'use strict';

    const builderId = Insider.browser.isDesktop() ? 4096 : 4097;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const giftCampaignBuilderId = 4100;
    const giftCampaignVariationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(giftCampaignBuilderId);
    const couponStorage = Insider.storage.localStorage.get(`ins-custom-coupon-${ giftCampaignVariationId }`) ?? '';
    /* OPT-167123 START */
    const sessionStorageName = `ins-user-has-seen-campaign-${ variationId }`;
    const isUserHasSeen = Insider.storage.session.get(sessionStorageName);
    /* OPT-167123 END */

    const config = {
        firstIconSrc: 'https://web-image.useinsider.com/fptshop/defaultImageLibrary/icon-gif-1-1723429976.png',
        secondIconSrc: 'https://web-image.useinsider.com/fptshop/defaultImageLibrary/icon-gif-1723430016.png',
        /* OPT-164287 START */
        iconBefore: '',
        iconAfter: '',
        closeGoalId: 140
        /* OPT-164287 END */
    };

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        goal: `sp-custom-${ variationId }-1`,
        customIconBoxWrapper: `ins-custom-icon-box-wrapper-${ variationId }`,
        customIconBox: `ins-custom-icon-box-${ variationId }`,
        customFirstIcon: `ins-custom-first-icon-${ variationId }`,
        customSecondIcon: `ins-custom-second-icon-${ variationId }`,
        customHide: `ins-custom-hide-${ variationId }`,
        /* OPT-164287 START */
        giftWrapper: `ins-custom-wrapper-${ variationId }`,
        closeButton: `ins-custom-close-button-${ variationId }`,
        giftImage: `ins-custom-gift-image-${ variationId }`,
        /* OPT-164287 END */
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        partnerChatWidget: '.zalo-chat-widget:visible'
    });

    let isEligibileToShow = false;

    self.init = () => {
        /* OPT-167123 START */
        if (variationId) {
            self.resetCampaign();

            if (Insider.fns.isEmptyString(couponStorage) && isEligibileToShow && !isUserHasSeen) {
                if (!Insider.campaign.isControlGroup(variationId)) {
                    self.reset();
                    self.buildCSS();
                    self.buildHTML();
                    self.setEvents();

                    if (!Insider.__external.isIntervalSet167123) {
                        self.setIconIntervaL();
                    }
                }

                return true;
            }
        }
        /* OPT-167123 END */
    };

    /* OPT-167123 START */
    self.resetCampaign = () => {
        const relatedRule = (Insider.campaign.get(variationId)?.si?.t ?? [])[0];

        if (Insider.fns.isFunction(window?.eval)) {
            isEligibileToShow = window.eval((Insider.rules[relatedRule]?.test.split('&&') ?? [])
                .filter((rule, index) => index !== 0 ).join('&&'));
        } else {
            Insider.logger.log(`eval is not a function. builderID: ${ builderId }`);
        }

        if (!isEligibileToShow) {
            self.reset();
        }
    };
    /* OPT-167123 END */

    self.reset = () => {
        /* OPT-167123 START */
        const { style, customIconBoxWrapper, giftWrapper, closeButton } = selectors;

        Insider.dom(`${ style }, ${ customIconBoxWrapper }, ${ giftWrapper }, ${ closeButton }`).remove();
        /* OPT-167123 END */
    };

    self.buildCSS = () => {
        const { customIconBoxWrapper, customIconBox, customFirstIcon, customSecondIcon, partnerChatWidget,
            customHide, giftWrapper, closeButton, giftImage } = selectors; /* OPT-164287 */

        const isChatBotExists = Insider.dom(partnerChatWidget).exists();

        const customStyle =
        `${ customIconBoxWrapper } {
            position: fixed !important;
            width: 100px;
            height: 100px;
            bottom: ${ isChatBotExists ? '5%' : '2%;' };
            left: 1%;
            z-index: 9999;
            cursor: pointer;
        }
        /* OPT-164287 START */
        ${ giftWrapper } {
            display: block;
            position: fixed;
            bottom: ${ isChatBotExists ? '5%' : '2%;' };
            left: 1%; /* OPT-164287 */
            z-index: 999999;
            cursor: pointer;
        }
        ${ closeButton } {
            display: block;
            position: fixed;
            bottom: 17%; /* default desktop value */
            z-index: 999999;
            cursor: pointer;
            left: 1%;
            width: 20px;
            height: 20px;
            background-color: #939CA3;
            border-radius: 50%;
            color: #ffffff;
            text-align: center;
        }
        ${ giftImage } {
            /* OPT-167123 START */
            min-width: 85px;
            height: 85px;
            /* OPT-167123 END */
        }
        /* OPT-164287 END */
        ${ customIconBox } {
            width: 100%;
            height: 100%;
            position: relative;
        }
        ${ customFirstIcon }, ${ customSecondIcon } {
            position: absolute;
            bottom: 0;
            right: 0;
            /* OPT-167123 START */
            left: 5px;
            min-width: 85px;
            height: 85px;
            /* OPT-167123 END */
        }
        ${ customHide } {
            display: none;
        }
        @media screen and (max-width: 1100px) {
            ${ customIconBoxWrapper } {
                width: 80px;
                right: 31px;
                ${ isChatBotExists ? 'bottom: 6%' : 'bottom: 5%' }
            }
        }
        @media screen and (max-width: 768px) { /* Mobile devices */
            ${ customIconBoxWrapper } {
                bottom: 16% !important;
            }
            ${ closeButton } {
                bottom: 25% !important;
            }
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        /* OPT-164287 START */
        const { customIconBoxWrapper, customIconBox, customFirstIcon, customSecondIcon, customHide, goal, giftWrapper,
            giftImage, closeButton } = classes;
        const { firstIconSrc, secondIconSrc, iconBefore } = config;
        /* OPT-164287 END */
        const customHTML =
        `<div class="${ customIconBoxWrapper } ${ goal }" tabIndex="1">
            <div class="${ customIconBox }">
                <img class="${ customFirstIcon }" src="${ firstIconSrc }">
                <img class="${ customSecondIcon } ${ customHide }" src="${ secondIconSrc }">
            </div>
        </div>
        <div class="${ closeButton }">X</div>`;
        /* OPT-164287 START */
        const giftHtml =
        `<div class="${ giftWrapper } ${ goal } ${ customHide }">
            <img class="${ giftImage }" src="${ iconBefore }" />
        </div>`;

        Insider.dom('body').append(`${ customHTML }${ giftHtml }`);
        /* OPT-164287 END */
    };

    self.setIconIntervaL = () => {
        Insider.__external.isIntervalSet167123 = true;

        setInterval(() => {
            Insider.dom(selectors.customSecondIcon).css('display',
                `${ Insider.dom(selectors.customSecondIcon).css('display') === 'none' ? 'block' : 'none' }`);
        }, Insider.dateHelper.ONE_SECOND_AS_MILLISECOND * 1);
    };

    self.setEvents = () => {
        const { customIconBoxWrapper, closeButton, giftWrapper, giftImage: giftImageSelector } = selectors;
        const { customHide, closeButton: closeButtonClass, giftImage, customSecondIcon, customFirstIcon } = classes;
        const { iconAfter, iconBefore, closeGoalId } = config;
        const eventName = Insider.browser.isDesktop() ? 'click' : 'touchend';

        Insider.eventManager.once(`click.click:icon:${ variationId }`, selectors.customIconBoxWrapper, () => {
            /* OPT-167123 START */
            /* Insider.dom(selectors.customIconBoxWrapper).addClass(classes.customHide); */
            self.reset();

            Insider.storage.session.set({
                name: sessionStorageName,
                value: true
            });
            /* OPT-167123 END */

            Insider.campaign.info.clearVisibleCampaignsByType('ON-PAGE');

            if (Insider.fns.isEmptyString(couponStorage)) {
                const giftCampaignStorageName = `sp-camp-${ giftCampaignVariationId }`;
                const giftCampaignStorage = Insider.storage.localStorage.get(giftCampaignStorageName) ?? {};

                giftCampaignStorage.joined = false;
                giftCampaignStorage.closed = false;

                Insider.storage.localStorage.set({
                    name: giftCampaignStorageName,
                    value: giftCampaignStorage
                });
            }

            setTimeout(() => {
                Insider.campaign.info.show(giftCampaignVariationId);
            }, 100);
        });
        /* OPT-164287 START */
        Insider.eventManager.once(`${ eventName }.gift:wrapper:${ variationId }`, window, (event) => {
            const $eventTarget = Insider.dom(event.target);

            if ($eventTarget.hasClass(closeButtonClass)) {
                Insider.dom(giftWrapper).removeClass(customHide);
                Insider.dom(`${ customIconBoxWrapper }, ${ closeButton }`).addClass(customHide);

                Insider.utils.opt.sendCustomGoal(builderId, closeGoalId, true);
            }

            if ($eventTarget.hasClass(giftImage)) {
                Insider.dom(`${ customIconBoxWrapper }, ${ closeButton }`).removeClass(customHide);
                Insider.dom(giftWrapper).addClass(customHide);
            }

            /*if ($eventTarget.hasClass(customSecondIcon) || $eventTarget.hasClass(customFirstIcon)) {
                Insider.dom(closeButton).addClass(customHide);
            }*/
        });

        setInterval(() => {
            Insider.dom(giftImageSelector).attr('src',
                `${ Insider.dom(giftImageSelector).attr('src') === iconAfter ? iconBefore : iconAfter }`);
        }, Insider.dateHelper.ONE_SECOND_AS_MILLISECOND * 1);
        /* OPT-164287 END */

        /* OPT-167123 START */
        Insider.eventManager.once(`log:sent.listen:coupon:log:${ variationId }`, (event) => {
            const eventDetail = event?.detail ?? {};

            if (eventDetail.type === 'notify-coupon' && eventDetail.campId === Number(giftCampaignVariationId)) {
                self.reset();
            }
        });
        /* OPT-167123 END */
    };

    return self.init();
})({});
/* OPT-151330 END */