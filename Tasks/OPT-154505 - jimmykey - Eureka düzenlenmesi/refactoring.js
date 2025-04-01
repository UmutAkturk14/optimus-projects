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

    Insider.eventManager.once(`click.set:search:text:${ variationId }`, `${ searchBox }, ${ headerArea }`, () => {
        Insider.dom(searchBar).val('');
    });

    Insider.eventManager.once(`mouseup.hide:eureka:${ variationId }`, closeButton, () => {
        Insider.dom(parentElement).css('display', 'none');
    });
};

if (variationId) {
    if (!Insider.campaign.isControlGroup(variationId)) {
        setClickBehaviour();
    }

    true;
}
/* OPT-154505 END */
