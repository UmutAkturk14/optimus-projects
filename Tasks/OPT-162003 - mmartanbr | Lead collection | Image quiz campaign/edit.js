// Helpers - start
/**
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
}

function applyCloseButtonSettings() {
  const isOnApi = camp.id !== 0;

  if (!isOnApi) {
      return;
  }

  const previewWrapper = `.ins-preview-wrapper-${ camp.id }`;
  const ENUMS = {
      SELECTORS: {
          CLOSE_BUTTON_WRAPPER: `${ previewWrapper } .ins-element-close-button`,
          CLOSE_BUTTON_CONTENT: `${ previewWrapper } .ins-element-content`
      },
      CLASSES: {
          HIDE_ELEMENT: 'ins-display-none'
      },
      ATTRIBUTES: {
          CLOSE_BUTTON_DELAY_STATUS: 'close-button-delay-status',
          CLOSE_BUTTON_DELAY_VALUE: 'close-button-delay-value'
      }
  };
  const { SELECTORS, CLASSES, ATTRIBUTES } = ENUMS;
  const $closeButtonWrapper = Insider.dom(SELECTORS.CLOSE_BUTTON_WRAPPER);
  const $closeButton = $closeButtonWrapper.find(SELECTORS.CLOSE_BUTTON_CONTENT);
  const closeButtonDelayStatus = $closeButton.attr(ATTRIBUTES.CLOSE_BUTTON_DELAY_STATUS) === 'true';
  const closeButtonDelayValue = Number($closeButton.attr(ATTRIBUTES.CLOSE_BUTTON_DELAY_VALUE)) || 0;

  if (closeButtonDelayStatus) {
      $closeButtonWrapper.addClass(CLASSES.HIDE_ELEMENT);

      setTimeout(() => {
          $closeButtonWrapper.removeClass(CLASSES.HIDE_ELEMENT);
      }, closeButtonDelayValue * 1000);
  }
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
* @param {number|string} campId
* @param {Array<object>} formConfig
* @returns {void}
*/

