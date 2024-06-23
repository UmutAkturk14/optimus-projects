// Helpers - start
/**
 * @param {string} redirectLink
 * @returns {boolean}
 */

function isUrlEmpty(redirectLink) {
    return [undefined, '', 'javascript:void(0)', 'javascript:void(0);'].indexOf(redirectLink) > -1;
}/**
* @description Gets form translation for the countdown templates
* @returns {Object}
*/

function getFormTranslation() {
    const isOnApi = camp.id !== 0;
    const defaultConfig = {
        language: 'en_US',
        translation: {
            form1: { day: 'Day', hour: 'Hour', minute: 'Minute', second: 'Second' },
            form2: { day: 'Days', hour: 'Hours', minute: 'Minutes', second: 'Seconds' }
        }
    };
    let language = isOnApi
        ? Insider.campaign.get(camp.id).lang[0]
        : ((window.ActionBuilder && ActionBuilder.settings.campaignLang) || '').split(',')[0];

    if (Insider.fns.isUndefined(getFormTranslation.language)) {
        getFormTranslation.language = Insider.systemRules.call('getLang');
    }

    if (typeof Insider.utils.pluralForm[language] === 'undefined') {
        language = getFormTranslation.language;
    }

    return {
        language: language || defaultConfig.language,
        translation: Insider.utils.pluralForm.translations[language] || defaultConfig.translation,
    };
}/**
* @description main function to init coupon code Templates
*/

function initCouponCode() {
    const self = {};

    let mainWrapper = Insider.dom(`.ins-preview-wrapper-${ camp.id }`);
    const elements = {
        insCouponButton: '.ins-coupon-button',
        clipboardButton: mainWrapper.find('.ins-element-copy-to-clipboard-button'),
        copyButton: mainWrapper.find('.ins-coupon-button'),
        insCopyToClipboard: '.ins-copy-to-clipboard',
        insCopyToClipboardButton: '.ins-element-copy-to-clipboard-button',
        helloBarWrapper: '.ins-hello-bar-inner',
        responsiveBanner: '#ins-responsive-banner',
        inputError: '.ins-input-error-text',
        checkboxError: '.ins-validation-error',
        submitButton: 'a[id^="link-button-"]',
        slideContainer: '.ins-slider-container',
    };
    const coupon = `sp-info-c-${ camp.id }`;
    const isOnActionBuilder = camp.id === 0;

    self.construct = function () {
        setCouponStatus(); // helper

        if (isOnActionBuilder) {
            return false;
        }

        self.triggerCoupon();
        self.triggerClipBoard();
        self.setEvents();
    };

    self.triggerCoupon = function () {
        if (!self.isCouponExist()) {
            self.getCoupon();
        } else {
            self.useCoupon();
        }
    };

    self.triggerClipBoard = function () {
        if (typeof InsClipboard === 'undefined') {
            Insider.request.script({
                src: `${ Insider.__external.EITRI_URL }clipboard.min.js`,
                success: self.setCopyButton,
            });
        } else {
            self.setCopyButton();
        }
    };

    self.setEvents = function () {
        const clickEvent = 'click.insSideMenuCoupon';

        Insider.eventManager.on(clickEvent, elements.clipboardButton, function () {
            const $this = Insider.dom(this);
            const backgroundColor = $this.parent().data('after-click-color') || '#515252';
            let $couponButton = Insider.dom(elements.helloBarContainer).exists()
                ? Insider.dom(elements.helloBarContainer).find(elements.insCouponButton)
                : $this.closest(elements.insCouponButton);
            const afterClickText = $this.parent().attr('data-after-click-text') || '#{{After Click Text}}';

            if (Insider.dom(elements.slideContainer).exists()) {
                $couponButton = $this;
            }

            $this.text(afterClickText);

            $couponButton
                .attr('style', `${ $couponButton.attr('style') }; background-color: ${ backgroundColor } !important;`);
        });
    };

    /**
   * @returns {boolean}
   */
    self.isCouponExist = function () {
        return Insider.storage.get(coupon, 'localStorage', true) !== null;
    };

    self.useCoupon = function () {
        const couponCode = self.isCouponExist() ? Insider.storage.get(coupon, 'localStorage', true) : '';

        if (couponCode) {
            const couponContent = Insider.dom(elements.insCopyToClipboard, mainWrapper);

            elements.clipboardButton.attr('data-clipboard-text', couponCode);
            couponContent.html(couponContent.html().replace('@COUPONCODE', couponCode));
        }
    };

    self.getCoupon = function () {
        if (!Insider.__external[`insGetCoupon${ camp.id }`]) {
            Insider.__external[`insGetCoupon${ camp.id }`] = true;

            if (!mainWrapper.find(elements.responsiveBanner).exists()) {
                Insider.eventManager.dispatch(`getCoupon${ camp.id }`, self.useCoupon);
            } else {
                const submitButtonSelector = `.ins-preview-wrapper-${ camp.id } ${ elements.submitButton }`;

                Insider.eventManager
                    .off('click.insGetCoupon', submitButtonSelector)
                    .on('click.insGetCoupon', submitButtonSelector, () => {
                        mainWrapper = Insider.dom(`.ins-preview-wrapper-${ camp.id }`);

                        if (!mainWrapper.find(elements.inputError).exists()
                          && !mainWrapper.find(elements.checkboxError).exists()
                          && mainWrapper.find(elements.insCopyToClipboard).exists()) {
                            Insider.eventManager.dispatch(`getCoupon${ camp.id }`, self.useCoupon);
                        }
                    });
            }
        }
    };

    self.setCopyButton = function () {
        Insider.eventManager.dispatch(`setCopyButton${ camp.id }`, elements.insCopyToClipboardButton);
    };

    self.construct();
}/**
* @param {boolean|undefined} status
* @returns {void}
*/

