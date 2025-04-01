/* OPT-132873 START */
((self) => {
    'use strict';

    const builderId = 364;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    /* OPT-145926 START */
    const inlineEurekaBuilderId = 514;
    const inlineEurekaVariationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(inlineEurekaBuilderId);
    let removeCount = 0;
    /* OPT-145926 END */

    const selectors = {
        insiderSearch: '#insider-search-input',
        searchContainer: '#SearhBoxBorder',
        /* OPT-144810 START */
        noResult: '.ProductList .NotFound',
        searchInputBanner: '.ins-relative-position-c138',
        headerInput: '#UserMenus [action="/tr/p/Cat/NewSearch"] input',
        secondInput: '.SearchArea [type="search"]',
        searchInput: '.hidden-xs.hidden-sm.SearchBox > form > input'
        /* OPT-144810 END */
    };

    self.init = () => {
        if (variationId && !Insider.campaign.isControlGroup(variationId)) {
            self.setEvents();

            Insider.dom(selectors.noResult).exists() && self.setEurekaAttributes(); /* OPT-144810 */
        }
    };

    self.setEvents = () => {
        const { searchContainer, insiderSearch, searchInput } = selectors;

        Insider.eventManager.once(`click.track:eureka:input:${ variationId }`, searchContainer, () => {
            Insider.fns.onElementLoaded(insiderSearch, () => {
                setTimeout(() => {
                    Insider.dom(insiderSearch).click();
                    Insider.dom(searchInput).focus();
                }, 500);

                !!inlineEurekaVariationId && self.adjustNewSearchPage();
            }).listen();

        });

        /* OPT-145926  START */
        if (!!inlineEurekaVariationId && Insider.fns.hasParameter('NewSearch')) {
            Insider.eventManager.once(`click.search:input:${ variationId }`, insiderSearch, () => {
                !!inlineEurekaVariationId && self.adjustNewSearchPage();
            });
        }
    };

    self.adjustNewSearchPage = () => {
        const inlineEurekaSelectors = {
            inlineEurekaJs: `.ins-camp-frameless-js-${ inlineEurekaVariationId }`,
            inlineEurekaWrapper: `.ins-preview-wrapper-${ inlineEurekaVariationId }`,
            inlineEurekaStyle: `.ins-outer-stylesheet-${ inlineEurekaVariationId }`,
        };
        const { inlineEurekaJs, inlineEurekaStyle, inlineEurekaWrapper } = inlineEurekaSelectors;

        if (removeCount > 0) {
            setTimeout(() => {
                Insider.campaign.info.remove(inlineEurekaVariationId);

                removeCount++;
            }, 500);
        }

        Insider.dom(`${ inlineEurekaJs }, ${ inlineEurekaWrapper }, ${ inlineEurekaStyle }`).remove();
    };
    /* OPT-145926  END */

    /* OPT-144810 START */
    self.setEurekaAttributes = () => {
        const { secondInput, headerInput } = selectors;
        const eurekaClasses = 'insider-search ins-edit-mode-active';

        Insider.fns.onElementLoaded(secondInput, (element) => {
            Insider.dom(element).attr('id', '').removeClass(eurekaClasses);
            Insider.dom(headerInput).addClass(eurekaClasses);
        }).listen();
    };
    /* OPT-144810 END */

    self.init();
})({});

true;
/* OPT-132873 END */