function applyMultipleSettings(campId, formConfig) {
  const initializeMultipleSettingsCss = function () {
      const config = typeof formConfig === 'string' ? JSON.parse(formConfig) : (formConfig || []);
      const attributeConfig = getAttributeConfigs();
      const cssConfig = getCssSettings(config.concat(attributeConfig));

      appendSettingsAsCssContent(cssConfig);
  };

  /**
   * @returns {Array<object>}
   */
  var getAttributeConfigs = function () {
      const config = [];

      Insider.dom('[data-multiple-settings]').each(function (index, element) {
          const $target = Insider.dom(element);

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
  const getCssSelector = function (tabType, elementType, uid) {
      const mainSelector = `.ins-preview-wrapper-${ campId } #${ uid }`;

      switch (tabType) {
          case 'default':
          case 'button_default':
              return {
                  text: `${ mainSelector } input`,
                  checkbox: `${ mainSelector } input:not(:checked) ~ label:after`,
                  button: `${ mainSelector } a[id*="link-"]`,
              }[elementType];

          case 'filled':
              return `${ mainSelector } input:not(:placeholder-shown)`;

          case 'hover':
              return `${ mainSelector } a[id*="link-"]:hover`;

          case 'checked':
              return `${ mainSelector } input:checked ~ label:after`;

          case 'clicked':
              return `${ mainSelector } a[id*="link-"]:active`;

          case 'error':
              return {
                  text: `${ mainSelector } [class*="error"] ~ input`,
                  checkbox: `${ mainSelector } [class*="error"]:not(:checked) ~ label:after`,
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
      const multipleSettings = ['button_default', 'default', 'filled', 'hover', 'clicked', 'checked', 'error'];
      const cssConfig = {};

      formConfig.forEach(function (config) {
          Object.entries(config.settings).forEach(function (setting) {
              const tabType = setting[0];
              const value = setting[1];

              if (multipleSettings.indexOf(tabType) < 0) {
                  return;
              }

              const selector = getCssSelector(tabType, config.type, config.uid);

              cssConfig[selector] = getCssFields(value);

              if (value.placeholder) {
                  cssConfig[`${ selector }::placeholder`] = convertFontStyle(value.placeholder);
              }

              if (value['error-message']) {
                  const errorSelector = `.ins-preview-wrapper-${ campId } #${ config.uid
                  } [class*="error"]:first-child`;

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
      const underline = fontStyle.underline ? 'underline' : '';
      const strike = fontStyle.strike ? 'line-through' : '';

      return `${ underline } ${ strike }`;
  };

  /**
   * @param {object} elementsStyles
   * @returns {void}
   */
  var appendSettingsAsCssContent = function (elementsStyles) {
      const styleElementClass = `ins-multiple-settings-style-${ campId } ins-multiple-settings-style`;
      const styleElementSelector = '.ins-multiple-settings-style';
      const element = document.createElement('style');
      let content = '';

      Object.entries(elementsStyles).forEach(function (elementsStyle) {
          content += `${ elementsStyle[0] } {`;

          Object.entries(elementsStyle[1]).forEach(function (style) {
              content += `${ style[0] }:${ style[1] }!important;`;
          });

          content += '}';
      });

      element.className = styleElementClass;
      element.innerHTML = content;

      Insider.dom(styleElementSelector).remove();
      Insider.dom('head').append(element);
  };

  initializeMultipleSettingsCss();
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

  if (typeof Insider.utils.pluralForm.translations[language] === 'undefined') {
      language = getFormTranslation.language;
  }

  return {
      language: language || defaultConfig.language,
      translation: Insider.utils.pluralForm.translations[language] || defaultConfig.translation,
  };
}/**
* @param {string} redirectLink
* @returns {boolean}
*/

function isUrlEmpty(redirectLink) {
  return [undefined, '', 'javascript:void(0)', 'javascript:void(0);'].indexOf(redirectLink) > -1;
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
          const tagName = ($element.getNode(0) || {}).tagName || '';
          const isSpanHasLink = tagName === 'SPAN' && $element.attr('data-href');
          const isSubLinkElement = isSpanHasLink && event.target === event.currentTarget;
          const hasSubLink = Insider.dom(event.currentTarget).find('[data-href]');
          const isClickedOnSubLink = isSpanHasLink && event.target !== event.currentTarget;
          const isValidElement = ($element.attr('class') || '')
              .match(/ins-own-link-available|ins-close-button/) === null;

          if ((!isClickedOnSubLink || isSubLinkElement) && (isValidElement || hasSubLink)) {
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
}/**
* @param {string} type
* @param {int} number
* @param {string} config
* @returns {string}
*/

function getTranslationFromConfig(type, number, config) {
  const { translation, rules } = config;
  const formIndex = rules?.map((fn) => new Function('c', fn)(number)).indexOf(true) || 0;

  return translation[`form${ (formIndex + 1) }`][type];
}// Helpers - end

const previewWrapper = `.ins-preview-wrapper-${ camp.id }`;
const selectors = {
  notificationContent: `.ins-notification-content-${ camp.id }`,
  elementContainer: `${ previewWrapper } .ins-responsive-banner-element-container`,
  phoneCountryCodeList: `${ previewWrapper } .ins-phone-country-code-list`,
  countryList: `${ previewWrapper } .ins-list-country`,
  countryContent: `${ previewWrapper } .ins-phone-country-code-content`,
  countryFlag: `${ previewWrapper } .ins-country-flag`,
  dialCode: `${ previewWrapper } .ins-dial-code`,
  wrapElement: '.ins-element-wrap:eq(0)',
  phoneInput: 'input[inputtype="phone-input"]',
  scriptStyleId: '#ins-phone-country-flag-style',
  countryCodeSwitch: '#default-country-code-switch',
  layoutWrapper: `${ previewWrapper } .ins-responsive-banner-layout-container:visible .ins-layout-wrapper,${
      previewWrapper } .ins-responsive-banner-layout-container:visible a.ins-element-link [data-href]`,
  multipleSettingsStyle: '.ins-multiple-settings-style',
  /* OPT-162003 START */
  questionWrapper: `${ previewWrapper } .ins-question-wrapper`,
  selectionAnswer: `${ previewWrapper } .ins-selection-answer`,
  /* OPT-162003 END */
};
const scriptsEnums = {
  utils: `${ Insider.__external.EITRI_URL }ins-utils.js`,
  mask: `${ Insider.__external.EITRI_URL }ins-mask.js`,
  css: `${ Insider.__external.EITRI_URL }phone-country-flag.min.css`,
};
const phoneMasks = {};
const isMobile = Insider.browser.isMobile();
const classes = {
  rtl: 'ins-responsive-banner-rtl',
  displayNone: 'ins-display-none',
  /* OPT-162003 START */
  questionInnerWrapper: 'ins-question-inner-wrapper',
  header: 'ins-question-header',
  selectionWrapper: 'ins-selection-wrapper',
  selection: 'ins-selection-answer',
  image: 'ins-selection-image',
  text: 'ins-selection-text',
  /* OPT-162003 END */
};
const isOnApi = camp.id !== 0;
const redirectList = [
  {
      wrapper: selectors.notificationContent,
      redirectLink: selectors.redirectLink,
      newTab: selectors.newTab,
  }
];

/**
* @returns {void}
*/
const initialize = function () {
  loadPhoneScripts();
  initResponsiveCss();
  setCountdownTextPadding();

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
  /* OPT-162003 */
  createQuestions();
  slideQuestions();
  /* OPT-162003 */
  Insider.dom(selectors.phoneCountryCodeList).addClass(classes.displayNone);

  setEvents();
};

/**
* @returns {void}
*/
var loadPhoneScripts = function () {
  if (!Insider.dom(selectors.scriptStyleId).exists()) {
      Insider.dom('head').append(`<link id="ins-phone-country-flag-style" rel="stylesheet" href="${
          scriptsEnums.css }" type="text/css" />`);
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
  Insider.dom(`${ selectors.elementContainer }, ${ selectors.closeButton }`).addClass(classes.rtl);
};

/**
* @param {Element} countryFlagElement
* @param {Element} phoneInputElement
* @returns {void}
*/
const changeCountryFlag = function (countryFlagElement, phoneInputElement) {
  Insider.dom(countryFlagElement).nodes[0].className = `ins-country-flag ${
      Insider.dom(phoneInputElement).attr('country-code') }`;
};

/**
* @param {Element} element
* @returns {void}
*/
const setInputMask = function (element) {
  const maskOptions = {
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
const maskInputHolder = function (element) {
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
      const startingCountryCode =
              Insider.dom(Insider.dom(element).nodes[0]
                  .previousElementSibling)
                  .find('div')
                  .attr('class')
                  .split(' ')
                  .pop();
      const input = Insider.dom(element)
          .parents(selectors.wrapElement)
          .find('input');

      input.attr('country-code', startingCountryCode);

      Insider.dom(Insider.dom(element).nodes[0]).find('li').nodes.some(function (listElement, position) {
          const isCountryCodeMatch = startingCountryCode === Insider.dom(listElement).attr('data-country-name');

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
          const exampleNumber = Insider
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
  Insider.eventManager.once(`focus.on:phone:input:${ camp.id }`, selectors.phoneInput, function () {
      maskInputHolder(Insider.dom(this).nodes[0]);
  });

  if (!isMobile) {
      Insider.eventManager.once(`click.show:country:dropdown:${ camp.id }`, selectors.countryContent, function (event) {
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
          `change.show:country:dropdown:${ camp.id }`,
          selectors.phoneCountryCodeList,
          function () {
              const selectedWrapElement = Insider.dom(this).parents(selectors.wrapElement);

              selectedWrapElement.find(selectors.dialCode).text(`+${ this.value.replace(/[()+/]/g, '') }`);

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

  Insider.eventManager.once(`click.list:country:selection:${ camp.id }`, selectors.countryList, function () {
      const clickedElement = Insider.dom(this);
      const selectedWrapElement = clickedElement.parents(selectors.wrapElement);
      const inputElement = selectedWrapElement.find('input');

      inputElement.attr({
          'country-code': clickedElement.attr('data-country-name'),
          'data-dial-code': clickedElement.attr('data-dial-code'),
      });

      clickedElement.parent().find('li').attr('aria-selected', false);
      clickedElement.attr('aria-selected', true);
      Insider.dom(selectors.phoneCountryCodeList).addClass(classes.displayNone);

      selectedWrapElement.find(selectors.dialCode).text(`+${ clickedElement.attr('data-dial-code') }`);

      changeCountryFlag(selectedWrapElement.find(selectors.countryFlag).nodes[0], inputElement.nodes[0]);
      updatePhonePlaceHolder();
  });

  Insider.eventManager.once(
      `input.country:toggle:${ camp.id }`, selectors.countryCodeSwitch, Insider.fns.debounce(function () {
          updatePhonePlaceHolder();
      }, 300)
  );
};

/* OPT-162003 START */
const questionConfig = {
  0: {
      question: 'Example question',
      selections: [
          {
              image: 'https://image.useinsider.com/mmartanbr/defaultImageLibrary/content_maior_maisfrio-1717704989.jpeg',
              text: 'Lorem Ipsum',
          },
          {
              image: 'https://image.useinsider.com/mmartanbr/defaultImageLibrary/_0000_CAMA%2010%20-%20MMPIQKCQZONEVC-MM18CJDQA5520-EQMIC.1FOO21VC--1716831991.jpeg',
              text: 'Lorem Ipsum',
          },
          {
              image: 'https://image.useinsider.com/mmartanbr/defaultImageLibrary/content_maior_maisfrio-1717704989.jpeg',
              text: 'Lorem Ipsum',
          }
      ]
  },
  1: {
      question: 'Example question',
      selections: [
          {
              image: 'https://image.useinsider.com/mmartanbr/defaultImageLibrary/content_maior_maisfrio-1717704989.jpeg',
              text: 'Lorem Ipsum',
          },
          {
              image: 'https://image.useinsider.com/mmartanbr/defaultImageLibrary/content_maior_maisfrio-1717704989.jpeg',
              text: 'Lorem Ipsum',
          },
          {
              image: 'https://image.useinsider.com/mmartanbr/defaultImageLibrary/popupcorrigido-1711996777.jpeg',
              text: 'Lorem Ipsum',
          }
      ]
  },
  2: {
      question: 'Example question',
      selections: [
          {
              image: 'https://image.useinsider.com/mmartanbr/defaultImageLibrary/content_maior_maisfrio-1717704989.jpeg',
              text: 'Lorem Ipsum',
          },
          {
              image: 'https://image.useinsider.com/mmartanbr/defaultImageLibrary/content_maior_maisfrio-1717704989.jpeg',
              text: 'Lorem Ipsum',
          },
          {
              image: 'https://image.useinsider.com/mmartanbr/defaultImageLibrary/content_maior_maisfrio-1717704989.jpeg',
              text: 'Lorem Ipsum',
          }
      ]
  },
  3: {
      question: 'Example question',
      selections: [
          {
              image: 'https://image.useinsider.com/mmartanbr/defaultImageLibrary/content_maior_maisfrio-1717704989.jpeg',
              text: 'Lorem Ipsum',
          },
          {
              image: 'https://image.useinsider.com/mmartanbr/defaultImageLibrary/content_maior_maisfrio-1717704989.jpeg',
              text: 'Lorem Ipsum',
          },
          {
              image: 'https://image.useinsider.com/mmartanbr/defaultImageLibrary/content_maior_maisfrio-1717704989.jpeg',
              text: 'Lorem Ipsum',
          }
      ]
  },
  4: {
      question: 'Example question',
      selections: [
          {
              image: 'https://image.useinsider.com/mmartanbr/defaultImageLibrary/content_maior_maisfrio-1717704989.jpeg',
              text: 'Lorem Ipsum',
          },
          {
              image: 'https://image.useinsider.com/mmartanbr/defaultImageLibrary/content_maior_maisfrio-1717704989.jpeg',
              text: 'Lorem Ipsum',
          },
          {
              image: 'https://image.useinsider.com/mmartanbr/defaultImageLibrary/content_maior_maisfrio-1717704989.jpeg',
              text: 'Lorem Ipsum',
          }
      ]
  }
};

const createQuestions = () => {
    Insider.fns.keys(questionConfig).forEach((questionId) => {
        const { questionInnerWrapper, header, selectionWrapper } = classes;
        const { questionWrapper } = selectors;

        Insider.dom(`${ previewWrapper } [data-question-id=${ questionId }]`).remove();
        const questionHtml = `
            <div data-question-id=${ questionId } class="${ questionInnerWrapper }">
                <div class="${ header }">${ questionConfig[questionId].question }</div>
                <div class="${ selectionWrapper }">
                    ${ getSelectionsHtml(questionConfig[questionId].selections) }
                </div>
            </div>
        `;

        Insider.dom(questionWrapper).append(questionHtml);
    });
};

const getSelectionsHtml = (selections) => {
    let html = '';

    selections.forEach((selection, index) => {
        const { selection: selectionClass, image: imageClass, text: textClass } = classes;
        const { image, text } = selection;

        html += `
            <div class="${ selectionClass }">
                <img class="${ imageClass }" src="${ image }" image-position="${ index + 1 }"></img>
                <div class="${ textClass }">${ text }</div>
            </div>
        `;
    });

    return html;
};

const slideQuestions = () => {
    const { selectionAnswer, questionWrapper } = selectors;

    Insider.eventManager.once(`click.select:answeewqewqr:${ camp.id }`, selectionAnswer, (event) => {
        const imagePosition = Insider.dom(event.target).attr('image-position');
        const questionId = Insider.dom(event.currentTarget).parents('.ins-question-inner-wrapper').attr('data-question-id');

        Insider.storage.update({
            name: 'ins-selected-answers-162003',
            value: {
                [`question-${ Number(questionId) + 1 }`]: Number(imagePosition)
            }
        });

        Insider.dom(questionWrapper).css('transform', `translate(-${ (Number(questionId) + 1) * 20 }%)`);
    });
};
/* OPT-162003 END */

initialize();

Insider.eventManager.once(`framelessInited${ camp.id }`, initialize);