function setCouponStatus(status) {
    const $couponButton = Insider.dom('.ins-element-copy-to-clipboard-button');
    const hasCoupon = status
      || '#{{Show Coupon Code}}' === 'block'
      || '#{{Coupon Code}}' === 'block'
      || '#{{Coupon}}' === 'true'
      || '#{{Coupon}}' === 'block'
      || $couponButton.closest('.ins-add-element-area').exists();

    $couponButton.attr('data-coupon-status', hasCoupon);
}/**
* @returns {boolean}
*/

function isArabic() {
    const rightToLeftLanguages = [
        'ar_AR', // Arabic
        'ar_AE', // Arabic (United Arab Emirates)
        'ar_DZ', // Arabic (Algeria)
        'ar_EG', // Arabic (Egypt)
        'ar_IQ', // Arabic (Iraq)
        'ar_JO', // Arabic (Jordan)
        'ar_KW', // Arabic (Kuwait)
        'ar_LB', // Arabic (Lebanon)
        'ar_LY', // Arabic (Libya)
        'ar_MA', // Arabic (Morocco)
        'ar_OM', // Arabic (Oman)
        'ar_QA', // Arabic (Qatar)
        'ar_SA', // Arabic (Saudi Arabia)
        'ar_SD', // Arabic (Sudan)
        'ar_SY', // Arabic (Syria)
        'ar_TN', // Arabic (Tunisia)
        'ar_YE', // Arabic (Yemen)
        'fa_IR', // Persian (Iran)
        'fa_AF', // Persian (Afghanistan - Dari)
        'ur_PK', // Urdu (Pakistan)
        'ur_IN', // Urdu (India)
        'he_IL', // Hebrew (Israel)
        'yi', // Yiddish
        'ps_AF', // Pashto (Afghanistan)
        'ku_TR', // Kurdish (Turkey)
        'ku_IR', // Kurdish (Iran)
        'ug_CN', // Uyghur (China)
        'sd_IN', // Sindhi (India)
        'sd_PK', // Sindhi (Pakistan)
        'ckb_IQ', // Central Kurdish (Iraq)
        'ckb_IR', // Central Kurdish (Iran)
    ];

    return rightToLeftLanguages.includes(Insider.systemRules.call('getLang'));
}/**
* @param {string} type
* @param {int} number
* @returns {string}
*/

