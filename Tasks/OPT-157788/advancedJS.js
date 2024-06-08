const COMMON = {
    eurekaMainWrapperSelector: `.ins-preview-wrapper-${ camp.id } .ins-eureka-main-wrapper`,
};
const templateConfig = {
    CONFIG: {
        locale: Insider.systemRules.call('getLocale'),
        isMobile: true,
        campaign: camp,
        maxResultCount: 6,
        isOnAPISide: camp.id !== 0,
        isOnPreviewTab: camp.id === 0 && typeof window.ActionBuilder === 'undefined',
        isOnDesignTab: camp.id === 0 && typeof window.ActionBuilder !== 'undefined',
        templateMargin: 15,
        searchResultPadding: 48,
        noResultImageHeight: 208,
        paginationHeight: 32,
        maxVisibleRowCount: 2,
        numberOfRows: 3,
        numberOfColumns: 2,
        productWidth: Number('#{{Product Area.Width}}') || 150,
        productHeight: Number('#{{Product Area.Height}}') || 290,
        templateAlignment: '#{{Template Alignment}}',
        resultPageSectionTitle: '@SuccessHeader',
        defaultPageSectionTitle: '@RecommendationHeader',
        sidebarWidth: Number('#{{Sidebar Width}}'),
        titleHeight: 24,
        appendProduct: false,
        isProductLoading: false,
        defaultStateConfig: {
            isRequestSent: false,
            products: [],
            categoryNames: ['Facet 1', 'Facet 2', 'Facet 3', 'Facet 4', 'Facet 5'],
            brandNames: ['Facet 1', 'Facet 2', 'Facet 3', 'Facet 4', 'Facet 5'],
            partnerResources: {},
        },
        appliedFiltersMap: {},
        sortingType: 'Relevancy',
        currentPage: 1,
        rowGap: 8,
        columnGap: 16,
        templateCornerOffset: 10,
        isPaginationActive: false,
        isLoadMoreActive: true,
        scrollableAggregations: ['category', 'brand_name'],
        isGAEnhanceIntegrationActive: '#{{GA Enhanced Integration}}' === 'true',
        badgeStatus: '#{{Discount Badge}}' === 'block',
        isDiscountTypePercentage: '#{{Discount Type}}' !== 'percentage',
        clonedDefaultFacetList: {},
        scrollableFacets: {},
        isDictionaryLoaded: false,
        appliedFiltersMapCache: {},
        aggregations: [],
        isSearchAsYouTypeActive: '#{{Search As You Type}}' === 'true',
    },
    CLASSES: {
        active: 'active',
        show: 'show',
        bold: 'ins-bold',
        hide: 'ins-eureka-hide',
        disabled: 'ins-disabled',
        disabledSeparator: 'ins-disabled-seperator',
        activeSliderPage: 'ins-active-slide',
        invalidInput: 'ins-invalid-input',
        caretDown: 'fa-caret-down',
        caretUp: 'fa-caret-up',
        angleLeft: 'fa fa-angle-left',
        invisible: 'invisible',
        scrollEnabled: 'ins-scroll-enabled',
        displayNone: 'ins-display-none',
        facetShowMoreClick: 'ins-facet-show-more-click',
        searchInput: 'insider-search ins-edit-mode-active',
        lockScreen: 'ins-lock-screen',
        styleSheet: `ins-eureka-style-sheet-${ camp.id }`,
        iconOverlay: 'ins-icon-overlay',
        head: 'head',
        transparentOverlay: 'ins-transparent-overlay',
        usedFacet: 'ins-used-facet',
        clonedFacet: 'ins-cloned-facet',
    },
    ELEMENTS: {
        closeTemplateButton: '.ins-back-button-wrapper',
        searchButton: '.ins-search-button-wrapper',
        scrollableArea: '.ins-scrollable-area',
        scrollableResults: '#ins-scrollable-results',
        clearInputButton: '.ins-clear-input',
        filterButton: '.ins-filter-button',
        sortingButton: '.ins-sort-button',
        pageCloseButton: '.ins-page-close-button-wrapper',
        filterPage: `${ COMMON.eurekaMainWrapperSelector } #ins-slide-page-3`,
        sortingPage: `${ COMMON.eurekaMainWrapperSelector } #ins-slide-page-4`,
        applyButton: '.ins-apply-button',
        eurekaMainWrapperSelector: COMMON.eurekaMainWrapperSelector,
        previewWrapper: `.ins-preview-wrapper-${ camp.id }`,
        contentWrapper: `.ins-content-wrapper-${ camp.id }`,
        notificationContent: `.ins-notification-content-${ camp.id }`,
        searchResultWrapper: `${ COMMON.eurekaMainWrapperSelector } .ins-search-result-wrapper`,
        resultWrapper: '.ins-search-result-wrapper',
        sidebarFilter: '.ins-sidebar-filters-wrapper',
        noResultImage: '.no-result-container',
        firstItemBox: '.ins-eureka-box-item:first',
        itemBox: '.ins-eureka-box-item',
        title: '.section-title-container',
        eurekaBody: '.ins-eureka-body',
        addToCartButton: '.ins-add-to-cart-wrapper',
        sectionTitle: '.ins-eureka-section-title',
        percentageIcon: '.ins-percentage-icon',
        productBox: '.ins-product-box',
        discountBadge: '.ins-discount-badge',
        imageBox: '.ins-image-box',
        upArrow: '.fa-caret-up',
        productName: '.ins-product-name-text',
        productCategory: '.ins-product-category-text',
        productPrice: '.ins-product-price',
        productOriginalPrice: '.ins-product-discount',
        discountBadgeContainer: '.ins-discount-badge-container',
        discountPercentage: '.ins-discount-percentage',
        adjustProductHeight: 'ins-adjust-product-height',
        lockScreen: 'ins-lock-screen',
        loadingContainer: `${ COMMON.eurekaMainWrapperSelector } .ins-loading-container`,
        body: `${ COMMON.eurekaMainWrapperSelector } .ins-eureka-body`,
        maxRecommendationResultCount: 48,
        discountType: '#{{Discount Type}}',
        pageCount: 'ins-page-count',
        eurekaSearchInputId: 'insider-search-input',
        eurekaSearchInput: '.insider-search.ins-edit-mode-active',
        selectedElement: (camp.locationConfig.relativePosition || {}).element || '#template-container',
        searchInput: '.insider-search',
        dynamicSearchInput: '.ins-dynamic-input',
        sidebarWrapper: `${ COMMON.eurekaMainWrapperSelector } .ins-sidebar-filters-wrapper`,
        elementContent: '.ins-element-content',
        editableElement: '.ins-editable',
        input: 'input',
        span: 'span',
        active: '.active',
        facetItem: '.ins-facet-item',
        collapseButton: '.ins-facet-collapse-button',
        clearAllButton: '.ins-facet-clear-all-button',
        listButton: '.ins-facet-item-list',
        checkboxButton: '.ins-facet-item-checkbox-row',
        rangeButton: '.ins-facet-item-range-row',
        rangeGroup: '.ins-facet-item-range-groups',
        rangeCheckbox: '#ins-range-checkbox',
        toggleButton: '.ins-toggle-action',
        toggleRow: '.ins-toggle-row',
        toggleCheckbox: '#ins-toggle-checkbox',
        sliderNextButton: '.ins-slider-input-container .ins-slider-next-button-container',
        inputPrefix: '.ins-input-prefix',
        ratingButton: '.ins-rating-row',
        sortButton: '.ins-sort-button',
        sortButtonText: '.ins-sort-button .ins-element-content',
        itemsPerPageButton: '.ins-items-per-page .ins-dropdown-container .ins-dropdown-button',
        dropdownButton: '.ins-dropdown-button',
        sortingDropdownWrapper: '.ins-sorting-wrapper',
        itemsPerPageDropdownWrapper: '.ins-items-per-page .ins-dropdown-wrapper',
        dropdownItem: '.ins-sorting-item',
        dropdownText: '.ins-dropdown-text',
        sortDropdownItem: '.ins-sorting-item',
        itemsPerPageDropdownItem: '.ins-items-per-page .ins-dropdown-item',
        facetSearch: '.ins-facet-search-input',
        appliedFiltersContainer: '.ins-applied-filters-container',
        appliedFilterChip: '.ins-facet-checkbox-chip',
        facetDescription: '.ins-facet-item-description',
        facetCounter: '.ins-counter',
        counterWrapper: '.ins-wrap-counter',
        appliedFilterClose: '.ins-facet-clear-cross',
        showMoreButton: '.ins-facet-show-more-button',
        showMoreButtonContainer: '.ins-facet-show-more-button-container',
        pageButton: '.ins-page-button',
        pageNavButton: '.ins-page-nav-button',
        paginationSeparator: '.ins-pagination-separator',
        paginationDots: '.ins-three-dots',
        listGroups: '.ins-facet-item-list-groups',
        dropdown: '.ins-dropdown',
        dropdownContent: '.ins-dropdown-wrapper',
        checkboxGroups: '.ins-facet-item-checkbox-groups',
        checkboxItemWrapper: 'ins-facet-item-checkbox-row-wrapper',
        checkboxInput: '#ins-facet-checkbox',
        facetSlider: '.ins-facet-item-slider-container',
        facetRating: '.ins-facet-item-rating-container',
        facetItemTitle: '.ins-facet-item-label-text',
        facetLabelWrapper: '.ins-facet-item-label-wrapper',
        paginationContainer: '.ins-pagination-container',
        pagination: '.ins-pagination',
        redirectionText: '.ins-eureka-redirection-text',
        redirectionWrapper: '.section-redirection-wrapper',
        itemsPerPage: '.ins-items-per-page',
        facetsList: '.ins-facets-list',
        facetItemLabel: '.ins-facet-item-label',
        appliedFilterGroup: '.ins-applied-filter-group',
        sliderElementMin: '.ins-draggable-slider .ins-slider-thumb-min',
        sliderElementMax: '.ins-draggable-slider .ins-slider-thumb-max',
        sliderProgress: '.ins-draggable-slider .ins-sliders-progress',
        draggableSlider: '.ins-draggable-slider',
        sliderInputContainer: '.ins-slider-input-container',
        sliderInput: '.ins-slider-input',
        noResultTextContainer: '.no-result-text-container',
        searchbarContainer: '.ins-facet-search-container',
        productLoader: '.ins-product-loader',
        ratingRadio: '#ins-rating-radio',
        appliedFilterName: '.applied-filter-name',
        appliedFilterValues: '.applied-filter-values',
        scrollEnabled: '.ins-scroll-enabled',
        defaultListButton: '#ins-slide-page-0 .ins-facet-item-list',
        resultListButton: '#ins-slide-page-3 .ins-facet-item-list',
        noResultListButton: '#ins-slide-page-2 .ins-facet-item-list',
        sliderPages: `${ COMMON.eurekaMainWrapperSelector } .ins-slider-page`,
        defaultPage: `${ COMMON.eurekaMainWrapperSelector } #ins-slide-page-0`,
        resultPage: `${ COMMON.eurekaMainWrapperSelector } #ins-slide-page-1`,
        noResultPage: `${ COMMON.eurekaMainWrapperSelector } #ins-slide-page-2`,
        activeState: `${ COMMON.eurekaMainWrapperSelector } .ins-slider-page.ins-active-slide`,
    },
    ATTRIBUTES: {
        productId: 'ins-product-id',
        product: 'ins-product',
    },
    EVENTS: {
        keydown: `keydown.ins:eureka:search:bar:${ camp.id }`,
        searchInputClick: `ins:eureka:search:input:${ camp.id }`,
        showMoreClick: `ins:eureka:show:more:button:${ camp.id }`,
        addToCartClick: `ins:eureka:add:to:cart:${ camp.id }`,
        collapseClick: `ins:eureka:collapse:button:${ camp.id }`,
        clearAllClick: `ins:eureka:clearAll:button:${ camp.id }`,
        listClick: `ins:eureka:list:click:${ camp.id }`,
        defaultListClick: `ins:eureka:default:list:click:${ camp.id }`,
        resultListClick: `ins:eureka:result:list:click:${ camp.id }`,
        noResultListClick: `ins:eureka:no:result:list:click:${ camp.id }`,
        checkboxClick: `ins:eureka:checkbox:click:${ camp.id }`,
        facetSearch: `keyup.ins:eureka:facet:search:${ camp.id }`,
        toggleClick: `click.ins:eureka:toggle:click:${ camp.id }`,
        rangeClick: `ins:eureka:range:click:${ camp.id }`,
        sliderNextButton: `ins:eureka:slider:next:button:${ camp.id }`,
        sliderProgress: `input.ins:eureka:slider:progress:${ camp.id }`,
        ratingClick: `ins:eureka:rating:click:${ camp.id }`,
        sortClick: `ins:eureka:sort:click:${ camp.id }`,
        itemsPerPageClick: `ins:eureka:items:per:page:click:${ camp.id }`,
        sortingItemClick: `ins:eureka:sorting:item:click:${ camp.id }`,
        itemsPerPageItemClick: `ins:eureka:items:per:page:item:click:${ camp.id }`,
        appliedFilterCloseClick: `ins:eureka:applied:filter:close:click:${ camp.id }`,
        pageClick: `ins:eureka:page:click:${ camp.id }`,
        sliderInput: `input.ins:eureka:slider:input:${ camp.id }`,
        pageNavClick: `ins:eureka:page:nav:click:${ camp.id }`,
        searchResultScroll: `scroll.ins:eureka:search:result:scroll:${ camp.id }`,
        checkboxScroll: `scroll.ins:checkbox:create:item:${ camp.id }`,
        scrollableAreaScroll: `scroll.ins:eureka:search:result:scroll:${ camp.id }`,
        resize: `resize.ins:eureka-window${ camp.id }`,
        click: `click.ins:eureka-click${ camp.id }`,
        closeTemplateClick: `ins:eureka:close:template:click:${ camp.id }`,
        searchButtonClick: `ins:eureka:search:button:click:${ camp.id }`,
        clearInputClick: `ins:eureka:clear:input:click:${ camp.id }`,
        filterButtonClick: `ins:eureka:filter:button:click:${ camp.id }`,
        sortingButtonClick: `ins:eureka:sorting:button:click:${ camp.id }`,
        pageCloseClick: `ins:eureka:page:close:click:${ camp.id }`,
        applyClick: `ins:eureka:apply:click:${ camp.id }`,
        dynamicSearchKeyup: `keyup.ins:eureka:dynamic:search:text:${ camp.id }`,
        sliderFacetInput: `input.ins:eureka:slider:facet:input:${ camp.id }`,
        sliderFocusOut: `focusout.ins:eureka:slider:focusout:${ camp.id }`,
    },
    FEATURES: {
        isFontAwesomeEnabled: true,
    },
};

