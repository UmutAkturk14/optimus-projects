/* OPT-148013 START */
const builderId = 95;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

const selectors = {
    button: '.vtex-button',
    buttonTextArea: '.vtex-add-to-cart-button-0-x-buttonText'
};

const textByVariationId = {
    c106: 'Fechar pedido',
    c107: 'Ir para o carrinho',
    c108: 'Continuar a compra',
    c109: 'Revisar pedido'
}[variationId];

if (variationId) {
    Insider.fns.onElementLoaded('.vtex-add-to-cart-button-0-x-buttonText', () => {
        if (!Insider.campaign.isControlGroup(variationId)) {
            setButtonText(); /* OPT-152874 */
        }

        Insider.campaign.custom.show(variationId);
    }).listen();

    true;
}
/* OPT-148013 END */

/* OPT-152874 START */
const setButtonText = () => {
    const { button, buttonTextArea } = selectors;

    const observer152874 = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof Element && typeof node.closest === 'function') {
                        if (node.closest(button)) {
                            Insider.dom(buttonTextArea)?.text(textByVariationId);
                        }
                    }
                });
            }
        });
    });

    observer152874.observe(document.body, { childList: true, subtree: true });
};
/* OPT-152874 END */