function getNumberTranslation(type, number) {
    const $timeTextsWrapper = Insider.dom(`.ins-preview-wrapper-${ camp.id } .insCountdownWrapper > .insCountdown`);
    const config = JSON.parse($timeTextsWrapper.attr('data-countdown-translation') || '{}');

    if (config.translation && config.rules) {
        return getTranslationFromConfig(type, number, config);
    }

    const formTranslation = getFormTranslation();
    const campLang = formTranslation.language;
    const dateTrans = formTranslation.translation;

    return Insider.utils.pluralForm.getFormText(
        campLang,
        number,
        [
            dateTrans.form1[type],
            (dateTrans.form2 || [])[type],
            (dateTrans.form3 || [])[type],
            (dateTrans.form4 || [])[type],
        ]
    );
}/**
* @description used to redirect when clicked on the wrapper
* @param {Object} config
* @param {string} config.wrapper
* @param {string} config.redirectLink
* @param {string} [config.logClass]
* @param {boolean} [config.newTab]
*/

function manageRedirect(config) {
    if (camp.id !== 0 && !isUrlEmpty(config.redirectLink)) {
        $wrapper = Insider.dom(`.ins-preview-wrapper-${ camp.id } ${ config.wrapper }`);
        const namespace = '.insWrapperRedirect';
        const elementLinkClass = 'ins-element-link';

        $wrapper.css('cursor', 'pointer').addClass(elementLinkClass);

        Insider.eventManager.off(namespace, $wrapper).on(`click${ namespace }`, $wrapper, function (event) {
            const $element = Insider.dom(event.target);
            const isNewTab = typeof config.newTab === 'string' ? config.newTab !== 'false' : config.newTab;

            if ($element.attr('class').match(/ins-own-link-available|ins-close-button/) === null) {
                const $clickJoinElement = Insider.dom(`.ins-preview-wrapper-${ camp.id } ${ config.logClass }`);

                if ($clickJoinElement.exists()) {
                    $clickJoinElement.click();
                }

                if (isNewTab) {
                    window.open(config.redirectLink, '_blank');
                } else {
                    window.location.href = config.redirectLink;
                }

                return true;
            }
        });
    }
}/**
* @description init countdown
* @param {string} mainWrapper
* @returns {void}
*/

