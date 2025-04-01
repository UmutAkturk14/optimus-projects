/* OPT-146706 START */
((self) => {
    'use strict';

    const builderId = Insider.browser.isDesktop() ? 2610 : 2611;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        hide: `ins-custom-hide-${ variationId }`,
        align: `ins-align-chatbot-${ variationId }`, /* OPT-150644 */
        goal: `sp-custom-${ variationId }-1`
    };

    const selectors = {
        partnerChatbot: '.css-uxl7bn-wrapper',
        partnerChatbotButton: '.css-8mdmic-button',
        partnerWhatsappButton: '.css-1sj3b23-whatsapp' /* OPT-150644 */
    };

    const requestData = {
        partnerName: Insider.partner.name,
        lists: {
            productList_OPT146706: [Insider.systemRules.call('getCurrentProduct').id]
        }
    };

    self.init = () => {

        if (variationId) {
            self.checkProductId();
        }
    };

    self.checkProductId = () => {
        Insider.request.post({
            url: 'https://cronus.useinsider.com/api/inone/product-list/check',
            data: requestData,
            success: (response) => {
                if (response.success && response.data['productList_OPT146706'].length) {
                    self.buildCampaign();
                }
            },
            error(xhr) {
                Insider.logger.log(xhr.response);
            },
            parse: true
        });
    };

    self.buildCampaign = () => {
        if (!Insider.campaign.isControlGroup(variationId)) {
            sessionStorage.setItem('concierge_chat_bot_testing', true);
            self.setGoalEvents();
            self.reset();
            self.buildCSS();
            /* OPT-150644 START */
            self.removeWhatsappButton();
            self.alignChatbotButton();
            /* OPT-150644 END */
        }

        Insider.campaign.custom.show(variationId);
    };

    self.setGoalEvents = () => {
        const { partnerChatbot, partnerChatbotButton } = selectors;

        Insider.dom(partnerChatbot).addClass(classes.goal);

        Insider.eventManager.once(`pointerup.click:chatbot:${ variationId }`, partnerChatbotButton, (event) => {
            if (event.isPrimary) {
                Insider.dom(partnerChatbot).click();
            }
        });
    };

    self.reset = () => {
        const { style, goal, hide, align } = classes;

        Insider.dom(selectors.partnerChatbot).removeClass(`${ goal }, ${ hide }`);
        Insider.dom(selectors.partnerWhatsappButton).removeClass(`${ align }`); /* OPT-150644 */

        Insider.dom(`.${ style }`).remove();
    };

    self.buildCSS = () => {
        const { hide, align, style } = classes; /* OPT-150644 */

        const customStyle =
    `.${ hide } {
        display: none !important;
    }
    /* OPT-150644 START */
    .${ align } {
        left: 80vw;
    }`;
        /* OPT-150644 END */

        Insider.dom('<style>').addClass(style).html(customStyle).appendTo('head');
    };

    /* OPT-150644 START */
    self.removeWhatsappButton = () => Insider.dom(selectors.partnerWhatsappButton)
        .addClass(classes.hide);

    self.alignChatbotButton = () => Insider.dom(selectors.partnerChatbot).addClass(classes.align);
    /* OPT-150644 END */

    self.init();
})({});
/* OPT-146706 END */
