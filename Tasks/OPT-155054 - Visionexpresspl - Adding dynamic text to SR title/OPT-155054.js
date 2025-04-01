/* OPT-155054 START */
const isDesktop = Insider.browser.isDesktop();
const builderId = isDesktop ? 2762 : 2763;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

const selectors = {
    recommenderTitle: `.ins-preview-wrapper-${ variationId } .ins-editable`,
};

if (variationId) {
    if (!Insider.campaign.isControlGroup(variationId)) {
        const { recommenderTitle } = selectors;

        Insider.fns.onElementLoaded(recommenderTitle, () => {
            const userName = Insider.utils.getDataFromIO('user', 'name');
            const newText = Insider.dom(recommenderTitle).text().replace('{{Name}}', userName);

            Insider.dom(recommenderTitle).text(newText);
        }).listen();
    }

    true;
}
/* OPT-155054 END */

/* OPT-155054 START */
const recommenderTitle = `.ins-preview-wrapper-${ camp.id } .ins-editable`;

Insider.fns.onElementLoaded(recommenderTitle, () => {
    const userName = Insider.utils.getDataFromIO('user', 'name');
    const newText = Insider.dom(recommenderTitle).text().replace('{{Name}}', userName);

    Insider.dom(recommenderTitle).text(newText);
}).listen();
/* OPT-155054 END */
