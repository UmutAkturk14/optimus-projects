/* OPT-152874 START */
Insider.fns.onElementLoaded('.vtex-add-to-cart-button-0-x-buttonText', () => {
    Insider.dom('.vtex-add-to-cart-button-0-x-buttonText').text('Fechar pedido');
}).listen();
/* OPT-152874 END */

/* OPT-148013 START */
const builderId = 95;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

const textByVariationId = {
    c106: 'Fechar pedido',
    c107: 'Ir para o carrinho',
    c108: 'Continuar a compra',
    c109: 'Revisar pedido'
}[variationId];

if (variationId) {
    Insider.fns.onElementLoaded('.vtex-add-to-cart-button-0-x-buttonText', () => {
        if (!Insider.campaign.isControlGroup(variationId)) {
            setTimeout(() => {
                Insider.dom('.vtex-add-to-cart-button-0-x-buttonText').text(textByVariationId);
            }, 500);
        }

        Insider.campaign.custom.show(variationId);
    }).listen();

    false;
}
/* OPT-148013 END */