function countdown(mainWrapper) {
    const enums = {
        countdownElement: '.ins-element-countdown',
        visibleCountdown: '.ins-element-countdown:visible',
        contentWrapper: '.ins-content-wrapper',
        elementContent: '.ins-element-content',
        couponContent: '.ins-coupon-content',
        days: '.ins-days',
        hours: '.ins-hours',
        minutes: '.ins-min',
        seconds: '.ins-sec',
        firstFigure: '.ins-figure:nth-child(1)',
        secondFigure: '.ins-figure:nth-child(2)',
        top: '.top',
        bottom: '.bottom',
        topBack: '.top-back',
        bottomBack: '.bottom-back',
        countTitle: '.count-title',
        appTemplateSettings: '[data-template-settings]',
        requestUrls: {
            countdown: `${ Insider.__external.EITRI_URL }ins-countdown.js`,
            animation: `${ Insider.__external.EITRI_URL }ins-animation.js`,
        },
    };
    const wrapperElement = Insider.dom(mainWrapper);

    if (!Insider.dom(enums.visibleCountdown).exists() && !Insider.dom(enums.appTemplateSettings).exists()) {
        wrapperElement.show();

        return;
    }

    Insider.request.script({
        src: enums.requestUrls.countdown,
        success() {
            Insider.request.script({ src: enums.requestUrls.animation, success: templateInit });
        }
    });

    /**
   * @returns {void}
   */
    var templateInit = function () {
        const contentWrapper = Insider.dom(`${ enums.contentWrapper }-${ camp.id }`);
        const countdownElement = contentWrapper.find(enums.countdownElement).find(enums.elementContent);
        const couponElement = contentWrapper.find(enums.couponContent);

        if (couponElement.exists()) {
            initCouponCode();
        }

        if (!countdownElement.exists()) {
            wrapperElement.show();

            countdownElement.remove();

            return;
        }

        const days = Insider.dom(enums.days, countdownElement);
        const hours = Insider.dom(enums.hours, countdownElement);
        const minutes = Insider.dom(enums.minutes, countdownElement);
        const seconds = Insider.dom(enums.seconds, countdownElement);

        const $dayFigureOne = days.find(enums.firstFigure);
        const $dayFigureTwo = days.find(enums.secondFigure);
        const $hourFigureOne = hours.find(enums.firstFigure);
        const $hourFigureTwo = hours.find(enums.secondFigure);
        const $minuteFigureOne = minutes.find(enums.firstFigure);
        const $minuteFigureTwo = minutes.find(enums.secondFigure);
        const $secondFigureOne = seconds.find(enums.firstFigure);
        const $secondFigureTwo = seconds.find(enums.secondFigure);

        /**
       * @param {number} value
       * @param {jQuery} $figureOne
       * @param {jQuery} $figureTwo
       * @returns {void}
       */
        const checkTime = function (value, $figureOne, $figureTwo) {
            const newFirstDigit = (value || 0).toString().charAt(0);
            const newSecondDigit = (value || 0).toString().charAt(1);
            const $figureOneDigit = $figureOne.find(enums.top).eq(0).html();
            const $figureTwoDigit = $figureTwo.find(enums.top).eq(0).html();

            if (value >= 10) {
                // Animate only if the figure has changed
                if ($figureOneDigit !== newFirstDigit) {
                    animateFigure($figureOne, newFirstDigit);
                }

                if ($figureTwoDigit !== newSecondDigit) {
                    animateFigure($figureTwo, newSecondDigit);
                }
            } else {
                // If we are under 10, replace first figure with 0
                if ($figureOneDigit !== '0') {
                    animateFigure($figureOne, 0);
                }

                if ($figureTwoDigit !== newFirstDigit) {
                    animateFigure($figureTwo, newFirstDigit);
                }
            }
        };

        /**
       * @param {jQuery} $figure
       * @param {number} value
       * @returns {void}
       */
        var animateFigure = function ($figure, value) {
            const $topPart = $figure.find(enums.top);
            const $bottomPart = $figure.find(enums.bottom);
            const $backTopPart = $figure.find(enums.topBack);
            const $backBottomPart = $figure.find(enums.bottomBack);

            // Before we begin, change the back value
            $backTopPart.find('span').html(value);

            // Also change the back bottom value
            $backBottomPart.find('span').html(value);

            if ('#{{Design}}' !== 'ins-countdown-default') {
                $topPart.html(value);
                $bottomPart.html(value);

                return;
            }

            // Then animate
            window.InsAnimation.Animate.to($topPart, 0.8, {
                rotationX: '-180deg',
                transformPerspective: 300,
                ease: window.InsAnimation.Quart.easeOut,
                onComplete() {
                    $topPart.html(value);
                    $bottomPart.html(value);
                    window.InsAnimation.Animate.set($topPart, { rotationX: 0 });
                }
            });

            window.InsAnimation.Animate.to($backTopPart, 0.8, {
                rotationX: 0,
                transformPerspective: 300,
                ease: window.InsAnimation.Quart.easeOut,
                clearProps: 'all'
            });
        };

        if (Insider.__external[`camp:countdown:no${ camp.id }`]) {
            clearInterval(Insider.__external[`camp:countdown:no${ camp.id }`]);
        }

        const countdown = new insCountdown(
            {
                campID: camp.id,
                type: countdownElement.attr('data-countdown-type'),
                timerEndHour: countdownElement.attr('data-countdown-hour'),
                timerEndMinute: countdownElement.attr('data-countdown-minute'),
                recurringStartHour: countdownElement.attr('data-countdown-recurring-start-hour'),
                recurringEndHour: countdownElement.attr('data-countdown-recurring-end-hour'),
                endDate: countdownElement.attr('data-countdown-end-date'),
                endHour: countdownElement.attr('data-countdown-end-hour'),
                closeOnClick: countdownElement.attr('data-countdown-close') || 'off',
                countdownSecond: countdownElement.attr('data-countdown-second') || 'off',
                countdownHideDays: countdownElement.attr('data-countdown-hide-days') || 'off',
                elements: {
                    days,
                    hours,
                    minutes,
                    seconds
                }
            },
            function (values) {
                Insider.dom(enums.countTitle, days)
                    .html(getNumberTranslation('day', values.days) || 'Days');
                Insider.dom(enums.countTitle, hours)
                    .html(getNumberTranslation('hour', values.hours) || 'Hours');
                Insider.dom(enums.countTitle, minutes)
                    .html(getNumberTranslation('minute', values.minutes) || 'Minutes');
                Insider.dom(enums.countTitle, seconds)
                    .html(getNumberTranslation('second', values.seconds) || 'Seconds');
                // Days
                checkTime(values.days, $dayFigureOne, $dayFigureTwo);
                // Hours
                checkTime(values.hours, $hourFigureOne, $hourFigureTwo);
                // Minutes
                checkTime(values.minutes, $minuteFigureOne, $minuteFigureTwo);
                // Seconds
                checkTime(values.seconds, $secondFigureOne, $secondFigureTwo);

                wrapperElement.show();
            }
        );

        Insider.__external[`camp:countdown:no${ camp.id }`] = countdown.countInterval;

        initCouponCode();
    };
}/**
* @returns {void}
*/

