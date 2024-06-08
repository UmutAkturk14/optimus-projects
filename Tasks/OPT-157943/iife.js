/* OPT-157943 START */
((self) => {
    'use strict';

    const builderId = 3042;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        searchBarWrapperStyle: `ins-search-bar-wrapper-${ variationId }`,
        searchBarInputStyle: `ins-search-bar-input-${ variationId }`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        dynamicInput: '.ins-dynamic-input',
        partnerSearchBarInput: '#insider-search-input',
        partnerSearchBarInputWrapper: '.search-container.clearfix'

    });

    self.init = () => {
        if (variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.buildCSS();
                self.addClass();
                self.setEvents();
            }
        }

        return true;
    };

    self.reset = () => {
        const { searchBarWrapperStyle, searchBarInputStyle } = classes;
        const { partnerSearchBarInputWrapper, partnerSearchBarInput, style } = selectors;

        Insider.dom(style).remove();
        Insider.dom(partnerSearchBarInputWrapper).removeClass(searchBarWrapperStyle);
        Insider.dom(partnerSearchBarInput).removeClass(searchBarInputStyle);
    };

    self.buildCSS = () => {
        const { searchBarWrapperStyle, searchBarInputStyle } = selectors;

        const customStyle =
        `${ searchBarInputStyle } {
            width: 100%;
        }
        ${ searchBarWrapperStyle } {
            display: flex;
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.addClass = () => {
        const { partnerSearchBarInputWrapper, partnerSearchBarInput } = selectors;
        const { searchBarWrapperStyle, searchBarInputStyle } = classes;

        Insider.dom(partnerSearchBarInputWrapper).addClass(searchBarWrapperStyle);
        Insider.dom(partnerSearchBarInput).addClass(searchBarInputStyle);
    };

    self.setEvents = () => {
        Insider.eventManager.once(`focusin.set:searchbar:focus:${ variationId }`, document, (event) => {
            const { dynamicInput, partnerSearchBarInput } = selectors;

            const $firstDynamicInput = Insider.dom(dynamicInput).nodes?.[0] ?? {};
            const $searchBarInput = Insider.dom(partnerSearchBarInput);

            if (event.target === $firstDynamicInput && $searchBarInput) {
                $searchBarInput.focus();
            }
        });
    };

    return self.init();
})({});
/* OPT-157943 END */
