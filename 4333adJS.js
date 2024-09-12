// Helpers - start
function setCouponStatus(status) {
    var $couponButton = Insider.dom('.ins-element-copy-to-clipboard-button');
    var hasCoupon = status
        || '#{{Show Coupon Code}}' === 'block'
        || '#{{Coupon Code}}' === 'block'
        || '#{{Coupon}}' === 'true'
        || '#{{Coupon}}' === 'block'
        || $couponButton.closest('.ins-add-element-area').exists();

    $couponButton.attr('data-coupon-status', hasCoupon);
}
// Helpers - end
var enums = {
    wrapper: '.ins-preview-wrapper-' + camp.id,
    selectors: {
        spinButton: '.ins-spin-button',
        checkbox: ' .ins-checkbox-default',
        dynamicInput: ' .ins-dynamic-input',
        validation: '.ins-validation-error',
    }
};

var construct = function () {
    /* OPT-135093 START */
    Insider.campaign.webInfo.clearVisibleCampaignsByType('ON-PAGE');
    Insider.campaign.info.clearVisibleCampaignsByType('ON-PAGE');
    /* OPT-135093 END */

    setRightToLeftContent();
    setCouponStatus(true); // helper

    if (camp.id === 0) {
        setSelectableSlices();

        return;
    }

    Insider.__external.wheelOfFortuneConfig = {
        tour: 7,
        speed: 3,
    };

    clearRotation();
    checkCopyButton();
    setEvents();
};

var setSelectableSlices = function () {
    var sliceCount = Number('#{{Wheel Slice}}');
    var sliceCont = Insider.dom('.ins-inner-slice');

    for (var i = 0; i < sliceCount; i++) {
        sliceCont.eq(i).addClass('ins-selectable-element ins-element-wrap ins-element-sub-frame');
        Insider.dom('.ins-inner-slice-text', sliceCont).eq(i)
            .addClass('ins-selectable-element ins-element-wrap element-text');
    }
};

var clearRotation = function () {
    Insider.dom('.insWheelWrapper').attr('style', '');
    Insider.dom('.insWheelWrapper').addClass('wheel-clear-rotation');
};

var checkCopyButton = function () {
    if (typeof InsClipboard === 'undefined') {
        Insider.request.script({
            src: Insider.__external.EITRI_URL + 'clipboard.min.js',
            success: setCopyButton,
        });
    } else {
        setCopyButton();
    }
};

var setCopyButton = function () {
    Insider.eventManager.dispatch(
        'setCopyButton' + camp.id,
        '.ins-element-copy-to-clipboard-button'
    );
};

var triggerCoupon = function () {
    if (isCouponExists()) {
        return useCoupon();
    }

    return getCoupon();
};

var useCoupon = function () {
    var couponCode = isCouponExists()
        ? Insider.storage.get('sp-info-c-' + camp.id, 'localStorage', true)
        : '';

    if (couponCode) {
        var couponCont = Insider.dom(enums.wrapper + ' .ins-copy-to-clipboard');

        couponCont.html(couponCont.html().replace('@COUPONCODE', couponCode));
        Insider.dom(enums.wrapper + ' .ins-element-copy-to-clipboard-button').attr('data-clipboard-text', couponCode);
        
        /* ZEN-121176 START */
        setTimeout(function() {
            var userId = Insider.getUserId();
            var time = Insider.dateHelper.now();
            var locale = Insider.systemRules.call('getLocale');
            var payLoad = {
                event: 'user',
                custom_attributes: {
                    coupon_code: couponCode
                }
            };
            var defaultPayload = {
                version: '1.0',
                partner_name: Insider.partner.name,
                user_id: userId,
                date: time,
                locale: locale,
                event: payLoad.event,
                event_type: payLoad.typeEvent,
                attributes: payLoad.data
            };
            
            var data = Insider.fns.assign(defaultPayload, payLoad);
            
            Insider.request.post({
                url: 'https://hit.api.useinsider.com/hit',
                type: 'POST',
                data: JSON.stringify(data)
            });
            
            Insider.track('events', [{
                event_name: 'lead_submitted',
                timestamp: (((Insider.dateHelper.getISODateWithoutUTC() || '').split('.') || [])[0] || '') + 'Z',
                event_params: {
                    campaign_id: camp.id,
                    custom: {
                        coupon_code: couponCode
                    }
                }
            }]);
        }, 1500);
        /* ZEN-121176 END */
    }
};