function initResponsiveCss() {
    const cssId = 'static-responsive';
    const cssFilePath = `${ Insider.__external.STATIC_URL }css/responsive-layout.min.css`;

    if (Insider.dom(`#${ cssId }`).exists()) {
        return false;
    }

    Insider.dom('head').append(
        `<link id ="${ cssId }" rel="stylesheet" ` + `href="${ cssFilePath }" type="text/css" />`
    );
}/**
* @returns {void}
*/

function setCountdownTextPadding() {
    const countdownDesign = '#{{Design}}';
    const countdownTextVisibility = '#{{Show Countdown Text}}';
    const $countdownSeparator = Insider.dom('.ins-countdown-separator');
    let height;

    if (countdownDesign === 'ins-countdown-big-numbers'
      || countdownDesign === 'ins-countdown-digital-dark'
      || countdownDesign === 'ins-countdown-digital-white') {
        height = 'auto';
    } else if (countdownTextVisibility === 'block' && countdownDesign === 'ins-countdown-default') {
        height = 'calc(46px + (#{{Countdown Text Padding}}px * 1.9))';
    } else if (countdownTextVisibility === 'block') {
        height = 'calc(46px + #{{Countdown Text Padding}}px)';
    } else {
        height = '32px';
    }

    $countdownSeparator.css('height', height);
}// Helpers - end

