/* OPT-146884 START */
((self) => {
    'use strict';

    const builderId = 3139;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const partnerScrollButton = '.scroll-up-button';

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        scrollButton: `ins-custom-scroll-style-${ variationId }`,
    };

    self.init = () => {
        if (variationId && !Insider.campaign.isControlGroup(variationId)) {
            self.reset();

            if (Insider.systemRules.call('isOnMainPage') || Insider.systemRules.call('isOnCategoryPage')) {
                console.log('Showing the campaign');
                self.buildCSS();
                self.addClass();
            }

            return true;
        }
    };

    self.reset = () => {
        const { style, scrollButton } = classes;

        Insider.dom(`.${ style }`).remove();
        Insider.dom(partnerScrollButton).removeClass(scrollButton);
    };

    self.buildCSS = () => {
        const customStyle =
        `${ partnerScrollButton } {
            width: 62px;
            height: 62px;
            padding: 0px !important;
            border-radius: 0;
            bottom: 18px;
            border: 1px solid;
            border-color: #1A1A1A;
            text-align: center;
            box-shadow: 0 8px 16px 0px rgba(68, 68, 68, 0.15);
            background-color: #ffffff;
            z-index: 2147483647;
        }
        ${ partnerScrollButton }:hover {
          background: #FFFFFF !important;
        }
        ${ partnerScrollButton } svg {
          margin-top: 20px;
          color: #1A1A1A;
          width: 20px;
          height: 20px;
          opacity: 80%;
        }
        @media (min-width: 48em) {
          ${ partnerScrollButton } svg {
              margin-top: -20% !important;
              margin-right: 6px;
          }
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.addClass = () => {
        const { scrollButton } = classes;

        Insider.fns.onElementLoaded(`${ partnerScrollButton }:visible:has(:not(.${ scrollButton }))`, () => {
            Insider.dom(`${ partnerScrollButton }:visible`).addClass(scrollButton);

            if (Insider.systemRules.call('isOnMainPage') || Insider.systemRules.call('isOnCategoryPage')) {
                self.addClass();
            } else {
                self.reset();
            }
        }).listen();
    };

    /* OPT-161796 START */
    self.listenScroll = () => {
        const eventName = `scroll.change:height:${ variationId }`;

        Insider.eventManager.once(eventName, window, Insider.fns.throttle(() => {
            if (Insider.dom(window).scrollTop() >= 500) {

                if (Insider.systemRules.call('getTotalCartAmount') > 1) {

                    Insider.campaign.info.show(variationId);

                    Insider.eventManager.off(eventName, window);
                }
            }
        }, 500));
    };
    /* OPT-161796 END */

    self.init();
})({});

true;
/* OPT-146884 END */
