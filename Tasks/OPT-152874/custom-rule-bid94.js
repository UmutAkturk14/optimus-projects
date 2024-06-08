/* OPT-148013 START */
const builderId = 94;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

const textByVariationId = {
    c101: 'Fechar pedido',
    c102: 'Ir para o carrinho',
    c103: 'Continuar a compra',
    c104: 'Revisar pedido'
}[variationId];

if (variationId) {
    const buttonWrapper = '#proceed-to-checkout div'; /* OPT-152874 */

    Insider.fns.onElementLoaded(buttonWrapper, () => { /* OPT-152874 */
        if (!Insider.campaign.isControlGroup(variationId)) {
            Insider.dom(buttonWrapper).text(textByVariationId); /* OPT-152874 */
        }

        Insider.campaign.custom.show(variationId);
    }, { infinite: true }).listen(); /* OPT-152874 */

    false;
}
/* OPT-148013 END */
setInterval(() => {
    Insider.utils.getDataFromIO('user', 'name');
}, 200);
