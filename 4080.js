/* OPT-130513 START */
(function (self) {
    'use strict';

    const isMobile = Insider.browser.isMobile();
    const builderId = isMobile ? 4083 : 4082;
    const wheelOfFortuneBuilderId = isMobile ? 4081 : 4080; /* OPT-142280 */
    const wheelOfFortuneVariationId =
                Number(Insider.campaign.userSegment.getActiveVariationByBuilderId(wheelOfFortuneBuilderId));
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const wheelImage = `https://web-image.useinsider.com/fptshop/defaultImageLibrary/${ isMobile ?
        '3875120_CreateAgif-1724923119' : '3875120_CreateAgif-1724923119' }.gif`; /* OPT-157795 */
    const wheelOfFortuneStorageName = `sp-info-c-${ wheelOfFortuneVariationId }`;
    const isCouponExists = Insider.storage.localStorage.get(wheelOfFortuneStorageName);
    /* OPT-167483 START */
    const sessionStorageName = `ins-user-has-seen-campaign-${ variationId }`;
    const spinnedStorageName = `ins-user-has-spinned-campaign-${ wheelOfFortuneVariationId }`;
    const hasClosedCampaign = Insider.storage.session.get(sessionStorageName);
    const hasSpinned = Insider.storage.session.get(spinnedStorageName);
    /* OPT-167483 END */

    /* OPT-164287 START */
    const config = {
        iconBefore: 'https://image.useinsider.com/fptshop/defaultImageLibrary/item%20%286%29-1720447573.png',
        iconAfter: 'https://image.useinsider.com/fptshop/defaultImageLibrary/item%20%285%29-1720447610.png',
        closeGoalId: 140,
        /* OPT-167483 START */
        eligiblePages: {
            xiaomi: 'xiaomi',
            tinTuc: 'tin-tuc'
        }
        /* OPT-167483 END */
    };
    /* OPT-164287 END */
    const classes = {
        style: `ins-custom-style-${ variationId }`,
        goal: `sp-custom-${ variationId }-1`,
        /* OPT-164287 START */
        giftWrapper: `ins-custom-wrapper-${ variationId }`,
        container: `ins-icon-container-${ variationId }`,
        image: `ins-wheel-image-${ variationId }`,
        hide: `ins-hide-${ variationId }`,
        closeButton: `ins-custom-close-button-${ variationId }`,
        giftImage: `ins-custom-gift-image-${ variationId }`,
        /* OPT-164287 END */
    };

    const selectors = Object.keys(classes).reduce(function (createdSelector, key) {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        zalo: '.zalo-chat-widget',
        spinButton: '.ins-spin-button' /* OPT-167483 */
    });

    const isZaloExists = Insider.dom(selectors.zalo).exists();

    /* OPT-167483 START */
    self.init = () => {
        const { xiaomi, tinTuc } = config.eligiblePages;

        const pageUrl = window.location.href;
        const isPageEligible = Insider.systemRules.call('isOnMainPage')
            || Insider.fns.has(pageUrl, xiaomi)
            || Insider.fns.has(pageUrl, tinTuc);

        const campaignStatus = !isCouponExists && !hasClosedCampaign;

        self.reset();

        if (isPageEligible) {
            if (!Insider.campaign.isControlGroup(variationId) && campaignStatus && !hasSpinned) { /* OPT-167483 */
                self.buildCSS();
                self.buildHTML();
                self.setEvents();
            }

            return campaignStatus;
        }
    };
    /* OPT-167483 END */

    self.reset = () => {
        const { style, container, giftWrapper, closeButton } = selectors;

        Insider.dom(`${ style }, ${ container }, ${ giftWrapper }, ${ closeButton }`).remove();
    };

    /* OPT-145671 START */
    self.buildCSS = () => {
        const { giftWrapper, image, container, closeButton, hide, giftImage } = selectors; /* OPT-164287 */

        const bottomRate = isMobile ? '13%;' : '5%;';
        const style =
            `${ container } {
                display: block;
                position: fixed;
                bottom: ${ isZaloExists ? bottomRate : '2%;' };
                left: 1%; /* OPT-164287 */
                z-index: 999999;
                cursor: pointer;
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
                /* OPT-167483 START */
                ${ closeButton } {
                    bottom: 40% !important;
                }
                /* OPT-167483 END */
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
        const { container, closeButton, giftWrapper, giftImage, spinButton } = selectors; /* OPT-167483 */
        const { iconAfter, iconBefore } = config;
        const { hide, closeButton: closeButtonClass, giftImage: giftImageClass } = classes;
        const eventName = Insider.browser.isDesktop() ? 'click' : 'touchend';
        const hit = 'https://hit.api.useinsider.com/hit'; /* OPT-167483 */
        /* OPT-164287 END */

        Insider.eventManager.once(`pointerup.show:wheel:of:fortune:${ variationId }`,
            container, () => { /* OPT-164287 */
                if (!Insider.storage.localStorage.get(wheelOfFortuneStorageName)) {
                    Insider.storage.localStorage.remove(`sp-camp-${ wheelOfFortuneVariationId }`); /* OPT-150441 */

                    Insider.campaign.info.clearVisibleCampaignsByType('ON-PAGE');
                    /* OPT-142280 START */
                    setTimeout(() => {
                        Insider.campaign.info.show(wheelOfFortuneVariationId);
                        self.listenFormSubmit();
                    }, 500);
                /* OPT-142280 END */
                }
            });
        /* OPT-164287 START */
        Insider.eventManager.once(`${ eventName }.gift:wrapper:${ variationId }`, window, (event) => {
            const $eventTarget = Insider.dom(event.target);

            if ($eventTarget.hasClass(closeButtonClass)) {
                /* OPT-167483 START */
                self.closeCampaign();

                Insider.storage.set({
                    name: sessionStorageName,
                    value: true
                }, 'session');
                /* OPT-167483 END */
            }

            if ($eventTarget.hasClass(giftImageClass)) {
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

        /* OPT-167483 START */
        Insider.fns.onElementLoaded(spinButton, () => {
            Insider.eventManager.once(`${ eventName }.spin:button:${ variationId }`, spinButton, () => {
                Insider.utils.opt.ajaxListener((url, response, method) => {
                    if (Insider.fns.has(url, hit) && method === 'POST') {
                        Insider.storage.set({
                            name: spinnedStorageName,
                            value: true
                        }, 'session');

                        setTimeout(() => {
                            self.closeCampaign();
                        }, 3000);
                    }
                });
            });
        }).listen();
        /* OPT-167483 END */
    };

    self.listenFormSubmit = () => {
        Insider.utils.opt.ajaxListener((url, response, data) => {
            if (url.includes('/event/v1/insert') && !Insider.fns.isNull(data)) {
                Insider.dom(selectors.container).hide();
                Insider.dom(selectors.closeButton).hide();
            } else {
                Insider.logger.log('ajaxListener is not a function');
            }
        });
    };

    self.closeCampaign = () => {
        const { giftWrapper, container, closeButton } = selectors;
        const { hide } = classes;
        const { closeGoalId } = config;

        Insider.dom(giftWrapper).removeClass(hide);
        Insider.dom(`${ container }, ${ closeButton }`).addClass(hide);

        Insider.utils.opt.sendCustomGoal(builderId, closeGoalId, true);
    };
    /* OPT-142280 END */

    return self.init();
})({});
/* OPT-130513 END */