const previewWrapper = `.ins-preview-wrapper-${ camp.id }`;
const responsiveBanner = {
    notificationContent: `.ins-notification-content-${ camp.id }`,
    elementContainer: `${ previewWrapper } .ins-responsive-banner-element-container`,
    closeButton: `${ previewWrapper } .ins-element-close-button`,
    rtl: 'ins-responsive-banner-rtl',
    defaultCursor: 'ins-default-cursor',
    redirectLink: '#{{Top Bar Link}}',
    newTab: '#{{Open In New Tab}}',
    image: `${ previewWrapper } .ins-element-image`,
    resetPaddingClass: 'ins-reset-padding',
    layoutWrapper: `${ previewWrapper } .ins-responsive-banner-layout-container:visible .ins-layout-wrapper`,
};
const elementLibrary = {
    image: `${ previewWrapper } .ins-sticker-element`,
    text: `${ previewWrapper } .adaptive-title`,
    countdown: `${ previewWrapper } .ins-countdown-element-content`,
    button: `${ previewWrapper } .ins-adaptive-button-wrapper`,
    couponCode: `${ previewWrapper } .ins-coupon-content`,
};
const isOnApi = camp.id !== 0;
let isResize = false;
const redirectList = [
    {
        wrapper: responsiveBanner.notificationContent,
        redirectLink: responsiveBanner.redirectLink,
        newTab: responsiveBanner.newTab,
    }
];

/**
* @returns {void}
*/
const initialize = function () {
    initTemplate();
    setEvents();
    initResponsiveCss();
    setCountdownTextPadding();
    changeDynamicText(); /* OPT-157642 */
};

/**
* @returns {boolean}
*/
var initTemplate = function () {
    removeImagePadding();
    setAllRedirectLink();

    if (isArabic()) {
        changeRightToLeft();
    }

    if (isResize) {
        return false;
    }

    if (Insider.dom(elementLibrary.couponCode).exists()) {
        initCouponCode();
    }

    countdown(previewWrapper);
    setDefaultCursor();

    return true;
};

/**
* @returns {void}
*/
var removeImagePadding = function () {
    Insider.dom(responsiveBanner.image).parent().addClass(responsiveBanner.resetPaddingClass);
};

/**
* @returns {void}
*/
var setAllRedirectLink = function () {
    Insider.dom(responsiveBanner.layoutWrapper).each(function (key, element) {
        const $that = Insider.dom(element);
        const redirectObject = {
            wrapper: `#${ $that.attr('id') }`,
            redirectLink: $that.attr('data-href'),
            newTab: $that.attr('data-blank'),
        };

        redirectList.push(redirectObject);
    });

    callManageRedirect();
};

/**
* @returns {void}
*/
var callManageRedirect = function () {
    redirectList.forEach(function (value) {
        manageRedirect({
            wrapper: value.wrapper,
            redirectLink: value.redirectLink,
            newTab: value.newTab,
        });
    });
};

/**
* @returns {void}
*/
var changeRightToLeft = function () {
    Insider.dom(`${ responsiveBanner.elementContainer }, ${ responsiveBanner.closeButton }`).addClass(responsiveBanner.rtl);
};

/**
* @returns {void}
*/
var setDefaultCursor = function () {
    if (isOnApi) {
        Insider.dom(`${ elementLibrary.image }, ${ elementLibrary.couponCode }, ${
            elementLibrary.countdown }, ${ elementLibrary.button }, ${ elementLibrary.text }`)
            .addClass(responsiveBanner.defaultCursor);
    }
};

/**
* @returns {void}
*/
var setEvents = function () {
    Insider.eventManager.once(`resize.responsiveBanner:${ camp.id }`, window, function () {
        isResize = true;

        initialize();
    });

    Insider.eventManager.once(`framelessInited${ camp.id }`, function () {
        initialize();
    });
};

/* OPT-157642 START */
const changeDynamicText = () => {
    const selector = {
        web: '#editable-text-17129305297460',
        mobile: '#editable-text-17129305297461',
        tablet: '#editable-text-17129305297462'
    }[Insider.browser.getPlatform()];

    const campaignText = Insider.dom(selector).text().trim();
    const productPrice = Insider.systemRules.call('getCurrentProduct').price.toFixed(2) * 0.10;
    const firstWord = campaignText.split(' ')[0];
    const newFirstWord = `+${ productPrice.toFixed(2) }`;
    const newText = campaignText.replace(firstWord, newFirstWord);

    Insider.dom(selector).text(newText);
};
/* OPT-157642 END */

initialize();
