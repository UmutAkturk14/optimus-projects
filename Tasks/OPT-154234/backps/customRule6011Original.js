/* OPT-137772 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 3717 : 3718; /* OPT-151759 */
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isOnCrocsPage = Insider.systemRules.call('isOnCategoryPage') && Insider.fns.hasParameter('/catalog/highlights/odezhda-i-obuv/odezhda-i-obuv/');

    const classes = {
        banner: `ins-banner-${ variationId }`,
        popup: `ins-popup-${ variationId }`,
        closeButton: `ins-close-button-${ variationId }`,
        popupHeader: `ins-popup-header-${ variationId }`,
        popupTitle: `ins-popup-title-${ variationId }`,
        logo: `ins-logo-${ variationId }`,
        popupText: `ins-popup-text-${ variationId }`,
        overlay: `ins-overlay-${ variationId }`,
        style: `ins-custom-style-${ variationId }`,
        join: `sp-custom-${ variationId }-1`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        appendLocation: '.app-content'
    });

    let width = window.innerWidth || 768;
    let bannerWidth;
    let windowWidth;

    const config = {
        /* ZEN-152660 START */
        images: {
            1920: 'https://image.useinsider.com/sportmaster/defaultImageLibrary/1920%20%281566x236%29%20%282%29-min-1707402947.png',
            1440: 'https://image.useinsider.com/sportmaster/defaultImageLibrary/1440%20%281170x236%29%20%282%29-min-1707402960.png',
            1024: 'https://image.useinsider.com/sportmaster/defaultImageLibrary/1024%20%28918x180%29%20%281%29-min-1707402987.png',
            768: 'https://image.useinsider.com/sportmaster/defaultImageLibrary/768%20%28718x180%29%20%281%29-min-1707403000.png',
            320: 'https://image.useinsider.com/sportmaster/defaultImageLibrary/375-min-1707403014.png'
        },
        /* ZEN-152660 END */
        closeButton: 'https://image.useinsider.com/sportmaster/defaultImageLibrary/image%20%2812%29-1696842808.png',
        closeButtonMobile: 'https://image.useinsider.com/sportmaster/defaultImageLibrary/image%20%2814%29-1697096569.png',
        logo: 'https://image.useinsider.com/sportmaster/defaultImageLibrary/image%20%289%29-1695904081.png',
        popupTitle: 'Условия акции',
        popupText: `Акция действует в двух магазинах Спортмастер по адресам: г. Москва, Варшавское ш., д.129А и г. Москва, ТЦ "Европолис", пр-т Мира, д.211, пока подарки есть в наличии. Для участия необходимо авторизоваться в Клубной программе и приобрести верхнюю одежду бренда Lassie в одном из указанных магазинов. Если клиент не зарегистрирован в Клубной программе, он может зарегистрироваться на сайте или в мобильном приложении. В акции можно участвовать 1 раз за период проведения.
      <br><br>
      ООО «Спортмастер». 117437, г. Москва, ул. Миклухо-Маклая, д. 18, корп. 2. ОГРН 1057747320278. 6+`
    };

    self.init = () => {
        if (variationId && isOnCrocsPage && !self.isOnExpectionCity()) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.detectWindowWidth();
                self.buildCss();
                self.buildHtml();
                self.setEvents();
            }

            Insider.campaign.custom.show(variationId);
        }
    };

    self.isOnExpectionCity = () => {
        const exectionList = [];
        const exectionList2 = [];

        return exectionList.includes(Number(Insider.utils.getDataFromDataLayer('macroCityId'))) ||
          exectionList2.includes((Insider.storage.localStorage.get('userLocaation') || {}).city);
    };

    self.reset = () => {
        const { banner, overlay, style } = selectors;

        Insider.dom(`${ banner }, ${ overlay }, ${ style }`).remove();
    };

    self.detectWindowWidth = () => {
        width = window.innerWidth;

        if (width >= 1920) {
            width = 1920;
            bannerWidth = 1566;
        } else if (width >= 1440) {
            width = 1440;
            bannerWidth = 1170;
        } else if (width >= 1024) {
            width = 1024;
            bannerWidth = 918;
        } else if (width >= 768) {
            width = 768;
            bannerWidth = 718;
        } else {
            width = 320;
            bannerWidth = 350;
        }
    };

    self.buildCss = () => {
        const { banner, popup, closeButton, popupHeader, popupTitle, logo, popupText, overlay } = selectors;
        let style =
      `${ banner } {
          cursor: pointer;
          width: ${ bannerWidth }px;
          margin: 0 auto;
          margin-top: 10px;
          max-width: 100%;
      }
      ${ popup } {
          position: fixed;
          z-index: 999999999;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #ffffff;
          width: 718px;
          max-height: 90%;
          padding: 56px;
          display: flex;
          flex-direction: column;
      }
      ${ popupTitle } {
          padding-bottom: 40px;
          font-weight: 500;
          font-size: 28px;
          line-height: 40px;
          font-family: GothamProMedium, sans-serif;
          letter: 4px;
          text-transform: uppercase;
      }
      ${ closeButton } {
          cursor: pointer;
          position: absolute;
          top: 27px;
          right: 27px;
          width: 14px;
          height: 14px;
      }
      ${ closeButton } img {
          width: 100%;
      }
      ${ popupText } {
          font-family: GothamProMedium, sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 24px;
          letter-spacing: 0px;
          text-align: left;
          color: #333333;
          overflow-y: scroll;
          padding-right: 5px;
      }
      ${ popupText } a:first-child {
          word-break: break-all;
          text-decoration: underline;
          color: #1551E5;
      }
      ${ popupText }::-webkit-scrollbar {
          width: 4px;
      }
      ${ popupText }::-webkit-scrollbar-thumb {
          background: #E3E3E3;
      }
      ${ popupHeader } {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 52px;
          background-color: #1551E5;
          padding: 21px;
      }
      ${ logo } {
          height: 22px;
      }
      ${ overlay } {
          position: fixed;
          width: 100%;
          height: 100%;
          background: #0000005C;
          z-index: 999999998;
          cursor: pointer;
      }
      ${ banner } {
          cursor: pointer;
      }`;

        if (width < 768 || !isDesktop) {
            style +=
          `${ popup } {
             width: 100%;
             height: 100%;
             max-height: unset;
             padding: 0px;
          }
          ${ popupTitle } {
              font-size: 14px;
          }
          ${ closeButton } {
              position: relative;
              top: unset;
              right: unset;
              color: #ffffff;
              width: 20px;
              height: 20px;
              margin-bottom: 3px;
          }
          ${ popupTitle } {
              color: #ffffff;
              padding: 0;
          }
          ${ popupText } {
              padding: 20px 5px 10px 15px;
              margin-right: 5px;
          }`;
        }

        Insider.dom('<style>').addClass(classes.style).html(style).appendTo('head');
    };

    self.buildHtml = () => {
        const html =
      `<img class="${ classes.banner }" src="${ config.images[width] }" alt="">`;

        Insider.dom(selectors.appendLocation).before(html);
    };

    self.setEvents = () => {
        const { banner, closeButton, popup, overlay } = selectors;
        const eventType = isDesktop ? 'click' : 'touchend';

        Insider.eventManager.once(`${ eventType }.banner:image:${ variationId }`, banner, () => {
            if (!(Insider.storage.localStorage.get(`sp-camp-${ variationId }`) || {}).joined) {
                Insider.campaign.custom.storeJoinLog(variationId);

                Insider.campaign.updateCampaignCookie({
                    joined: true
                }, Insider.campaign.custom.addCampaignIdPrefix(variationId));
            }

            setTimeout(() => {
                self.callPopup();
            }, 100);
        });

        Insider.eventManager.once(`${ eventType }.close:button:${ variationId }`, `${ closeButton }, ${ overlay }`,
            () => {
                setTimeout(() => {
                    Insider.dom(`${ popup }, ${ overlay }`).remove();
                }, 100);
            });

        Insider.eventManager.once(`resize.window:change:${ variationId }`, window, Insider.fns.debounce(() => {
            windowWidth = width;

            self.detectWindowWidth();

            if (windowWidth !== width) {
                Insider.dom(banner).attr('src', config.images[width]).css('width', bannerWidth);
            }
        }, 50));
    };

    self.callPopup = () => {
        const { popup, popupHeader, logo, popupTitle, closeButton, popupText, overlay } = classes;
        let html = '';

        if (width === 320 || !isDesktop) {
            html =
          `<div class="${ popup }">
              <div class="${ popupHeader }">
                  <img class="${ logo }" src="${ config.logo }" alt="">
                  <div class="${ popupTitle }"> ${ config.popupTitle }</div>
                  <div class="${ closeButton }"><img src="${ config.closeButtonMobile }"></div>
              </div>
              <div class="${ popupText }">${ config.popupText }</div>
          </div>
          <div class="${ overlay }"></div>`;
        } else {
            html =
          `<div class="${ popup }">
              <div class="${ popupTitle }"> ${ config.popupTitle }</div>
              <div class="${ closeButton }"><img src="${ config.closeButton }"></div>
              <div class="${ popupText }">${ config.popupText }</div>
          </div>
          <div class="${ overlay }"></div>`;
        }

        Insider.dom('body').prepend(html);
    };

    self.init();
})({});

false;
/* OPT-137772 END */
