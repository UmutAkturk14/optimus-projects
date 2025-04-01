/* OPT-165437 */
Insider.__external.SetLoader165437 = (variationId) => {
    ((self) => {
        'use strict';

        const clickMethod = Insider.browser.isDesktop ? 'click' : 'touchend';

        const classes = {
            style: `ins-custom-loader-style-${ variationId }`,
            wrapper: `ins-preview-wrapper-${ variationId }`,
            loader: `ins-custom-loader-${ variationId }`,
            quantitySelector: `ins-custom-item-counter-wrapper-${ variationId }`,
            hide: `ins-hidden-element-${ variationId }`
        };

        const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
            createdSelector[key] = `.${ classes[key] }`, createdSelector
        ), {
            addToCart: '.ins-add-product-to-cart-button',
            addToCartText: '.add-to-cart-text',
            popUp: '.modal-content',
            popUpActions: '.add-to-cart-dialog__cart, .add-to-cart-dialog__continue',
            errorText: '.simple-dialog__msg:contains("Sorry, this product is not available at the moment.")',
            changedAddToCart: '.add-to-cart-text:contains("Added to Basket")'
        });

        const buttonTextConfig = {
            add: 'Add to Basket',
            added: 'Added to Basket'
        };

        self.init = () => {
            if (variationId) {
                if (!Insider.campaign.isControlGroup(variationId)) {
                    self.reset();
                    self.buildCSS();
                    self.addClass();
                    self.setEvents();
                }

                Insider.campaign.info.show(variationId);
            }
        };

        self.reset = () => {
            const { style, loader: loaderSelector } = selectors;
            const { loader } = classes;

            Insider.dom(style).remove();
            Insider.dom(loaderSelector).removeClass(loader);
        };

        self.buildCSS = () => {
            const { loader, hide } = selectors;

            const customStyle =
                `${ loader } {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    position: relative;
                    animation: rotate 1s linear infinite;
                    margin: auto;
                }
                ${ loader }::before {
                    content: "";
                    box-sizing: border-box;
                    position: absolute;
                    inset: 0px;
                    border-radius: 50%;
                    border: 5px solid #FFF;
                    animation: prixClipFix 2s linear infinite;
                }
                @keyframes rotate {
                    100% {transform: rotate(360deg)}
                }
                @keyframes prixClipFix {
                    0% {clip-path: polygon(50% 50%,0 0,0 0,0 0,0 0,0 0)}
                    25% {clip-path: polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0)}
                    50% {clip-path: polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)}
                    75% {clip-path: polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 100%)}
                    100% {clip-path: polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 0)}
                }
                ${ hide } {
                    display: none !important;
                }`;

            Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
        };

        self.addClass = () => {
            const { quantitySelector } = selectors;

            Insider.dom(quantitySelector).hide();
        };

        self.setEvents = () => {
            self.handleAddToCartButtonClick();
            self.handlePopUp();
        };

        self.handleAddToCartButtonClick = () => {
            const { wrapper, addToCart, popUp, errorText, addToCartText } = selectors;
            const { loader } = classes;
            const { added } = buttonTextConfig;

            Insider.eventManager.once(`${ clickMethod }.add:to:cart:button:click:${ variationId }`, `${ wrapper }
                ${ addToCart }`, (event) => {

                const $target = Insider.dom(event.target);
                const $targetButton = $target.find(addToCartText).length ?
                    $target.find(addToCartText) :
                    $target.closest(addToCartText);

                if (!Insider.dom(errorText).exists()) {
                    setTimeout(() => {
                        $targetButton.text('');
                        $targetButton.addClass(loader);
                    }, 200);

                    Insider.fns.onElementLoaded(popUp, () => {
                        $targetButton.removeClass(loader);
                        $targetButton.text(added);
                    }).listen();
                }
            });
        };

        self.handlePopUp = () => {
            const { popUp, popUpActions, changedAddToCart } = selectors;
            const { add } = buttonTextConfig;

            Insider.fns.onElementLoaded(popUpActions, () => {
                Insider.eventManager.once(`${ clickMethod }.track:pop:up:clicks:${ variationId }`, window, (e) => {
                    if (Insider.dom(e.target).closest(popUp)) {
                        Insider.dom(changedAddToCart).text(add);
                    }
                });
            }).listen();
        };

        self.init();
    })({});
};

true;
/* OPT-165437 END */
