<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> cf379e5 (Uploading the task files.)
// Helpers - start
/**
 * @param {boolean|undefined} status
 * @returns {void}
 */


function setCouponStatus(status) {
    var $couponButton = Insider.dom('.ins-element-copy-to-clipboard-button');
    var hasCoupon = status
        || '#{{Show Coupon Code}}' === 'block'
        || '#{{Coupon Code}}' === 'block'
        || '#{{Coupon}}' === 'true'
        || '#{{Coupon}}' === 'block'
        || $couponButton.closest('.ins-add-element-area').exists();

    $couponButton.attr('data-coupon-status', hasCoupon);}/**
 * @description main function to init coupon code Templates
 */

function initCouponCode() {
    var self = {};

    var mainWrapper = Insider.dom('.ins-preview-wrapper-' + camp.id);
    var elements = {
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
    var coupon = 'sp-info-c-' + camp.id;
    var isOnActionBuilder = camp.id === 0;

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
                src: Insider.__external.EITRI_URL + 'clipboard.min.js',
                success: self.setCopyButton,
            });
        } else {
            self.setCopyButton();
        }
    };

    self.setEvents = function () {
        var clickEvent = 'click.insSideMenuCoupon';

        Insider.eventManager.on(clickEvent, elements.clipboardButton, function () {
            var $this = Insider.dom(this);
            var backgroundColor = $this.parent().data('after-click-color') || '#515252';
            var $couponButton = Insider.dom(elements.helloBarContainer).exists()
                ? Insider.dom(elements.helloBarContainer).find(elements.insCouponButton)
                : $this.closest(elements.insCouponButton);
            var afterClickText = $this.parent().attr('data-after-click-text') || '#{{After Click Text}}';

            if (Insider.dom(elements.slideContainer).exists()) {
                $couponButton =  $this;
            }

            $this.text(afterClickText);

            $couponButton
                .attr('style', $couponButton.attr('style') + '; background-color: ' + backgroundColor + ' !important;');
        });
    };

    /**
     * @returns {boolean}
     */
    self.isCouponExist = function () {
        return Insider.storage.get(coupon, 'localStorage', true) !== null;
    };

    self.useCoupon = function () {
        var couponCode = self.isCouponExist() ? Insider.storage.get(coupon, 'localStorage', true) : '';

        if (couponCode) {
            var couponContent = Insider.dom(elements.insCopyToClipboard, mainWrapper);

            elements.clipboardButton.attr('data-clipboard-text', couponCode);
            couponContent.html(couponContent.html().replace('@COUPONCODE', couponCode));
        }
    };

    self.getCoupon = function () {
        if (!Insider.__external['insGetCoupon' + camp.id]) {
            Insider.__external['insGetCoupon' + camp.id] = true;

            if (!mainWrapper.find(elements.responsiveBanner).exists()) {
                Insider.eventManager.dispatch('getCoupon' + camp.id, self.useCoupon);
            } else {
                const submitButtonSelector = `.ins-preview-wrapper-${camp.id} ${elements.submitButton}`

                Insider.eventManager
                    .off('click.insGetCoupon', submitButtonSelector)
                    .on('click.insGetCoupon', submitButtonSelector, () => {
                        mainWrapper = Insider.dom(`.ins-preview-wrapper-${camp.id}`);

                        if (!mainWrapper.find(elements.inputError).exists()
                            && !mainWrapper.find(elements.checkboxError).exists()
                            && mainWrapper.find(elements.insCopyToClipboard).exists()) {
                            Insider.eventManager.dispatch('getCoupon' + camp.id, self.useCoupon);
                        }
                    });
            }
        }
    };

    self.setCopyButton = function () {
        Insider.eventManager.dispatch('setCopyButton' + camp.id, elements.insCopyToClipboardButton);
    };

    self.construct();}/**
 * @returns {boolean}
 */

