/* OPT-145790 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 413 : 414;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const buttonText = 'Découvrir';

    const classes = {
        textChanged: `ins-custom-text-changed-${ variationId }`,
        customStyle: `ins-custom-style-${ variationId }`,
        join: `sp-custom-${ variationId }-1`,
        hide: `ins-custom-hide-${ variationId }`
    };

    const urlList = [
        'https://www.lacompagniedulit.com/accessoires.html',
        'https://www.lacompagniedulit.com/oreiller/',
        'https://www.lacompagniedulit.com/oreiller.html',
        'https://www.lacompagniedulit.com/couette.html'
    ];

    /* OPT-148046 START */
    const excludedUrlList = [
        'https://www.lacompagniedulit.com/matelas.html',
        'https://www.lacompagniedulit.com/sommier.html',
        'https://www.lacompagniedulit.com/ensemble-literie.html'
    ];
    /* OPT-148046 END */

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        discoverButton: '.product-ctn-btn',
        buttonWrapper: '.product-ctn-footer',
        flag: '.product-ctn-flag span',
        productName: '.product-ctn-name',
        productCard: '.product-ctn-inner' /* OPT-147666 */
    });

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.buildCSS();
                self.hideButtons();
                self.changeButtonTexts();
                self.setEvents();
            }

            return true;
        }
    };

    self.buildCSS = () => {
        const { textChanged, hide } = selectors;

        const style =
      `${ textChanged } {
          cursor: pointer;
      }
      ${ hide } {
          visibility: hidden !important;
      }`;

        Insider.dom('<style>').addClass(classes.customStyle).html(style).appendTo('body');
    };

    self.hideButtons = () => {
        const { discoverButton, buttonWrapper, flag } = selectors;

        if (self.checkButtonHidingPages()) {
            Insider.dom(discoverButton).accessNodes((element) => {
                if (Insider.fns.has(Insider.dom(element).text(), buttonText)) {
                    Insider.dom(element).parents(buttonWrapper).find(flag).addClass(classes.hide);
                }
            });
        }
    };

    self.checkButtonHidingPages = () => urlList.some(() => Insider.fns.has(urlList, window.location.href));

    self.changeButtonTexts = () => {
        const { textChanged, join } = classes;

        if (!self.checkButtonHidingPages()) {
            /* OPT-147666 START */
            const $allFlags = Insider.dom(selectors.flag).nodes;
            const $targetFlags = Insider.systemRules.call('isOnMainPage') ?
                $allFlags.slice(0, $allFlags.length - 8) : $allFlags;

            Insider.dom($targetFlags).accessNodes((element) => {
                Insider.dom(element).addClass(`${ textChanged } ${ join }`);

                /* OPT-148046 START */
                if (!Insider.fns.has(excludedUrlList, window.location.href)) {
                    Insider.dom(element).text(buttonText);
                }
                /* OPT-148046 END */
            });
            /* OPT-147666 END */
        }
    };

    self.setEvents = () => {
        const { textChanged, productName, productCard } = selectors;

        Insider.eventManager.once(`click.discover:button:${ variationId }`, textChanged, (event) => {
            self.sendCustomGoal(123);

            setTimeout(() => { /* OPT-150635 */
                window.location.href = Insider.dom(event.target).closest(productCard).find(productName).attr('href'); /* OPT-147666 */
            }, 200); /* OPT-150635 */
        });
    };

    self.sendCustomGoal = (goalId) => {
        Insider.utils.opt.sendCustomGoal(builderId, goalId, true);
    };

    return self.init();
})({});
/* OPT-145790 END */
