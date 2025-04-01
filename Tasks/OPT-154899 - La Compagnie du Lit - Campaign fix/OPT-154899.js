/* OPT-154899 START */
const builderId = Insider.browser.isDesktop() ? 413 : 414;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
const bannerTitle = 'Découvrir';
const goal = `sp-custom-${ variationId }-1`;

const selectors = {
    productLinks: '.product-ctn-infos > a',
    footerBanner: '.flag'
};

if (variationId && Insider.systemRules.call('isOnMainPage')) {
    if (!Insider.campaign.isControlGroup(variationId)) {
        const { footerBanner, productLinks } = selectors;

        Insider.fns.onElementLoaded(footerBanner, () => {
            Insider.dom(footerBanner).accessNodes((element, index) => {
                const anchorElement = Insider.dom('<a>');
                const href = Insider.dom(`${ productLinks }:eq(${ index })`).attr('href');

                anchorElement.attr('href', href);

                Insider.dom(element).text(bannerTitle).addClass(goal).wrap(anchorElement);
            });
        }).listen();
    }

    true;
}
/* OPT-154899 END */
