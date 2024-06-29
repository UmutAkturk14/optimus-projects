/* OPT-112396 START */
((self) => {
    'use strict';

    const builderId = 91;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isControlGroup = Insider.campaign.isControlGroup(variationId);
    const disabledSizeNumber = []; /* OPT-153084 */

    const config = {
        errorMessageText: 'Lütfen gerekli seçimleri yapınız',
        sizeFindName: 'Bedenimi Bul',
        sizeName: 'BEDEN',
        elementsInformation: {
            colorsDiv: '',
            imageSrc: '',
            productName: '',
            productPrice: '',
            productDiscount: '',
            sizeList: [],
            basketDiv: '',
            colorList: [],
            colorBackground: [],
            imgSrc: []
        },
        arrowUp: 'https://image.useinsider.com/koton/defaultImageLibrary/icons8-collapse-arrow-50-1675625346.png',
        arrowDown: 'https://image.useinsider.com/koton/defaultImageLibrary/icons8-collapse-arrow-50%20%281%29-1675625367.png',
        closeButtonImage: 'https://image.useinsider.com/koton/defaultImageLibrary/x-1709560771.jpeg', /* ZEN-155783 */
        disabledSizeBell: 'https://image.useinsider.com/koton/defaultImageLibrary/Frame-1709661995.png', /* OPT-153084 */
        colorDisplay: 'none;',
        variationGoalId: 26,
        controlGroupGoalId: 27,
    };

    const productClasses = {
        wrapper: `ins-product-wrapper-${ variationId }`,
        closeButton: `ins-wrap-close-button-${ variationId }`,
        container: `ins-product-container-${ variationId }`,
        image: `ins-product-image-${ variationId }`,
        contentContainer: `ins-product-content-container-${ variationId }`,
        information: `ins-product-information-${ variationId }`,
        name: `ins-product-name-${ variationId }`,
        price: `ins-product-price-${ variationId }`,
        discount: `ins-product-discount-${ variationId }`,
        colorWrapper: `ins-product-colors-wrapper-${ variationId }`,
        colorsContainer: `ins-product-colors-container-${ variationId }`,
        colors: `ins-product-colors-${ variationId }`,
        justColors: `ins-product-justColors-${ variationId }`,
        popupArrow: `ins-popup-arrow-${ variationId }`,
        sizeAndBasket: `ins-product-size-basket-${ variationId }`,
        sizeContainer: `ins-product-size-container-${ variationId }`,
        size: `ins-product-size-${ variationId }`,
        basket: `ins-product-basket-${ variationId }`,
        downArrowSize: `ins-popup-arrow-down-size-${ variationId }`,
        upArrowSize: `ins-popup-arrow-up-size-${ variationId }`,
        downArrowColor: `ins-popup-arrow-down-color-${ variationId }`,
        upArrowColor: `ins-popup-arrow-up-color-${ variationId }`,
        style: `ins-basket-style-${ variationId }`,
        join: `sp-custom-${ variationId }-1`,
        sizePopup: `ins-size-popup-${ variationId }`,
        sizeName: `ins-size-popup-name-${ variationId }`,
        sizeItem: `ins-size-popup-item-${ variationId }`,
        popupArrowSize: `ins-size-arrow-size-item-${ variationId }`,
        colorPopup: `ins-color-popup-item-${ variationId }`,
        colorName: `ins-color-item-name-${ variationId }`,
        colorImage: `ins-color-item-image-${ variationId }`,
        colorItem: `ins-color-item-container-${ variationId }`,
        error: `ins-error-message-${ variationId }`,
        findSize: `ins-find-size-${ variationId }`,
        sizeCheckBar: `ins-size-popup-checkbar-${ variationId }`,
        justColorOutline: `ins-just-outline-color-${ variationId }`,
        colorOutline: `ins-outline-color-${ variationId }`,
        /* OPT-153084 START */
        disableSizeWrapper: `ins-disable-size-wrapper-${ variationId }`,
        disableSizeText: `ins-disable-size-text-${ variationId }`,
        partnerOutOfStockButton: 'pz-button.pz-product-alert-button.js-product-stock-alert.-faded.-reversed.-w-full.pz-button.-icon-left.-appearance-filled',
        /* OPT-153084 END */
    };

    const selectors = Object.keys(productClasses).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ productClasses[key] }`;

        return createdSelector;
    }, {});

    const partnerSelectors = {
        product: '.product-info',
        navigator: '.js-sticky-header.-sticky-header',
        productBottom: '.product-info__list',
        colors: 'pz-variant[name="Renk"] .pz-variant__options',
        image: '.product-media__images picture:first-child img',
        name: '.product-info__header-title',
        price: '.price__price',
        discount: '.price__basket-offer',
        size: '.dimensions-input__content .variant:contains("Beden") .variant__option',
        basket: '.add-to-cart',
        sizeCheck: '.dimensions-input__content.js-dimensions-content .variant',
        findSize: '.dimensions__guide pz-button',
        partnerBasket: '.add-to-cart.js-add-to-cart',
        partnerBasketSpan: '.add-to-cart.js-add-to-cart span',
    };

    self.callInit = () => {
        const { product, sizeCheck, size, image } = partnerSelectors;

        Insider.fns.onElementLoaded(`${ product }, ${ sizeCheck }, ${ size }, ${ image }`, () => {
            if (!(Insider.dom(sizeCheck).nodes.length > 1) &&
          Insider.dom(size).nodes.length > 0) {
                self.init();
            }
        }).listen();
    };

    self.init = () => {
        if (!isControlGroup && variationId) {
            self.reset();
            self.takeHtml();
            self.buildCss();
            self.buildHtml();
        }

        self.setEvents();

        Insider.campaign.info.clearVisibleCampaignsByType('ON-PAGE');

        Insider.campaign.custom.show(variationId);
    };

    self.reset = () => {
        Insider.dom(`${ selectors.wrapper }, ${ selectors.style }`).remove();
    };

    self.takeHtml = () => {
        const { elementsInformation } = config;
        const { colors, image, name, price, discount, size, basket } = partnerSelectors;

        if (Insider.dom(colors).children().nodes.length > 0) {
            config.colorDisplay = 'flex;';

            [elementsInformation.colorsDiv] = Insider.dom(colors).clone().removeClass('pz-variant__options')
                .addClass(productClasses.colorsContainer).nodes;

            Insider.dom(elementsInformation.colorsDiv).children().accessNodes((node) => {
                const $element = Insider.dom(node);

                $element.find('a').attr('disabled', 'disabled');

                $element.find('.color-name').remove();

                elementsInformation.colorList.push($element.attr('label'));

                if (Insider.dom(colors).text().trim() === '') {
                    $element.addClass(productClasses.justColors);

                    /* ZEN-147527 START */
                    if ($element.selector.classList.contains('-selected')) {
                        $element.addClass(productClasses.justColorOutline);
                    }
                    /* ZEN-147527 END */
                    elementsInformation.colorBackground.push($element.attr('style'));
                } else {
                    $element.addClass(productClasses.colors);

                    /* ZEN-147527 START */
                    if ($element.selector.classList.contains('-selected')) {
                        $element.addClass(productClasses.colorOutline);
                    }
                    /* ZEN-147527 END */
                    elementsInformation.imgSrc.push($element.find('img').attr('src'));
                }
            });
        }

        elementsInformation.imageSrc = Insider.dom(image).attr('data-src');
        elementsInformation.productName = Insider.dom(name).text().trim();
        elementsInformation.productPrice = Insider.dom(price).text().trim();
        elementsInformation.productDiscount = Insider.dom(discount).text().trim();

        /* OPT-153084 START */
        Insider.dom(size).accessNodes((sizeName) => {
            const $elements = Insider.dom(sizeName);
            const productSize = $elements.text().trim();

            if ($elements.hasClass('-disabled')) {
                disabledSizeNumber.push(productSize);
            }

            productSize !== '' && elementsInformation.sizeList.push(productSize);
        });
        /* OPT-153084 END */

        [elementsInformation.basketDiv] = Insider.dom(basket).clone().removeClass('js-add-to-cart').
            addClass(productClasses.basket).nodes;
    };

    self.buildCss = () => {
        const { wrapper, closeButton, container, image, contentContainer, information, name, price, discount, colors,
            colorsContainer, popupArrow, sizeAndBasket, sizeContainer, size, basket, justColors, colorWrapper, error,
            sizePopup, sizeName, sizeItem, popupArrowSize, colorName, colorImage, colorPopup, colorItem, findSize,
            sizeCheckBar, justColorOutline, colorOutline, disableSizeWrapper, disableSizeText } = selectors;

        const addBasketStyle =
      `${ wrapper } {
          display: none;
          position: fixed;
          top: auto;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 50; /* OPT-153084 */
          transform: translateY(0px);
          font-family: Roboto;
          background-color: #fff;
          height: 130px;
          box-shadow: 0px 4px 45px rgba(0, 0, 0, 0.23);
      }
      ${ closeButton } {
          color: rgb(0,0,0,0.7);
          padding: 8px;
          position: absolute;
          top: -6px;
          right: 1px;
          cursor: pointer;
          font-family: inherit;
          font-size: 19px;
          width: 35px;
          height: 35px;
      }
      ${ container } {
          display: flex;
          width: 72.5%;
          height: 100px;
          margin: 15px auto;
      }
      ${ image } {
          height: 100px;
          width: 75.83px;
          background-size: 100% 100%;
      }
      ${ contentContainer } {
          display: flex;
          flex: 50%; /* ZEN-92614 */
          justify-content: space-between;
      }
      ${ sizeAndBasket } {
          flex: 38%;
          display: flex;
          padding: 0px 22px;
          box-sizing: content-box;
          justify-content: space-between; /* OPT-148157 */
      }
      ${ colorWrapper } {
          display: none;
          flex: 1;
          justify-content: end;
          align-items: center;
          position: relative;
      }
      ${ colorsContainer } {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
      }
      ${ colors } {
          width: 38px;
          height: 50px;
      }
      ${ justColors } {
          display: inline-block;
          position: relative;
          height: 1.5rem;
          width: 1.5rem;
          overflow: hidden;
          border-radius: 9999px;
          border-width: 2px;
          border-style: none;
          outline: 2px solid transparent;
          outline-offset: 2px;
      }
      ${ information } {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          flex-basis: 280px;
          margin-left: 0.7rem; /* ZEN-92614 */
      }
      ${ name } {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 400;
          font-size: 12px;
          line-height: 16px;
          letter-spacing: 0.01em;
          max-width: 280px;
      }
      ${ price } {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 800;
          font-size: 12px;
          line-height: 14px;
      }
      ${ discount } {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 600;
          font-size: 12px;
          line-height: 16px;
          width: 350px; /* OPT-148157 */
          color: #FC0D1B;
      }
      ${ popupArrow } {
          height: 16px;
          width: 16px;
          background-size: 100% 100%;
          margin: 0px 25px;
          cursor: pointer;
          padding: 8px;
      }
      ${ sizeContainer } {
          display: flex;
          align-items: center;
          position: relative;
      }
      ${ size } {
          font-family: 'Roboto';
          font-style: normal;
          /* ZEN-147527 START */
          font-size: 16px;
          line-height: normal;
          font-weight: 900;
          /* ZEN-147527 END */
          display: flex;
          align-items: center;
          letter-spacing: 0.01em;
          color: #070707;
          width: max-content; /* ZEN-155783 */
      }
      ${ basket } {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 10px 100px;
          gap: 6px;
          background: #070707;
          height: 45px; /* ZEN-147527 */
          align-self: center;
          margin-left: 10%; /* OPT-148157 */
      }
      ${ basket } .pz-icon-basket {
          color: white;
      }
      ${ basket } span {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
          line-height: 19px;
          letter-spacing: -0.02em;
          color: #FFFFFF;
          flex-shrink: 0;
      }
      ${ sizePopup } {
          display:none;
          position: absolute;
          bottom: 144px;
          background: white;
          width: 350px; /* OPT-148157 */
          right: 30%;
          box-shadow: 0px 4px 45px rgba(0, 0, 0, 0.23);
      }
      ${ sizeName } {
          padding: 8px 12px;
          font-weight: bold;
          color: #000;
          /* OPT-148157 START */
          border-bottom: 1.5px solid #F8F8F8;
          font-weight: 600;
          font-size: 15px;
          /* OPT-148157 END */
      }
      ${ sizeItem } {
          padding: 8px 12px;
          color: #000;
          cursor:pointer;
          /* OPT-148157 START */
          border-bottom: 1.5px solid #F8F8F8;
          font-family: 'Roboto';
          font-size: 13px;
          /* OPT-148157 END */
      }
      ${ sizeItem }:hover {
          background-color: #F8F8F8; /* OPT-148157 */
      }
      ${ popupArrowSize } {
          position: absolute;
          width: 20px;
          height: 20px;
          background: white;
          transform: rotate(45deg);
          bottom: -5px;
          left: 50%;
      }
      ${ colorPopup } {
          display:none;
          position: absolute;
          bottom: 144px;
          background: white;
          width: 400px;
          right: 36%;
          padding: 25px 13px;
          box-shadow: 0px 4px 45px rgba(0, 0, 0, 0.23);
      }
      ${ colorPopup } img{
          width: 35px;
          height: 46px;
      }
      ${ colorItem } {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          border-bottom: 1.5px solid #dbd4d4;
          color: #000;
          cursor:pointer;
      }
      ${ colorItem }:hover {
          background-color: #c0c0c0;
      }
      ${ colorName } {
          color: black;
          margin-left: 25px;
      }
      ${ colorImage } {
          width: 21px;
          height: 21px;
          background-size: 100% 100%;
          border-radius: 100%;
      }
      ${ error } {
          display:none;
          font-size: .75rem;
          line-height: 1rem;
          --tw-text-opacity: 1;
          color: red;
          position: absolute;
          bottom: 105px;
      }
      ${ sizeCheckBar } {
          padding: 0px 13px 25px 13px;
      }
      /* ZEN-147527 START */
      ${ justColorOutline } {
          outline-color: #000;
      }
      ${ colorOutline } {
          border: 1px solid #000;
      }
      /* ZEN-147527 END */
      ${ findSize } {
          padding: 8px 12px;
          text-align: center;
          background-color: #F8F8F8;
          border-bottom: 1.5px solid #F8F8F8;
          color: #000;
          text-decoration: underline;
          cursor: pointer;
          font-size: 12px;
      }
      /* OPT-153084 START */
      ${ disableSizeWrapper } {
          display: flex;
          align-items: baseline;
      }
      ${ disableSizeText } {
          font-family: Roboto;
          font-size: 13px;
          font-weight: 700;
          line-height: 15px;
          letter-spacing: 0em;
          text-align: left;
          color: #E4E4E4;
      }
      /* OPT-153084 END */
      @media (max-width: 1450px) {
          ${ colors } {
              width: 30px;
              height: 39.3px;
          }
          ${ popupArrow } {
              margin: 0px 14px;
          }
      }
      @media (max-width: 1400px) {
          ${ justColors } {
              height: 0.9rem;
              width: 0.9rem;
          }
          ${ popupArrow } {
              margin: 0px 8px;
          }
          ${ information } {
              flex-basis: 200px;
          }
      }`;

        Insider.dom('<style>').addClass(productClasses.style).html(addBasketStyle).appendTo('head');
    };

    self.buildHtml = () => {
        const { wrapper, container, closeButton, contentContainer, name, information, image, join, price, sizeAndBasket,
            discount, popupArrow, sizeContainer, size, colorWrapper, downArrowSize, upArrowSize, downArrowColor, error,
            upArrowColor } = productClasses;

        const { sizeName, elementsInformation, arrowDown, arrowUp, closeButtonImage } = config;
        const { colorsDiv, imageSrc, productName, productPrice, productDiscount, sizeList, basketDiv, colorList, imgSrc,
            colorBackground } = elementsInformation;

        const addBasketHtmlStructure =
      `<div class="${ wrapper } ${ join }">
          <img src="${ closeButtonImage }" class="${ closeButton }"></img>
          <div class="${ container }">
              <div class="${ image }" style="background-image: url(${ imageSrc })"></div>
              <div class="${ contentContainer }">
                  <div class="${ information }">
                      <div class="${ name }">${ productName }</div>
                      <div class="${ price }">${ productPrice }</div>
                      <div class="${ discount }">${ productDiscount }</div>
                  </div>
                  <div class="${ colorWrapper }">
                      <div class="${ popupArrow } ${ downArrowColor } " style="background-image: url(${ arrowDown })">
                      </div>
                      <div class="${ popupArrow } ${ upArrowColor }" style="background-image: url(${ arrowUp });
                      display: none;"></div>
                  </div>
              </div>
              <div class="${ sizeAndBasket }">
                  <div class="${ sizeContainer }">
                      <div class="${ size }">${ sizeName }</div>
                      <div class="${ popupArrow } ${ downArrowSize }" style="background-image: url(${ arrowDown })">
                      </div>
                      <div class="${ popupArrow } ${ upArrowSize }" style="background-image: url(${ arrowUp });
                      display: none;"></div>
                  </div>
              </div>
          </div>
      </div>`;

        const errorMessage = `<div class= ${ error }>${ config.errorMessageText }</div>`;

        Insider.dom('body').append(addBasketHtmlStructure);
        Insider.dom(selectors.colorWrapper).prepend(colorsDiv);
        Insider.dom(selectors.sizeAndBasket).append(basketDiv);
        Insider.dom(basketDiv).prepend(errorMessage);

        const { sizeHtml, colorHtml } = imgSrc.length !== 0 ? self.createPopupHml({ sizeList, colorList, imgSrc }) :
            self.createPopupHml({ sizeList, colorList, colorBackground });

        Insider.dom(selectors.wrapper).append(sizeHtml).append(colorHtml);
    };

    self.createPopupHml = (itemLists) => {
        const { sizePopup, sizeName, sizeItem, popupArrowSize, colorName, colorImage, colorPopup,
            colorItem, findSize, sizeCheckBar, disableSizeText, disableSizeWrapper } = productClasses;
        const { disabledSizeBell } = config;

        /* OPT-153084 START */
        const sizes = itemLists.sizeList.reduce((createdSize, size) => {
            if (disabledSizeNumber.includes(size)) {
                createdSize +=
              `<div class="${ sizeItem } ${ disableSizeWrapper }">
                  <span class="${ disableSizeText }">${ size }</span>
                  <img src="${ disabledSizeBell }">
              </div>`;
            } else {
                createdSize += `<div class="${ sizeItem }">${ size }</div>`;
            }

            return createdSize;
        }, '');
        /* OPT-153084 END */

        const sizeHtml =
      `<div class="${ sizePopup }">
          <div class="${ findSize }">${ config.sizeFindName }</div>
          <div class="${ sizeCheckBar }">
              <div class="${ sizeName }">${ config.sizeName }</div>
              ${ sizes }
              <div class="${ popupArrowSize }"></div>
          </div>
      </div>`;

        const colors = itemLists.colorList.reduce((createdColors, color, currentIndex) => {
            const singleItem = itemLists.imgSrc ? `<img alt = "${ color }" src =${ itemLists.imgSrc[currentIndex] }>
          <div class="${ colorName }">${ color }</div>` :
                `<div class="${ colorImage }" style= "${ itemLists.colorBackground[currentIndex] }"></div>
              <div class="${ colorName }">${ color }</div>`;

            createdColors += `<div class="${ colorItem }"> ${ singleItem } </div>`;

            return createdColors;
        }, '');

        const colorHtml =
      `<div class="${ colorPopup }">
          ${ colors }
          <div class="${ popupArrowSize }"></div>
      </div>`;

        return { sizeHtml, colorHtml };
    };

    self.setEvents = () => {
        const { wrapper, closeButton, popupArrow, basket, sizePopup, sizeItem, colorPopup, colorItem, downArrowSize,
            upArrowSize, downArrowColor, upArrowColor, size, error, findSize, partnerOutOfStockButton } = selectors;

        const { downArrowSize: downArrowSizeClass, upArrowSize: upArrowSizeClass, downArrowColor: downArrowColorClass,
            upArrowColor: upArrowColorClass, sizeItem: sizeItemClass, colorItem: colorItemClass,
            closeButton: closeButtonClass, basket: basketClass, findSize: findSizeClass,
            disableSizeWrapper } = productClasses;

        Insider.eventManager.once(`scroll.listen:partner:element:show:or:not:${ variationId }`,
            window, Insider.fns.throttle(() => {
                Insider.dom(wrapper).css('display', self.giveBasketVisibleInformation() ? 'none' : 'block');
            }, 500)
        );

        Insider.eventManager.once(`mousedown.add:to:cart:${ variationId }`, `${ partnerSelectors.partnerBasket },
       ${ partnerSelectors.partnerBasketSpan }`, () => {
            const errorDisplay = Insider.dom('.action__error').css('display');

            const isCustomBasketExist = Insider.dom(basket).exists();

            const bodyName = Insider.dom('.js-dimensions-text').text().trim();

            if (!isCustomBasketExist && bodyName !== 'Beden') {
                if (errorDisplay !== 'block') {
                    if (Insider.fns.isFunction(Insider.__external.sendCustomGoal)) {
                        Insider.__external.sendCustomGoal(builderId, config.controlGroupGoalId, true);
                    } else {
                        Insider.logger.log('Insider.__external.sendCustomGoal is not a function.');
                    }
                }
            }
        }
        );

        Insider.eventManager.once(`click.popups:size:color:close:basket33:${ variationId }`, `${ popupArrow },
      ${ closeButton }, ${ basket }, ${ sizeItem }, ${ colorItem }, ${ findSize }`, function () {
            const $element = Insider.dom(this);

            const name = $element.text().trim(); /* OPT-153084 */

            if ($element.hasClass(downArrowSizeClass)) {
                Insider.dom(downArrowSize).css('display', 'none');
                Insider.dom(upArrowSize).css('display', 'block');

                Insider.dom(sizePopup).css('display', 'block');
            } else if ($element.hasClass(upArrowSizeClass)) {
                Insider.dom(upArrowSize).css('display', 'none');
                Insider.dom(downArrowSize).css('display', 'block');

                Insider.dom(sizePopup).css('display', 'none');
            } else if ($element.hasClass(sizeItemClass)) {
                Insider.dom(sizePopup).css('display', 'none');
                Insider.dom(upArrowSize).css('display', 'none');
                Insider.dom(downArrowSize).css('display', 'block');
                Insider.dom(error).css('display', 'none');

                Insider.dom(size).text(name);

                if (name.includes('Yaş') || name.includes('Ay')) {
                    Insider.dom(`.variant__option:contains(${ name })`).click();
                } else {
                    Insider.dom(`.variant__option[data-value = "${ name }"]`).click();
                }

            } else if ($element.hasClass(downArrowColorClass)) {
                Insider.dom(downArrowColor).css('display', 'none');
                Insider.dom(upArrowColor).css('display', 'block');

                Insider.dom(colorPopup).css('display', 'block');
            } else if ($element.hasClass(upArrowColorClass)) {
                Insider.dom(upArrowColor).css('display', 'none');
                Insider.dom(downArrowColor).css('display', 'block');

                Insider.dom(colorPopup).css('display', 'none');
            } else if ($element.hasClass(colorItemClass)) {
                Insider.dom(colorPopup).css('display', 'none');
                Insider.dom(upArrowColor).css('display', 'none');
                Insider.dom(downArrowColor).css('display', 'block');

                Insider.dom(`pz-variant[name="Renk"] pz-variant-option[label= "${ $element.text().trim() }"] a`)
                    .click();
            } else if ($element.hasClass(closeButtonClass)) {
                Insider.dom(wrapper).css('display', 'none');
            } else if ($element.hasClass(basketClass)) {
                if (Insider.dom(size).text() === 'BEDEN') {
                    Insider.dom(error).css('display', 'block');
                } else {
                    (Insider.systemRules.spAddToCart() || {}).addToBasket(
                        (Insider.systemRules.call('getCurrentProduct') || {}).id);

                    Insider.dom(error).css('display', 'none');

                    if (Insider.fns.isFunction(Insider.__external.sendCustomGoal)) {
                        Insider.__external.sendCustomGoal(builderId, config.variationGoalId, true);
                    } else {
                        Insider.logger.log('Insider.__external.sendCustomGoal is not a function.');
                    }
                }
            } else if ($element.hasClass(findSizeClass)) {
                Insider.dom(partnerSelectors.findSize).click();
            }
        });

        Insider.eventManager.once(`click.size:making:bold-${ variationId }`, sizeItem, (element) => {
            /* OPT-153084 START */
            Insider.dom(element['_originalTarget']).hasClass(disableSizeWrapper) &&
           setTimeout(() => Insider.dom(partnerOutOfStockButton).click(), 750);
            /* OPT-153084 END */

            Insider.dom(sizeItem).css('font-weight', '400');
            Insider.dom(element.currentTarget).css('font-weight', '900');
        });

        /* OPT-153084 START */
        Insider.eventManager.once(`click.size:find:${ variationId }`, findSize, () => {
            Insider.dom('.pz-expandable[title="Beden Tablosu"]').click();
            Insider.dom(sizePopup).css('display', 'none');
            Insider.dom(upArrowSize).css('display', 'none');
            Insider.dom(downArrowSize).css('display', 'block');
        });
        /* OPT-153084 END */
    };

    self.giveBasketVisibleInformation = () => {
        const { navigator, productBottom } = partnerSelectors;

        const docViewTop = Insider.dom(window).scrollTop() + Insider.dom(navigator).height() + 130;
        const elemTop = Insider.dom(productBottom).offset().top;
        const elemBottom = elemTop + Insider.dom(productBottom).height();

        return elemBottom > docViewTop;
    };

    if (isControlGroup) {
        self.callInit();
    } else {
        setTimeout(function () {
            self.callInit();
        }, 3000);
    }

    return false;
})({});
/* OPT-112396 END */
