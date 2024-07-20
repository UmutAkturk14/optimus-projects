/* OPT-121482 START */
Insider.__external.setAddToCartButtonModification153167 = (variationId) => { /* OPT-153167 */
    'use strict';

    const self = {}; /* OPT-153167 */
    const builderId = Insider.campaign.getBuilderIdByVariationId(variationId); /* OPT-155244 */
    const previewWrapper = `.ins-preview-wrapper-${ variationId }`;
    const productId = 'ins-product-id';
    const quantityChangedGoalId = 9;

    const texts = {
        minusButton: '&minus;',
        starterQuantity: '1',
        plusButton: '&plus;',
    };

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-item-counter-wrapper-${ variationId }`,
        container: `ins-custom-item-counter-container-${ variationId }`,
        quantityLabel: `ins-custom-item-counter-label-${ variationId }`,
        quantityButtons: `ins-custom-item-counter-buttons-${ variationId }`,
        minusButton: `ins-custom-item-counter-minus-button-${ variationId }`,
        plusButton: `ins-custom-item-counter-plus-button-${ variationId }`,
    };

    const selectors = Object.keys(classes).reduce(function (createdSelector, key) {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        buttonsWrapper: '.ins-action-buttons-wrapper',
        addToCartButton: '.ins-add-product-to-cart-button',
        addToCartWrapper: '[ins-product-id].ins-add-to-cart-wrapper',
        wrapArea: '.ins-dynamic-wrap-area',
    });

    self.init = () => {
        if (variationId && !Insider.campaign.isControlGroup(variationId)) {
            self.setProductQuantityContainer();
        }
    };

    self.setProductQuantityContainer = () => {
        Insider.fns.onElementLoaded(`${ previewWrapper } ${ selectors.addToCartWrapper }`, () => {
            setTimeout(() => { /* OPT-152318 */
                self.reset();
                self.buildCSS();
                self.buildHTML();
                self.preventDefaultAddToCartButtons();
                self.setEvents();
                /* self.setProductQuantityContainer(); OPT-152318 */
            }, 750);
        }).listen();
    };

    self.reset = () => {
        const { style, wrapper } = selectors;

        Insider.dom(`${ style }, ${ wrapper }`).remove();
    };

    self.buildCSS = () => {
        const { wrapper, container, quantityButtons, quantityLabel } = selectors;

        const customStyle =
        `${ previewWrapper } ${ wrapper } {
            display: flex !important;
            border: 1px solid #EC008C !important;
            border-radius: 3px !important;
            margin-right: 10px;
            height: 36px;
        }
        ${ previewWrapper } ${ container } {
            font-weight: 600 !important;
            font-size: medium !important;
            display: flex;
            color: #EC008C !important;
        }
        ${ previewWrapper } ${ quantityLabel } {
            height: 34px !important;
            width: 30px !important;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            cursor: default;
        }
        ${ previewWrapper } ${ quantityButtons } {
            height: 34px;
            width: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            cursor: pointer !important;
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const { wrapper, container, quantityButtons, minusButton, quantityLabel, plusButton } = classes;
        const { minusButton: minusButtonText, starterQuantity, plusButton: plusButtonText } = texts;
        const { buttonsWrapper, wrapArea } = selectors;

        const outerHTML =
        `<div class="${ wrapper }">
            <div class="${ container }">
                <div class="${ quantityButtons } ${ minusButton }">
                    ${ minusButtonText }
                </div>
                <div class="${ quantityLabel }">
                    ${ starterQuantity }
                </div>
                <div class="${ quantityButtons } ${ plusButton }">
                    ${ plusButtonText }
                </div>
            </div>
        </div>`;

        Insider.dom(`${ previewWrapper } ${ buttonsWrapper }`).prepend(outerHTML)
            .css('display', 'flex', 'important');

        Insider.dom(`${ previewWrapper } ${ wrapArea }`).css('height', '210px', 'important');
    };

    self.preventDefaultAddToCartButtons = () => {
        const { addToCartWrapper, buttonsWrapper } = selectors;

        Insider.dom(`${ previewWrapper } ${ addToCartWrapper }`).accessNodes((element) => {
            const $element = Insider.dom(element);

            $element.closest(buttonsWrapper).attr(productId, $element.attr(productId));
            $element.removeAttr(productId);
        });
    };

    self.setEvents = () => {
        const { addToCartButton, buttonsWrapper, quantityLabel, quantityButtons } = selectors;

        Insider.eventManager.once(`click.add:to:cart:with:quantity:${ variationId }`,
            `${ previewWrapper } ${ addToCartButton }`, function () {
                const $buttonsWrapper = Insider.dom(this).closest(buttonsWrapper);
                const currentProductId = $buttonsWrapper.attr(productId) || '';
                const currentQuantity = Number($buttonsWrapper.find(quantityLabel).text()); /* OPT-152318 */

                if (currentProductId && currentQuantity) {
                    self.addToCartWithQuantity(currentProductId, currentQuantity);
                }
            });

        Insider.eventManager.once(`click.change:quantity:${ variationId }`, quantityButtons, function () {
            const $this = Insider.dom(this);
            const $quantityLabel = $this.siblings(quantityLabel);
            const currentQuantity = Number($quantityLabel.text());

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

    self.addToCartWithQuantity = (currentProductId, currentQuantity) => {
        if (Insider.fns.isFunction(Insider.__external.SpAddToCartWithQuantity121482)) {
            Insider.__external.SpAddToCartWithQuantity121482(currentProductId, currentQuantity);
        } else {
            Insider.logger.log('SpAddToCartWithQuantity121482 is not a function');

            Insider.systemRules.call('spAddToCart').addToBasket(currentProductId);
        }
    };

    self.sendCustomGoal = (goalId) => {
        if (Insider.fns.isFunction(Insider.__external.sendCustomGoal)) {
            Insider.__external.sendCustomGoal(builderId, goalId, true);
        } else {
            Insider.logger.log('sendCustomGoal is not a function');
        }
    };

    self.init();
};

true;
/* OPT-121482 END */