function isArabic() {
    const rightToLeftLanguages = [
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

    return rightToLeftLanguages.includes(Insider.systemRules.call('getLang'));}/**
 * @param {number|string} campId
 * @param {Array<object>} formConfig
 * @returns {void}
 */
function applyMultipleSettings(campId, formConfig) {
    var initializeMultipleSettingsCss = function () {
        var config = typeof formConfig === 'string' ? JSON.parse(formConfig) : (formConfig || []);
        var attributeConfig = getAttributeConfigs();
        var cssConfig = getCssSettings(config.concat(attributeConfig));

        appendSettingsAsCssContent(cssConfig);
    };

    /**
     * @returns {Array<object>}
     */
    var getAttributeConfigs = function () {
        var config = [];

        Insider.dom('[data-multiple-settings]').each(function (index, element) {
            var $target = Insider.dom(element);

            config.push({
                type: $target.attr('id').match(/input|option|button/),
                uid: $target.attr('id'),
                id: $target.attr('id').split('-').pop(),
                settings: JSON.parse($target.attr('data-multiple-settings') || '{}'),
            });
        });

        return config;
    };

    /**
     * @param {string} tabType
     * @param {string} elementType
     * @param {string} uid
     * @returns {string}
     */
    var getCssSelector = function (tabType, elementType, uid) {
        var mainSelector = '.ins-preview-wrapper-' + campId + ' #' + uid;

        switch (tabType) {
            case 'default':
            case 'button_default':
                return {
                    text: mainSelector + ' input',
                    checkbox: mainSelector + ' input:not(:checked) ~ label:after',
                    button: mainSelector + ' a[id*="link-"]:link',
                }[elementType];

            case 'filled':
                return mainSelector + ' input:not(:placeholder-shown)';

            case 'hover':
                return mainSelector + ' a[id*="link-"]:hover';

            case 'checked':
                return mainSelector + ' input:checked ~ label:after';

            case 'clicked':
                return mainSelector + ' a[id*="link-"]:active';

            case 'error':
                return {
                    text: mainSelector + ' [class*="error"] ~ input',
                    checkbox: mainSelector + ' [class*="error"]:not(:checked) ~ label:after',
                }[elementType];

            default:
                return '';
        }
    };

    /**
     * @param {object} formConfig
     * @returns {object}
     */
    var getCssSettings = function (formConfig) {
        var multipleSettings = ['button_default', 'default', 'filled', 'hover', 'clicked', 'checked', 'error'];
        var cssConfig = {};

        formConfig.forEach(function (config) {
            Object.entries(config.settings).forEach(function (setting) {
                var tabType = setting[0];
                var value = setting[1];

                if (multipleSettings.indexOf(tabType) < 0) {
                    return;
                }

                var selector = getCssSelector(tabType, config.type, config.uid);

                cssConfig[selector] = getCssFields(value);

                if (value.placeholder) {
                    cssConfig[selector + '::placeholder'] = convertFontStyle(value.placeholder);
                }

                if (value['error-message']) {
                    var errorSelector = '.ins-preview-wrapper-' + campId + ' #' + config.uid +
                        ' [class*="error"]:first-child';

                    cssConfig[errorSelector] = convertFontStyle(value['error-message']);
                }
            });
        });

        return cssConfig;
    };

    /**
     * @param {object} cssConfig
     * @returns {object}
     */
    var getCssFields = function (cssConfig) {
        return Object.fromEntries(
            Object.entries(cssConfig).filter(function (data) {
                return typeof data[1] !== 'object';
            })
        );
    };

    /**
     * @param {object} properties
     * @returns {object}
     */
    var convertFontStyle = function (properties) {
        properties['text-decoration'] = getTextDecorationValue(properties['font-style']);
        properties['font-weight'] = properties['font-style'].bold ? '700' : 'normal';
        properties['font-style'] = properties['font-style'].italic ? 'italic' : 'normal';

        return properties;
    };

    /**
     * @param {object} fontStyle
     * @returns {string}
     */
    var getTextDecorationValue = function (fontStyle) {
        var underline = fontStyle.underline ? 'underline' : '';
        var strike = fontStyle.strike ? 'line-through' : '';

        return underline + ' ' + strike;
    };

    /**
     * @param {object} elementsStyles
     * @returns {void}
     */
    var appendSettingsAsCssContent = function (elementsStyles) {
        var styleElementClass = 'ins-multiple-settings-style-' + campId + ' ins-multiple-settings-style';
        var styleElementSelector = '.ins-multiple-settings-style';
        var element = document.createElement('style');
        var content = '';

        Object.entries(elementsStyles).forEach(function (elementsStyle) {
            content += elementsStyle[0] + ' {';

            Object.entries(elementsStyle[1]).forEach(function (style) {
                content += style[0] + ':' + style[1] + '!important;';
            });

            content += '}';
        });

        element.className = styleElementClass;
        element.innerHTML = content;

        Insider.dom(styleElementSelector).remove();
        Insider.dom('head').append(element);
    };

    initializeMultipleSettingsCss();}/**
 * @returns {void}
 */

function initResponsiveCss() {
    var cssId = 'static-responsive';
    var cssFilePath = Insider.__external.STATIC_URL + 'css/responsive-layout.min.css';

    if (Insider.dom('#' + cssId).exists()) {
        return false;
    }

    Insider.dom('head').append(
        '<link id ="' + cssId + '" rel="stylesheet" ' + 'href="' + cssFilePath + '" type="text/css" />'
    );}/**
 * @description init countdown
 * @param {string} mainWrapper
 * @returns {void}
 */

function countdown(mainWrapper) {
    var enums = {
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
            countdown: Insider.__external.EITRI_URL + 'ins-countdown.js',
            animation: Insider.__external.EITRI_URL + 'ins-animation.js',
        },
    };
    var wrapperElement = Insider.dom(mainWrapper);

    if (!Insider.dom(enums.visibleCountdown).exists() && !Insider.dom(enums.appTemplateSettings).exists()) {
        wrapperElement.show();

        return;
    }

    Insider.request.script({
        src: enums.requestUrls.countdown,
        success: function () {
            Insider.request.script({ src: enums.requestUrls.animation, success: templateInit });
        }
    });

    /**
     * @returns {void}
     */
    var templateInit = function () {
        var contentWrapper = Insider.dom(enums.contentWrapper + '-' + camp.id);
        var countdownElement = contentWrapper.find(enums.countdownElement).find(enums.elementContent);
        var couponElement = contentWrapper.find(enums.couponContent);

        if (couponElement.exists()) {
            initCouponCode();
        }

        if (!countdownElement.exists()) {
            wrapperElement.show();

            countdownElement.remove();

            return;
        }

        var days = Insider.dom(enums.days, countdownElement);
        var hours = Insider.dom(enums.hours, countdownElement);
        var minutes = Insider.dom(enums.minutes, countdownElement);
        var seconds = Insider.dom(enums.seconds, countdownElement);

        var $dayFigureOne = days.find(enums.firstFigure);
        var $dayFigureTwo = days.find(enums.secondFigure);
        var $hourFigureOne = hours.find(enums.firstFigure);
        var $hourFigureTwo = hours.find(enums.secondFigure);
        var $minuteFigureOne = minutes.find(enums.firstFigure);
        var $minuteFigureTwo = minutes.find(enums.secondFigure);
        var $secondFigureOne = seconds.find(enums.firstFigure);
        var $secondFigureTwo = seconds.find(enums.secondFigure);

        /**
         * @param {number} value
         * @param {jQuery} $figureOne
         * @param {jQuery} $figureTwo
         * @returns {void}
         */
        var checkTime = function (value, $figureOne, $figureTwo) {
            var newFirstDigit = (value || 0).toString().charAt(0);
            var newSecondDigit = (value || 0).toString().charAt(1);
            var $figureOneDigit = $figureOne.find(enums.top).eq(0).html();
            var $figureTwoDigit = $figureTwo.find(enums.top).eq(0).html();

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
            var $topPart = $figure.find(enums.top);
            var $bottomPart = $figure.find(enums.bottom);
            var $backTopPart = $figure.find(enums.topBack);
            var $backBottomPart = $figure.find(enums.bottomBack);

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
                onComplete: function () {
                    $topPart.html(value);
                    $bottomPart.html(value);
                    window.InsAnimation.Animate.set($topPart, {rotationX: 0});
                }
            });

            window.InsAnimation.Animate.to($backTopPart, 0.8, {
                rotationX: 0,
                transformPerspective: 300,
                ease: window.InsAnimation.Quart.easeOut,
                clearProps: 'all'
            });
        };

        new insCountdown(
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
                    days: days,
                    hours: hours,
                    minutes: minutes,
                    seconds: seconds
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

        initCouponCode();
    };}/**
 * @param {string} type
 * @param {int} number
 * @returns {string}
 */

