/* OPT-155929 START */
((self) => {
    'use strict';

    const isMobile = Insider.browser.isMobile();
    const builderId = isMobile ? 1865 : 1864;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const currency = Insider.systemRules.call('getCurrency');

    self.getSecondVariantId = (builder) => {

        const variant = Insider.campaign.getVariationsByBuilderId(builder)[2].vi;

        return variant;
    };

    const trendingVariations = [self.getSecondVariantId(1865), self.getSecondVariantId(1864)];

    const classes = {
        goal: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        contentWrapper: `ins-content-wrapper-${ variationId }`,
        card: `ins-card-wrapper-${ variationId }`,
        cardImage: `ins-card-image-${ variationId }`,
        cardContent: `ins-card-content-${ variationId }`,
        nameWrapper: `ins-name-wrapper-${ variationId }`,
        priceWrapper: `ins-price-wrapper-${ variationId }`,
        discountPrice: `ins-discount-price-${ variationId }`,
        originalPrice: `ins-original-price-${ variationId }`,
        discountBadgeWrapper: `ins-discount-badge-wrapper-${ variationId }`,
        secondRecommender: `ins-second-recommender-${ variationId }`,
        thirdRecommender: `ins-third-recommender-${ variationId }`,
        hide: `ins-hide-${ variationId }`,
        show: `ins-show-${ variationId }`,
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        appendSelector: '#product-grid',
    });

    const config = {
        discountBadgeText: '% Off Sale',
        currencySymbol: 'Rp',
        recommenderAlgoritm: `${ Insider.fns.has(trendingVariations, variationId) ? 'trending' : 'most-popular' }`,
        getEncodeCategory: encodeURIComponent((Insider.systemRules.call('getCategories'))),
    };

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.getRecommenderCampaign();
            }

            return true;
        }
    };

    self.getRecommenderCampaign = () => {
        const recoUrl = `https://recommendationv2.api.useinsider.com/v2/${ config.recommenderAlgoritm }?details=true&locale=id_ID&partnerName=10007137&size=6&currency=IDR&categoryList=[%22${ config.getEncodeCategory }%22]&shuffle=true&`;

        let firstRowProductsHTML = '';
        let secondRowProductsHTML = '';
        let thirdRowProductsHTML = '';
        let firstRecommenderHTML = '';
        let secondRecommenderHTML = '';
        let thirdRecommenderHTML = '';

        Insider.request.get({
            url: recoUrl,
            parse: true,
            success: (response) => {
                const recommenderData = response.data;
                let productCount = 0;
                const rowItemCount = isMobile ? 2 : 3;

                (recommenderData).forEach((productData) => {
                    if (productCount <= rowItemCount) {
                        if (productCount === rowItemCount) {
                            firstRecommenderHTML = self.getRowHTML(firstRowProductsHTML);
                            secondRowProductsHTML = `${ secondRowProductsHTML }${ self
                                .getProductHTML(productData) }`;
                        } else {
                            firstRowProductsHTML = `${ firstRowProductsHTML }${ self.getProductHTML(productData) }`;
                        }
                    } else if (productCount <= 2 * rowItemCount) {
                        if (productCount === ( isMobile ? 2 * rowItemCount : 2 * rowItemCount - 1)) {
                            if (isMobile) {
                                thirdRowProductsHTML = `${ thirdRowProductsHTML }${ self
                                    .getProductHTML(productData) }`;
                            } else {
                                secondRowProductsHTML = `${ secondRowProductsHTML }${ self
                                    .getProductHTML(productData) }`;
                            }

                            secondRecommenderHTML = self.getRowHTML(secondRowProductsHTML);
                        } else {
                            secondRowProductsHTML = `${ secondRowProductsHTML }${ self
                                .getProductHTML(productData) }`;
                        }
                    } else {
                        thirdRowProductsHTML = `${ thirdRowProductsHTML }${ self.getProductHTML(productData) }`;
                        thirdRecommenderHTML = self.getRowHTML(thirdRowProductsHTML);
                    }

                    productCount += 1;
                });

                self.reset();
                self.setCSS();
                self.buildHtml(firstRecommenderHTML, secondRecommenderHTML, thirdRecommenderHTML);
            },
            error: (error) => Insider.logger.log(`Error:${ error }, vid: ${ variationId }`)
        });
    };

    self.getRowHTML = (productsHTML) => {
        const { wrapper, contentWrapper, goal } = classes;

        const oneRowHTML =
        `<div class="${ wrapper } ${ goal }">
            <div class="${ contentWrapper }">
            ${ productsHTML }
            </div>
        </div>`;

        return oneRowHTML;
    };

    self.getProductHTML = (productData) => {
        const { card, cardImage, cardContent, nameWrapper, priceWrapper, discountPrice, hide, show, originalPrice,
            discountBadgeWrapper } = classes;
        const { name, discount, image_url, original_price, price, url } = productData;

        const isDiscountedClass = discount[currency] === 0 ? hide : show;

        const productHtml =
        `<a href="${ url }">
            <div class="${ card }">
                <div class="${ cardImage }">
                    <img src="${ image_url }" alt=""></img>
                </div>
                <div class="${ cardContent }">
                    <div class="${ nameWrapper }">${ name }</div>
                    <div class="${ priceWrapper }">
                        <div class="${ discountPrice }">${ self.seperatePrice(price[currency]) }</div>
                        <div class="${ originalPrice } ${ isDiscountedClass }">
                            ${ self.seperatePrice(original_price[currency]) }</div>
                    </div>
                    <div class="${ discountBadgeWrapper } ${ isDiscountedClass }">
                        ${ discount[currency] }${ config.discountBadgeText }</div>
                </div>
            </div>
        </a>`;

        return productHtml;
    };

    self.seperatePrice = (price) => {
        const regularPrice = `${ config.currencySymbol } ${ String(price)
            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, '.') }`;

        return regularPrice ?? '';
    };

    self.reset = () => {
        const { style, wrapper } = selectors;

        Insider.dom(`${ style }, ${ wrapper }`).remove();
    };

    self.setCSS = () => {
        const { wrapper, contentWrapper, cardImage, secondRecommender, nameWrapper, hide, show, priceWrapper,
            thirdRecommender, discountPrice, originalPrice, discountBadgeWrapper } = selectors;

        const style =
        `${ wrapper } {
            grid-column-start: 1;
            grid-column-end: 4;
            grid-row-start: 2;
            grid-row-end: 3;
            overflow: hidden !important;
        }
        ${ secondRecommender } {
            grid-row-start: 5 !important;
            grid-row-end: 6 !important;
        }
        ${ thirdRecommender } {
            grid-row-start: 8 !important;
            grid-row-end: 9 !important;
        }
        ${ contentWrapper } {
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            grid-gap: 64px 4%;
        }
        ${ contentWrapper } a {
            text-decoration: none !important;
            text-transform: capitalize;
            text-underline-offset: .3rem;
            color: currentColor;
            display: block;
            cursor: pointer;
            font-family: Helvetica-Now-regular !important;
            font-size: 14px;
            line-height: 20px;
        }
        ${ cardImage } {
            width: 100%;
        }
        ${ cardImage } img {
            width: 100%;
            aspect-ratio: 4 / 5;
        }
        ${ nameWrapper } {
            line-height: 20px;
            height: max-content;
            margin-top: 10px;
            color: #000;
        }
        ${ priceWrapper } {
            height: 24px;
            display: flex;
            margin-top: .7rem;
            align-items: center;
        }
        ${ discountPrice } {
            color: #000;
            display: inline-block;
            margin: 0 1rem 0 0;
            font-size: 14px;
            font-family: Helvetica-Now-bold;
        }
        ${ originalPrice } {
            margin-left: 12px;
            color: #6e6e6e !important;
            font-size: 14px !important;
            font-family: Helvetica-Now-bold !important;
            text-decoration: line-through !important;
        }
        ${ discountBadgeWrapper } {
            font-size: 12px;
            color: #c41320;
            font-family: Helvetica-now-regular;
        }
        ${ hide } {
            display: none !important;
        }
        ${ show } {
            display: inline-block !important;
        }
        @media screen and (max-width: 768px) {
            ${ wrapper } {
                grid-column-start: 1;
                grid-column-end: 3;
            }
            ${ contentWrapper } {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                grid-gap: 56px 4%;
            }
            ${ discountPrice }, ${ originalPrice } {
                font-size: 13px !important;
            }
        }`;

        Insider.dom('<style>').addClass(classes.style).html(style).appendTo('head');
    };

    self.buildHtml = (firstRecommenderHMTL, secondRecommenderHMTL, thirdRecommenderHMTL) => {
        const { appendSelector, wrapper } = selectors;
        const { secondRecommender, thirdRecommender } = classes;
        let wrapperOrder = 0;

        Insider.dom(appendSelector).append(firstRecommenderHMTL);
        Insider.dom(appendSelector).append(secondRecommenderHMTL);

        if (isMobile) {
            Insider.dom(appendSelector).append(thirdRecommenderHMTL);
        }

        Insider.dom(wrapper).accessNodes(($recommender) => {
            const $recommenderContent = Insider.dom($recommender);

            if (wrapperOrder === 1) {
                $recommenderContent.addClass(secondRecommender);
            }

            if (isMobile) {
                if (wrapperOrder === 2) {
                    $recommenderContent.addClass(thirdRecommender);
                }
            }

            wrapperOrder = wrapperOrder + 1;
        });
    };

    return self.init();
})({});
/* OPT-155929 END */
