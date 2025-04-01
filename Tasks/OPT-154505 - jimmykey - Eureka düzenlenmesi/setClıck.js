/* OPT-154505 START */
const builderId = 1016;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

const selectors = {
    searchBar: '#insider-search-input',
    closeButton: '.sb button',
    searchBox: '#SearhBoxBorder',
    headerArea: '.headerArea',
    parentElement: `.ins-preview-wrapper-${ variationId }`
};

const setClickBehaviour = () => {
    const { searchBar, closeButton, searchBox, parentElement, headerArea } = selectors;

    Insider.fns.onElementLoaded(searchBar, () => {
        Insider.eventManager.once('click.set:search:text', `${ searchBox }, ${ headerArea }`, () => {
            Insider.dom(searchBar).nodes[0].value = '';
        });

        if (Insider.fns.isFunction($)) {
            $(closeButton).click(() => {
                Insider.dom(parentElement).css('display', 'none');
            });
        }
    }).listen();
};

if (variationId) {
    if (!Insider.campaign.isControlGroup(variationId)) {
        setClickBehaviour();
    }

    true;
}
/* OPT-154505 END */
