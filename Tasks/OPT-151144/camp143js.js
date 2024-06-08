// Helpers - start
/**
 * @param {object} options
 * @param {number} options.price
 * @param {string} options.currency
 * @param {string} options.currencySymbol
 * @returns {string}
 */

function formatPrice(options) {
  /**
   * @param {string} activeCurrency
   * @returns {object}
   */
  function getCurrencyRule (activeCurrency) {
      return (
          typeof camp.currencyFormatRules === 'string'
              ? Insider.fns.parse(camp.currencyFormatRules)
              : camp.currencyFormatRules
      )[activeCurrency];
  }

  var currency = options.currency || Insider.systemRules.call('getCurrency');
  var currencyRule = getCurrencyRule(currency) || {};
  var currencySymbol = options.currencySymbol || currencyRule.symbol;

  if (typeof currencyRule.decimalCount === 'string') {
      currencyRule.decimalCount = parseInt(currencyRule.decimalCount);
  }

  /**
   * @param {number} currentPrice
   * @param {number} floatingPrice
   * @returns {string}
   */
  function addDigitToSinglePrice(currentPrice, floatingPrice) {
      var decimalPrice = currentPrice.toString();

      if (decimalPrice.length === 1 && !floatingPrice && currencyRule.decimalCount === 2) {
          decimalPrice += currencyRule.decimalSeparator + '00';
      }

      return decimalPrice;
  }

  if (!currencyRule) {
      return addDigitToSinglePrice(options.price, 0) + ' ' + currency;
  }

  currencyRule.alignment = currencyRule.alignment.toString();
  var price = options.price.toString();
  var splittedPrice = price.toString().split('.');
  var floatingPrice = splittedPrice[1] || '';
  var basePrice = splittedPrice[0] || '';
  var formattedPrice = [];
  var percentile = 0;

  for (var i = (basePrice.length - 1); i >= 0; i--) {
      if (percentile > 0 && percentile % 3 === 0) {
          formattedPrice.push(currencyRule.thousandSeparator);
          percentile = 0;
      }
      formattedPrice.push(basePrice[i]);
      percentile++;
  }
  basePrice = formattedPrice.reverse().join('');

  if ((currencyRule.decimalCount === -1 && !floatingPrice) || !currencyRule.decimalCount) {
      return currencyRule.alignment === '1'
          ? addDigitToSinglePrice(basePrice, 0) + ' ' + currencySymbol
          : currencySymbol + ' ' + addDigitToSinglePrice(basePrice, 0);
  }

  floatingPrice = Number(basePrice.split(currencyRule.thousandSeparator).join('') + '.' + floatingPrice)
      .toFixed(currencyRule.decimalCount !== -1 ? currencyRule.decimalCount : 2)
      .split('.')[1] || '';

  if (currencyRule.alignment === '1') {
      return addDigitToSinglePrice(basePrice, floatingPrice) + currencyRule.decimalSeparator +
          floatingPrice + ' ' + currencySymbol;
  }

  return currencySymbol + ' ' + addDigitToSinglePrice(basePrice, floatingPrice) +
      currencyRule.decimalSeparator + floatingPrice;}/**
* @param {object} element
*/

function setAfterClickText(element) {
  var afterClickText = Insider.dom(element).parents('.ins-preview-wrapper')
      .find('[data-after-click-text]').attr('data-after-click-text') || '';

  Insider.dom('.ins-element-editable', element).find('div, span').text(afterClickText);}/**
* @param {object} element
*/

function setAfterClickColor(element) {
  var targetElement = Insider.dom(element).closest('[data-after-click-color]');

  if (!targetElement.exists()) {
      targetElement = Insider.dom(element).find('[data-after-click-color]');
  }

  targetElement.css('background-color', targetElement.attr('data-after-click-color'));}/**
* @param {number} [count]
* @returns {Array<object>}
*/

function getDummyProducts(count = 8) {
  const product = {
      id: Insider.dateHelper.now(),
      name: 'Black Insider T-shirt',
      img: '//image.useinsider.com/default/action-builder/dummy-black-tshirt.png',
      url: 'javascript:void(0)',
      price: '15.00',
      originalPrice: '20.00',
  };

  return Array.from({ length: count }, () => product);}// Helpers - end