var getCoupon = function () {
    Insider.eventManager.dispatch('getCoupon' + camp.id, useCoupon);
};

var setEvents = function () {
    Insider.eventManager.on('insValidationSuccess' + camp.id, triggerCoupon);

    Insider.eventManager
        .off('click.insCouponCopyToClipboard', enums.wrapper + ' .ins-element-copy-to-clipboard-button')
        .on('click.insCouponCopyToClipboard', enums.wrapper + ' .ins-element-copy-to-clipboard-button', function () {
            if (camp.id !== 0) {
                Insider.dom('.ins-editable', this).text('Đã sao chép');
                Insider.dom(this).closest('.ins-coupon-button').attr('style', 'background-color: #515252 !important;');
            }
        });

    Insider.eventManager.once('click.spinButton:' + camp.id, enums.selectors.spinButton, function () {
        if (!Insider.dom(enums.selectors.validation).exists()) {
            Insider.dom(enums.wrapper + enums.selectors.checkbox + ', ' +
                enums.wrapper + enums.selectors.dynamicInput).attr('disabled', 'disabled');
        }
    });
};

var isCouponExists = function () {
    return Insider.storage.get('sp-info-c-' + camp.id, 'localStorage', true) !== null;
};

var rightToLeftLangList = [
    'ar_AE',
    'ar_AR',
    'ar_EG',
    'ar_ME',
    'ar_SA',
    'fa_FA',
    'ur_UR',
];

var setRightToLeftContent = function () {
    if (rightToLeftLangList.indexOf(Insider.systemRules.call('getLang')) > -1) {
        var wrapper = '.ins-preview-wrapper-' + camp.id;

        Insider.dom(wrapper).attr('dir', 'ltr');
        Insider.dom(wrapper).find('.ins-slider').attr('dir', 'rtl');
        Insider.dom(wrapper).find('.ins-adaptive-question').attr('dir', 'ltr');
    }
};

construct();

Insider.eventManager.on('framelessInited' + camp.id, function () {
    construct();
});

/* OPT-130531 START */
var sideCouponBuilderId = 2994;
var sideCouponVariationId = Number(Insider.campaign.userSegment.getActiveVariationByBuilderId(sideCouponBuilderId));
var mainWrapper = '.ins-preview-wrapper-' + camp.id;
var closeButtonSelector = '.ins-preview-wrapper-' + camp.id + ' .ins-element-close-button';
var overlaySelector = '[data-camp-id="' + camp.id + '"]#ins-frameless-overlay';

Insider.fns.onElementLoaded(mainWrapper, function () {
    Insider.eventManager.off('click.close' + camp.id, closeButtonSelector);

    Insider.eventManager.once('click.close:wheel:of:fortune:' + camp.id, closeButtonSelector,
        function (event) {
            event.preventDefault();

            Insider.dom(mainWrapper + ', ' + overlaySelector).remove();

            Insider.campaign.info.storeCloseLog(camp.id);

            if (Insider.storage.localStorage.get('sp-info-c-' + camp.id)) {
                Insider.campaign.info.clearVisibleCampaignsByType('ON-PAGE');
                Insider.campaign.info.show(sideCouponVariationId);
            }
        });
}).listen();
/* OPT-130531 END */

