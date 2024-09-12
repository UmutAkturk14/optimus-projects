/* OPT-130513 START */
(function (self) {
    'use strict';

    var isMobile = Insider.browser.isMobile();
    var builderId = isMobile ? 4083 : 4082;
    var wheelOfFortuneBuilderId = isMobile ? 4081 : 4080; /* OPT-142280 */
    var wheelOfFortuneVariationId =
                Number(Insider.campaign.userSegment.getActiveVariationByBuilderId(wheelOfFortuneBuilderId));
    var variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const wheelImage = `https://image.useinsider.com/fptshop/defaultImageLibrary/${ isMobile ?
        'DealGiuaThang-ezgif.com-resize-1720772923' : 'DealGiuaThang-ezgif.com-resize-1720772923' }.gif`; /* OPT-157795 */
    var wheelOfFortuneStorageName = 'sp-info-c-' + wheelOfFortuneVariationId;
    var isCouponExists = Insider.storage.localStorage.get(wheelOfFortuneStorageName);

    /* OPT-164287 START */
    const config = {
        iconBefore: 'https://image.useinsider.com/fptshop/defaultImageLibrary/item%20%286%29-1720447573.png',
        iconAfter: 'https://image.useinsider.com/fptshop/defaultImageLibrary/item%20%285%29-1720447610.png',
        closeGoalId: 140
    };
    /* OPT-164287 END */
    var classes = {
        style: 'ins-custom-style-' + variationId,
        goal: 'sp-custom-' + variationId + '-1',
        /* OPT-164287 START */
        giftWrapper: `ins-custom-wrapper-${ variationId }`,
        container: 'ins-icon-container-' + variationId,
        image: 'ins-wheel-image-' + variationId,
        hide: `ins-hide-${ variationId }`,
        closeButton: `ins-custom-close-button-${ variationId }`,
        giftImage: `ins-custom-gift-image-${ variationId }`,
        /* OPT-164287 END */
    };

    var selectors = Object.keys(classes).reduce(function (createdSelector, key) {
        createdSelector[key] = '.' + classes[key];

        return createdSelector;
    }, {
        zalo: '.zalo-chat-widget'
    });

    var isZaloExists = Insider.dom(selectors.zalo).exists();

    self.init = function () {
        if (!Insider.campaign.isControlGroup(variationId) && !isCouponExists) {
            self.reset();
            self.buildCSS();
            self.buildHTML();
            self.setEvents();
        }

        return !isCouponExists;
    };

    self.reset = function () {
        Insider.dom(selectors.style + ', ' + selectors.wrapper).remove();
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
            }
            /* OPT-164287 END */
            ${ image } {
            height: 100%;
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
        const { hide, closeButton: closeButtonClass, giftImage: giftImageClass, image } = classes;
        const eventName = Insider.browser.isDesktop() ? 'click' : 'touchend';
        /* OPT-164287 END */

        Insider.eventManager.once(`pointerup.show:wheel:of:fortune:${ variationId }`, container, () => { /* OPT-164287 */
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
                Insider.dom(giftWrapper).removeClass(hide);
                Insider.dom(`${ container }, ${ closeButton }`).addClass(hide);

                Insider.utils.opt.sendCustomGoal(builderId, closeGoalId, true);
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
    };

    /* OPT-142280 START */
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
    /* OPT-142280 END */

    return self.init();
})({});
/* OPT-130513 END */