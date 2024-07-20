/* OPT-121669 START */
Insider.__external.SetAddToCartButtonModification153169 = (variationId) => { /* OPT-153169 */
    'use strict';

    const self = {}; /* OPT-153169 */
    var previewWrapper = '.ins-preview-wrapper-' + variationId;
    var productId = 'ins-product-id';
    var quantityChangedGoalId = 9;

    var texts = {
        minusButton: '&minus;',
        starterQuantity: '1',
        plusButton: '&plus;',
        addToCartButtonText: 'Add',
    };

    var classes = {
        style: 'ins-custom-style-' + variationId,
        wrapper: 'ins-custom-item-counter-wrapper-' + variationId,
        container: 'ins-custom-item-counter-container-' + variationId,
        quantityLabel: 'ins-custom-item-counter-label-' + variationId,
        quantityButtons: 'ins-custom-item-counter-buttons-' + variationId,
        minusButton: 'ins-custom-item-counter-minus-button-' + variationId,
        plusButton: 'ins-custom-item-counter-plus-button-' + variationId,
    };

    var selectors = Object.keys(classes).reduce(function (createdSelector, key) {
        createdSelector[key] = '.' + classes[key];

        return createdSelector;
    }, {
        buttonsWrapper: '.ins-action-buttons-wrapper',
        addToCartButton: '.ins-add-product-to-cart-button',
        addToCartWrapper: '[ins-product-id].ins-add-to-cart-wrapper',
        addToCartText: '.add-to-cart-text',
        wrapArea: '.ins-dynamic-wrap-area',
    });

    self.init = function () {
        if (variationId && !Insider.campaign.isControlGroup(variationId)) {
            self.setProductQuantityContainer();
        }
    };

    self.setProductQuantityContainer = function () {
        Insider.fns.onElementLoaded(previewWrapper + ' ' + selectors.addToCartWrapper, function () {
            setTimeout(() => { /* OPT-152318 */
                self.reset();
                self.buildCSS();
                self.buildHTML();
                self.preventDefaultAddToCartButtons();
                self.setEvents();
                //self.setProductQuantityContainer(); /* OPT-152318 */
            }, 1000);
        }).listen();
    };

    self.reset = function () {
        Insider.dom(selectors.style + ', ' + selectors.wrapper).remove();
    };

    self.buildCSS = function () {
        var customStyle =
        previewWrapper + ' ' + selectors.wrapper + ' {' +
            'display: flex !important;' +
            'border: 1px solid #EC008C !important;' +
            'border-radius: 3px !important;' +
            'margin-right: 10px;' +
            'height: 32px;' +
            'width: calc(40% - 5px) !important;' +
        '}' +
        previewWrapper + ' ' + selectors.container + ' {' +
            'font-weight: 600 !important;' +
            'font-size: medium !important;' +
            'display: flex;' +
            'color: #EC008C !important;' +
            'justify-content: space-around;' +
            'width: 100%;' +
        '}' +
        previewWrapper + ' ' + selectors.quantityLabel + ' {' +
            'height: 30px !important;' +
            'width: 20% !important;' +
            'display: flex;' +
            'align-items: center;' +
            'justify-content: center;' +
            'font-size: 15px;' +
            'cursor: default;' +
        '}' +
        previewWrapper + ' ' + selectors.quantityButtons + ' {' +
            'height: 30px;' +
            'width: 40%;' +
            'display: flex;' +
            'align-items: center;' +
            'justify-content: center;' +
            'font-size: 15px;' +
            'cursor: pointer !important;' +
        '}';

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = function () {
        var outerHTML =
        '<div class="' + classes.wrapper + '">' +
            '<div class="' + classes.container + '">' +
                '<div class="' + classes.quantityButtons + ' ' + classes.minusButton + '">' +
                    texts.minusButton +
                '</div>' +
                '<div class="' + classes.quantityLabel + '">' +
                    texts.starterQuantity +
                '</div>' +
                '<div class="' + classes.quantityButtons + ' ' + classes.plusButton + '">' +
                    texts.plusButton +
                '</div>' +
            '</div>' +
        '</div>';

        Insider.dom(previewWrapper + ' ' + selectors.buttonsWrapper).prepend(outerHTML)
            .css('display', 'flex', 'important');

        Insider.dom(previewWrapper + ' ' + selectors.wrapArea).css('height', '200px', 'important');
    };

    self.preventDefaultAddToCartButtons = function () {
        Insider.dom(previewWrapper + ' ' + selectors.addToCartWrapper).accessNodes(function (element) {
            var $element = Insider.dom(element);

            $element.closest(selectors.buttonsWrapper).attr(productId, $element.attr(productId));

            $element.removeAttr(productId).css('width', 'calc(60% - 5px)', 'important');

            $element.find(selectors.addToCartText).text(texts.addToCartButtonText);
            $element.find(selectors.addToCartButton).attr('data-after-click-text', texts.addToCartButtonText);
        });
    };

    self.setEvents = function () {
        Insider.eventManager.once('click.add:to:cart:with:quantity:' + variationId,
            previewWrapper + ' ' + selectors.addToCartButton, function () {
                var $buttonsWrapper = Insider.dom(this).closest(selectors.buttonsWrapper);
                var currentProductId = $buttonsWrapper.attr(productId) || '';
                var currentQuantity = Number($buttonsWrapper.find(selectors.quantityLabel).text()); /* OPT-152318 */

                if (currentProductId && currentQuantity) {
                    self.addToCartWithQuantity(currentProductId, currentQuantity);
                }
            });

        Insider.eventManager.once('click.change:quantity:' + variationId, selectors.quantityButtons, function () {
            var $this = Insider.dom(this);
            var $quantityLabel = $this.siblings(selectors.quantityLabel);
            var currentQuantity = Number($quantityLabel.text());

            if ($this.hasClass(classes.minusButton)) {
                if (currentQuantity > 1) {
                    $quantityLabel.text(currentQuantity - 1);
                }
            } else {
                if (currentQuantity < 10) {
                    $quantityLabel.text(currentQuantity + 1);
                }
            }

            self.sendCustomGoal(quantityChangedGoalId);
        });
    };

    self.addToCartWithQuantity = function (currentProductId, currentQuantity) {
        if (Insider.fns.isFunction(Insider.__external.SpAddToCartWithQuantity121482)) {
            Insider.__external.SpAddToCartWithQuantity121482(currentProductId, currentQuantity);
        } else {
            Insider.logger.log('SpAddToCartWithQuantity121482 is not a function');

            Insider.systemRules.call('spAddToCart').addToBasket(currentProductId);
        }
    };

    self.sendCustomGoal = function (goalId) {
        if (Insider.fns.isFunction(Insider.__external.sendCustomGoal)) {
            Insider.__external.sendCustomGoal(builderId, goalId, true);
        } else {
            Insider.logger.log('sendCustomGoal is not a function');
        }
    };

    self.init();
};

true;
/* OPT-121669 END */