/* ZEN-139129 START */
Insider.eventManager.on(`insValidationSuccess${ camp.id }`, () => {
    const couponValue = '50K mua Online sản phẩm Samsung đơn từ 1.000.000Đ';
    const mainWrapper = `.ins-preview-wrapper-${ camp.id }`;
    const userName = Insider.dom(`${ mainWrapper } input[input-type="na"]`).val() || '';
    let userPhone = Insider.dom(`${ mainWrapper } input[type="tel"]`).val() || '';
    const userEmail = Insider.dom(`${ mainWrapper } input[type="email"]`).val() || '';
    const countryCode = `+${Insider.dom('#ins-phone-country-code').val().match(/\(\+(\d+)\)/)[1]}`;

    window.insider_object = window.insider_object || {};
    window.insider_object.user = window.insider_object.user || {};
    window.insider_object.user.gdpr_optin = true;
    
    if (userPhone !== '') {
        if (userPhone[0] === '0') {
            userPhone = userPhone.replace('0', countryCode);
        } else {
            userPhone = `${ countryCode }${ userPhone }`;
        }
        window.insider_object.user.phone_number = userPhone;
        window.insider_object.user.sms_optin = true;
    }

    /* if (userPhone !== '') {
        if (userPhone[0] === '0') {
            userPhone = userPhone.replace('0', '+84');
        } else if (userPhone.slice(0, 2) === '84') {
            userPhone = `+${ userPhone }`;
        } else {
            userPhone = `+84${ userPhone }`;
        }
        window.insider_object.user.phone_number = userPhone;
        window.insider_object.user.sms_optin = true;
    } */

    if (userEmail !== '') {
        window.insider_object.user.email = userEmail;
        window.insider_object.user.email_optin = true;
    }

    if (userName !== '') {
        window.insider_object.user.name = userName;
    }

    window.insider_object.user.custom = window.insider_object.user.custom || {};
    window.insider_object.user.custom.wheel_coupon_value = couponValue;
    
    if (!window.insWheelDataCollect) {
        window.insWheelDataCollect = true;
        Insider.initializeHitAPI();
    }

    setTimeout(() => {
        Insider.track('events', [{
            event_name: 'wheel_coupon_received',
            timestamp: `${ ((Insider.dateHelper.getISODateWithoutUTC() || '').split('.') || [])[0] || '' }Z`,
            event_params: {
                campaign_id: camp.id,
                custom: {
                    coupon_code: String(Insider.storage.get(`sp-info-c-${ camp.id }`, 'localStorage', true) || ''),
                    coupon_value: couponValue
                }
            }
        }]);
        
        const userId = Insider.getUserId();
        const time = Insider.dateHelper.now();
        const locale = Insider.systemRules.call('getLocale');
        const payLoad = {
            event: 'user',
            custom_attributes: {
                wheel_coupon_code: String(Insider.storage.get(`sp-info-c-${ camp.id }`, 'localStorage', true) || '')
            }
        };
        const defaultPayload = {
            version: '1.0',
            partner_name: Insider.partner.name,
            user_id: userId,
            date: time,
            locale,
            event: payLoad.event,
            event_type: payLoad.typeEvent,
            attributes: payLoad.data
        };
        
        const data = Insider.fns.assign(defaultPayload, payLoad);
        
        Insider.request.post({
            url: 'https://hit.api.useinsider.com/hit',
            type: 'POST',
            data: JSON.stringify(data)
        });
    }, 3500);
    
    Insider.dom('[class*=ins-custom-close-button]').remove();
});
/* ZEN-139129 END */

/* ZEN-164038 START */
const campWrapper = `.ins-preview-wrapper-${ camp.id }`;

Insider.eventManager.once(`input.ins:phone:change:${ camp.id }`, `${ campWrapper } input[type="tel"]`, () => {
    const $phoneElement = Insider.dom(`${ campWrapper } input[type="tel"]`);
    const phoneElementValue = $phoneElement.val();

    if (phoneElementValue[0] === '0' && phoneElementValue.length > 10) {
        $phoneElement.val(phoneElementValue.slice(0, 10));
    }
    
    if (phoneElementValue[0] !== '0' && phoneElementValue.length > 9) {
        $phoneElement.val(phoneElementValue.slice(0, 9));
    }
});
/* ZEN-164038 END */














































