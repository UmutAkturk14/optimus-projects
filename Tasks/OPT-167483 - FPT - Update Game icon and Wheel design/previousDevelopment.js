/* OPT-159520 START */
((self) => {
    'use strict';

    const isMobile = Insider.browser.isMobile();
    const builderId = isMobile ? 4370 : 4369;
    const memoryGameBuilderId = isMobile ? 4372 : 4371;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const memoryGameVariationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(memoryGameBuilderId);
    let lastTime = 0;
    /* OPT-167483 START */
    const sessionStorageName = `ins-user-has-seen-campaign-${ variationId }`;
    const hasClosedCampaign = Insider.storage.get(sessionStorageName, 'session');
    /* OPT-167483 END */

    const config = {
        stickyChangeTime: 1500,
        /* OPT-164287 START */
        iconBefore: 'https://image.useinsider.com/fptshop/defaultImageLibrary/item%20%286%29-1720447573.png',
        iconAfter: 'https://image.useinsider.com/fptshop/defaultImageLibrary/item%20%285%29-1720447610.png',
        closeGoalId: 140,
        /* OPT-164287 END */
        stickyBanner: {
            firstImage: 'https://image.useinsider.com/fptshop/defaultImageLibrary/icon-gssif-1718416321.png',
            secondImage: 'https://image.useinsider.com/fptshop/defaultImageLibrary/icsson-gif-1718416409.png'
        }
    };

    const classes = {
        style: `ins-style-${ variationId }`,
        firstBanner: `ins-first-banner-${ variationId }`,
        secondBanner: `ins-second-banner-${ variationId }`,
        stickyBanner: `ins-sticky-banner-${ variationId }`,
        goal: `sp-custom-${ variationId }-1`,
        /* OPT-164287 START */
        giftWrapper: `ins-custom-wrapper-${ variationId }`,
        hide: `ins-hide-${ variationId }`,
        closeButton: `ins-custom-close-button-${ variationId }`,
        giftImage: `ins-custom-gift-image-${ variationId }`,
        /* OPT-164287 END */
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        chatWidget: '.zalo-chat-widget',
        memoryGameCoupon: `.ins-memory-game-coupon-${ memoryGameVariationId }`
    });

    self.init = () => {
        if (variationId && !Insider.storage.session.get(`ins-memory-game-done-${ memoryGameVariationId }`)
            && !hasClosedCampaign) { /* OPT-167483 */
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.addStyle();
                self.buildStickyBanner();
                self.setEvents();
            }

            return true;
        }
    };

    self.reset = () => {
        const { stickyBanner, inlineBanner, style } = selectors;

        Insider.dom(`${ stickyBanner }, ${ inlineBanner }, ${ style }`).remove();
    };

    self.addStyle = () => {
        const { stickyBanner, firstBanner, secondBanner, chatWidget, giftWrapper, closeButton, hide,
            giftImage } = selectors; /* OPT-164287 */
        const { firstImage, secondImage } = config.stickyBanner;

        const isThereChatIcon = Insider.dom(chatWidget).exists();

        const style =
        `${ stickyBanner } {
            position: fixed;
            bottom: ${ isThereChatIcon ? '6%' : '5%' };
            left: 1%;
            /* OPT-167483 START */
            width: 85px;
            height: 85px;
            /* OPT-167483 END */
            background-size: cover;
            background-repeat: no-repeat;
            cursor: pointer;
            z-index: 9999;
        }
        /* OPT-164287 START */
        ${ giftWrapper } {
            display: block;
            position: fixed;
            bottom: ${ isThereChatIcon ? '5%' : '2%;' };
            left: 1%; /* OPT-164287 */
            z-index: 999999;
            cursor: pointer;
        }
        ${ closeButton } {
            display: block;
            position: fixed;
            bottom: 17%;
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
        ${ firstBanner } {
            background-image: url(${ firstImage });
        }
        ${ secondBanner } {
            background-image: url(${ secondImage });
        }
        @media (max-width:1199px) {
            ${ stickyBanner } {
                right: 20px;
				bottom: 15% !important;
            }
			${ closeButton } {
				bottom: 27% !important;
            }
        }`;

        Insider.dom('<style>').addClass(classes.style).html(style).appendTo('head');
    };

    self.buildStickyBanner = () => {
        const { stickyBanner, firstBanner, goal, giftWrapper, giftImage, hide, closeButton } = classes; /* OPT-164287 */

        const stickyBannerHtml =
        `<div class="${ stickyBanner } ${ goal } ${ firstBanner }"></div>
        <div class="${ closeButton }">X</div>`;
        /* OPT-164287 START */
        const giftHtml =
        `<div class="${ giftWrapper } ${ goal } ${ hide }">
            <img class="${ giftImage }" src="${ config.iconBefore }" />
        </div>`;

        Insider.dom('body').append(`${ stickyBannerHtml }${ giftHtml }`);
        /* OPT-164287 END */
        self.changeImage();
    };

    self.changeImage = () => {
        const { stickyBanner } = selectors;
        const { firstBanner, secondBanner } = classes;

        const animationFrameCallback = (timestamp) => {
            if (timestamp - lastTime >= config.stickyChangeTime) {
                if (Insider.dom(stickyBanner).hasClass(firstBanner)) {
                    Insider.dom(stickyBanner).removeClass(firstBanner).addClass(secondBanner);
                } else {
                    Insider.dom(stickyBanner).removeClass(secondBanner).addClass(firstBanner);
                }

                lastTime = timestamp;
            }

            window.requestAnimationFrame(animationFrameCallback);
        };

        window.requestAnimationFrame(animationFrameCallback);
    };

    self.setEvents = () => {
        /* OPT-164287 START */
        const { stickyBanner, memoryGameCoupon, closeButton, giftWrapper, giftImage: giftImageSelector } = selectors;
        const { hide, closeButton: closeButtonClass, giftImage, stickyBanner: stickyBannerClass } = classes;
        const { iconAfter, iconBefore, closeGoalId } = config;
        const eventName = Insider.browser.isDesktop() ? 'click' : 'touchend';
        /* OPT-164287 END */

        Insider.eventManager.once(`click.sticky:banner:${ variationId }`, stickyBanner, () => {
            Insider.campaign.custom.show(memoryGameVariationId);
        });
        /* OPT-164287 START */
        Insider.eventManager.once(`${ eventName }.gift:wrapper:${ variationId }`, window, (event) => {
            const $eventTarget = Insider.dom(event.target);

            if ($eventTarget.hasClass(closeButtonClass)) {
                Insider.dom(giftWrapper).removeClass(hide);
                Insider.dom(`${ stickyBanner }, ${ closeButton }`).addClass(hide);

                Insider.utils.opt.sendCustomGoal(builderId, closeGoalId, true);

                /* OPT-167483 START */
                Insider.storage.set({
                    name: sessionStorageName,
                    value: true
                }, 'session');
                /* OPT-167483 END */
            }

            if ($eventTarget.hasClass(giftImage)) {
                Insider.dom(`${ stickyBanner }, ${ closeButton }`).removeClass(hide);
                Insider.dom(giftWrapper).addClass(hide);
            }

            /*if ($eventTarget.hasClass(stickyBannerClass)) {
                Insider.dom(closeButton).addClass(hide);
            }*/
        });

        setInterval(() => {
            Insider.dom(giftImageSelector).attr('src',
                `${ Insider.dom(giftImageSelector).attr('src') === iconAfter ? iconBefore : iconAfter }`);
        }, Insider.dateHelper.ONE_SECOND_AS_MILLISECOND * 1);
        /* OPT-164287 END */

        Insider.fns.onElementLoaded(memoryGameCoupon, () => {
            self.reset();
        }).listen();
    };

    return self.init();
})({});
/* OPT-159520 END */