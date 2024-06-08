/* ZEN-124003 START */
(function (self) {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 3559 : 3560; /* ZEN-133580 */
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isControlGroup = Insider.campaign.isControlGroup(variationId);
    const isVariationDefined = !Insider.fns.isUndefined(variationId);
    const isOnProductPage = Insider.systemRules.call('isOnProductPage');

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        overlay: `ins-custom-overlay-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        image: `ins-custom-image-${ variationId }`,
        title: `ins-custom-title-${ variationId }`,
        text: `ins-custom-text-${ variationId }`,
        container: `ins-custom-container-${ variationId }`,
        wrap: `ins-custom-wrap-${ variationId }`,
        mainText: `ins-custom-main-text-${ variationId }`,
        close: `ins-custom-close-${ variationId }`,
        linkText: `ins-custom-link-text-${ variationId }`,
        textContainer: `ins-custom-text-container-${ variationId }`,
        icon: `ins-custom-icon-${ variationId }`,
        name: `ins-custom-name-${ variationId }`, /* ZEN-135443 */
        redirectUrlPaymentOptions: `ins-url-payment-options-${ variationId }`, /* ZEN-139916 */
        blueLine: `ins-blue-line-${ variationId }`, /* ZEN-148876 */
        goal: `sp-custom-${ variationId }-1`,
        addToCartButton: 'pip-buy-module__buttons' /* OPT-154705 */
    };

    const selectors = Object.keys(classes).reduce(function (createdSelector, key) {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        button: '.paymentOptions .placeOrderBtn .opcbuttons.longText.mt-4',
        cookiesArea: '#onetrust-banner-sdk:visible',
        cookiesOkayButton: '#onetrust-accept-btn-handler:visible',
        cookiesConfirmButton: '.save-preference-btn-handler.onetrust-close-btn-handler:visible'
    });

    const config = {
        image: 'https://image.useinsider.com/ikeauae/defaultImageLibrary/Credit%20Card-1705410565.png',
        // title: 'Easy Installments',
        text: '0% تقسيط الدفعات بدون فوائد',
        lastText: 'تسوق ',
        priceText: ' الان بسعر في الشهر ',
        link: 'https://www.ikea.com/ae/ar/customer-service/payment-options/',
        linkText: '  لمعرفة المزيد',
        icon: 'https://image.useinsider.com/ikeauae/defaultImageLibrary/Frame%20%282%29-1697192323.png', /* ZEN-133580 */
        closeIcon: 'https://image.useinsider.com/ikeauae/defaultImageLibrary/Cross%20Small-1705410409.png',
        /* ZEN-148876 START */
        lineImage: isDesktop ? 'https://image.useinsider.com/ikeauae/defaultImageLibrary/Color%20Indicator%20%281%29-1705417580.png' :
            'https://image.useinsider.com/ikeauae/defaultImageLibrary/Color%20Indicator-1705417617.png'
        /* ZEN-148876 END */
    };

    const goalId = {
        'قسمها على 4 دفعات مع تمارا': 759,
        'قسمها على 4 دفعات مع  تابي': 760,
    };

    self.init = function () {
        Insider.fns.onElementLoaded('.tamara-product-widget:visible', function () {
            setTimeout(function () {
                if (isVariationDefined && Insider.systemRules.call('getCurrentProduct').quantity !== 0 ) {
                    if (!isControlGroup && isOnProductPage) {
                        self.reset();
                        self.buildCSS();
                        self.buildHTML();
                        self.setEvents();
                    }
                    Insider.campaign.custom.show(variationId);
                }
            }, 10000);
        }).listen();

        if (Insider.fns.hasParameter('checkout')) {
            Insider.campaign.custom.show(variationId);

            Insider.fns.onElementLoaded(selectors.button, function () {
                self.sendGoal();
            }).listen();
        }
    };

    self.reset = function () {
        Insider.dom(`${ selectors.style }, ${ selectors.wrapper }`).remove();
    };

    self.buildCSS = function () {
        const customStyle =
      `${ selectors.wrapper } {` +
          'position: fixed;' +
          'display: flex;' +
          'border-radius: 10px;' +
          /* ZEN-148876 START */
          `width:${ isDesktop ? '327px !important;' : 'calc(100% - 90px);'
          }height:${ isDesktop ? '154px;' : '120px;'
          }bottom:${ isDesktop ? '35px;' : '45px;'
          }${ !isDesktop ? 'left: 0px;' : ''
          }${ isDesktop ? 'right: 90px;' : ''
          }z-index: 991;` +
          'background-color: #f2f2f2;' +
          'filter: drop-shadow(0px 0px 0px rgba(0, 0, 0, 0.10));' +
      /* ZEN-148876 END */
      `}${
          selectors.close } {` +
          'position: absolute;' +
          'left: 0;' +
          `padding:${ isDesktop ? '10px;' : '10px 5px;' /* ZEN-148876 */
          }font-size: 15px;` +
          'top: 0;' +
          'cursor: pointer;' +
          'color: #000;' +
          'font-weight: bold;' +
      `}${
      /* ZEN-148876 START */
          selectors.blueLine } {` +
          'position: absolute;' +
          `height:${ isDesktop ? '155px;' : '120px;' /* ZEN-133580 */
          }transform: scaleX(-1);` +
      `}${
      /* ZEN-148876 END */
          selectors.image } {` +
          'height: 24px;' +
          'width: 24px;' +
      `}${
          selectors.container } {` +
          'display: flex;' +
          'gap: 20px;' +
          `padding:${ isDesktop ? ' 28px 15px;' : '8px 15px;'
          }direction: rtl;` +
      `}${
          selectors.title } {` +
          'font-size: 16px;' +
          'color: #484848;' +
          /* ZEN-148876 START */
          'font-style: normal;' +
          'font-weight: 700;' +
          'direction: rtl;' +
          'text-align: right;' +
      /* ZEN-148876 END */
      `}${
          selectors.text } {` +
          `font-size:${ isDesktop ? '11pt;' : '12px;'
          }color: #231f20;` +
          'font-weight: 400;' +
      `}${
          selectors.mainText } {` +
          `font-size:${ isDesktop ? '14px;' : '12px;'
          }color: #231f20;` +
      `}${
          selectors.linkText } {` +
          `font-size:${ isDesktop ? '14px;' : '12px;'
          }color: #231f20;` +
          'font-weight: 500;' +
          'cursor: pointer;' +
          `margin-top:${ isDesktop ? '15px;' : '0px;'
          }direction: rtl;` +
      `}${
          selectors.textContainer } {` +
          `font-size:${ isDesktop ? '11pt;' : '12px;'
          }display: flex;` +
          'gap: 3px;' +
          'color: #484848;' +
          'font-weight: 400;' +
          'align-items: baseline;' +
          'flex-direction: column;' +
          'direction: rtl;' +
      `}${
      /* ZEN-133580 START */
          selectors.icon } {` +
          'width: 40px;' +
          'height: 40px;' +
          'position: absolute;' +
          `left: ${ isDesktop ? '21px;' : '10px;'
          }bottom:${ isDesktop ? '15px;' : '10px;'
          }cursor: pointer;` +
      `}${
          selectors.wrap } {` +
          'display: flex;' +
          'flex-direction: column;' +
      `}${
      /* ZEN-133580 END */
          selectors.name } {` +
          `font-size:${ isDesktop ? '14px;' : '12px;' /* ZEN-133580 */
          }color: #484848;` +
      `}${
      /* ZEN-139916 START */
          selectors.redirectUrlPaymentOptions } {` +
          'width: 100%;' +
          'color: #484848;' +
      '}';
        /* ZEN-139916 END */

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = function () {
        const productPrice = Insider.systemRules.call('getCurrentProduct').price / 4 || 0;

        const productName = Insider.dom('.pip-header-section__title--big.notranslate').text();

        const outerHtml = isDesktop
            ? `<div class="${ classes.wrapper }">` +
              `<img src="${ config.lineImage }"  class="${ classes.blueLine }"></img>` + /* ZEN-148876 */
              `<img src="${ config.closeIcon }" class="${ classes.close }"></img>` +
          `<div class="${ classes.container }">` +
              `<img src="${ config.image }" class="${ classes.image }"></img>` +
              `<div class="${ classes.wrap }">` +
                  `<div class="${ classes.title }"> ${ config.text }</div>` +
                  `<div class="${ classes.textContainer }">` +
                      `<div class="${ classes.mainText }">${ config.lastText
                      }<strong class="${ classes.name }">${ productName }</strong>${ config.priceText
                      }<strong class="${ classes.name }"> درهم${ productPrice }</strong>` +
                      '</div>' +
                      `<a class="${ classes.goal } ${ classes.redirectUrlPaymentOptions }" href="${ config.link }">` +
                          `<div class="${ classes.linkText }">${ config.linkText }</div>` +
                      '</a>' +
                      `<div class="${ classes.container }">` +
                          `<img src="${ config.icon }" class="${ classes.icon }"></img>` +
                      '</div>' +
                  '</div>' +
              '</div>' +
          '</div>' +
      '</div>' :
            `<div class="${ classes.wrapper }">` +
          `<img src="${ config.lineImage }"  class="${ classes.blueLine }"></img>` + /* ZEN-148876 */
          `<img src="${ config.closeIcon }" class="${ classes.close }"></img>` +
          `<div class="${ classes.container }">` +
              `<img src="${ config.image }" class="${ classes.image }"></img>` +
              `<div class="${ classes.wrap }">` +
                  `<div class="${ classes.title }"> ${ config.text }</div>` +
                  `<div class="${ classes.textContainer }">` +
                      `<div class="${ classes.mainText }">${ config.lastText
                      }<strong class="${ classes.name }" >${ productName }</strong>${ config.priceText
                      }<strong class="${ classes.name }"> درهم${ productPrice }</strong>` +
                      '</div>' +
                      `<a class="${ classes.goal } ${ classes.redirectUrlPaymentOptions }" href="${ config.link }">` +
                          `<div class="${ classes.linkText }">${ config.linkText }</div>` +
                      '</a>' +
                  '</div>' +
                  `<div class="${ classes.container }">` +
                      `<img src="${ config.icon }" class="${ classes.icon }"></img>` +
                  '</div>' +
              '</div>' +
          '</div>' +
      '</div>'; /* ZEN-133580 */

        Insider.dom('body').append(outerHtml);
    };

    self.setEvents = function () {
        Insider.eventManager.once(`click.close:element:${ variationId }`, selectors.close, function () {
            self.reset();
        });

        /* ZEN-133580 START */
        Insider.eventManager.once(`click.cart:icon:${ variationId }`, selectors.icon, function () {
            Insider.dom('[aria-label="أضف إلى عربة التسوق"]').click();
        });

        if (!isDesktop) {
            if (Insider.dom('.js-sticky-product-bar.pip-sticky-product-bar.pip-sticky-product-bar--visible').exists()) {
                Insider.dom(selectors.wrapper).css('display', 'none');
            }

            const expandObserver = new MutationObserver(function () {
                if (Insider.dom('.js-sticky-product-bar.pip-sticky-product-bar.pip-sticky-product-bar--visible').exists()) {
                    Insider.dom(selectors.wrapper).css('display', 'none');
                } else {
                    Insider.dom(selectors.wrapper).css('display', 'block');
                }
            });

            expandObserver.observe(Insider.dom('.js-sticky-product-bar').nodes[0], {
                childList: false,
                attributes: true,
                subtree: false
            });
        } else {
            /* ZEN-149168 START */
            if (Insider.dom(selectors.cookiesArea).exists()) {
                Insider.dom(selectors.wrapper).css('bottom', '100px');
            }

            Insider.eventManager.once(`click.accept:button:${ variationId }`,
                `${ selectors.cookiesConfirmButton }, ${ selectors.cookiesOkayButton }`, () => {
                    setTimeout(() => {
                        !Insider.dom(selectors.cookiesArea).exists() && Insider.dom(selectors.wrapper).css('bottom', '45px');
                    }, 500);
                });
            /* ZEN-149168 END */
        }
        /* ZEN-133580 END */
        /* ZEN-148876 START */
        Insider.fns.onElementLoaded('.rec-sheets__content-wrapper', () => {
            self.reset();
        }).listen();
        /* ZEN-148876 END */

        /* OPT-154705 START */
        Insider.eventManager.once(`click.add:to:cart:${ variationId }`, selectors.addToCartButton, () => {
            if (!Insider.campaign.getCampaignStorage(variationId)?.joined) {
                Insider.campaign.custom.storeJoinLog(variationId);

                Insider.campaign.updateCampaignCookie({
                    joined: true
                }, Insider.campaign.custom.addCampaignIdPrefix(variationId));
            }
        });
        /* OPT-154705 END */
    };

    self.sendGoal = function () {
        Insider.eventManager.once(`click.payment:button:${ variationId }`, selectors.button, function () {
            const payment = Insider.dom('.paymentOptions input:checked').parent().find('span.floatingL').text().trim();

            if (goalId[payment]) {
                self.sendCustomGoal(goalId[payment]);
                self.sendCustomGoal(764); /* ZEN-132679 */
            }
        });
    };

    /* ZEN-132679 START */
    self.sendCustomGoal = function (goal) {
        if (Insider.fns.isFunction(Insider.__external.sendCustomGoal)) {
            Insider.__external.sendCustomGoal(builderId, goal, false);
        } else {
            Insider.logger.log('sendCustomGoal is not a function');
        }
    };
    /* ZEN-132679 END */

    self.init();
})({});

false;
/* ZEN-124003 END */
