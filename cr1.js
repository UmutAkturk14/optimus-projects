/* OPT-164554 START */
((self) => {
    'use strict';

    const builderId = 205;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isAutoAdvanceVariation = Insider.campaign.getFirstVariationByBuilderId(builderId)?.vi === variationId;
    const isControlGroup = Insider.campaign.isControlGroup(variationId);
    const campaignStorage = Insider.storage.localStorage.get(`sp-camp-${ variationId }`);
    const isCampaignClosed = campaignStorage?.closed;
    const isCampaignJoined = campaignStorage?.joined;

    let currentPage = 0;

    const config = {
        isShadowOpen: true, /* OPT-165827 */
        texts: {
            endButton: 'Turu sonlandır',
            continueButton: 'Devam'
        },
        fontSizes: {
            title: 14,
            description: 12,
            endButton: 10,
            continueButton: 12,
            pagination: 10
        },
        colors: {
            title: '#fff',
            description: '#fff',
            endButtonColor: '#fff',
            pagination: '#fff',
            closeButton: '#fff',
            backgroundColor: '#e20000',
            continueButtonBackgroundColor: '#fff',
            continueButtonColor: '#e20000',
            arrow: '#e20000',
            dot: '#e20000',
        },
        goalIds: {
            [`ins-custom-goal-1-${ variationId }`]: 93,
            [`ins-custom-goal-2-${ variationId }`]: 94,
            [`ins-custom-goal-3-${ variationId }`]: 95,
            [`ins-custom-goal-4-${ variationId }`]: 96,
            [`ins-custom-goal-5-${ variationId }`]: 97,
            [`ins-custom-goal-6-${ variationId }`]: 98,
            [`ins-custom-goal-7-${ variationId }`]: 99,
            [`ins-custom-goal-8-${ variationId }`]: 100,
            endButton: 101,
        }
    };

    const pagesData = [
        {
            /* OPT-165827 START */
            title: 'Sayfaya Hızlı Bakış',
            fontSize: 14,
            nextPageSecond: 15,
            /* OPT-165827 END */
            description: 'Fonların günlük, aylık, yıllık dönemlere ait getirilerini, 1 yıllık trend grafiklerini, risk değeri, fiyat, valör bilgilerini bir bakışta görebilirsiniz.',
            appendLocation: '.header-btns',
            arrowClassNameKey: 'topArrowContainer',
            wrapperClassNameKey: 'firstPosition',
        },
        {
            /* OPT-165827 START */
            title: 'Fon Getirilerini İnceleyin',
            fontSize: 14,
            nextPageSecond: 15,
            /* OPT-165827 END */
            description: 'Fonların getirileri veya mevduat eşleniğine göre listeleme için seçim yapabilirsiniz.',
            appendLocation: '.btns-group:nth-child(1) .select-holder:nth-child(1)',
            arrowClassNameKey: 'leftArrowContainer',
            wrapperClassNameKey: 'secondPosition',
        },
        {
            /* OPT-165827 START */
            title: 'Getiri Tipini Seçin',
            fontSize: 14,
            nextPageSecond: 15,
            /* OPT-165827 END */
            description: 'Tek bir tarih için veya iki tarih arasına göre filtreleme yapabilirsiniz.',
            appendLocation: '.btns-group:nth-child(1) .select-holder:nth-child(2)',
            arrowClassNameKey: 'bottomArrowContainer',
            wrapperClassNameKey: 'thirdPosition',
        },
        {
            /* OPT-165827 START */
            title: 'Tarih Filtresini Ayarlayın',
            fontSize: 14,
            nextPageSecond: 15,
            /* OPT-165827 END */
            description: 'Günlük, aylık ve yıllık dönemlere ait sıralama yapabilmek için görüntülemek istediğiniz zaman dilimini seçiniz.',
            appendLocation: '.controls-block-inner .data-list li:nth-child(4)',
            arrowClassNameKey: 'topArrowContainer',
            wrapperClassNameKey: 'fourthPosition',
        },
        {
            /* OPT-165827 START */
            title: 'Getiriye Göre Sıralayın',
            fontSize: 14,
            nextPageSecond: 15,
            /* OPT-165827 END */
            description: 'Fon kategorisi, önerilen vade, alış ve satış valörü ve 1 yıllık trend önizlemesini buradan görüntüleyebilirsiniz.',
            appendLocation: '.box-detail-lg:eq(0) .box-col-btn:has(.box-opener)',
            arrowClassNameKey: 'rightArrowContainer',
            wrapperClassNameKey: 'fifthPosition',
        },
        {
            /* OPT-165827 START */
            title: 'Fon Detayına Ulaşın',
            fontSize: 14,
            nextPageSecond: 15,
            /* OPT-165827 END */
            description: 'Tek tıkla dilediğiniz fon hakkında; fon künyesi, varlık dağılımı, fon performansı gibi daha detaylı bilgilere ulaşabilirsiniz.',
            appendLocation: '.detail-info-btns:eq(0)',
            arrowClassNameKey: 'bottomArrowContainer',
            wrapperClassNameKey: 'sixthPosition',
        },
        {
            /* OPT-165827 START */
            title: 'Fonları Karşılaştırın',
            fontSize: 14,
            nextPageSecond: 15,
            /* OPT-165827 END */
            description: 'İstediğiniz fonların günlük, aylık, yıllık dönemlere ait getirilerini, 1 yıllık trend grafiklerini, risk değerini, fiyat ve valör bilgilerini kolayca karşılaştırabilirsiniz.',
            appendLocation: '.btns-group:has(#btnShowCompareChb)',
            arrowClassNameKey: 'rightArrowContainer',
            wrapperClassNameKey: 'seventhPosition',
        },
        {
            /* OPT-165827 START */
            title: 'Emeklilik Fonlarını İnceleyin',
            fontSize: 14,
            nextPageSecond: 15,
            /* OPT-165827 END */
            description: 'Tek tıkla Emeklilik Fonları Fiyat ve Getirileri sayfasına geçiş yapabilirsiniz.',
            appendLocation: '.form-check.form-switch',
            arrowClassNameKey: 'bottomArrowContainer',
            wrapperClassNameKey: 'eighthPosition',
        },
    ];

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        firstPosition: `ins-custom-first-position-${ variationId }`,
        secondPosition: `ins-custom-second-position-${ variationId }`,
        thirdPosition: `ins-custom-third-position-${ variationId }`,
        fourthPosition: `ins-custom-fourth-position-${ variationId }`,
        fifthPosition: `ins-custom-fifth-position-${ variationId }`,
        sixthPosition: `ins-custom-sixth-position-${ variationId }`,
        seventhPosition: `ins-custom-seventh-position-${ variationId }`,
        eighthPosition: `ins-custom-eighth-position-${ variationId }`,
        content: `ins-custom-content-${ variationId }`,
        title: `ins-custom-title-${ variationId }`,
        closeButton: `ins-custom-close-button-${ variationId }`,
        body: `ins-custom-body-${ variationId }`,
        footer: `ins-custom-footer-${ variationId }`,
        continueButton: `ins-custom-continue-button-${ variationId }`,
        endButton: `ins-custom-end-button-${ variationId }`,
        pageNumber: `ins-custom-page-number-${ variationId }`,
        topArrowContainer: `ins-custom-top-arrow-container-${ variationId }`,
        bottomArrowContainer: `ins-custom-bottom-arrow-container-${ variationId }`,
        leftArrowContainer: `ins-custom-left-arrow-container-${ variationId }`,
        rightArrowContainer: `ins-custom-right-arrow-container-${ variationId }`,
        arrow: `ins-custom-arrow-${ variationId }`,
        dot: `ins-custom-dot-${ variationId }`,
        customPosition: `ins-custom-position-${ variationId }`,
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        firstAppendLocation: '.header-btns',
        partnerDetailShowButton: '.box-detail-lg:eq(0):not(.box-active) .box-col-btn:has(.box-opener) button',
        goals: '.header-btns, .header-btns, .header-btns, .header-btns',
        customGoal: `[class*="ins-custom-goal-"][class$="${ variationId }"]`
    });

    self.init = () => {
        if (variationId && !isCampaignJoined && !isCampaignClosed) {
            Insider.fns.onElementLoaded(selectors.firstAppendLocation, () => {
                self.buildCampaign();
                self.setCustomGoalClassForControlGroup();
                self.setEvents();
                self.startAutoAdvance();

                Insider.dom('html, body').animate({ scrollTop: 0 }, 50);

                Insider.campaign.custom.show(variationId);
            }).listen();
        }
    };

    self.buildCampaign = () => {
        if (!isControlGroup) {
            self.reset();
            self.setCSS();
            self.buildHTML();
        }
    };

    self.reset = () => {
        const { style, wrapper, customPosition } = selectors;

        Insider.dom(customPosition).removeClass(classes.customPosition);

        self.stopAutoAdvance();

        Insider.dom(`${ style }, ${ wrapper }`).remove();
    };

    self.stopAutoAdvance = () => {
        if (isAutoAdvanceVariation) {
            clearTimeout(Insider.__external.autoAdvanceTimeout164554);
        }
    };

    self.setCSS = () => {
        const { wrapper, content, title, closeButton, body, footer, continueButton, endButton, arrow, dot,
            firstPosition, secondPosition, thirdPosition, fourthPosition, fifthPosition, sixthPosition, seventhPosition,
            eighthPosition, topArrowContainer, bottomArrowContainer, leftArrowContainer, rightArrowContainer,
            customPosition, pageNumber } = selectors;

        const { fontSizes, colors, isShadowOpen } = config;

        const { title: titleColor, description, closeButton: closeButtonColor, continueButtonColor,
            continueButtonBackgroundColor, endButton: endButtonColor, arrow: arrowColor, dot: dotColor,
            backgroundColor } = colors;
        const { description: decorationSize, closeButton: closeButtonSize,
            continueButton: continueButtonSize, endButton: endButtonSize, pagination }
            = fontSizes;

        const { appendLocation, fontSize } = pagesData[currentPage]; /* OPT-165827 */

        const { style, customPosition: customPositionClass } = classes;

        const customStyle =
        `${ wrapper } {
            position: absolute;
            width: 260px;
            padding: 10px 20px;
            background-color: ${ backgroundColor };
            color: #fff;
            font-family: "Open Sans", sans-serif !important;
            box-shadow: ${ isShadowOpen ? '0px 3px 6px 6px rgb(0 0 0 / 20%);' : 'none' } /* OPT-165827 */
            z-index: 9999;
        }
        ${ firstPosition } {
            top: 70px;
            right: 50%;
            transform: translateX(50%);
        }
        ${ secondPosition } {
            top: 50%;
            left: 135px;
            transform: translateY(-50%);
        }
        ${ thirdPosition } {
            top: -28px;
            left: 50%;
            transform: translate(-50%, -100%);
        }
        ${ fourthPosition } {
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
        }
        ${ fifthPosition } {
            top: 50%;
            right: 82px;
            transform: translateY(-50%);
        }
        ${ sixthPosition } {
            top: -210px;
            left: 50%;
            transform: translateX(-64%);
        }
        ${ seventhPosition } {
            top: -67px;
            right: 194px;
        }
        ${ eighthPosition } {
            top: -27px;
            left: 50%;
            transform: translate(-60%, -100%);
        }
        ${ content } {
            position: relative;
        }
        ${ pageNumber } {
            font-size: ${ pagination }px;
        }
        ${ title } {
            font-weight: bold;
            text-align: left;
            font-size: ${ fontSize }px;
            margin-bottom: 20px;
            color: ${ titleColor };
        }
        ${ closeButton } {
            position: absolute;
            top: -4px;
            right: -14px;
            cursor: pointer;
            background: none;
            border: none;
            color: ${ closeButtonColor };
            font-size: ${ closeButtonSize }px;
        }
        ${ body } {
            margin-bottom: 15px;
            font-size: ${ decorationSize }px;
            color: ${ description };
            text-align: left;
            font-weight: 400;
        }
        ${ footer } {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        ${ continueButton } {
            background-color: ${ continueButtonBackgroundColor };
            color: ${ continueButtonColor };
            padding: 5px 10px;
            border: none;
            font-size: ${ continueButtonSize }px;
            cursor: pointer;
            font-weight: bold;
        }
        ${ endButton } {
            text-decoration: underline;
            cursor: pointer;
            font-size: ${ endButtonSize }px;
            color: ${ endButtonColor };
        }
        ${ topArrowContainer } {
            position: absolute;
            top: 0;
            right: 50%;
            transform: rotate(180deg);
        }
        ${ bottomArrowContainer } {
            position: absolute;
            bottom: 0;
            right: 50%;
        }
        ${ leftArrowContainer } {
            position: absolute;
            bottom: 50%;
            left: 0;
            transform: rotate(90deg);
        }
        ${ rightArrowContainer } {
            position: absolute;
            bottom: 50%;
            right: 0;
            transform: rotate(-90deg);
        }
        ${ arrow } {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 10px solid ${ arrowColor };
        }
        ${ dot } {
            position: absolute;
            bottom: -25px;
            left: 50%;
            transform: translateX(-50%);
            width: 10px;
            height: 10px;
            background-color: ${ dotColor };
            border-radius: 50%;
        }
        ${ customPosition } {
            position: relative !important;
        }`;

        Insider.dom(appendLocation).addClass(customPositionClass);
        Insider.dom(appendLocation).addClass(`ins-custom-goal-${ currentPage + 1 }-${ variationId }`);
        Insider.dom('<style>').addClass(style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const { wrapper, content, title, closeButton, body, footer, continueButton, endButton, arrow, pageNumber, dot }
            = classes;
        const { continueButton: continueButtonText, endButton: endButtonText } = config.texts;
        const { title: titleText, wrapperClassNameKey, description, arrowClassNameKey, /* OPT-165827 */
            appendLocation } = pagesData[currentPage];

        const outerHtml =
        `<div class="${ wrapper } ${ classes[wrapperClassNameKey] }">
            <div class="${ content }">
                <div class="${ title }">${ titleText }</div>
                <button class="${ closeButton }">&#x2716;</button>
                <div class="${ body }">
                    ${ description }
                </div>
                <div class="${ footer }">
                    <span class="${ endButton }">${ endButtonText }</span>
                    <span class="${ pageNumber }">${ currentPage + 1 } / ${ pagesData.length }</span>
                    <button class="${ continueButton }">${ continueButtonText }</button>
                </div>
            </div>
            <div class="${ classes[arrowClassNameKey] }">
                <div class="${ arrow }"></div>
                <div class="${ dot }"></div>
            </div>
        </div>`;

        Insider.dom(appendLocation).append(outerHtml);
    };

    self.setCustomGoalClassForControlGroup = () => {
        if (isControlGroup) {
            pagesData.map((page, index) => {
                Insider.dom(page.appendLocation).addClass(`ins-custom-goal-${ index + 1 }-${ variationId }`);
            });
        }
    };

    self.setEvents = () => {
        const { wrapper, closeButton, continueButton, endButton, customGoal } = selectors;
        const { closeButton: closeButtonClass, endButton: endButtonClass } = classes;

        if (!isControlGroup) {
            Insider.eventManager.once(`click.close:${ variationId }`, `${ closeButton }, ${ endButton }`, (event) => {
                self.reset();
                self.stopAutoAdvance();

                if (Insider.dom(event.currentTarget).hasClass(endButtonClass)) {
                    Insider.utils.opt.sendCustomGoal(builderId, config.goalIds.endButton, true);
                }

                Insider.campaign.info.storeCloseLog(variationId);

                Insider.campaign.updateCampaignCookie({
                    closed: true
                }, Insider.campaign.custom.addCampaignIdPrefix(variationId));

            });

            Insider.eventManager.once(`click.continue:${ variationId }`, continueButton, () => {
                self.advancePage();
            });

            Insider.eventManager.once(`click.join:goal:${ variationId }`, wrapper, ({ target }) => {
                if (!isCampaignJoined && !Insider.dom(target).hasClass(closeButtonClass)
                    && !Insider.dom(target).hasClass(endButtonClass)) {
                    Insider.campaign.custom.storeJoinLog(variationId);

                    Insider.campaign.updateCampaignCookie({
                        joined: true
                    }, Insider.campaign.custom.addCampaignIdPrefix(variationId));
                }
            });
        }

        Insider.eventManager.on(`click.send:custom:goal:${ variationId }`, customGoal,
            ({ isTrusted, target, currentTarget }) => {
                if (isTrusted && !Insider.dom(target).hasClass(wrapper) &&
                    !Insider.dom(target).closest(wrapper).exists()) {
                    const regex = new RegExp(`ins-custom-goal-\\d+-${ variationId }`, 'g');
                    const customGoalClass = Insider.dom(currentTarget).attr('class')?.match(regex);

                    if (customGoalClass?.length) {
                        Insider.utils.opt.sendCustomGoal(builderId, config.goalIds[customGoalClass[0]], true);
                    }
                }
            });
    };

    self.advancePage = () => {
        const { partnerDetailShowButton } = selectors;
        const { appendLocation } = pagesData[currentPage];

        if (currentPage === 2) {
            Insider.dom('html, body').animate({
                scrollTop: Insider.dom(appendLocation).offset()?.top ?? 500
            }, 50);
        } else if (currentPage === 4) {
            self.reset();

            Insider.dom(partnerDetailShowButton).click();
        } else if (currentPage === 5) {
            Insider.dom('html, body').animate({ scrollTop: 0 }, 50);
        }

        currentPage += 1;

        if (currentPage < pagesData.length) {
            self.buildCampaign();
            self.startAutoAdvance();
        } else {
            self.reset();
            self.stopAutoAdvance();
        }
    };

    self.startAutoAdvance = () => {
        if (isAutoAdvanceVariation) {
            self.stopAutoAdvance();

            Insider.__external.autoAdvanceTimeout164554 =
                setTimeout(() => self.advancePage(), pagesData[currentPage].nextPageSecond * 1000); /* OPT-165827 */
        }
    };

    self.init();
})({});
/* OPT-164554 END */
