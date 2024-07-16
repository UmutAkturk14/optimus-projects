/* OPT-163051 START */
((self) => {
    'use strict';

    const isMobile = Insider.browser.isMobile();
    const builderId = isMobile ? 4137 : 4124;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const variationIds = Insider.campaign.getVariationsByBuilderId(builderId);
    const isSecondVariation = isMobile && variationId === variationIds[2]?.vi;
    const campaignStorageName = `ins-closed-or-joined-${ variationId }`;
    const storageData = Insider.storage.get(campaignStorageName);

    const config = {
        campaignDelaySeconds: 2,
        campaignReEligibilityDays: 10,
        redirectURL: 'https://www.sportmaster.ru/', /* OPT-164780 */
        popUpImageSource: 'https://image.useinsider.com/sportmaster/defaultImageLibrary/1%29_S-Popup%20%D0%9C%D0%92%20%D1%81%D1%82%D0%B0%D0%BD%D0%B4%D0%B0%D1%80%D1%82%D0%BD%D1%8B%D0%B9-1720349644.png'
    };

    const goalIds = {
        closeButtonClicks: 805,
        redirectButtonClicks: 806,
        otherAreaClicks: 812 /* OPT-164780 */
    };

    const classes = {
        style: `ins-style-${ variationId }`,
        wrapper: `ins-wrapper-${ variationId }`,
        innerWrapper: `ins-inner-wrapper-${ variationId }`,
        popUpImage: `ins-pop-up-image-${ variationId }`,
        closeButton: `ins-close-button-${ variationId }`,
        redirectButton: `ins-redirect-button-${ variationId }`,
        goal: `sp-custom-${ variationId }-1`,
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {});

    self.init = () => {
        if (variationId && Insider.fns.isNull(storageData)) {
            setTimeout(() => {
                if (!Insider.campaign.isControlGroup(variationId)) {
                    self.reset();
                    self.buildCSS();
                    self.buildHTML();
                    self.setEvents();
                }

                Insider.campaign.custom.show(variationId);
            }, config.campaignDelaySeconds * 1000);
        }
    };

    self.reset = () => {
        const { style, wrapper } = selectors;

        Insider.dom(`${ style }, ${ wrapper }`).remove();
    };

    self.buildCSS = () => {
        const { wrapper, innerWrapper, closeButton, redirectButton, popUpImage } = selectors;

        const customStyle =
        `${ wrapper } {
            z-index: 10;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 476px;
            height: 686px;
            box-shadow: 0 2px 10px #00000029; /* OXT2-278 */
        }
        ${ innerWrapper } {
            position: relative;
        }
        ${ popUpImage } {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        ${ closeButton } {
            cursor: pointer;
            position: absolute;
            top: 26px;
            right: 26px;
            width: 30px;
            height: 30px;
        }
        ${ redirectButton } {
            cursor: pointer;
            position: absolute;
            bottom: 46px;
            right: 42px;
            width: 392px;
            height: 61px;
        }
        @media (max-width: 1199px) {
            ${ wrapper } {
                display: flex;
                align-items: center;
                justify-content: center;
                width: ${ isSecondVariation ? '100%' : '340px' };
                height: ${ isSecondVariation ? '100%' : '490px' };
                box-shadow: ${ isSecondVariation ? '0px' : '0 2px 10px #00000029' }; /* OXT2-278 */
            }
            ${ closeButton } {
                top: ${ isSecondVariation ? '3.5%' : '19px' };
                right: ${ isSecondVariation ? '5.5%' : '19px' };
                width: ${ isSecondVariation ? '6%' : '21px' };
                height: ${ isSecondVariation ? '4.5%' : '21px' };
            }
            ${ redirectButton } {
                width: ${ isSecondVariation ? '82%' : '280px' };
                height: ${ isSecondVariation ? '9%' : '42px' };
                bottom: ${ isSecondVariation ? '6.8%' : '35px' };
                right: ${ isSecondVariation ? '9%' : '30px' };
            }
            ${ popUpImage } {
                width: 100%;
                height: auto;
                object-fit: cover;
            }
            @media (orientation: landscape) {
                ${ wrapper } {
                    display: none;
                }
            }
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const { wrapper, innerWrapper, closeButton, redirectButton, popUpImage, goal } = classes;

        const outerHtml =
        `<div class="${ wrapper }">
            <div class="${ innerWrapper }">
                <img class="${ popUpImage }" src="${ config.popUpImageSource }">
                <div class="${ closeButton }"></div>
                <div class="${ redirectButton } ${ goal }"></div>
            </div>
        </div>`;

        Insider.dom('body').append(outerHtml);
    };

    self.setEvents = () => {
        const { closeButton, redirectButton } = selectors;

        Insider.eventManager.once(`click.manage:campaign:${ variationId }`,
            `${ closeButton }, ${ redirectButton }`, (event) => {
                const $target = Insider.dom(event.currentTarget);

                if ($target.is(closeButton)) {
                    self.sendCloseGoalAndCloseCampaign();
                } else {
                    self.sendButtonGoalAndRedirectUser();
                }

                self.setEligibilityStorage();
            });

        /* OPT-164780 START */
        Insider.eventManager.once(`click.track:other:area:clicks:${ variationId }`, window, (event) => {
            const $target = Insider.dom(event.target);

            if (!$target.closest(selectors.wrapper).exists()) {
                self.sendCustomGoal(goalIds.otherAreaClicks);

                self.reset();
            }
        });
        /* OPT-164780 END */
    };

    self.sendCloseGoalAndCloseCampaign = () => {
        self.sendCustomGoal(goalIds.closeButtonClicks);

        self.reset();
    };

    self.sendCustomGoal = (goalId) => {
        Insider.utils.opt.sendCustomGoal(builderId, goalId, true);
    };

    self.sendButtonGoalAndRedirectUser = () => {
        self.sendCustomGoal(goalIds.redirectButtonClicks);

        setTimeout(() => {
            /* OPT-164780 START */
            window.open(config.redirectURL, '_blank');

            self.reset();
            /* OPT-164780 END */
        }, 1000);
    };

    self.setEligibilityStorage = () => {
        Insider.storage.localStorage.set({
            name: campaignStorageName,
            value: true,
            expires: Insider.dateHelper.addDay(config.campaignReEligibilityDays),
        });
    };

    self.init();
})({});
/* OPT-163051 END */