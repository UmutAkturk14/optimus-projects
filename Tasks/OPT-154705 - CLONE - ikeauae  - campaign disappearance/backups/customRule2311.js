/* ZEN-124003 START */
(function (self) {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 3398 : 3464; /* ZEN-133580 */
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
        blueLine: `ins-blue-line-${ variationId }`, /* ZEN-148876 */
        goal: `sp-custom-${ variationId }-1`,
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
        title: 'Easy Installments',
        text: '0% interest–free installments',
        lastText: 'Shop ',
        priceText: 'now at ',
        link: 'https://www.ikea.com/ae/en/customer-service/payment-options/',
        linkText: ' Learn more',
        icon: 'https://image.useinsider.com/ikeauae/defaultImageLibrary/Frame%20%282%29-1697192323.png', /* ZEN-133580 */
        /* ZEN-148876 START */
        closeIcon: 'https://image.useinsider.com/ikeauae/defaultImageLibrary/Cross%20Small-1705410409.png',
        lineImage: isDesktop ? 'https://image.useinsider.com/ikeauae/defaultImageLibrary/Color%20Indicator%20%281%29-1705417580.png' :
            'https://image.useinsider.com/ikeauae/defaultImageLibrary/Color%20Indicator-1705417617.png'
        /* ZEN-148876 END */
    };

    const goalId = {
        Tamara: 759,
        Tabby: 760,
    };

    self.init = function () {
        setTimeout(function () {
            if (isVariationDefined && Insider.systemRules.call('getCurrentProduct').quantity !== 0 ) {
                Insider.fns.onElementLoaded('.tamara-product-widget:visible', function () {
                    if (!isControlGroup && isOnProductPage) {
                        self.reset();
                        self.buildCSS();
                        self.buildHTML();
                        self.setEvents();
                    }

                    Insider.campaign.custom.show(variationId);
                }).listen();
            }
        }, 10000);

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
          `height:${ isDesktop ? '154px;' : '100px;' /* ZEN-133580 */
          }display: flex;` +
          'border-radius: 10px;' +
          /* ZEN-148876 START */
          `width:${ isDesktop ? '327px !important;' : 'calc(100% - 90px);'
          }bottom:${ isDesktop ? '35px;' : '45px;'
          }left:${ isDesktop ? '15px;' : '0px;'
          }z-index: 991;` +
          'background-color: #f2f2f2;' +
          'filter: drop-shadow(0px 0px 0px rgba(0, 0, 0, 0.10));' +
      /* ZEN-148876 END */
      `}${
          selectors.close } {` +
          'position: absolute;' +
          'right: 0;' +
          'padding: 8px;' + /* ZEN-148876 */
          'top: 0;' +
          'cursor: pointer;' +
          'color: #000;' +
      `}${
      /* ZEN-148876 START */
          selectors.blueLine } {` +
          'position: absolute;' +
          `height:${ isDesktop ? '155px;' : '95px;'
          }}${
              /* ZEN-148876 END */
              selectors.image } {` +
          'height: 24px;' +
          'width: 24px;' +
      `}${
          selectors.container } {` +
          'display: flex;' +
          'flex-direction: row;' +
          /* ZEN-148876 START */
          `gap:${ isDesktop ? '10px;' : '2px;'
          }padding:${ isDesktop ? ' 28px 15px;' : '8px 10px;'
          /* ZEN-148876 END */
          }}${
              selectors.title } {` +
          'color: #000;' +
          'margin-bottom: 5px;' +
          /* ZEN-148876 START */
          'font-size: 16px;' +
          'font-style: normal;' +
          'font-weight: 700;' +
          'line-height: normal;' +
      /* ZEN-148876 END */
      `}${
          selectors.text } {` +
          'font-size: 12px;' +
          'color: #231f20;' +
          'font-weight: 400;' +
      `}${
          selectors.mainText } {` +
          'font-size:12px;' +
          'color: #231f20;' +
      `}${
          selectors.linkText } {` +
          'font-size:12px;' +
          'color: #231f20;' +
          'font-weight: 500;' +
          'cursor: pointer;' +
          `margin-top:${ isDesktop ? '8px;' : '0px;'
          }}${
              selectors.textContainer } {` +
          'font-size: 12px;' +
          'display: flex;' +
          'gap: 3px;' +
          'color: #231f20;' +
          'font-weight: 400;' +
          'align-items: baseline;' +
          'flex-direction: column;' +
          `width:${ isDesktop ? '140px;' : '200px;'
          }}${
              /* ZEN-133580 START */
              selectors.icon } {` +
          'width: 40px;' +
          'height: 40px;' +
          'position: absolute;' +
          'right: 10px;' +
          `bottom:${ isDesktop ? '15px;' : '10px;'
          }cursor: pointer;` +
          'z-index: 99999;' +
      `}${
          selectors.wrap } {` +
          'display: flex;' +
          'flex-direction: column;' +
      `}${
      /* ZEN-133580 END */
          selectors.name } {` +
          'font-size:12px;' +
          'font-weight: bold;' +
      '}';

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = function () {
        const productPrice = Insider.systemRules.call('getCurrentProduct').price / 4 || 0;

        const productName = Insider.dom('.pip-header-section__title--big.notranslate').text();

        const outerHtml =
      isDesktop ?
          `<div class="${ classes.wrapper }">` +
              `<img src="${ config.lineImage }"  class="${ classes.blueLine }"></img>` + /* ZEN-148876 */
              `<img src="${ config.closeIcon }" class="${ classes.close }"></img>` +
              `<div class="${ classes.container }">` +
                  `<img src="${ config.image }" class= ${ classes.image }></img>` +
                  `<div class="${ classes.wrap }">` +
                          `<div class="${ classes.title }"> ${ config.text }</div>` +
                          `<div class="${ classes.textContainer }">` +
                              `<div class="${ classes.mainText }">${ config.lastText
                              }<strong class="${ classes.name }">${ productName }</strong>${ config.priceText
                              }<strong class="${ classes.name }">Dhs ${ productPrice }</strong> per month` +
                              '</div>' +
                          '</div>' +
                          `<a class="${ classes.goal }" href="${ config.link }">` +
                          `<div class="${ classes.linkText }">${ config.linkText }</div>` +
                          '</a>' +
                      `<div class="${ classes.container }">` +
                      `<img src="${ config.icon }" class= ${ classes.icon }></img>` +
              '</div>' +
          '</div>' :
          `<div class="${ classes.wrapper }">` +
              `<img src="${ config.lineImage }" class="${ classes.blueLine }"></img>` + /* ZEN-148876 */
              `<img src="${ config.closeIcon }" class="${ classes.close }"></img>` +
              `<div class="${ classes.container }">` +
                  `<img src="${ config.image }" class= ${ classes.image }></img>` +
                  `<div class="${ classes.wrap }">` +
                          `<div class="${ classes.title }"> ${ config.text }</div>` +
                          `<div class="${ classes.textContainer }">` +
                              `<div class="${ classes.mainText }">${ config.lastText
                              }<strong class="${ classes.name }" >${ productName }</strong>${ config.priceText
                              }<strong class="${ classes.name }">Dhs ${ productPrice }</strong> per month` +
                              '</div>' +
                              `<a href="${ config.link }">${ config.linkText } </a>` +
                          '</div>' +
                      `<div class="${ classes.container }">` +
                      `<img src="${ config.icon }" class= ${ classes.icon }></img>` +
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
            Insider.dom('[aria-label="Add to bag"]').click();
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
                        !Insider.dom(selectors.cookiesArea).exists() && Insider.dom(selectors.wrapper).css('bottom', '35px');
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