function getNumberTranslation(type, number) {
    const $timeTextsWrapper = Insider.dom(`.ins-preview-wrapper-${camp.id} .insCountdownWrapper > .insCountdown`);
    const config = JSON.parse($timeTextsWrapper.attr('data-countdown-translation') || '{}');

    if (config.translation && config.rules) {
        return getTranslationFromConfig(type, number, config);
    }

    var formTranslation = getFormTranslation();
    var campLang = formTranslation.language;
    var dateTrans = formTranslation.translation;

    return Insider.utils.pluralForm.getFormText(
        campLang,
        number,
        [
            dateTrans.form1[type],
            (dateTrans.form2 || [])[type],
            (dateTrans.form3 || [])[type],
            (dateTrans.form4 || [])[type],
        ]
    );}/**
 * @description Gets form translation for the countdown templates
 * @returns {Object}
 */

function getFormTranslation() {
    var isOnApi = camp.id !== 0;
    var defaultConfig = {
        language: 'en_US',
        translation: {
            form1: { day: 'Day', hour: 'Hour', minute: 'Minute', second: 'Second' },
            form2: { day: 'Days', hour: 'Hours', minute: 'Minutes', second: 'Seconds' }
        }
    };
    var language = isOnApi
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
    };}/**
 * @param {string} redirectLink
 * @returns {boolean}
 */