(function (self) {
  var currency = Insider.systemRules.call('getCurrency') || '';
  var currencyRule = camp.currencyFormatRules[currency] || {};
  var leftToRightEmbeddingUnicode = '\u202A';
  var embeddingDelimiterUnicode = '\u202C';
  var embeddedCurrencySymbol = leftToRightEmbeddingUnicode + currencyRule.symbol + embeddingDelimiterUnicode;
  var selectors = {
      editableAfterClickText: '.ins-editable-after-click-text',
      mainWrapper: '.ins-preview-wrapper-' + camp.id + ' .ins-mobile-versus-main-wrapper',
      versusBox: '.ins-mobile-versus-box-item',
      versusBoxFirstItem: '.ins-mobile-versus-box-item:first',
      mobileVersusBody: '.ins-mobile-versus-body',
      productBox: '.ins-product-box',
      imageBox: '.ins-image-box',
      productName: '.ins-product-name',
      productPrice: '.ins-product-price',
      productDiscount: '.ins-product-discount',
      productDiscountPercentage: '.ins-discount-percentage',
      addToCartWrapper: '.ins-add-to-cart-wrapper',
      addToCartButton: '.ins-add-to-cart',
      bodyWrapper: '.ins-mobile-versus-body-wrapper',
      body: '.ins-preview-wrapper-' + camp.id + ' .ins-mobile-versus-body',
      arrowWrapper: '.ins-slider-arrow-wrapper',
      nextArrow: '.ins-slider-next',
      prevArrow: '.ins-slider-prev',
      contentWrapper: '.ins-content-wrapper',
      productImageBox: '.ins-product-box .ins-image-box',
      sliderTitle: '#editable-text-1454703450633',
      productAttributes: '.ins-product-attributes',
      elementLink: '.ins-element-link'
  };

  var rightToLeftLangList = [
      'ar_AE',
      'ar_AR',
      'ar_EG',
      'ar_ME',
      'ar_SA',
      'fa_FA',
      'ur_UR'
  ];
  var products = {};

  self.feed = {
      prepareProducts: function (data) {
          if (camp.id !== 0) {
              Insider.dom(selectors.mainWrapper).hide();
          }

          var productHtml = Insider.dom(selectors.mainWrapper)
              .find(selectors.versusBoxFirstItem)
              .clone().getNode(0).outerHTML;

          Insider.dom(selectors.mainWrapper).find(selectors.versusBox).remove();

          var addToCartButtonId = 1508331698331;
          var mobileVersusBody = Insider.dom(selectors.mainWrapper).find(selectors.mobileVersusBody);

          data.forEach(function (item) {
              mobileVersusBody.append(
                  self.feed.dynamicReplacement(productHtml, item, self.helpers.getSalePrice(item), addToCartButtonId)
              );

              addToCartButtonId++;
          });
      },
      dynamicReplacement: function (productHtml, item, salePrice, addToCartButtonId) {
          var itemContainer = Insider.dom(productHtml);

          if (self.helpers.isUrlEncoded(item.url)) {
              item.url = decodeURIComponent(item.url);
          }

          itemContainer.find(selectors.productBox).attr('href', camp.id !== 0 ? item.url : 'javascript:void(0);');
          itemContainer.find(selectors.imageBox).css('background-image', 'url("' + item.img + '")');
          itemContainer.find(selectors.productName).text(decodeURIComponent(item.name));
          itemContainer.find(selectors.productPrice).text(formatPrice({
              price: self.helpers.getConvertedPrice(item.price, item.exchange) || '',
              currency: currency,
              currencySymbol: embeddedCurrencySymbol,
          }));
          itemContainer.find(selectors.productDiscount).text(formatPrice({
              price: self.helpers.getConvertedPrice(item.originalPrice, item.exchange),
              currency: currency,
              currencySymbol: embeddedCurrencySymbol,
          }));
          itemContainer.find(selectors.productDiscountPercentage).text(self.helpers.getDiscountPercentage(item));
          itemContainer.find(selectors.productDiscount)
              .css('display', self.helpers.getOriginalPriceVisibility(item, salePrice));
          itemContainer.find(selectors.addToCartWrapper).attr('ins-product-id', item.id);
          itemContainer.html(itemContainer.html().replace('1508331698331', addToCartButtonId.toString()));

          self.helpers.checkDiscountPercentage(itemContainer, item);

          return itemContainer.getNode(0).outerHTML;
      }
  };

  self.helpers = {
      isUrlEncoded: function (url) {
          return url.indexOf('%3A%2F%2') !== -1
      },
      getSalePrice: function (item) {
          var salePrice = isNaN(parseInt(item.originalPrice)) ? item.originalPrice : item.originalPrice;

          return salePrice;
      },
      getDiscountedPrice: function (item) {
          var priceAttr = 'price';

          if (!item[priceAttr]) {
              return '';
          }

          return item[priceAttr];
      },
      getDiscountPercentage: function (item) {
          var salePrice = self.helpers.getSalePrice(item) || 0;
          var discountedPrice = self.helpers.getDiscountedPrice(item) || 0;

          if (salePrice == discountedPrice){
              return 0;
          }

          return (((salePrice - discountedPrice) / salePrice) * 100).toFixed(0);
      },
      getOriginalPrice: function (product) {
          var price = parseFloat(product.price);
          var originalPrice = parseFloat(product.originalPrice);

          return originalPrice && originalPrice > price ? formatPrice({ price: product.originalPrice }) : '';
      },
      getOriginalPriceVisibility: function (product) {
          if ('#{{Discount Price}}' === 'none' || !self.helpers.getOriginalPrice(product)) {
              return 'none';
          }

          return 'block';
      },
      checkDiscountPercentage: function (itemContainer, item) {
          if (self.helpers.getDiscountPercentage(item) <= 0) {
              return itemContainer.find('.ins-discount-badge').attr("style", "display: none !important");
          }

          return itemContainer.find('.ins-discount-badge').css('display', 'flex');
      },
      getConvertedPrice: function (price, exchange) {
          if (!exchange) {
              return price;
          }

          var from = exchange.match(/from (\w+)/).pop();
          var to = exchange.match(/to (\w+)/).pop();
          var mainPrice = Insider.currencyService.getConvertedPrice(from, to, price);

          return Insider.currencyService.getConvertedPrice(Insider.currencyService.to, currency, mainPrice);
      }
  };

  self.setEvents = function (versusSlider) {
      if (camp.id !== 0) {
          Insider.eventManager
              .off('click.insVersusAddToCart', selectors.mainWrapper + ' ' + selectors.addToCartWrapper)
              .on('click.insVersusAddToCart', selectors.mainWrapper + ' ' + selectors.addToCartWrapper, function () {
                  var productId = Insider.dom(this).attr('ins-product-id') || '';
                  var product = self.data.filter(function (currentProduct) {
                      return currentProduct.id === productId;
                  })[0];

                  Insider.systemRules.call('spAddToCart').addToBasket(productId, undefined, { product: product });

                  setAfterClickText(this);
                  setAfterClickColor(this);
              });
      } else {
          setTimeout(function () {
              if (!camp.skeleton) {
                  window.ActionBuilder && ActionBuilder.eventManager.triggerManualEvent('notification.refreshElementList');
              }
          }, 200);
      }

      Insider.eventManager
          .off('resize.' + camp.id, window)
          .on('resize.' + camp.id, window, Insider.fns.debounce(versusSlider.setDimensions.bind(versusSlider), 100));
  };

  self.sliderInit = function (callback) {
      var versusSlider = {};
      var mainWrapperDiv = Insider.dom(selectors.mainWrapper);

      versusSlider.elements = {
          mainWrapper: mainWrapperDiv,
          wrapper: mainWrapperDiv.find(selectors.bodyWrapper),
          arrowWrapper: mainWrapperDiv.find(selectors.arrowWrapper),
          next: mainWrapperDiv.find(selectors.nextArrow),
          prev: mainWrapperDiv.find(selectors.prevArrow),
          contentWrapper: mainWrapperDiv.closest(selectors.contentWrapper),
          productImageBox: mainWrapperDiv.find(selectors.productImageBox)
      };

      versusSlider.settings = {
          betweenItemMargin: Number('#{{Product Margin}}') * 2,
          eachItemWidth: Number('#{{Product Area.Width}}') || 180,
          itemCount: Insider.dom(versusSlider.elements.mainWrapper).find(selectors.versusBox).length,
          windowItemCount: Number('#{{Display Product Number}}'),
          isResponsiveMode: '#{{Responsive Design}}' === 'true',
          slidingItemCount: Number('#{{Sliding Number}}') || 2,
          isLoopActive: '#{{Slider Loop}}' === 'true'
      };

      versusSlider.setDimensions = function () {
          var settings = versusSlider.settings;
          var elements = versusSlider.elements;
          var wrapperWidth = Number('#{{Size.Width}}') || elements.contentWrapper.width();
          var windowItemCount = settings.isResponsiveMode ?
              settings.windowItemCount :
              (wrapperWidth / (settings.eachItemWidth + settings.betweenItemMargin));
          var eachItemWidth = (wrapperWidth / windowItemCount) - settings.betweenItemMargin;
          var mobileVersusBody = Insider.dom(selectors.body);

          versusSlider.setSetting('windowItemCount', windowItemCount);
          versusSlider.setSetting('eachItemWidth', eachItemWidth);

          elements.wrapper.width(wrapperWidth);
          elements.productImageBox.height('#{{Image Area.Height}}' || '200px');
          // Shows up images in here to prevent multiple image request on network
          elements.productImageBox.css('display', 'flex');

          mobileVersusBody.find(selectors.versusBox).width(eachItemWidth);
          mobileVersusBody.find(selectors.addToCartWrapper).height('#{{Add to Cart Size.Height}}' || '30px');
          mobileVersusBody.width((eachItemWidth + settings.betweenItemMargin) * settings.itemCount);
          mobileVersusBody.attr('data-current', 0);

          if ('#{{Add To Cart Button Image Checkbox}}' === 'true') {
              mobileVersusBody.find(selectors.addToCartWrapper).addClass('ins-add-to-cart-button-with-image');
              mobileVersusBody.find(selectors.addToCartWrapper)
                  .find(selectors.addToCartButton)
                  .parent()
                  .remove();
          }

          return versusSlider;
      };

      versusSlider.setSetting = function (key, value) {
          versusSlider.settings[key] = value;
      };

      versusSlider.construct = function () {
          versusSlider.elements.wrapper.toggleClass(
              'ins-responsive-mode-active',
              versusSlider.settings.isResponsiveMode
          );

          Insider.dom(selectors.body).attr('data-current', 0);
          versusSlider.setArrowIcons();
          versusSlider.setDimensions();
          versusSlider.bindEvents();
          versusSlider.bindTouchEvents();
          versusSlider.checkRtlStatus();

          return versusSlider;
      };

      versusSlider.checkRtlStatus = function () {
          if (rightToLeftLangList.indexOf(Insider.systemRules.call('getLang')) > -1) {
              versusSlider.slideTo(
                  versusSlider.settings.itemCount - versusSlider.settings.windowItemCount
              );

              var mainWrapperDiv = Insider.dom(selectors.mainWrapper);

              mainWrapperDiv.find(selectors.sliderTitle).css('float', 'right');
              mainWrapperDiv.find(selectors.productAttributes).css('float', 'right');
              mainWrapperDiv.find(selectors.elementLink).css('text-align', 'center');
          }
      };

      versusSlider.setArrowIcons = function () {
          var arrowWrapper = versusSlider.elements.arrowWrapper;
          var arrowWrapperClass = 'ins-arrow-with-border';
          arrowWrapper.removeClass('ins-arrow-with-background ins-arrow-with-border');

          if ('#{{Arrow Image Checkbox}}' === 'true') {
              arrowWrapperClass = 'ins-arrow-with-background';
          }

          arrowWrapper.addClass(arrowWrapperClass);
      };

      versusSlider.checkArrowButtons = function () {
          var settings = versusSlider.settings;
          var elements = versusSlider.elements;
          var currentItem = Insider.dom(selectors.body).attr('data-current');

          if (currentItem < settings.itemCount - settings.windowItemCount) {
              elements.next.show();
          } else if (!settings.isLoopActive) {
              elements.next.hide();
          }

          if (currentItem > 0) {
              elements.prev.show();
          } else if (!settings.isLoopActive) {
              elements.prev.hide();
          }
      };

      versusSlider.bindEvents = function () {
          var elements = versusSlider.elements;
          versusSlider.checkArrowButtons();

          Insider.eventManager
              .off('click', elements.prev)
              .on('click', elements.prev, versusSlider.slideToLeft.bind(this));
          Insider.eventManager
              .off('click', elements.next)
              .on('click', elements.next, versusSlider.slideToRight.bind(this));
      };

      versusSlider.bindTouchEvents = function () {
          var element = selectors.body;
          var events = versusSlider.touchEvents;

          Insider.eventManager.off('touchstart', element).on('touchstart', element, events.touchstart);
          Insider.eventManager.off('touchmove', element).on('touchmove', element, events.touchmove);
      };

      versusSlider.touchEvents = {
          touchstart: function (event) {
              var touch = event.originalEvent.touches[0];

              xDown = touch.clientX;
              yDown = touch.clientY;
          },
          touchmove: function (event) {
              if (!xDown || !yDown) {
                  return;
              }

              var touch = event.originalEvent.touches[0];
              var xUp = touch.clientX;
              var yUp = touch.clientY;
              var xDiff = xDown - xUp;
              var yDiff = yDown - yUp;

              if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(yDiff) < 10) {
                  event.preventDefault();

                  if (xDiff > 0) {
                      versusSlider.slideToRight();
                  } else {
                      versusSlider.slideToLeft();
                  }
              }

              xDown = null;
              yDown = null;
          }
      };

      versusSlider.slideToLeft = function () {
          var settings = versusSlider.settings;
          var currentItem = parseInt(Insider.dom(selectors.body).attr('data-current'));
          var newCurrentItem = currentItem - settings.slidingItemCount;

          if (newCurrentItem + settings.slidingItemCount === 0) {
              if (!settings.isLoopActive) {
                  return;
              }

              newCurrentItem = settings.itemCount - Math.floor(settings.windowItemCount);
          } else if (newCurrentItem < 0) {
              newCurrentItem = 0;
          }

          versusSlider.slideTo(newCurrentItem);
      };

      versusSlider.slideToRight = function () {
          var settings = versusSlider.settings;
          var currentItem = parseInt(Insider.dom(selectors.body).attr('data-current'));
          var newCurrentItem = currentItem + settings.slidingItemCount;
          var windowItemCount = Math.floor(settings.windowItemCount);
          var itemCount = Math.floor(settings.itemCount);
          var emptyAreaCount = Math.abs(windowItemCount - settings.slidingItemCount);

          if (newCurrentItem + emptyAreaCount >= itemCount) {
              if (!settings.isLoopActive) {
                  return;
              }

              newCurrentItem = 0;
          } else if (itemCount - newCurrentItem < windowItemCount) {
              newCurrentItem = itemCount - windowItemCount;
          }

          versusSlider.slideTo(newCurrentItem);
      };

      versusSlider.slideTo = function (newCurrentItem) {
          var settings = versusSlider.settings;
          var mobileVersusBody = Insider.dom(selectors.body);
          var newPosition = newCurrentItem * (settings.eachItemWidth + settings.betweenItemMargin);

          mobileVersusBody.attr('data-current', newCurrentItem);
          mobileVersusBody.css('transform', 'translateX(-' + newPosition + 'px)');

          versusSlider.checkArrowButtons();
      };

      versusSlider.construct();

      if (callback instanceof Function) {
          callback(versusSlider);
      }

      return versusSlider;
  };

  self.init = function () {
      Insider.dom(selectors.mainWrapper)
          .find(selectors.mobileVersusBody)
          .css('transform', 'unset');

      if (camp.id === 0) { // in panel
          self.data = getDummyProducts(#{{Product Limit}});
      } else {
          self.data = Insider.campaign.versus.getVisitedProducts().slice(-1 * #{{Product Limit}}).reverse();
      }

      if (self.data.length === 0) {
          Insider.dom(selectors.mainWrapper).hide();

          return false;
      }

      if (self.data.length < 2) {
          Insider.dom(selectors.mainWrapper).find(selectors.arrowWrapper).hide();
      }

      self.feed.prepareProducts(self.data);

      Insider.dom(selectors.mainWrapper).show();

      self.setEvents(self.sliderInit());
  };

  self.init();

  Insider.eventManager.on('framelessInited' + camp.id, self.init);

  Insider.eventManager.once(`orientationchange:${ camp.id }`, window, self.init)  /* OPT-151144 */
})({});
