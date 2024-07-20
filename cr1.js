/* OPT-155677 START */
((self) => {
    'use strict';

    const builderId = 1673;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    /* OPT-157244 START */
    let firstHorizontalPositionStart = 0;
    let firstHorizontalPositionEnd = 0;
    let secondHorizontalPositionStart = 0;
    let secondHorizontalPositionEnd = 0;
    let firstSwipeCount = 0;
    let secondSwipeCount = 0;
    /* OPT-157244 END */

    let translateXValue = 0;

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        goal: `sp-custom-${ variationId }-1`,
        sliderElement: `ins-slider-element-${ variationId }`,
        firstSliderContainer: `ins-first-slider-container-${ variationId }`,
        secondSliderContainer: `ins-second-slider-container-${ variationId }`,
        containerHeader: `ins-container-header-${ variationId }`,
        containerHeader2: `ins-container-header2-${ variationId }`, /* ZEN-163874 */
        sliderContainer: `ins-slider-container-${ variationId }`
    };

    const campaignConfig = {
        first: {
            /* ZEN-174073 START */
            columnText: 'Monsoon Must-Haves',
            columnImages: {
                firstImage: 'https://image.useinsider.com/itcindia/defaultImageLibrary/960-x-960_Kitchen%20Cleaning%20%281%29-1719829876.jpeg',
                secondImage: 'https://image.useinsider.com/itcindia/defaultImageLibrary/960-x-960_Floor%20Cleaning%20%281%29-1719829915.jpeg',
                thirdImage: 'https://image.useinsider.com/itcindia/defaultImageLibrary/960-x-960_Bath%20%26%20Body%20%281%29-1719829981.jpeg    ',
                fourthImage: 'https://image.useinsider.com/itcindia/defaultImageLibrary/960-x-960_Health%20%26%20Hygiene%20%281%29-1719830024.jpeg',
            },
            columnUrls: {
                firstUrl: 'https://www.itcstore.in/more/home-kitchen/kitchen-cleaners?utm_source=insider_onsite&utm_medium=insider_blocks&utm_campaign=monsoon_kitchen_srclm',
                secondUrl: 'https://www.itcstore.in/more/home-kitchen/floor-surface-cleaners?utm_source=insider_onsite&utm_medium=insider_blocks&utm_campaign=monsoon_homecare_srclm',
                thirdUrl: 'https://www.itcstore.in/personal-care/bath-body?utm_source=insider_onsite&utm_medium=insider_blocks&utm_campaign=monsoon_body_srclm',
                fourthUrl: 'https://www.itcstore.in/personal-care/health-hygiene?utm_source=insider_onsite&utm_medium=insider_blocks&utm_campaign=monsoon_hygn_srclm',
            }
            /* ZEN-174073 END */
        },
        second: {
            columnText: 'Back to school essentials',
            /* ZEN-171119 START */
            columnImages: {
                firstImage: 'https://image.useinsider.com/itcindia/defaultImageLibrary/960-x-960_Hygiene%20%281%29-1718028647.jpeg',
                secondImage: 'https://image.useinsider.com/itcindia/defaultImageLibrary/Stationary%20960%20x%20960%20%281%29-1718028710.jpeg',
                thirdImage: 'https://image.useinsider.com/itcindia/defaultImageLibrary/960-x-960_A%20tiffin%20%281%29-1718028769.jpeg',
                fourthImage: 'https://image.useinsider.com/itcindia/defaultImageLibrary/960-x-960_Beverages%20%281%29-1718028807.jpeg',
            },
            columnUrls: {
                firstUrl: 'https://www.itcstore.in/personal-care/health-hygiene?utm_source=insider_onsite&utm_medium=insider_blocks&utm_campaign=b2skl_hygn_srclm',
                secondUrl: 'https://www.itcstore.in/more/stationery?utm_source=insider_onsite&utm_medium=insider_blocks&utm_campaign=b2skl_stnry_srclm',
                thirdUrl: 'https://www.itcstore.in/tiffin-ideas-for-school?utm_source=insider_onsite&utm_medium=insider_blocks&utm_campaign=b2skl_tiffin_srclm',
                fourthUrl: 'https://www.itcstore.in/dairy-beverages/beverages/fruit-beverages?utm_source=insider_onsite&utm_medium=insider_blocks&utm_campaign=b2skl_beve_srclm',
            }
            /* ZEN-171119 END */
        }
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        appendSelector: '.home-section.m-auto'
    });

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.buildCSS();
                self.buildHTML();
                self.setEvents();
            }

            return true;
        }
    };

    self.reset = () => {
        const { style, wrapper } = selectors;

        Insider.dom(`${ style }, ${ wrapper }`).remove();
    };

    self.buildCSS = () => {
        const { wrapper, sliderElement, containerHeader, sliderContainer, containerHeader2 } = selectors;

        const customStyle = `
        ${ wrapper } {
            display: flex;
            flex-direction: column;
            overflow: hidden;
            width: 95vw;
            margin: 0px 0px 15px;
        }
        ${ sliderContainer } {
            display: flex;
            flex-wrap: nowrap;
            overflow: hidden;
            width: calc(85vw* 4);
            transition: all 1s ease 0s;
            gap: 20px; /* ZEN-174957 */
        }
        ${ sliderElement } img {
            /* ZEN-174957 START */
            width: 350px !important;
            /* OPT-174957 END */
            border-radius: 8px;
        }
        ${ containerHeader } {
            font-family: 'Lexend-Medium';
            font-size: 18px;
            color: #252C3F;
            padding: 8px 8px 6px 8px; /* OPT-157244 */
        }
        /* ZEN-163874 START*/
        ${ containerHeader2 } { 
            font-family: 'Lexend-Medium';
            font-size: 18px;
            color: #252C3F;
            margin-top: 10px; /* ZEN-163874 */
            padding: 8px 8px 6px 8px;
        }
        /* ZEN-163874 END*/
        `;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const {containerHeader, containerHeader2} = classes /* ZEN-163874 */
        const firstColumnHTML = self.generateColumnHTML(campaignConfig.first, containerHeader); /* ZEN-163874 */
        const secondColumnHTML = self.generateColumnHTML(campaignConfig.second, containerHeader2); /* ZEN-163874 */

        const outerHtml = `
            <div class="${ classes.wrapper }">
                ${ firstColumnHTML }
                ${ secondColumnHTML }
            </div>
        `;

        Insider.dom(selectors.appendSelector).after(outerHtml);
    };

    self.generateColumnHTML = (columnConfig, titleNum) => { /* ZEN-163874 */
        const { columnText, columnImages, columnUrls } = columnConfig;
        const {sliderContainer, firstSliderContainer, secondSliderContainer } = classes;

        const sliderElements = Object.values(columnImages).map((imageUrl, index) =>
            self.generateSliderElement(imageUrl, Object.values(columnUrls)[index]));

        return `
            <span class="${ titleNum }">
                ${ columnText }
            </span>
            <div data-image-count="${ Insider.fns.keyCount(columnImages) }" class="${ sliderContainer } ${ columnText === 'WATCH & MUNCH!' ? firstSliderContainer : secondSliderContainer }">
                ${ sliderElements.join('') }
            </div>
        `; /* OPT-157244 */ /* ZEN-163874 */
    };

    self.generateSliderElement = (imageUrl, linkUrl) => {
        const { sliderElement, goal } = classes;

        return `
        <div class="${ sliderElement } ${ goal }">
            <a href="${ linkUrl }">
                <img src="${ imageUrl }">
            </a>
        </div>`;
    };

    self.setEvents = () => {
        const { firstSliderContainer, secondSliderContainer, sliderContainer } = selectors;

        Insider.eventManager.once(`touchstart.get:start:position:${ variationId }`,
            `${ firstSliderContainer } , ${ secondSliderContainer }`, (event) => {
                /* OPT-157244 START */
                if (Insider.dom(event.target).parents(sliderContainer).hasClass(classes.firstSliderContainer)) {
                    firstHorizontalPositionStart = event.changedTouches[0].screenX;
                } else {
                    secondHorizontalPositionStart = event.changedTouches[0].screenX;
                }
                /* OPT-157244 EMD */
            });

        Insider.eventManager.once(`touchend.get:finish:position:${ variationId }`,
            `${ firstSliderContainer } , ${ secondSliderContainer }`, (event) => {
                /* OPT-157244 START */
                const $slider = Insider.dom(event.target).parents(sliderContainer);
                const imageCount = $slider.attr('data-image-count') - 1;
                const isFirstContainer = $slider.hasClass(classes.firstSliderContainer);

                if (isFirstContainer) {
                    firstHorizontalPositionEnd = event.changedTouches[0].screenX;
                } else {
                    secondHorizontalPositionEnd = event.changedTouches[0].screenX;
                }

                self.handleSwipe(event, imageCount, isFirstContainer);
                /* OPT-157244 END */
            });

        /* OPT-157244 START */
        Insider.eventManager.once(`orientationchange.orientation:change:${ variationId }`, window, () => {
            self.handleOrientationChange();
        });
        /* OPT-157244 END */
    };

    /* OPT-157244 START */
    self.handleOrientationChange = () => {
        firstHorizontalPositionStart = 0;
        firstHorizontalPositionEnd = 0;
        secondHorizontalPositionStart = 0;
        secondHorizontalPositionEnd = 0;
        firstSwipeCount = 0;
        secondSwipeCount = 0;
        const { firstSliderContainer, secondSliderContainer } = selectors;

        Insider.dom(`${ firstSliderContainer }, ${ secondSliderContainer }`).css('transform', 'translateX(0px)');
    };
    /* OPT-157244 END */

    self.handleSwipe = (target, imageCount, isFirstContainer) => {
        const horizontalPositionDifference = self.calculateHorizontalPositionDifference(isFirstContainer);
        const sliderElementWidth = Insider.dom(`${ selectors.sliderElement }:eq(0)`).width();

        /* OPT-157244 START */
        if (isFirstContainer) {
            if (horizontalPositionDifference < 0 && firstSwipeCount !== imageCount) {
                firstSwipeCount++;
            } else if (horizontalPositionDifference > 0 && firstSwipeCount !== 0) {
                firstSwipeCount--;
            }

            translateXValue = (firstSwipeCount * sliderElementWidth * -1) + 6;

        } else {
            if (horizontalPositionDifference < 0 && secondSwipeCount !== imageCount) {
                secondSwipeCount++;
            } else if (horizontalPositionDifference > 0 && secondSwipeCount !== 0) {
                secondSwipeCount--;
            }

            translateXValue = (secondSwipeCount * sliderElementWidth * -1) + 6;
        }
        /* OPT-157244 END */

        Insider.dom(target.currentTarget).css('transform', `translateX(${ translateXValue }px)`);
    };

    /* OPT-157244 START */
    self.calculateHorizontalPositionDifference = (isFirstContainer) => {
        let horizontalDifference = 0;

        if (isFirstContainer) {
            horizontalDifference = firstHorizontalPositionEnd - firstHorizontalPositionStart;
        } else {
            horizontalDifference = secondHorizontalPositionEnd - secondHorizontalPositionStart;
        }

        return horizontalDifference;
    };
    /* OPT-157244 END */

    return self.init();
})({});
/* OPT-155677 END */