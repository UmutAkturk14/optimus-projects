/* OPT-148818 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 3708 : 3709;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const config = {
        textInfo: 'Do you want this delivered today?', /* OPT-149924 */
        textContent: '(Dubai) Limited slots only',
        countdownText: 'Order within',
        /* OPT-149924 START */
        iconUrl: 'https://image.useinsider.com/ikeauae/defaultImageLibrary/Information%20Circle-1707159179.png',
        shoppingIconUrl: 'https://image.useinsider.com/ikeauae/defaultImageLibrary/Shopping%20Bag%20Add-1707161063.png',
        /* OPT-149924 END */
        timezone: 4,
        targetHours: 14,
        targetMinutes: 59,
        targetSeconds: 59 /* OPT-151668 */
    };

    const time = Insider.dateHelper.getUTCTime().split(':');
    const convertedHour = Number(time[0]) + config.timezone;
    const calculatedHour = convertedHour >= 24 ? convertedHour - 24 : convertedHour;
    let remainedHour = config.targetHours - calculatedHour;
    let remainedMinute = config.targetMinutes - Number(time[1]);
    /* OPT-151668 START */
    let remainedSeconds =  Number(config.targetSeconds) - Insider.dateHelper.getISODateWithTime().split(':')[2];

    if (remainedMinute < 0) {
        remainedMinute = 59 + remainedMinute;
        remainedHour -= 1;
    }
    /* OPT-151668 END */

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        container: `ins-message-container-${ variationId }`,
        text: `ins-message-text-${ variationId }`,
        coloredText: `ins-colored-text-${ variationId }`,
        messageTime: `ins-message-time-${ variationId }`,
        countdown: `ins-countdown-${ variationId }`,
        /* OPT-149924 START */
        icon: `ins-icon-${ variationId }`,
        addToCart: `ins-add-to-cart-${ variationId }`,
        /* OPT-149924 END */
        goal: `sp-custom-${ variationId }-1`,
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        appendLocation: isDesktop ? '.pip-price-package:first' : '.js-price-package.pip-price-package',
        addToBag: '.pip-buy-module__buy-button-container button', /* OPT-149924 */
        addToCartButton: '.pip-buy-module__buy-button-container  .pip-btn__label'
    });

    self.init = () => {
        if (variationId && Insider.systemRules.call('isOnProductPage') && remainedHour >= 0
      && !(remainedHour === 0 && remainedMinute === 0 && remainedSeconds === 0)
          && Insider.dom(selectors.addToCartButton).text() !== 'Sold out online') {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.buildCSS();
                /* OPT-149924 START */
                Insider.fns.onElementLoaded(selectors.addToBag, () => {
                    setTimeout(() => {
                        self.buildHTML();
                        self.setEvent();
                    }, 700);
                }).listen();
                /* OPT-149924 END */
            }

            return true;
        }
    };

    self.reset = () => {
        const { style, wrapper } = selectors;

        Insider.dom(`${ style }, ${ wrapper }`).remove();

        Insider.__external.countDownTimerInterval151668
          && clearInterval(Insider.__external.countDownTimerInterval151668);
    };

    self.buildCSS = () => {
        const { wrapper, container, text, coloredText, countdown, icon, messageTime, addToCart } =
          selectors; /* OPT-149924 */

        const customStyle =
      `${ wrapper } {
          /* OPT-149924 START */
          display: flex;
          justify-content: space-between;
          min-height: 88px;
          border-radius: 4px;
          border-left: 4px solid #0058A3;
          background-color: rgba(255, 255, 255, 1);
          box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
          padding: 12px 8px 8px;
          gap: 8px;
          margin-bottom: 40px;
          /* OPT-149924 END */
      }
      /* OPT-149924 START */
      ${ icon } img {
          width: 23px;
      }
      /* OPT-149924 END */
      ${ container } {
          /* OPT-149924 START */
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          /* OPT-149924 END */
      }
      ${ text } {
          font-weight: 400;
          line-height: 19.07px;
          /* OPT-149924 START */
          font-size: 0.875rem;
          font-family: 'Noto IKEA';
          /* OPT-149924 END */
      }
      ${ coloredText } {
          color: #0058A3;
          font-weight: 700;
      }
      ${ countdown } {
          font-weight: 700;
          color: #111111;
      }
      /* OPT-149924 START */
      ${ messageTime } {
          color: #111111;
          font-size: 0.875rem;
          font-weight: 400;
          line-height: 19.07px;
          font-family: 'Noto IKEA';
      }
      ${ addToCart } {
          display: flex;
          align-self: center;
          align-items: center;
          justify-content: center;
          padding: 10px;
          border-radius: 64px;
          transition-property: transform;
          transition-duration: 250ms;
          transition-timing-function: cubic-bezier(0.4, 0, 0.4, 1);
          background: rgba(0, 88, 163, 1);
          cursor: pointer;
      }
      ${ addToCart } img {
          width: 24px;
      }
      ${ addToCart }:hover {
          background: rgb(0, 79, 147);
      }
      ${ addToCart }:active {
          background: rgb(0, 62, 114);
          transform: scale(0.97);
      }
      /* OPT-149924 END */`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        /* OPT-149924 START */
        const { wrapper, goal, container, text, messageTime, countdown, coloredText, icon, addToCart } = classes;
        const { textInfo, textContent, countdownText, iconUrl, shoppingIconUrl } = config;
        /* OPT-149924 END */

        const html =
      /* OPT-149924 START */
      `<div class="${ wrapper } ${ goal }">
          <div class="${ icon }">
              <img src="${ iconUrl }">
          </div>
          <div class="${ container }">
              <div class="${ text }">
                  <span class="${ coloredText }">${ textInfo }</span>
              </div>
              <div class="${ messageTime }">
                  ${ countdownText } <span class="${ countdown }"></span>
                  <br>
                  ${ textContent }
              </div>
          </div>
          ${ !Insider.dom(`${ selectors.addToBag }:disabled`).exists() ? `
              <div class="${ addToCart }">
                  <img src="${ shoppingIconUrl }">
              </div>` : '' }
      </div>`;
        /* OPT-149924 END */

        Insider.dom(selectors.appendLocation).before(html);
        /* OPT-151668 START */
        const countDownDatas = {
            newHours: remainedHour,
            newMinutes: remainedMinute,
            newSeconds: remainedSeconds
        };
        /* OPT-151668 END */

        self.setCountdownText(countDownDatas);

        setTimeout(() => {
            if (remainedHour === 0 && remainedMinute === 0 && remainedSeconds === 1) {
                self.reset();
            } else {
                remainedSeconds = remainedSeconds === 0 ? 0 : --remainedSeconds;
                self.setCountdownText(countDownDatas); /* OPT-151668 */

                self.setCountdownInterval();
            }
        }, 1000);
    };

    self.setCountdownText = (countDownDatas) => {
        const { newHours, newMinutes, newSeconds } = countDownDatas;

        /* OPT-151668 START*/
        Insider.dom(selectors.countdown).text(newHours ?
            `${ newHours } hrs ${ newMinutes } mins ${ newSeconds } secs` :
            `${ newMinutes } mins ${ newSeconds } secs`);
        /* OPT-151668 END */
    };

    self.setCountdownInterval = () => {
        /* OPT-151668 START*/
        Insider.__external.countDownTimerInterval151668 = setInterval(() => {
            if (remainedHour === 0 && remainedMinute === 0 && remainedSeconds === 1) {
                self.reset();
            } else if (remainedSeconds === 0 && remainedMinute > 0) {
                remainedMinute -= 1;
                remainedSeconds = 59;
            } else if (remainedSeconds === 0 && remainedMinute === 0 && remainedHour > 0) {
                remainedHour -= 1;
                remainedMinute = 59;
                remainedSeconds = 59;
            } else if (remainedSeconds > 0) {
                remainedSeconds -= 1;
            }

            const countDownDatas = {
                newHours: remainedHour,
                newMinutes: remainedMinute,
                newSeconds: remainedSeconds
            };

            self.setCountdownText(countDownDatas);
        }, 1000);
        /* OPT-151668 END */
    };

    /* OPT-149924 START */
    self.setEvent = () => {
        const { addToCart, addToBag } = selectors;

        Insider.eventManager.once(`click.native:add:to:bag:${ variationId }`, addToCart, () => {
            Insider.dom(addToBag).click();
        });
    };
    /* OPT-149924 END */

    return self.init();
})({});
/* OPT-148818 END */