const templateInit = function () {
    const Eureka = new Insider.campaign.eureka(templateConfig);

    Eureka.init();
};

if (Insider.fns.isUndefined(Insider.campaign.eureka)) {
    Insider.request.script({
        charset: 'UTF-8',
        src: `${ Insider.__external.EITRI_URL }ins-eureka.js`,
        success: templateInit,
    });
} else {
    templateInit();
}

Insider.eventManager.once(`framelessInited${ camp.id }`, templateInit);

/* OPT-157943 START */
((self) => {
    'use strict';

    const classes = {
        style: `ins-custom-style-${ camp.id }`,
        insSearchBarWrapperStyle: `ins-search-bar-wrapper-${ camp.id }`,
        insSearchBarInputStyle: `ins-search-bar-input-${ camp.id }`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        dynamicInput: '.ins-dynamic-input',
        searchBarInput: '#insider-search-input',
        searchBarInputWrapper: '.search-container.clearfix'

    });

    self.init = () => {
        self.reset();
        self.buildCSS();
        self.addClass();
        self.setEvents();

        return true;
    };

    self.reset = () => {
        const { insSearchBarWrapperStyle, insSearchBarInputStyle } = classes;
        const { searchBarInputWrapper, searchBarInput, style } = selectors;

        Insider.dom(style).remove();
        Insider.dom(searchBarInputWrapper).removeClass(insSearchBarWrapperStyle);
        Insider.dom(searchBarInput).removeClass(insSearchBarInputStyle);
    };

    self.buildCSS = () => {
        const { insSearchBarWrapperStyle, insSearchBarInputStyle } = selectors;

        const customStyle =
      `${ insSearchBarInputStyle } {
          width: 100%;
          background-color: #ffffff;
      }
      ${ insSearchBarWrapperStyle } {
          display: flex;
      }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.addClass = () => {
        const { searchBarInputWrapper, searchBarInput } = selectors;
        const { insSearchBarWrapperStyle, insSearchBarInputStyle } = classes;

        Insider.dom(searchBarInputWrapper).addClass(insSearchBarWrapperStyle);

        Insider.fns.onElementLoaded(searchBarInput, ($searchBarInput) => {
            $searchBarInput.addClass(insSearchBarInputStyle);
        }).listen();
    };

    self.setEvents = () => {
        Insider.eventManager.once(`focusin.set:searchbar:focus:${ camp.id }`, document, (event) => {
            const { dynamicInput, searchBarInput } = selectors;

            const $firstDynamicInput = Insider.dom(dynamicInput).nodes[0];
            const $searchBarInput = Insider.dom(searchBarInput);

            if (event.target === $firstDynamicInput && $searchBarInput) {
                $searchBarInput.focus();
            }
        });
    };

    return self.init();
})({});
/* OPT-157943 END */
