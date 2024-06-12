/* lead data */
const leadCollectionVariationID = 0;
const email = 'jhon@doe.com';
const customField = 'Hello';

const leadData = {
    form_data: [
        {
            type: 'text',
            id: 'questionId1',
            text: '',
            options: [
                {
                    id: 'questionId1',
                    text: customField,
                    type: 'text',
                    inputType: 'text',
                },
            ],
            questionId: 'questionId1',
            required_question: 'true',
        },

        {
            type: 'text',
            id: 'questionId2',
            text: '',
            options: [
                {
                    id: 'questionId2',
                    text: email,
                    type: 'text',
                    inputType: 'email',
                },
            ],
            questionId: 'questionId2',
            required_question: 'true',
        },

        {
            type: 'text',
            id: 'questionId3',
            text: '',
            options: [
                {
                    id: 'questionId3',
                    text: 'By submitting this form, you are giving consent for your e-mail to be used and disclosed.',
                    type: 'checkbox',
                    inputType: 'email-opt-in',
                },
            ],
            questionId: 'questionId3',
            required_question: 'true',
        }
    ],
    is_frameless: true,
    uid: Insider.getUserId(),
    campaign_id: leadCollectionVariationID,
    source: window.location !== window.parent.location ? document.referrer : document.location.href,
    coupon_action: {
        type: 'none',
        email,
        coupon_code: '',
    }
};

/* request */
Insider.request.post({
    url: 'https://carrier.useinsider.com/v2/form/save-questionnaire/partnerName',
    headers: {
        'Content-Type': 'application/json',
        'partner': 'partnerName',
    },
    parse: true,
    data: Insider.fns.stringify(leadData),
    success(xhr) {
        Insider.eventManager.dispatch('leadCollection:userData:sent', {
            campaignId: leadCollectionVariationID,
            formData: leadData.form_data,
            email,
        });
        Insider.logger.log(xhr.response);
    },
    error(xhr) {
        Insider.logger.log(xhr.response);
    },
});