function isUrlEmpty(redirectLink) {
    return [undefined, '', 'javascript:void(0)', 'javascript:void(0);'].indexOf(redirectLink) > -1;}/**
 * @description used to redirect when clicked on the wrapper
 * @param {Object} config
 * @param {string} config.wrapper
 * @param {string} config.redirectLink
 * @param {string} [config.logClass]
 * @param {boolean} [config.newTab]
 */

function manageRedirect(config) {
    if (camp.id !== 0 && !isUrlEmpty(config.redirectLink)) {
        $wrapper = Insider.dom(config.wrapper);
        var namespace = '.insWrapperRedirect';
        var elementLinkClass = 'ins-element-link';

        $wrapper.css('cursor', 'pointer').addClass(elementLinkClass);

        Insider.eventManager.off(namespace, $wrapper).on('click' + namespace, $wrapper, function (event) {
            var $element = Insider.dom(event.target);
            var isNewTab = typeof config.newTab === 'string' ? config.newTab !== 'false' : config.newTab;

            if ($element.attr('class').match(/ins-own-link-available|ins-close-button/) === null) {
                var $clickJoinElement = Insider.dom(config.logClass);

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
    }}/**
 * @returns {void}
 */
function setCountdownTextPadding() {
    var countdownDesign = '#{{Design}}';
    var countdownTextVisibility = '#{{Show Countdown Text}}';
    var $countdownSeparator = Insider.dom('.ins-countdown-separator');
    var height;

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

    $countdownSeparator.css('height', height);}/**
 * @param {string} type
 * @param {int} number
 * @param {string} config
 * @returns {string}
 */

function getTranslationFromConfig(type, number, config) {
    const { translation, rules } = config;
    const formIndex = rules?.map(fn => new Function('c', fn)(number)).indexOf(true) || 0;

    return translation[`form${(formIndex + 1)}`][type];}// Helpers - end
var previewWrapper = '.ins-preview-wrapper-' + camp.id;
var selectors = {
    notificationContent: '.ins-notification-content-' + camp.id,
    elementContainer: previewWrapper + ' .ins-responsive-banner-element-container',
    phoneCountryCodeList: previewWrapper + ' .ins-phone-country-code-list',
    countryList: previewWrapper + ' .ins-list-country',
    countryContent: previewWrapper + ' .ins-phone-country-code-content',
    countryFlag: previewWrapper + ' .ins-country-flag',
    dialCode: previewWrapper + ' .ins-dial-code',
    wrapElement: '.ins-element-wrap:eq(0)',
    phoneInput: 'input[inputtype="phone-input"]',
    scriptStyleId: '#ins-phone-country-flag-style',
    countryCodeSwitch: '#default-country-code-switch',
    layoutWrapper: previewWrapper + ' .ins-responsive-banner-layout-container:visible .ins-layout-wrapper',
    multipleSettingsStyle: '.ins-multiple-settings-style',
};
var scriptsEnums = {
    utils: Insider.__external.EITRI_URL + 'ins-utils.js',
    mask: Insider.__external.EITRI_URL + 'ins-mask.js',
    css: Insider.__external.EITRI_URL + 'phone-country-flag.min.css',
};
var phoneMasks = {};
var isMobile = Insider.browser.isMobile();
var classes = {
    rtl: 'ins-responsive-banner-rtl',
    displayNone: 'ins-display-none',
};
var isOnApi = camp.id !== 0;
var redirectList = [
    {
        wrapper: selectors.notificationContent,
        redirectLink: selectors.redirectLink,
        newTab: selectors.newTab,
    }
];

/**
 * @returns {void}
 */
var initialize = function () {
    loadPhoneScripts();
    initResponsiveCss();
    setCountdownTextPadding();
    setPopup(); /* OPT-162612 */

    if (!isOnApi) {
        applyMultipleSettings(camp.id, camp.formConfig);
    }

    initCouponCode();
    countdown(previewWrapper);
    setAllRedirectLink();

    if (isArabic()) {
        changeRightToLeft();
    }

    setTimeout(function () {
        if (typeof window.InsiderIMask === 'function') {
            setCountryList();
            updatePhonePlaceHolder();
        }
    }, 1000);

    Insider.dom(selectors.phoneCountryCodeList).addClass(classes.displayNone);

    setEvents();
};

/* OPT-162612 START */
const setPopup = () => {
    'use strict';

    const self = {};
    const variationId = camp.id;

    const customClasses = {
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        closeButton: `ins-close-button-${ variationId }`,
        header: `ins-header-${ variationId }`,
        hide: `ins-hide-${ variationId }`,
        clickText: `ins-click-text-${ variationId }`,
        wrongClickText: 'ins-click-text-0',
    };

    const customSelectors = Insider.fns.keys(customClasses).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ customClasses[key] }`, createdSelector
    ), {
        gdprText: `${ previewWrapper } [data-element-name="GDPR Policy"] .ins-element-editable`
    });

    const config = {
        headerText: 'Disclaimer',
        text1: 'I understand that TKM may process certain personal and/or sensitive personal data collected herein of myself, for the purpose of providing requisite services on my vehicle(s) and/or for promotional activities',
        text2: 'I hereby acknowledge and give my consent to TKM: (a) to process the provided information for the purposes mentioned above and for its internal and business purposes and; (b) for sharing with its affiliate companies, service providers and other such business partners as deemed fit by TKM.',
        text3: 'I hereby consent to TKM, its affiliates and service providers to process my personal data for the purposes of marketing and for any other related or incidental business purposes.',
        knowMore: 'Know more'
    };

    self.init = () => {
        self.reset();
        self.buildCSS();
        self.buildHTML();
        self.setEvents();
    };

    self.reset = () => {
        const { style, wrapper, clickText, wrongClickText } = customSelectors;

        Insider.dom(`${ style }, ${ wrapper }, ${ clickText }, ${ wrongClickText }`).remove();
    };

    self.buildCSS = () => {
        const { wrapper, closeButton, header, hide, clickText } = customSelectors;

        const customStyle =
        `${ wrapper } {
            position: fixed;
            top: 287px;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 640px;
            transition: all 0.3s;
            z-index: 9999999999999999999;
            background-color: #fff !important;
            box-shadow: #ccc 0 0 8px 0 !important;
        }
        ${ closeButton } {
            cursor: pointer;
            height: 30px;
            width: 33px;
            font-size: 15px;
            line-height: 28px;
            text-align: center;
            box-shadow: -1px 0 0px 0 rgba(0, 0, 0, 0.2);
            color: #000;
            opacity: .2;
            position: absolute;
            right: 0;
            top: 0;
        }
        ${ header } {
            font-size: 14px;
            font-weight: 600;
            color: #e10a1d;
            text-transform: uppercase;
            margin-top: 10px;
            text-align: center;
            line-height: 1.42857143;
            font-family: ToyotaType-Regular;
        }
        ${ wrapper } ul {
            font-family: ToyotaType-Regular;
            font-size: 12px;
            line-height: 16px;
            font-weight: 500;
            width: 100%;
            padding: 15px;
            padding-left: 55px;
            margin-bottom: 10px;
        }
        ${ wrapper } li {
            list-style-type: disc;
        }
        ${ hide } {
            visibility: none;
            opacity: 0;
        }
        ${ clickText } {
            color: #000000 !important;
        }
        ${ clickText }:hover {
            color: #23527c !important;
            cursor: pointer;
        }
        @media screen and (max-width: 767px) {
            ${ wrapper } {
               width: 100%;
            }
        }`;

        Insider.dom('<style>').addClass(customClasses.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const { wrapper, closeButton, header, hide, clickText } = customClasses;
        const { headerText, text1, text2, text3, knowMore } = config;

        const wrapperHtml =
        `<div class="${ wrapper } ${ hide }">
            <div class="${ closeButton }">×</div>
            <div class="${ header }">${ headerText }</div>
            <ul>
                <li>${ text1 }</li>
                <li>${ text2 }</li>
                <li>${ text3 }</li>
            </ul>
        </div>`;

        const clickTextHtml = `<span class="${ clickText }">${ knowMore }</span>`;

        Insider.dom(customSelectors.gdprText).append(clickTextHtml);

        Insider.dom('body').append(wrapperHtml);
    };

    self.setEvents = () => {
        const { closeButton, wrapper, clickText } = customSelectors;
        const { hide } = customClasses;

        Insider.eventManager.once(`click.slide:products:${ variationId }`, closeButton, () => {
            Insider.dom(wrapper).addClass(hide);
        });

        Insider.eventManager.once(`click.know:more:${ variationId }`, clickText, () => {
            Insider.dom(wrapper).removeClass(hide);
        });
    };

    self.init();
};
/* OPT-162612 END */

/**
 * @returns {void}
 */
var loadPhoneScripts = function () {
    if (!Insider.dom(selectors.scriptStyleId).exists()) {
        Insider.dom('head').append('<link id="ins-phone-country-flag-style" rel="stylesheet" href="' +
        scriptsEnums.css + '" type="text/css" />');
    }

    if (typeof window.InsiderIMask !== 'function') {
        Insider.request.script({ src: scriptsEnums.utils });
        Insider.request.script({ src: scriptsEnums.mask });
    }
};

/**
 * @returns {void}
 */
var setAllRedirectLink = function () {
    Insider.dom(selectors.layoutWrapper).each(function (key, element) {
        var $that = Insider.dom(element);
        var redirectObject = {
            wrapper: '#' + $that.attr('id'),
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
    redirectList.forEach(function(value) {
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
    Insider.dom(selectors.elementContainer + ', ' + selectors.closeButton).addClass(classes.rtl);
};

/**
 * @param {Element} countryFlagElement
 * @param {Element} phoneInputElement
 * @returns {void}
 */
var changeCountryFlag = function (countryFlagElement, phoneInputElement) {
    Insider.dom(countryFlagElement).nodes[0].className = 'ins-country-flag ' +
        Insider.dom(phoneInputElement).attr('country-code');
};

/**
 * @param {Element} element
 * @returns {void}
 */
var setInputMask = function (element) {
    var maskOptions = {
        mask: '',
        overwrite: true,
    };

    if (typeof window.InsiderIMask !== 'function' || Insider.dom(element).val() !== '') {
        return;
    }

    if (phoneMasks[element.id]) {
        phoneMasks[element.id].destroy();
    }

    phoneMasks[element.id] = window.InsiderIMask(element, maskOptions);
};

/**
 * @param {Element} element
 * @returns {void}
 */
var maskInputHolder = function (element) {
    setInputMask(element);

    phoneMasks[element.id].updateOptions({
        mask: Insider.dom(element).attr('placeholder').replace(/[1-9]/g, 0),
    });
};

/**
 * @returns {void}
 */
var setCountryList = function () {
    if (!isOnApi) {
        return;
    }

    Insider.dom(selectors.phoneCountryCodeList).each(function (index, element) {
        var startingCountryCode =
                Insider.dom(Insider.dom(element).nodes[0]
                    .previousElementSibling)
                    .find('div')
                    .attr('class')
                    .split(' ')
                    .pop();
        var input = Insider.dom(element)
            .parents(selectors.wrapElement)
            .find('input');

        input.attr('country-code', startingCountryCode);

        Insider.dom(Insider.dom(element).nodes[0]).find('li').nodes.some(function (listElement, position) {
            var isCountryCodeMatch = startingCountryCode === Insider.dom(listElement).attr('data-country-name');

            if (isCountryCodeMatch) {
                Insider.dom(listElement).attr('aria-selected', true);
                input.attr('data-dial-code', Insider.dom(listElement).attr('data-dial-code'));
            }

            return isCountryCodeMatch;
        });
    });
};

/**
 * @returns {void}
 */
var updatePhonePlaceHolder = function () {
    Insider.dom(selectors.phoneInput).each(function (index, element) {
        if (Insider.dom(element).attr('country-code') === 'id') {
            Insider.dom(element).attr('placeholder', '8543-7693-23212');
        } else {
            var exampleNumber = Insider
                    .__external
                    .getExampleNumber(Insider.dom(element).attr('country-code'),
                    true,
                    Insider.__external.numberType.MOBILE
                );

            Insider.dom(element).attr('placeholder', exampleNumber).val('');
        }
    });
};

/**
 * @returns {void}
 */
var setEvents = function () {
    Insider.eventManager.once('click.on:phone:input:' + camp.id, selectors.phoneInput, function () {
        maskInputHolder(Insider.dom(this).nodes[0]);
    });

    if (!isMobile) {
        Insider.eventManager.once('click.show:country:dropdown:' + camp.id, selectors.countryContent, function (event) {
            if (Insider.dom(event.currentTarget.nextElementSibling).hasClass(classes.displayNone)
            && isOnApi) {
                Insider.dom(event.currentTarget.nextElementSibling).removeClass(classes.displayNone);
                Insider.dom(event.currentTarget).parents(selectors.wrapElement).css('overflow', 'unset');
            } else {
                Insider.dom(event.currentTarget.nextElementSibling).addClass(classes.displayNone);
            }
        });
    } else {
        Insider.dom(selectors.phoneCountryCodeList).removeClass(classes.displayNone);

        Insider.eventManager.once(
            'change.show:country:dropdown:' + camp.id,
            selectors.phoneCountryCodeList,
            function () {
                var selectedWrapElement = Insider.dom(this).parents(selectors.wrapElement);

                selectedWrapElement.find(selectors.dialCode).text('+' + this.value.replace(/[()+/]/g, ''));

                setTimeout(function () {
                    changeCountryFlag(
                        selectedWrapElement.find(selectors.countryFlag).nodes[0],
                        selectedWrapElement.find('input').nodes[0]
                    );

                    updatePhonePlaceHolder();
                }, 100);
            }
        );
    }

    Insider.eventManager.once('click.list:country:selection:' + camp.id, selectors.countryList, function () {
        var clickedElement = Insider.dom(this);
        var selectedWrapElement = clickedElement.parents(selectors.wrapElement);
        var inputElement = selectedWrapElement.find('input');

        inputElement.attr({
            'country-code': clickedElement.attr('data-country-name'),
            'data-dial-code': clickedElement.attr('data-dial-code'),
        });

        clickedElement.parent().find('li').attr('aria-selected', false);
        clickedElement.attr('aria-selected', true);
        Insider.dom(selectors.phoneCountryCodeList).addClass(classes.displayNone);

        selectedWrapElement.find(selectors.dialCode).text('+' + clickedElement.attr('data-dial-code'));

        changeCountryFlag(selectedWrapElement.find(selectors.countryFlag).nodes[0], inputElement.nodes[0]);
        updatePhonePlaceHolder();
    });

    Insider.eventManager.once(
        'input.country:toggle:' + camp.id, selectors.countryCodeSwitch, Insider.fns.debounce(function () {
            updatePhonePlaceHolder();
        }, 300)
    );
};

initialize();

Insider.eventManager.once('framelessInited' + camp.id, initialize);

/* OPT-165946 START */
const customSelectors = {
    wrapper: `.ins-content-wrapper-${ camp.id }`,
    roleInput: '#ins-dynamic-input-17212958354450',
    button: '#button-16528107399650',
    errorText: '.ins-input-error-text'
};

const { wrapper, roleInput, button, errorText } = customSelectors;

Insider.eventManager.once(`pointerup.submit:button-${ camp.id }`, button,
    ({ isPrimary }) => {
        let role = Insider.dom(roleInput).val().trim();

        switch (role.toUpperCase()) {
            case 'MR' || 'MR.':
                role = 'MR.';
                break;

            case 'MS' || 'MS.':
                role = 'MS.';
                break;

            case 'MRS' || 'MRS.':
                role = 'MRS.';
                break;

            case 'DR' || 'DR.':
                role = 'DR.';
                break;

            default:
                role = '';
                break;
        }

        if (isPrimary && !Insider.dom(`${ wrapper } ${ errorText }`).exists() && role !== '') {
            Insider.storage.localStorage.set({
                name: 'ins-user-honority-165946',
                value: role,
                expires: 90
            });
        }
    });
/* OPT-165946 END */
<<<<<<< HEAD
=======
>>>>>>> 2ff2ed6 (Last commit)
=======
>>>>>>> 5c26471 (New tasks...)
>>>>>>> cf379e5 (Uploading the task files.)
