/* OPT-159520 START */
Insider.__external.CreateMemoryGame159520 = (idConfig) => {
    'use strict';

    const self = {};
    const { currentBuilderId, leadCollectionVariationId, couponCampaignBuilderId, reminderBuilderId } = idConfig;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(currentBuilderId);
    const gameDoneStorageName = `ins-memory-game-done-${ variationId }`;
    /* OPT-159520 END */
    const reminderVariationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(reminderBuilderId);
    const gameSeenStorageName = `ins-memory-game-seen-${ variationId }`;
    const couponStorageName = `ins-coupon-code-${ variationId }`;
    const couponCampaignVariationId = Insider.campaign.userSegment
        .getActiveVariationByBuilderId(couponCampaignBuilderId);
    let activeCouponCode = Insider.storage.localStorage.get(`sp-info-c-${ couponCampaignVariationId }`) ?? ''; /* OPT-161916 */

    const config = {
        formData: {
            nameAndSurnameId: '7406741596774',
            phoneId: '5641366167809',
            emailId: '6153007667159',
            gdprId: '1526541766369',
            couponId: '5107235493081', /* OPT-161916 */
        },
        /* Close Button */
        closeButtonImage: 'https://image.useinsider.com/fptshop/defaultImageLibrary/ic-close-1715347422.png',
        /* Nút Sử dụng ngay */
        generalCloseButton: 'https://image.useinsider.com/fptshop/defaultImageLibrary/Frame%2099128-1715346447.png',
        /* Thông tin trang nhập Lead và Game */
        opener: {
            title: 'Nhập thông tin để nhận quà',
            description: '*Số điện thoại được dùng để nhận giải.',
            policyRulesText: 'Xem thể lệ',
            policyURL: 'https://fptshop.com.vn/tin-tuc/tin-khuyen-mai/dong-hanh-cung-si-tu-188343',
            policyArrow: 'https://image.useinsider.com/fptshop/defaultImageLibrary/icon-1715593962.png',
            image: 'https://image.useinsider.com/fptshop/defaultImageLibrary/be%CC%89g-1718332423.png',
            gameText: 'Lật để tìm các lời chúc giống nhau',
            placeholders: {
                nameAndSurname: 'Nhập họ tên',
                phone: 'Nhập số điện thoại',
                email: 'Nhập email (không bắt buộc)',
            },
            gdprText: 'Tôi đồng ý nhận thông tin khuyến mãi',
        },
        winnerImage: 'https://image.useinsider.com/fptshop/defaultImageLibrary/be%CC%89g-1718332423.png',
        /* Nút Chơi ngay */
        submitButtonImage: 'https://image.useinsider.com/fptshop/defaultImageLibrary/Frame%2099127-1715346461.png',
        /* Các cặp ảnh của game */
        cardImage: {
            first: 'https://image.useinsider.com/fptshop/defaultImageLibrary/card-01-1718332514.png',
            second: 'https://image.useinsider.com/fptshop/defaultImageLibrary/card-02-1718332543.png',
            third: 'https://image.useinsider.com/fptshop/defaultImageLibrary/card-03-1718332573.png',
        },
        copyButtonText: 'COPY CODE',
        gameDescription: 'Lật để tìm các lời chúc giống nhau',
        shuffleCover: 'https://image.useinsider.com/fptshop/defaultImageLibrary/be%CC%89g-1718332423.png',
        /* Ảnh game khi úp xuống */
        cardCover: 'https://image.useinsider.com/fptshop/defaultImageLibrary/card-4-1718332649.png'
    };

    /* OPT-161916 START */
    const couponConfigByVariationId = {
        /* Thank-you Page - 6 trang */
        9151: {
            couponTitleImage: 'https://image.useinsider.com/fptshop/defaultImageLibrary/33-05%201-1715593979.png',
            couponDescription: 'Đã trúng voucher 10K khi mua Online đơn hàng giá trị từ 100K tại FPT Shop.<br>Hạn sử dụng: 03/07/2024',
            couponValue: '10K khi mua Online đơn hàng từ 100K'
        },
        9338: {
            couponTitleImage: 'https://image.useinsider.com/fptshop/defaultImageLibrary/33-05%201-1715593979.png',
            couponDescription: 'Đã trúng voucher 20k khi mua Online đơn hàng giá trị từ 100K tại FPT Shop. <br>Hạn sử dụng: 03/07/2024',
            couponValue: '20k khi mua Online đơn hàng từ 100K'
        },
        9339: {
            couponTitleImage: 'https://image.useinsider.com/fptshop/defaultImageLibrary/33-05%201-1715593979.png',
            couponDescription: 'Đã trúng voucher 50K khi mua Online đơn hàng giá trị từ 500K tại FPT Shop <br>Hạn sử dụng: 03/07/2024',
            couponValue: '50K khi mua Online đơn hàng từ 500K'
        },
        9340: {
            couponTitleImage: 'https://image.useinsider.com/fptshop/defaultImageLibrary/33-05%201-1715593979.png',
            couponDescription: 'Đã trúng voucher 100K khi mua Online đơn hàng giá trị từ 1 triệu tại FPT Shop <br>Hạn sử dụng: 03/07/2024',
            couponValue: '100K khi mua Online đơn hàng từ 1 triệu'
        },
        9341: {
            couponTitleImage: 'https://image.useinsider.com/fptshop/defaultImageLibrary/33-05%201-1715593979.png',
            couponDescription: 'Đã trúng voucher 200K khi mua Online đơn hàng giá trị từ 2 triệu tại FPT Shop. <br>Hạn sử dụng: 03/07/2024',
            couponValue: '200K khi mua Online đơn hàng từ 2 triệu'
        },
        9342: {
            couponTitleImage: 'https://image.useinsider.com/fptshop/defaultImageLibrary/33-05%201-1715593979.png',
            couponDescription: 'Đã trúng voucher  voucher giảm 10% mua Online màn hình LCD tại FPT Shop (trừ màn hình Apple). <br>Hạn sử dụng: 03/07/2024',
            couponValue: 'giảm 10% mua Online màn hình LCD tại FPT Shop (trừ màn hình Apple)'
        },
    };
    /* OPT-161916 END */

    const classes = {
        game: `ins-memory-game-wrapper-${ variationId }`,
        table: `ins-memory-game-table-${ variationId }`,
        popup: `ins-memory-game-popup-${ variationId }`,
        card: `ins-game-card-${ variationId }`,
        cardOpen: `ins-card-open-${ variationId }`,
        matched: `ins-matched-${ variationId }`,
        unmatched: `ins-unmatched-${ variationId }`,
        click: `sp-custom-${ variationId }`,
        disabled: `ins-disabled-${ variationId }`,
        overlay: `ins-memory-game-overlay-${ variationId }`,
        opener: `ins-memory-game-opener-${ variationId }`,
        startButton: `ins-start-button-${ variationId }`,
        closeButton: `ins-close-button-${ variationId }`,
        coupon: `ins-memory-game-coupon-${ variationId }`,
        copyToClipboard: `ins-memory-game-copy-to-clipboard-${ variationId }`,
        style: `ins-memory-game-style-${ variationId }`,
        openerTitle: `ins-opener-title-${ variationId }`,
        openerDescription: `ins-opener-description-${ variationId }`,
        policyContainer: `ins-opener-policy-container-${ variationId }`,
        policy: `ins-opener-policy-${ variationId }`,
        gameDescription: `ins-game-description-${ variationId }`,
        inputArea: `ins-input-area-${ variationId }`,
        gdpr: `ins-gdpr-${ variationId }`,
        couponContainer: `ins-coupon-container-${ variationId }`,
        copyCoupon: `ins-copy-coupon-${ variationId }`,
        copiedCoupon: `ins-copied-coupon-${ variationId }`,
        couponDescription: `ins-coupon-description-${ variationId }`,
        couponTitle: `ins-coupon-title-${ variationId }`,
        couponCloseButton: `ins-coupon-close-button-${ variationId }`,
        required: `ins-required-${ variationId }`,
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        couponArea: `.ins-preview-wrapper-${ reminderVariationId } .ins-copy-to-clipboard`
    });

    let matchCount = 0;

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.addStyle();
                self.buildOpenerHtml();
                self.setEvents();
            }

            return true;
        }
    };

    self.reset = () => {
        const { game, overlay, style } = selectors;

        Insider.dom(`${ game }, ${ overlay }, ${ style }`).remove();

        Insider.campaign.info.clearVisibleCampaignsByType('ON-PAGE');
        Insider.campaign.webInfo.clearVisibleCampaignsByType('ON-PAGE');
    };

    self.addStyle = () => {
        const { popup, overlay, startButton, shuffle, closeButton, coupon, copyToClipboard, card, matched, unmatched,
            cardOpen, disabled, table, opener, openerTitle, openerDescription, inputArea, gdpr, policy,
            policyContainer, gameDescription, couponContainer, copyCoupon, copiedCoupon, couponDescription,
            couponTitle, couponCloseButton, required } = selectors;
        const { submitButtonImage, closeButtonImage, cardCover, shuffleCover, opener: openerConfig } = config;

        const style =
            `@keyframes flipInY {
            from {
                -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
                transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
                -webkit-animation-timing-function: ease-in;
                animation-timing-function: ease-in;
                opacity: 0;
            }
            40% {
                -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
                transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
                -webkit-animation-timing-function: ease-in;
                animation-timing-function: ease-in;
            }
            60% {
                -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
                transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
                opacity: 1;
            }
            80% {
                -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
                transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
            }
            to {
                -webkit-transform: perspective(400px);
                transform: perspective(400px);
            }
        }
        @keyframes rubberBand {
            from {
                -webkit-transform: scale3d(1, 1, 1);
                transform: scale3d(1, 1, 1);
            }
            30% {
                -webkit-transform: scale3d(1.25, 0.75, 1);
                transform: scale3d(1.25, 0.75, 1);
            }
            40% {
                -webkit-transform: scale3d(0.75, 1.25, 1);
                transform: scale3d(0.75, 1.25, 1);
            }
            50% {
                -webkit-transform: scale3d(1.15, 0.85, 1);
                transform: scale3d(1.15, 0.85, 1);
            }
            65% {
                -webkit-transform: scale3d(.95, 1.05, 1);
                transform: scale3d(.95, 1.05, 1);
            }
            75% {
                -webkit-transform: scale3d(1.05, .95, 1);
                transform: scale3d(1.05, .95, 1);
            }
            to {
                -webkit-transform: scale3d(1, 1, 1);
                transform: scale3d(1, 1, 1);
            }
        }
        @keyframes pulse {
            from {
                -webkit-transform: scale3d(1, 1, 1);
                transform: scale3d(1, 1, 1);
            }
            50% {
                -webkit-transform: scale3d(1.2, 1.2, 1.2);
                transform: scale3d(1.2, 1.2, 1.2);
            }
            to {
                -webkit-transform: scale3d(1, 1, 1);
                transform: scale3d(1, 1, 1);
            }
        }
        ${ popup } {
            width: 360px;
            height: 560px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            position: fixed;
            z-index: 9999;
        }
        ${ overlay } {
            width: 100%;
            height: 100%;
            top: 0px;
            left: 0px;
            z-index: 9998;
            overflow: hidden;
            position: fixed;
            background: #040a2b;
            opacity: 0.5;
        }
        ${ startButton } {
            width: 204px;
            height: 42px;
            top: 470px;
            left: 80px;
            background: transparent;
            background-image: url("${ submitButtonImage }");
            position: absolute;
            background-repeat: no-repeat;
            background-size: cover;
            border: 0;
            cursor: pointer;
            pointer-events: auto;
        }
        ${ shuffle } {
            width: 214px;
            height: 40px;
            left: 37%;
            bottom: 11px;
            position: absolute;
            border: solid white 3px;
            color: white;
            font-family: inherit;
            font-size: 18px;
            cursor: pointer;
            pointer-events: auto;
        }
        ${ closeButton } {
            opacity: 1;
            color: black;
            background-image: url("${ closeButtonImage }");
            background-repeat: no-repeat;
            background-size: cover;
            right: -7px;
            top: -16px;
            position: absolute;
            width: 24px;
            height: 24px;
            cursor: pointer;
        }
        ${ coupon } {
            background-color: white;
            font-weight: bold;
            border: none;
            pointer-events: none;
            width: 192px;
            height: 35px;
            padding: 9px 20px 9px 20px;
            border-radius: 0px 4.53px 4.53px 0px;
        }
        ${ copyToClipboard } {
            left: 403px;
            top: 455px;
            font-size: 13px;
            padding-top: 5px;
            width: 160px;
            height: 38px;
            position: absolute;
            font-weight: bold;
            color: white;
            border: none;
            cursor: pointer;
            background: #3d317b;
            opacity: 0;
        }
        ${ card } {
            width: 158px;
            height: 82px;
            cursor: pointer;
            background-size: cover;
            display: inline-block;
            margin: 15px 0px 0px 11px !important;
            background-image: url("${ cardCover }");
        }
        ${ card }  img {
            display: none;
        }
        ${ card } + ${ matched }  img {
            display: block;
        }
        ${ cardOpen }  {
            transform: rotateY(0);
            cursor: default;
            pointer-events: none;
            -webkit-animation-name: flipInY;
            animation-name: flipInY;
            -webkit-backface-visibility: visible !important;
            backface-visibility: visible !important;
            animation-duration: .75s;
        }
        ${ cardOpen }  img {
            display: block;
        }
        ${ disabled }  {
            cursor: pointer;
            pointer-events: none;
        }
        ${ matched }  {
            cursor: default;
            -webkit-animation-name: rubberBand;
            animation-name: rubberBand;
            -webkit-backface-visibility: visible !important;
            backface-visibility: visible !important;
            animation-duration: .75s;
        }
        ${ unmatched } {
            cursor: default;
            pointer-events: none;
            animation-name: pulse;
            -webkit-animation-name: pulse;
            -webkit-backface-visibility: visible !important;
            backface-visibility: visible !important;
            animation-duration: .75s;
        }
        ${ table } {
            padding-left: 5px;
            padding-top: 225px;
            background-image: url("${ shuffleCover }");
            background-size: cover;
        }
        ${ opener } {
            background-image: url("${ openerConfig.image }");
            background-size: cover;
            padding: 165px 25px; /* OPT-167483 */
            color: white;
            text-align: center;
            font-family: Roboto, Helvetica, Arial sans-serif !important;
        }
        ${ openerTitle } {
            font-size: 24px;
            line-height: 32px;
            font-weight: 700;
        }
        ${ openerDescription } {
            font-size: 16px;
            font-weight: 400;
            line-height: 24px;
            margin-top: 12px;
        }
        ${ policy } {
            font-size: 16px;
            font-weight: 400;
            line-height: 16px;
            color: white !important;
            text-decoration: underline;
            display: block;
            margin-right: 7px;
        }
        ${ inputArea } {
            width: 313px;
            height: 32px;
            padding: 6px 12px 6px 12px;
            border-radius: 4px;
            border: 1px solid rgba(203, 209, 214, 1);
            margin-bottom: 5px;
	color: #000000 !important;
        }
        ${ gdpr } {
            display: flex;
            font-size: 13px;
            font-weight: 600;
            line-height: 24px;
            margin-top: 5px;
        }
        ${ gdpr } input {
            appearance: auto !important;
            margin-right: 7px;
            height: 15px;
            width: 15px;
            margin-top: 2px;
        }
        ${ policyContainer } {
            display: flex;
            margin-bottom: 15px;
            margin-top: 5px;
            justify-content: center;
        }
        ${ policyContainer } img {
            height: 14px;
        }
        ${ gameDescription } {
            position: absolute;
            top: 195px;
            left: 27px;
            font-size: 20px;
            font-weight: 400;
            line-height: 24px;
            color: white;
        }
        ${ couponContainer } {
            display: flex;
            font-size: 17px;
            font-weight: 800;
            line-height: 17px;
            color: black;
        }
        ${ copyCoupon } {
            width: 150px;
            height: 35px;
            padding: 9px 10px 9px 10px;
            border-radius: 4.53px 0px 0px 4.53px;
            border-right: 1px solid rgba(199, 199, 199, 1);
            background: white;
            font-weight: 800;
            cursor: pointer;
        }
        ${ copiedCoupon } {
            background: rgba(209, 205, 205, 1);
        }
        ${ couponDescription } {
            font-size: 20px;
            font-weight: 500;
            line-height: 24.2px;
            margin-top: 15px;
            margin-bottom: 20px;
        }
        ${ couponTitle } {
            width: 255px;
            margin-top: 3px;
			margin-left: 15px;
        }
        ${ couponCloseButton } {
            margin-top: 30px;
            cursor: pointer;
			margin-left: 18px;
        }
        ${ required } {
            border: 2px solid red !important;
        }
        @media screen and (max-width: 1199px) {
            ${ popup } {
                width: 340px;
                height: 528.8px;
            }
            ${ gameDescription } {
                top: 190px;
                left: 17px;
            }
            ${ card } {
                margin: 8px 0px 0px 4.5px !important;
            }
            ${ couponDescription } {
                font-size: 17px;
            }
            ${ couponTitle } {
                margin-top: -15px;
            }
            ${ openerTitle } {
                font-size: 21px;
            }
            ${ inputArea } {
                width: 100%;
	color: #000000 ! important;
            }
            ${ startButton } {
                left: 70px;
            }
            ${ coupon } {
                padding: 9px 15px 9px 15px;
            }
        }`;

        Insider.dom('<style>').addClass(classes.style).html(style).appendTo('head');
    };

    self.buildOpenerHtml = () => {
        const { popup, overlay, startButton, closeButton, game, opener, click, openerTitle, openerDescription, policy,
            inputArea, gdpr, policyContainer } = classes;
        const { title, description, policyRulesText, policyURL, policyArrow, gdprText, placeholders } = config.opener;
        const { nameAndSurname, phone, email } = placeholders;

        const openerHtml =
            `<div class="${ overlay }"></div>
        <div class="${ game } ${ click }">
            <div class="${ popup } ${ opener }">
                <div class="${ closeButton }"></div>
                <div class="${ openerTitle }">${ title }</div>
                <div class="${ openerDescription }">${ description }</div>
                <div class="${ policyContainer }">
                    <a href="${ policyURL }" class="${ policy }" target="_blank">${ policyRulesText }</a>
                    <img src="${ policyArrow }">
                </div>
                <div>
                    <input class="${ inputArea }" placeholder="${ nameAndSurname }">
                    <input class="${ inputArea }" placeholder="${ phone }">
                    <input class="${ inputArea }" placeholder="${ email }" type="email">
                </div>
                <div class="${ gdpr }">
                    <input type="checkbox" checked>
                    <div>${ gdprText }</div>
                </div>
                <button class="${ startButton }"></button>
            </div>
        </div>`;

        Insider.storage.session.set({
            name: gameSeenStorageName,
            value: true,
        });

        Insider.dom('body').append(openerHtml);
    };

    /* ZEN-168421 START */
    self.unifyUser = (userData) => {
        let formattedPhone = userData.phone[0] === '0' ? userData.phone.slice(1, 10).trim() : userData.phone;

        if (formattedPhone !== '') {
            formattedPhone = `+84${ formattedPhone }`;
        }

        window.insider_object = window.insider_object || {};
        window.insider_object.user = {
            gdpr_optin: true,
            email: userData.email,
            email_optin: true,
            phone_number: formattedPhone,
            sms_optin: true
        };

        Insider.initializeHitAPI();
    };
    /* ZEN-168421 END */

    self.setEvents = () => {
        const { closeButton, startButton, card, copyCoupon, couponCloseButton, inputArea, gdpr: gdprSelector,
            required, couponArea } = selectors;
        const { disabled, matched, unmatched, cardOpen, copiedCoupon, required: requiredClass } = classes;

        /* ZEN-168421 START */
        Insider.eventManager.once(`input.checkLimitPhoneNumber:${ variationId }`, `${ inputArea }:eq(1)`, () => {
            if (Insider.dom(`${ inputArea }:eq(1)`).val()[0] === '0') {
                Insider.dom(`${ inputArea }:eq(1)`).val(Insider.dom(`${ inputArea }:eq(1)`).val().slice(0, 10));
            } else {
                Insider.dom(`${ inputArea }:eq(1)`).val(Insider.dom(`${ inputArea }:eq(1)`).val().slice(0, 9));
            }
        });
        /* ZEN-168421 END */

        Insider.eventManager.once(`click.close:game:${ variationId }`, `${ closeButton }, ${ couponCloseButton }`,
            () => {
                Insider.campaign.info.storeCloseLog(variationId);

                Insider.campaign.info.updateCampaignCookie(
                    { closed: true },
                    Insider.campaign.custom.addCampaignIdPrefix(variationId)
                );

                self.reset();

                /* OPT-159520 START */
                if (Insider.storage.session.get(gameDoneStorageName)) {
                    Insider.fns.onElementLoaded(couponArea, () => {
                        Insider.dom(couponArea).text(activeCouponCode); /* OPT-161916 */
                    }).listen();

                    Insider.campaign.info.clearVisibleCampaignsByType('ON-PAGE');
                    Insider.campaign.webInfo.clearVisibleCampaignsByType('ON-PAGE');

                    Insider.campaign.info.show(reminderVariationId);
                    Insider.campaign.webInfo.show(reminderVariationId);
                }
                /* OPT-159520 END */
            });

        Insider.eventManager.once(`click.start:game:${ variationId }`, startButton, () => {
            const $inputAreas = Insider.dom(inputArea);

            const inputs = {
                nameAndSurname: $inputAreas.eq(0).val() ?? '',
                phone: $inputAreas.eq(1).val() ?? '',
                email: $inputAreas.eq(2).val() ?? '',
                gdpr: Insider.dom(`${ gdprSelector } input`).checked().exists() ?? false,
                couponValue: ''
            };

            /* OPT-167483 START */
            const { nameAndSurname, phone, gdpr, email } = inputs;
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            /* OPT-167483 END */

            Insider.dom(required).removeClass(requiredClass);

            if (!nameAndSurname) {
                $inputAreas.eq(0).addClass(requiredClass);
            }

            if (!phone) {
                $inputAreas.eq(1).addClass(requiredClass);
            }

            if (!gdpr) {
                Insider.dom(gdprSelector).addClass(requiredClass);
            }

            if (nameAndSurname && phone && gdpr && isValidEmail) { /* OPT-167483 */
                /* self.sendLeadCollection(inputs); OPT-163075 */
                self.startGame(inputs);
            }
        });

        Insider.eventManager.once(`click.card:flip:${ variationId }`, card, (event) => {
            Insider.dom(event.target).addClass(cardOpen);

            if (self.getUnmatchedCards().not(unmatched).length === 2) {
                Insider.dom(card).addClass(disabled);

                if (self.isOpenedCardsMatched()) {
                    matchCount++;

                    self.getUnmatchedCards().addClass(matched);
                } else {
                    self.getUnmatchedCards().addClass(unmatched);

                    setTimeout(() => {
                        self.getUnmatchedCards().removeClass(cardOpen).removeClass(unmatched);
                    }, 750);
                }

                setTimeout(() => {
                    Insider.dom(card).not(matched).removeClass(disabled);

                    if (matchCount === 3) {
                        self.gameWon();
                    }
                }, 1200);
            }
        });

        Insider.eventManager.once(`click.copy:coupon:${ variationId }`, copyCoupon, () => {
            navigator.clipboard.writeText(Insider.storage.localStorage.get(couponStorageName) ?? '');

            Insider.dom(copyCoupon).addClass(copiedCoupon);
        });
    };

    /* OPT-163075 START 
    self.sendLeadCollection = (inputs) => {
        const { nameAndSurnameId, phoneId, emailId, gdprId } = config.formData;
        const { nameAndSurname, phone, email, gdpr } = inputs;

        const partnerName = Insider.partner.name;

        const form_data = [
            {
                type: 'text',
                id: nameAndSurnameId,
                text: '',
                options: [
                    {
                        id: nameAndSurnameId,
                        text: nameAndSurname,
                        type: 'text',
                        inputType: 'none'
                    }
                ],
                questionId: nameAndSurnameId
            },
            {
                type: 'text',
                id: phoneId,
                text: '',
                options: [
                    {
                        id: phoneId,
                        text: phone,
                        type: 'text',
                        inputType: 'none'
                    }
                ],
                questionId: phoneId
            },
            {
                type: 'text',
                id: emailId,
                text: '',
                options: [
                    {
                        id: emailId,
                        text: email,
                        type: 'text',
                        inputType: 'none'
                    }
                ],
                questionId: emailId
            },
            {
                type: 'text',
                id: gdprId,
                text: '',
                options: [
                    {
                        id: gdprId,
                        text: gdpr.toString(),
                        type: 'text',
                        inputType: 'none'
                    }
                ],
                questionId: gdprId
            }
        ];

        const leadData = {
            is_frameless: true,
            form_data,
            uid: Insider.getUserId(),
            campaign_id: leadCollectionVariationId,
            source: window.location !== window.parent.location ? document.referrer : document.location.href,
            platform: Insider.browser.getPlatform(),
            coupon_action: {
                type: 'none',
                email: '',
                coupon_code: ''
            },
            partner_doie: false,
            personalization_idoie: false
        };

        if (phone) { /* OPT-163075 
            Insider.request.post({
                url: `https://carrier.useinsider.com/v2/form/save-questionnaire/${ partnerName }`,
                headers: {
                    'Content-Type': 'application/json',
                    'partner': partnerName
                },
                data: Insider.fns.stringify(leadData),
                parse: true,
                success: () => {
                    Insider.utils.opt.sendCustomGoal(currentBuilderId, 138, true); /* OPT-159520 

                    Insider.eventManager.dispatch('leadCollection:userData:sent', {
                        campaignId: leadData.campaign_id,
                        formData: leadData.form_data,
                        email: inputs.email,
                    });
                }, error: (xhr) => {
                    Insider.logger.log(`${ xhr }-${ variationId }`);
                },
            });
        }

    }; OPT-163075 END */

    self.startGame = (inputs) => {
        const { popup, table, card: cardClass, disabled, closeButton, cardOpen, gameDescription } = classes;
        const { opener, game, card } = selectors;
        const { cardImage, gameDescription: gameDescriptionData } = config;
        let cardHtml = '';

        self.generateNewCoupon(inputs);

        Insider.campaign.info.show(couponCampaignVariationId);
        Insider.campaign.webInfo.show(couponCampaignVariationId);

        Insider.fns.keys(cardImage).forEach((cardName, index) => {
            cardHtml +=
                `<div class="${ cardClass } ${ disabled } " card-index="${ index + 1 }">
                <img class="ins-${ cardName }-card" src="${ cardImage[cardName] }">
            </div>`;
        });

        const startGameHtml =
            `<div class="${ popup } ${ table }">
            <div class="${ closeButton }"></div>
            <div class="${ gameDescription }">${ gameDescriptionData }</div>
            ${ cardHtml + cardHtml }
        </div>`;

        Insider.dom(opener).fadeOut(300, () => {
            Insider.dom(opener).remove();

            Insider.dom(game).append(startGameHtml).fadeIn(300);

            const shuffleCallback = () => {
                Insider.dom(card).addClass(cardOpen);

                setTimeout(() => {
                    Insider.dom(card).toggleClass(cardOpen);
                    Insider.dom(card).toggleClass(disabled);
                }, 2000); /* OPT-161916 */
            };

            self.shuffleCards(() => {
                shuffleCallback();
            });
        });
    };

    self.generateNewCoupon = (inputs) => { /* OPT-163075 */
        let isCouponDefined = false;

        Insider.__external.leadCollectionInputs163075 = inputs; /* OPT-163075 */

        Insider.utils.opt.ajaxListener((url, response) => { /* OPT-161916 */
            if (Insider.fns.has(url, 'coupon/info')) {
                if (!isCouponDefined) {
                    setTimeout(() => {
                        /* OPT-161916 START */
                        const $couponElement = Insider.dom(selectors.coupon);
                        const activeCouponValue = (couponConfigByVariationId[couponCampaignVariationId] || {}).couponValue || '';

                        isCouponDefined = true;
                        activeCouponCode = Insider.storage.localStorage
                            .get(`sp-info-c-${ couponCampaignVariationId }`) ??
                            Insider.fns.parse(response ?? '{}').value ?? '';

                        if ($couponElement.exists()) {
                            $couponElement.text(activeCouponCode);
                        }

                        /* OPT-163075 START */
                        Insider.__external.leadCollectionInputs163075.couponValue = activeCouponValue;

                        self.sendCouponCodeToLeadCollection(Insider.__external.leadCollectionInputs163075);
                        /* OPT-163075 END */
                        /* OPT-161916 END */

                        Insider.storage.localStorage.set({
                            name: couponStorageName,
                            value: activeCouponCode, /* OPT-161916 */
                            expires: Insider.dateHelper.addDay(0.02)
                        });

                        /* ZEN-168420 START */
                        Insider.track('events', [{
                            event_name: 'voucher_hunt_success',
                            timestamp: `${ ((Insider.dateHelper.getISODateWithoutUTC() || '').split('.') || [])[0] || '' }Z`,
                            event_params: {
                                campaign_id: couponCampaignVariationId,
                                custom: {
                                    coupon_code: activeCouponCode, /* OPT-161916 */
                                    coupon_value: activeCouponValue
                                }
                            }
                        }]);

                        const updateAttributePayload = {
                            partner: 'fptshop',
                            source: 'email',
                            timestamp: Insider.dateHelper.now(),
                            lane: 0,
                            users: [{
                                insider_id: Insider.getUserId(),
                                attributes: {
                                    c_voucher_hunt_code: activeCouponCode, /* OPT-161916 */
                                    c_voucher_hunt_value: activeCouponValue
                                }
                            }]
                        };

                        Insider.request.post({
                            url: 'https://unification.useinsider.com/api/attribute/v1/update',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: JSON.stringify(updateAttributePayload),
                            success: () => {},
                            error: () => {},
                        });
                        /* ZEN-168420 END */

                    }, 2000);
                }
            }
        });
    };

    /* OPT-161916 START */
    /* OPT-163075 START */
    self.sendCouponCodeToLeadCollection = (inputs) => {
        const { nameAndSurnameId, phoneId, emailId, gdprId, couponId } = config.formData;
        const { nameAndSurname, phone, email, gdpr, couponValue } = inputs;
        const partnerName = Insider.partner.name;

        const form_data = [
            {
                type: 'text',
                id: nameAndSurnameId,
                text: '',
                options: [
                    {
                        id: nameAndSurnameId,
                        text: nameAndSurname,
                        type: 'text',
                        inputType: 'none'
                    }
                ],
                questionId: nameAndSurnameId
            },
            {
                type: 'text',
                id: phoneId,
                text: '',
                options: [
                    {
                        id: phoneId,
                        text: phone,
                        type: 'text',
                        inputType: 'none'
                    }
                ],
                questionId: phoneId
            },
            {
                type: 'text',
                id: emailId,
                text: '',
                options: [
                    {
                        id: emailId,
                        text: email,
                        type: 'text',
                        inputType: 'none'
                    }
                ],
                questionId: emailId
            },
            {
                type: 'text',
                id: gdprId,
                text: '',
                options: [
                    {
                        id: gdprId,
                        text: gdpr.toString(),
                        type: 'text',
                        inputType: 'none'
                    }
                ],
                questionId: gdprId
            },
            {
                type: 'text',
                id: couponId,
                text: '',
                options: [
                    {
                        id: couponId,
                        text: couponValue,
                        type: 'text',
                        inputType: 'none'
                    }
                ],
                questionId: couponId
            }
        ];
        /* OPT-163075 END */

        const leadData = {
            is_frameless: true,
            form_data,
            uid: Insider.getUserId(),
            campaign_id: leadCollectionVariationId,
            source: window.location !== window.parent.location ? document.referrer : document.location.href,
            platform: Insider.browser.getPlatform(),
            coupon_action: {
                type: 'none',
                email: '',
                coupon_code: ''
            },
            partner_doie: false,
            personalization_idoie: false
        };

        Insider.request.post({
            url: `https://carrier.useinsider.com/v2/form/save-questionnaire/${ partnerName }`,
            headers: {
                'Content-Type': 'application/json',
                'partner': partnerName
            },
            data: Insider.fns.stringify(leadData),
            parse: true,
            success: () => {
                /* OPT-163075 START */
                setTimeout(() => {
                    self.unifyUser(inputs);
                }, 2000);
                /* OPT-163075 END */
            },
            error: () => {
                Insider.logger.log(`Failed When Coupon Code Send -${ variationId }`);
            },
        });

    };
    /* OPT-161916 END */

    self.shuffleCards = (callback) => {
        const $table = Insider.dom(selectors.table);
        const tableChildren = $table.children();

        tableChildren.nodes.sort(() => 0.5 - Math.random());

        $table.html('');

        tableChildren.appendTo($table);

        callback();
    };

    self.getUnmatchedCards = () => {
        const { cardOpen, matched } = selectors;

        return Insider.dom(cardOpen).not(matched);
    };

    self.isOpenedCardsMatched = () => {
        const openedCards = self.getUnmatchedCards();

        return openedCards.first().attr('card-index') === openedCards.last().attr('card-index');
    };

    self.gameWon = () => {
        const { popup, closeButton, coupon, couponDescription, policyContainer,
            policy, opener, couponContainer, copyCoupon, couponTitle, couponCloseButton } = classes;

        /* OPT-161916 START */
        const { couponTitleImage, couponDescription: couponDescriptionText
        } = couponConfigByVariationId[couponCampaignVariationId] ?? {};
        /* OPT-161916 END */

        const { generalCloseButton, copyButtonText } = config;
        const { policyURL, policyRulesText, policyArrow } = config.opener;
        const { game, table } = selectors;

        const gameWonHtml =
            `<div class="${ popup } ${ opener }">
            <div class="${ closeButton }"></div>
            <img class="${ couponTitle }" src="${ couponTitleImage }">
            <div class="${ couponDescription }">${ couponDescriptionText }</div>
            <div class="${ policyContainer }">
                <a href="${ policyURL }" class="${ policy }" target="_blank">${ policyRulesText }</a>
                <img src="${ policyArrow }">
            </div>
            <div class="${ couponContainer }">
                <div class="${ copyCoupon }">${ copyButtonText } </div>
                <div class="${ coupon }">${ activeCouponCode }</div>
            </div>
            <img class="${ couponCloseButton }" src="${ generalCloseButton }">
        </div>`;

        Insider.dom(table).fadeOut(300, () => {
            Insider.dom(table).remove();

            Insider.dom(game).append(gameWonHtml).fadeIn(300);
        });

        /* OPT-159520 START */
        Insider.storage.session.set({
            name: gameDoneStorageName,
            value: true,
        });
        /* OPT-159520 END */
    };

    self.init();
};

true;