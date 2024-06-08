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
    const buttonWrapper = '#proceed-to-checkout';
    const buttonTextArea = '.vtex-add-to-cart-button-0-x-buttonText'; /* OPT-152874 */

    Insider.fns.onElementLoaded(buttonWrapper, () => { /* OPT-152874 */
        if (!Insider.campaign.isControlGroup(variationId)) {
            Insider.dom(`${ buttonWrapper } ${ buttonTextArea }`).text(textByVariationId);
        }

        Insider.campaign.custom.show(variationId);
    }, { infinite: true }).listen(); /* OPT-152874 */

    false; /* OPT-152874 */
}
/* OPT-148013 END */
