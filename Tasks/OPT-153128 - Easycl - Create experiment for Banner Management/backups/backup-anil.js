/* OPT-153128 START */
const isDesktop = Insider.browser.isDesktop();
const builderId = isDesktop ? 36 : 37;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
const imageURL = isDesktop ? 'https://image.useinsider.com/easycl/defaultImageLibrary/Easy%20Main%20Slider-1709608211.png' : 'https://image.useinsider.com/easycl/defaultImageLibrary/Easy%20Main%20Slider%20Mobile-1709608463.png';
const hasParameterQa = Insider.fns.hasParameter('qa');
const dataIndexSelector = (index) => {
    if (hasParameterQa) {
        return `.easyclqa-slider-layout-0-x-slide[data-index="${ index }"] .easyclqa-slider-layout-0-x-imageElement`;
    }

    return `.easycl-slider-layout-0-x-slide[data-index="${ index }"] .easycl-slider-layout-0-x-imageElement`;

};

const goalClass = `sp-custom-${ variationId }-1`;

const banners = [
    { index: 1, image: imageURL },
    { index: 2, image: imageURL },
    { index: 3, image: imageURL },
    { index: 4, image: imageURL },
    { index: 5, image: imageURL },
    { index: 6, image: imageURL },
    { index: 7, image: imageURL },
    { index: 8, image: imageURL },
    { index: 9, image: imageURL }
];

const changeBanners = () => {
    banners.forEach((banner) => {
        const bannerElement = dataIndexSelector(banner.index);

        Insider.fns.onElementLoaded(bannerElement, () => {
            if (Insider.dom(bannerElement).attr('src') !== banner.image) {
                Insider.dom(bannerElement).accessNodes((node) => {
                    Insider.dom(node).siblings('.ins-reset').remove();
                    Insider.dom(node).css('display', 'none');
                    Insider.dom(node).after(`<img class="ins-reset" src="${ banner.image }" style="max-height:1000px; width: 100%;">`);
                    Insider.dom(node).closest('.easycl-slider-layout-0-x-slide').addClass(goalClass);
                });

            }
        }, { infinite: true }).listen();
    });
};

if (variationId) {
    if (!Insider.campaign.isControlGroup(variationId)) {
        changeBanners();
    }

    true;
}
/* OPT-153128 END */
