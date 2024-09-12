/* OPT-130513 START */
(function (self) {
    'use strict';

    const isMobile = Insider.browser.isMobile();
    const builderId = isMobile ? 4340 : 4339;
    const wheelOfFortuneBuilderId = isMobile ? 4334 : 4333; /* OPT-142280 */
    const wheelOfFortuneVariationId =
            Number(Insider.campaign.userSegment.getActiveVariationByBuilderId(wheelOfFortuneBuilderId));
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    /* OPT-158319 START */
    const wheelImage = {
        start: 'https://image.useinsider.com/fptshop/defaultImageLibrary/aaaIcon-1722582050.png',
        end: 'https://image.useinsider.com/fptshop/defaultImageLibrary/Icon-1-1722582144.png'
    };
    /* OPT-167483 START */
    const sessionStorageName = `ins-user-has-seen-campaign-${ variationId }`;
    const hasClosedCampaign = Insider.storage.get(sessionStorageName, 'session');
    /* OPT-167483 END */

    /* OPT-164287 START */
    const config = {
        iconBefore: 'https://image.useinsider.com/fptshop/defaultImageLibrary/Icon3x-1722596381.png',
        iconAfter: 'https://image.useinsider.com/fptshop/defaultImageLibrary/Icon3x-1722596381.png',
        closeGoalId: 140
    };
    /* OPT-164287 END */

    let currentImage = wheelImage.start;
    /* OPT-158319 END */
    const wheelOfFortuneStorageName = `sp-info-c-${ wheelOfFortuneVariationId }`;
    const isCouponExists = Insider.storage.localStorage.get(wheelOfFortuneStorageName);

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        /* OPT-164287 START */
        giftWrapper: `ins-custom-wrapper-${ variationId }`,
        hide: `ins-hide-${ variationId }`,
        closeButton: `ins-custom-close-button-${ variationId }`,
        giftImage: `ins-custom-gift-image-${ variationId }`,
        /* OPT-164287 END */
        container: `ins-icon-container-${ variationId }`,
        image: `ins-wheel-image-${ variationId }`,
        goal: `sp-custom-${ variationId }-1`
    };

    const selectors = Object.keys(classes).reduce(function (createdSelector, key) {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        zalo: '.zalo-chat-widget'
    });

    const isZaloExists = Insider.dom(selectors.zalo).exists();

    self.init = function () {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId) && !isCouponExists
            && !hasClosedCampaign) { /* OPT-167483 */
                self.reset();
                self.buildCSS();
                self.buildHTML();
                self.setEvents();
                self.animateImages(); /* OPT-158319 */
                self.listenChangingPage(); /* OXT2-536 */
            }

            return !isCouponExists && !hasClosedCampaign; /* OPT-167483 */
        }
    };

    self.reset = function () {
        const { style, container, giftWrapper, closeButton } = selectors;

        Insider.dom(`${ style }, ${ container }, ${ giftWrapper }, ${ closeButton }`).remove();
    };

    /* OPT-145671 START */
    self.buildCSS = () => {
        const { container, image, giftWrapper, closeButton, hide, giftImage } = selectors; /* OPT-164287 */

        const bottomRate = isMobile ? '13%;' : '5%;';
        const style =
        `${ container } {
            display: block;
            position: fixed;
            bottom: ${ isZaloExists ? bottomRate : '2%;' };
            left: 1%;
            z-index: 999999;
            cursor: pointer;
			width: 100px;
            height: 100px;
        }
        /* OPT-164287 START */
        ${ giftWrapper } {
            display: block;
            position: fixed;
            bottom: ${ isZaloExists ? bottomRate : '2%;' };
            left: 1%; /* OPT-164287 */
            z-index: 999999;
            cursor: pointer;
        }
        ${ closeButton } {
            display: block;
            position: fixed;
            bottom: ${ isMobile ? '24%' : '17%' };
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
        ${ hide } {
            display: none;
        }
        ${ giftImage } {
            width: 65px;
            height: 60px;
            display: none !important; /* OPT-167483 */
        }
        /* OPT-164287 END */  
        ${ image } {
            /* OPT-167483 START */
            width: 85px !important;
            height: 85px !important;
            /* OPT-167483 END */
        }
        @media only screen and (max-width: 767px) {
          ${ container } {
            width: 85px;
            height: 85px;
          }
        }
        @media only screen and (max-height: 575.98px) and (orientation: landscape) {
          ${ container } {
            bottom: 20% !important;
          }
        }`;
        /* OPT-145671 END */

        Insider.dom('<style>').addClass(classes.style).html(style).appendTo('head');
    };

    self.buildHTML = function () {
        const { container, goal, image, closeButton, giftWrapper, hide, giftImage } = classes; /* OPT-164287 */

        const iconHtml =
            `<div class="${ container } ${ goal }">
                <img class="${ image }" src="${ wheelImage }" />
            </div>
            <div class="${ closeButton }">X</div>`;
        /* OPT-164287 START */
        const giftHtml =
        `<div class="${ giftWrapper } ${ goal } ${ hide }">
            <img class="${ giftImage }" src="${ config.iconBefore }" />
        </div>`;

        Insider.dom('body').append(`${ iconHtml }${ giftHtml }`);
        /* OPT-164287 END */
    };

    self.setEvents = function () {
        /* OPT-164287 START */
        const { container, closeButton, giftWrapper, giftImage } = selectors;
        const { iconAfter, iconBefore, closeGoalId } = config;
        const { hide, closeButton: closeButtonClass, giftImage: giftImageSelector, image } = classes;
        const eventName = Insider.browser.isDesktop() ? 'click' : 'touchend';
        /* OPT-164287 END */

        Insider.eventManager.once(`pointerup.show:wheel:of:fortune:${ variationId }`, container, () => { /* OPT-164287 */
            if (!Insider.storage.localStorage.get(wheelOfFortuneStorageName)) {
                Insider.storage.localStorage.remove(`sp-camp-${ wheelOfFortuneVariationId }`); /* OPT-150441 */

                Insider.campaign.info.clearVisibleCampaignsByType('ON-PAGE');
                /* OPT-142280 START */
                setTimeout(() => {
                    if (wheelOfFortuneVariationId) {
                        Insider.campaign.info.show(wheelOfFortuneVariationId);
                        self.listenFormSubmit();
                    }
                }, 500);
                /* OPT-142280 END */
            }
        });
        /* OPT-164287 START */
        Insider.eventManager.once(`${ eventName }.gift:wrapper:${ variationId }`, window, (event) => {
            const $eventTarget = Insider.dom(event.target);

            if ($eventTarget.hasClass(closeButtonClass)) {
                Insider.dom(giftWrapper).removeClass(hide);
                Insider.dom(`${ container }, ${ closeButton }`).addClass(hide);

                Insider.utils.opt.sendCustomGoal(builderId, closeGoalId, true);

                /* OPT-167483 START */
                Insider.storage.set({
                    name: sessionStorageName,
                    value: true
                }, 'session');
                /* OPT-167483 END */
            }

            if ($eventTarget.hasClass(giftImageSelector)) {
                Insider.dom(`${ container }, ${ closeButton }`).removeClass(hide);
                Insider.dom(giftWrapper).addClass(hide);
            }

            /*if ($eventTarget.hasClass(image)) {
                Insider.dom(closeButton).addClass(hide);
            }*/
        });

        setInterval(() => {
            Insider.dom(giftImage).attr('src',
                `${ Insider.dom(giftImage).attr('src') === iconAfter ? iconBefore : iconAfter }`);
        }, Insider.dateHelper.ONE_SECOND_AS_MILLISECOND * 1);
        /* OPT-164287 END */
    };
    /* OPT-142280 START */
    self.listenChangingPage = () => {
        Insider.utils.opt.ajaxListener((url, response, data) => {
            if (url.includes('hit.api.useinsider.com/hit') && !Insider.fns.hasParameter('samsung')
                && !Insider.fns.hasParameter('galaxy') && !Insider.systemRules.call('isOnMainPage')) {
                self.reset();
            }
        });
    };
    /* OXT2-536 END */

    self.listenFormSubmit = () => {
        Insider.utils.opt.ajaxListener((url, response, data) => {
            /* OXT2-536 START */
            if (url.includes('/event/v1/insert') && !Insider.fns.isNull(data)) {
                Insider.dom(selectors.container).hide();
            } else if (url.includes('hit.api.useinsider.com/hit') && !Insider.fns.hasParameter('samsung') && !Insider.fns.hasParameter('galaxy')) {
                self.reset();
            }
            /* OXT2-536 END */
        });
    };
    /* OPT-142280 END */
    /* OPT-158319 START */
    self.animateImages = () => {
        currentImage = (currentImage === wheelImage.start) ? wheelImage.end : wheelImage.start;

        Insider.dom(selectors.image).attr('src', currentImage);

        setTimeout(self.animateImages, 750);
    };
    /* OPT-158319 END */

    return self.init();
})({});
/* OPT-130513 END */