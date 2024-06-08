// [M-일반] HOME GNB - BEST 상품만 모았어요!_v4

/* OPT-133836 START - NEW v3 */
((self) => {
    'use strict';

    const builderId = 456; /* OPT-143264 */
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const itemWidth = 80;
    let isScrolled = false;

    const targetGnbMenu = '홈';

    const recommenderVariationIds = {
        // '전체': 381, /* OPT-155584 */
        '의류/속옷': 383,
        // '잡화/슈즈': 385, /* OPT-144709 */ /* OPT-155584 */
        '화장품/뷰티': 387,
        '가전/디지털': 389,
        '스포츠/레저': 391,
        // '식품/건강': 393, /* OPT-155584 */
        // '생활/주방': 395, /* OPT-155584 */
        '가구/인테리어': 397
        // '여행/문화': 399, /* OPT-155584 */
    };

    const lastRecommenderIndex = Object.keys(recommenderVariationIds).length - 1;

    const categoryItemsConfig = {
        0: {
            image: 'https://static.kshop.co.kr/d2/emc/mc/display/img/img_category_v2_woman1.png',
            text: '전체'
        },
        1: {
            image: 'https://imgs.kshop.co.kr/d2/emc/202302/07/202302071862b2e2f8720.png/dims/resize/120',
            text: '의류/속옷'
        },
        2: {
            image: 'https://imgs.kshop.co.kr/d2/emc/202302/07/202302071862b31b5c470.png/dims/resize/120',
            text: '잡화/슈즈'
        },
        3: {
            image: 'https://imgs.kshop.co.kr/d2/emc/202302/07/202302071862b325c1c60.png/dims/resize/120',
            text: '화장품/뷰티'
        },
        4: {
            image: 'https://imgs.kshop.co.kr/d2/emc/202302/07/202302071862b32ea7b70.png/dims/resize/120',
            text: '가전/디지털'
        },
        5: {
            image: 'https://imgs.kshop.co.kr/d2/emc/202302/07/202302071862b336b4590.png/dims/resize/120',
            text: '스포츠/레저'
        },
        6: {
            image: 'https://imgs.kshop.co.kr/d2/emc/202302/07/202302071862b33d7b510.png/dims/resize/120',
            text: '식품/건강'
        },
        7: {
            image: 'https://imgs.kshop.co.kr/d2/emc/202302/07/202302071862b3492ca10.png/dims/resize/120',
            text: '생활/주방'
        },
        8: {
            image: 'https://imgs.kshop.co.kr/d2/emc/202302/07/202302071862b34fc6750.png/dims/resize/120',
            text: '가구/인테리어'
        },
        9: {
            image: 'https://imgs.kshop.co.kr/d2/emc/202302/07/202302071862b35bcee20.png/dims/resize/120',
            text: '여행/문화'
        },
        mainCategoryTabName: targetGnbMenu /* OPT-143264 */
    };

    const classes = {
        style: `ins-style-${ variationId }`,
        goal: `sp-custom-${ variationId }-1`,
        wrapper: `ins-home-gnb-recommenders-wrapper-${ variationId }`,
        categoryWrapper: `ins-home-gnb-recommenders-category-wrapper-${ variationId }`,
        categoryItemWrapper: `ins-home-gnb-recommenders-category-item-wrapper-${ variationId }`,
        recommenderWrapper: `ins-home-gnb-each-recommenders-wrapper-${ variationId }`,
        categoryItemText: `ins-home-gnb-recommenders-category-item-text-${ variationId }`,
        categoryItemImage: `ins-home-gnb-recommenders-category-item-image-${ variationId }`,
        imageBackground: `ins-home-gnb-recommenders-category-image-background-${ variationId }`,
        imageActiveBackground: `ins-category-image-active-${ variationId }`,
        lastRecommender: `ins-preview-wrapper:eq(${ lastRecommenderIndex })`,
        heightUpdate: `ins-home-gnb-recommenders-category-height-update-${ variationId }`,
        hideClass: `ins-home-gnb-recommenders-category-hide-${ variationId }`, /* OPT-143264 */
        categoryHeader: `ins-home-gnb-recommenders-category-header-${ variationId }`,
    };

    const selectors = Object.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        appendLocation: 'main', /* OPT-143264 */
        partnerSection: '.act_caWrap',
        partnerRecommender: '[name*=recommendGnbTypeA]',
        partnerHeader: app !== 'APP' ? 'header.main' : 'contents.main', /* Daniel 2023.11.30 */
        swiperWrapper: '.swiper-wrapper',
        homeTab: `[data-menu-nm="${ targetGnbMenu }"]`,
        swiperSlide: '.swiper-slide',
        hideMenuTab: '.menuNav .swiper-slide' /* OPT-143264 */
    });

    self.retrieveGnbInfo = () => {
        let gnbIdx; let gnbName;

        if (window.app === 'APP') {
            const appGnbLink = new URL(window.location.href);

            gnbIdx = appGnbLink.searchParams.get('gaGnbIdx');
            gnbName = decodeURIComponent(appGnbLink.searchParams.get('gaGnbNm')) || '';

            if (gnbName === 'null' && gnbIdx === '2') {
                gnbName = '홈';
            }
        } else {
            gnbIdx = $('#header ul.swiper-wrapper .on').index() + 1;
            gnbName = $('#header ul.swiper-wrapper .on a').data('menuNm');
        }

        return { gnbIdx, gnbName };
    };

    let mutationObserver;
    let menuCheckInterval;

    self.checkForGnbNameChange = () => {
        let lastGnbName = self.retrieveGnbInfo().gnbName;
        const checkGnbName = () => {
            const currentGnbInfo = self.retrieveGnbInfo();

            if (currentGnbInfo.gnbName !== lastGnbName) {
                lastGnbName = currentGnbInfo.gnbName;
                self.onGnbNameChange();
            }
        };

        menuCheckInterval = setInterval(checkGnbName, 500);
        mutationObserver = new MutationObserver(checkGnbName);
        mutationObserver.observe(document, { subtree: true, childList: true });

    };

    self.onGnbNameChange = () => {
        const { style, wrapper, categoryWrapper } = selectors;
        const { hideClass } = classes;

        const { gnbIdx, gnbName } = self.retrieveGnbInfo();
        const isDesiredPage = gnbName === targetGnbMenu ? 1 : 0;

        if (isDesiredPage) {
            console.log('홈 - 페이지 랜딩');

            Insider.dom('.ins-home-gnb-recommenders-wrapper-c68').remove();
            Insider.dom('.ins-home-gnb-recommenders-category-wrapper-c68').remove();
            Insider.dom('.ins-style-c68').remove();

            // Insider.eventManager.dispatch('init-manager:re-initialize');
            self.createCampaign();

        } else {

            if (gnbName !== '쇼핑트렌드') {
                Insider.dom('.ins-home-gnb-recommenders-wrapper-c68').remove();
                Insider.dom('.ins-home-gnb-recommenders-category-wrapper-c68').remove();
                Insider.dom('.ins-style-c68').remove();

                Insider.dom('.ins-home-gnb-recommenders-wrapper-c68').remove();
                Insider.dom('.ins-home-gnb-recommenders-category-wrapper-c68').remove();
                Insider.dom('.ins-style-c68').remove();

            }

        }
    };

    self.init = () => {
        const { homeTab, swiperSlide, appendLocation } = selectors;
        const { wrapper } = classes;

        const { gnbIdx, gnbName } = self.retrieveGnbInfo();
        const isDesiredPage = gnbName === targetGnbMenu ? 1 : 0;

        if (variationId && !Insider.campaign.isControlGroup(variationId)) {
            Insider.fns.onElementLoaded(selectors.partnerSection, () => {

                self.checkForGnbNameChange();
                self.onGnbNameChange();

                if (isDesiredPage) {
                    console.log('홈 - 엔트리 랜딩');
                    self.createCampaign();
                }

            }).listen();

            Insider.fns.onElementLoaded(appendLocation, () => {
                setTimeout(() => {
                    self.hideWrapper(); /* OPT-143264 */
                }, 500);
            }).listen();

        }
    };

    self.createCampaign = () => {
        self.reset();
        self.buildCSS();
        self.buildHTML();
        self.appendRecommenders();
        self.setEvents();
    };

    self.reset = () => {
        const { style, wrapper, sectionWrapper } = selectors;

        Insider.dom(`${ style }, ${ wrapper }`).remove();

        Insider.dom(sectionWrapper).removeClass(classes.heightUpdate);
    };

    self.buildCSS = () => {
        const { wrapper, categoryWrapper, categoryItemImage, categoryItemText, categoryItemWrapper,
            imageBackground, imageActiveBackground, hideClass, categoryHeader,
            partnerHeader } = selectors; /* OPT-143264 */

        const style =
        `${ wrapper } {
            width: 100%;
            z-index: 0;
            position: relative;
        }
        ${ categoryWrapper } {
            width: 100%;
            display: flex;
            align-items: center;
            padding: 18px 8px 18px 8px;
            background-color: white;
            top: 45px;
            z-index: 1543545345;
            transition: transform .2s ease;
            overflow-x: scroll;
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        ${ categoryItemWrapper } {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        ${ categoryItemImage } {
            width: 60px;
            height: 60px; /* OPT-143264 */
        }
        ${ imageBackground } {
            background-color: #f6f6f6;
            border-radius: 50%;
            overflow: hidden;
        }
        ${ imageActiveBackground } {
            background-color: #ff5c5a;
        }
        ${ categoryItemText } {
            width: 80px;
            font-size: 12px;
            font-weight: 500;
            text-align: center;
            letter-spacing: -.05em;
            line-height: 18px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            margin-top: 6px;
            font-family: Noto Sans CJK KR !important;
        }
        /* OPT-143264 START */
        ${ hideClass } {
            display: none !important;
        }
        /* OPT-143264 END */
        ${ categoryWrapper }::-webkit-scrollbar {
            display: none;
        }
        ${ imageActiveBackground } + ${ categoryItemText } {
            font-weight: 900 !important;
        }
        ${ categoryHeader } {
            font-weight: 700;
            line-height: 1.5;
            font-size: 20px;
            font-family: "Noto Sans CJK KR";
            letter-spacing: -1.5px;
            padding: 0 18px;
        }
        ${ partnerHeader } {
            position : fixed !important;
        }
        #header.main {
            position: sticky !important;
        }`;

        Insider.dom('<style>').addClass(classes.style).html(style).appendTo('head');
    };

    self.buildHTML = () => {
        const { wrapper, goal, categoryWrapper, heightUpdate, hideClass, categoryHeader } = classes;
        const { appendLocation, partnerRecommender, swiperWrapper } = selectors; /* OPT-143264 */

        const { gnbIdx, gnbName } = self.retrieveGnbInfo();
        const isDesiredPage = gnbName === targetGnbMenu ? 1 : 0;

        const headerText = 'BEST 상품만 모았어요!';

        const outerHTML =
        `<div class="${ wrapper } ${ isDesiredPage ? '' : hideClass }">
            <div class="${ categoryHeader }">${ headerText }</div>
            <div class="${ categoryWrapper } ${ goal }"></div>
        </div>`;

        Insider.dom(appendLocation).children('.mainCon').append(outerHTML); /* OPT-143264 */

        Insider.dom(partnerRecommender).closest(swiperWrapper).addClass(heightUpdate);

        self.appendCategoryItems();
        self.appendRecommenderWrappers();
    };

    self.appendCategoryItems = () => {
        const { categoryItemWrapper, categoryItemText, categoryItemImage, imageBackground,
            imageActiveBackground } = classes;

        Insider.fns.keys(recommenderVariationIds).forEach((_, index) => {
            const { image: url, text } = categoryItemsConfig[index];

            const categoryItemHTML =
            `<div class="${ categoryItemWrapper }" category-index="${ index }">
                <span class="${ imageBackground } ${ index === 0 ? imageActiveBackground : '' }">
                    <img class="${ categoryItemImage }" src="${ url }"></img>
                </span>
                <div class="${ categoryItemText }">${ text }</div>
            </div>`;

            Insider.dom(selectors.categoryWrapper).append(categoryItemHTML);
        });
    };

    self.appendRecommenderWrappers = () => {
        for (let index = 0; index < Object.keys(recommenderVariationIds).length; index++) {
            const recommenderWrapperHTML =
            `<div class="${ classes.recommenderWrapper }" recommender-index="${ index }"></div>`;

            Insider.dom(selectors.wrapper).append(recommenderWrapperHTML);
        }
    };

    self.appendRecommenders = () => {
        setTimeout(() => {
            Object.values(recommenderVariationIds).forEach((recommenderVariationId) => {
                Insider.campaign.info.show(recommenderVariationId);
            });
        }, 500);
    };

    self.setEvents = () => {
        const { categoryItemWrapper, imageBackground, lastRecommender, categoryWrapper, wrapper,
            categoryHeader } = selectors;
        const { imageActiveBackground: activeImageClass } = classes;

        let categoryWrapperTop = 0;

        Insider.fns.onElementLoaded(categoryItemWrapper, () => {
            Insider.eventManager.once(`click.category:items:${ variationId }`, categoryItemWrapper, (event) => {
                const clickedItemIndex = Number(Insider.dom(event.target).closest('[class*=wrapper]')
                    .attr('category-index'));

                self.scrollToRecommender(clickedItemIndex);

                Insider.dom(imageBackground).removeClass(activeImageClass);
                Insider.dom(imageBackground).eq(clickedItemIndex).addClass(activeImageClass);
            });
        }).listen();

        Insider.fns.onElementLoaded(`${ wrapper }:not(${ selectors.hideClass })`, () => {
            Insider.fns.onElementLoaded(lastRecommender, () => {
                setTimeout(() => {
                    categoryWrapperTop = Insider.dom(categoryWrapper).offset().top +
                        Insider.dom(categoryWrapper).height();

                    Insider.eventManager.once(`scroll.page:${ variationId }`, window,
                        Insider.fns.throttle(() => {
                            self.setStickyWrapper(categoryWrapperTop);

                            setTimeout(() => {
                                if (!isScrolled) {
                                    self.setSelectedCategoryInScroll();
                                }

                                isScrolled = false;
                            }, 500);
                        }, 750)
                    );
                }, 4500);
            }).listen();
        }).listen();

        /* OPT-135918 START */
        Insider.eventManager.once(`click.on:redirect${ variationId }`, '.ins-layout-wrapper', (event) => {
            const productLink = (Insider.dom(event._originalTarget).find('.ins-product-box') || '').attr('href') || '';

            if (productLink) {
                window.location.href = productLink;
            }
        });
        /* OPT-135918 END */

        Insider.eventManager.once(`click.more:button:${ variationId }`, '.actMore', () => {
            !Insider.dom(categoryWrapper, wrapper).exists() &&
                Insider.dom(categoryHeader).after(Insider.dom(categoryWrapper));

            setTimeout(() => {
                categoryWrapperTop = Insider.dom(categoryWrapper).offset().top +
                    Insider.dom(categoryWrapper).height();
            }, 150);
        });

        Insider.eventManager.once(`resize.listen:landscape:${ variationId }`, window, Insider.fns.debounce(() => {
            categoryWrapperTop && self.setStickyWrapper(categoryWrapperTop);
        }, 200));
    };

    /* OPT-143264 START */
    self.hideWrapper = () => {
        const { hideMenuTab, categoryWrapper } = selectors;
        const { hideClass } = classes;
        let isDragging = false;

        Insider.eventManager.once(`mousedown.menu:dragging:${ variationId }`, hideMenuTab, () => {
            isDragging = false;
        });

        Insider.eventManager.once(`mousemove.main:tab:dragging:${ variationId }`, hideMenuTab, () => {
            isDragging = true;
        });

        Insider.eventManager.once(`mouseup.set:campaign:visibility:${ variationId }`, hideMenuTab, (event) => {
            const menuDragging = isDragging;

            isDragging = false;

            if (!menuDragging) {
                const menuTabText = Insider.dom(event.currentTarget).text().trim();
                const $menuWrapper = Insider.dom(categoryWrapper);

                if (menuTabText === categoryItemsConfig.mainCategoryTabName) {
                    $menuWrapper.removeClass(hideClass);
                } else {
                    $menuWrapper.addClass(hideClass);
                }
            }
        });
    };
    /* OPT-143264 END */

    self.scrollToRecommender = (clickedItemIndex) => {
        const { categoryWrapper, imageActiveBackground } = selectors;

        const beforeSelectedIndex = Number(Insider.dom(imageActiveBackground).closest('[class*=wrapper]')
            .attr('category-index'));
        const recommenderToSlide = Insider.dom(`[recommender-index=${ clickedItemIndex }]`);

        const scrollValue = clickedItemIndex > 1 ?
            Math.abs((window.innerWidth / 2 - (clickedItemIndex * itemWidth) - (itemWidth / 2))) : 0;

        (Insider.dom(categoryWrapper).nodes[0] || {}).scrollLeft = scrollValue;

        const updateTop = beforeSelectedIndex > clickedItemIndex ? 140 : 100;

        isScrolled = true;

        window.scrollTo({
            behavior: 'smooth',
            top: recommenderToSlide.offset().top - (clickedItemIndex === 0 ? 210 : updateTop),
        });
    };

    self.setStickyWrapper = (categoryWrapperTop) => {
        const { categoryWrapper, partnerHeader, wrapper, categoryHeader } = selectors;

        // Daniel 2023.11.30
        if (window.scrollY >= categoryWrapperTop) {
            if (app !== 'APP') {
                !Insider.dom(categoryWrapper, partnerHeader).exists() &&
                Insider.dom(partnerHeader).append(Insider.dom(categoryWrapper));
            } else {
                $(`.ins-home-gnb-recommenders-category-wrapper-${ variationId }`).parents('.mainCon').length &&
                $('#contents.main').prepend($(`.ins-home-gnb-recommenders-category-wrapper-${ variationId }`)) &&
                $(`.ins-home-gnb-recommenders-category-wrapper-${ variationId }`).css('top', '0px').css('position', 'fixed');
            }
        } else {
            if (app !== 'APP') {
                !Insider.dom(categoryWrapper, wrapper).exists() &&
                Insider.dom(categoryHeader).after(Insider.dom(categoryWrapper));
            } else {
                !$(`.ins-home-gnb-recommenders-category-wrapper-${ variationId }`).parents('.mainCon').length &&
                $(`.ins-home-gnb-recommenders-category-header-${ variationId }`).after($(`.ins-home-gnb-recommenders-category-wrapper-${ variationId }`)) &&
                $(`.ins-home-gnb-recommenders-category-wrapper-${ variationId }`).css('top', '45px').css('position', 'unset');
            }
        }
    };

    self.setSelectedCategoryInScroll = () => {
        const { categoryWrapper, recommenderWrapper, imageBackground } = selectors;
        const { imageActiveBackground: activeImageClass } = classes;

        Insider.dom(recommenderWrapper).accessNodes(($recommender, index) => {
            if (self.isElementInViewport($recommender)) {
                const activeImage = Insider.dom(`${ imageBackground }:eq(${ index })`);

                if (index > 1) {
                    Insider.dom(categoryWrapper).nodes[0].scrollLeft =
                        Math.abs((window.innerWidth / 2 - (index * itemWidth) - (itemWidth / 2)));
                } else {
                    Insider.dom(categoryWrapper).nodes[0].scrollLeft = 0;
                }

                if (!Insider.dom(activeImage).hasClass(activeImageClass)) {
                    Insider.dom(imageBackground).removeClass(activeImageClass);
                    activeImage.addClass(activeImageClass);
                }
            }
        });
    };

    self.isElementInViewport = ($recommender) => {
        const recommenderTop = ((Insider.dom($recommender).offset() || {}).top || 0) - 200;

        return window.scrollY > recommenderTop && window.scrollY < recommenderTop + Insider.dom($recommender).height();
    };

    self.init();

})({});

true;
/* OPT-133836 END */
