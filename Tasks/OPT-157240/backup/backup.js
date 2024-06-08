/* OPT-156893 START */
((self) => {
  'use strict';

  const isMobile = Insider.browser.isMobile();
  const builderId = isMobile ? 53 : 52;
  const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

  const classes = {
      style: `ins-custom-style-${ variationId }`,
      topToolbar: `ins-top-toolbar-${ variationId }`,
      stickyFilter: `ins-sticky-filter-${ variationId }`,
      relativeWrapper: `ins-relative-wrapper-${ variationId }`,
      join: `sp-custom-${ variationId }-1`,
      stickySideBar: `ins-sticky-side-bar-${ variationId }`,
      toolBarSorterFixed: `ins-toolbar-sorter-fixed-${ variationId }`,
      hide: `ins-hidden-element-${ variationId }`, /* OPT-157240 */
  };

  const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
      createdSelector[key] = `.${ classes[key] }`, createdSelector
  ), {
      sideBar: '.sidebar-main',
      filterSection: '#maincontent .columns .column.main .page-title-wrapper',
      resultWrapper: '#layer-product-list',
      topToolbarSelector: '.top-toolbar',
      toolbarSorter: '.toolbar-sorter:first',
      /* OPT-157240 START */
      firstTopToolbarSelector: '.top-toolbar.sp-custom-c21-1.ins-top-toolbar-c21:first',
      otherTopToolbarSelector: '.top-toolbar:not(:first)',
      secondDropdownSelector: '.toolbar.toolbar-products:first',
      filterSidebar: '.block.filter',
      /* OPT-157240 END */
  });

  self.init = () => {
      if (variationId) {
          Insider.fns.onElementLoaded(selectors.resultWrapper, () => {
              if (!Insider.campaign.isControlGroup(variationId)) {
                  self.reset();
                  self.buildCSS();
                  self.buildHTML();
                  self.setEvents();
              }

              Insider.campaign.custom.show(variationId);
          }).listen();
      }
  };

  self.reset = () => {
      const { stickyFilter, stickySideBar, relativeWrapper, topToolbar, toolbarSorter } = classes;
      const { sideBar, filterSection, resultWrapper, topToolbarSelector, toolBarSorterFixed } = selectors;

      self.removeClassPartnerElement(sideBar, stickySideBar);
      self.removeClassPartnerElement(filterSection, stickyFilter);
      self.removeClassPartnerElement(resultWrapper, relativeWrapper);
      self.removeClassPartnerElement(topToolbarSelector, topToolbar);
      self.removeClassPartnerElement(toolbarSorter, toolBarSorterFixed);
      Insider.dom(filterSection).css('width', '100%', 'important');
  };

  self.removeClassPartnerElement = (partnerElement, className) => {
      Insider.dom(partnerElement).removeClass(className);
  };

  self.buildCSS = () => {
      const { topToolbar, stickyFilter, stickySideBar, relativeWrapper, toolBarSorterFixed, hide } = selectors;

      const customStyle =
    `${ stickyFilter } {
        position: sticky !important;
        top: 71px;
        z-index: 99;
        background-color: #fff !important;
    }
    ${ stickySideBar } {
        position: sticky !important;
        top: 71px;
        overflow: scroll;
        height: calc(100vh - 110px);
    }
    ${ topToolbar } {
        position: sticky !important;
        top: 84px;
        z-index: 100;
        background-color: white;
        height: 40px;
        padding-top: 5px;
    }
    ${ relativeWrapper } {
        position: relative;
        z-index: 98;
    }
    /* OPT-157240 START */
    ${ hide } {
        display: none !important;
    }
    /* OPT-157240 END */
    @media screen and (max-width: 768px) {
        ${ stickyFilter } {
            top: 60px;
        }
    }
    @media screen and (min-width: 768px) {
        ${ stickyFilter } {
            float: left;
        }
        ${ toolBarSorterFixed } {
            position: fixed !important;
            top: 71px !important;
            z-index: 100 !important;
            height: 60px;
            width: 25%;
            background-color: white;
            display: flex;
            align-items: center;
            justify-content: end;
        }
    }`;

      Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
  };

  self.buildHTML = () => {
      const { stickyFilter, stickySideBar, relativeWrapper, topToolbar } = classes;
      const { sideBar, filterSection, resultWrapper, topToolbarSelector } = selectors;

      self.addClassPartnerElement(filterSection, stickyFilter);
      self.addClassPartnerElement(resultWrapper, relativeWrapper);

      if (isMobile) {
          self.addClassPartnerElement(topToolbarSelector, topToolbar);
      } else {
          self.addClassPartnerElement(sideBar, stickySideBar);
          Insider.dom(filterSection).css('width', '77%', 'important');
      }
  };

  self.addClassPartnerElement = (partnerElement, className) => {
      Insider.dom(partnerElement).addClass(`${ className } ${ classes.join }`);
  };

  self.setEvents = () => {
      const { toolbarSorter, resultWrapper } = selectors;
      const { toolBarSorterFixed } = classes;

      Insider.eventManager.once(`scroll.scroll:site:${ variationId }`, window, Insider.fns.debounce(() => {
          if (window.scrollY > 0 && window.scrollY < (Insider.dom(resultWrapper)?.nodes[0]?.clientHeight ?? 0)) {
              self.addClassPartnerElement(toolbarSorter, toolBarSorterFixed);
          } else {
              self.removeClassPartnerElement(toolbarSorter, toolBarSorterFixed);
          }
      }, 100));

      /* OPT-157240 START */
      if (isMobile) {
          const { firstTopToolbarSelector, otherTopToolbarSelector, secondDropdownSelector,
              filterSidebar } = selectors;

          Insider.eventManager.once(`touchend.set:alignment:${ variationId }`, `${ filterSidebar },
            ${ firstTopToolbarSelector }, .toolbar-sorter.sorter`, () => {


              const $otherTopToolbars = Insider.dom(otherTopToolbarSelector);

              if ($otherTopToolbars) {
                  Insider.dom(secondDropdownSelector).appendTo(firstTopToolbarSelector);

                  $otherTopToolbars.addClass(classes.hide);
              }
          });

      }
      /* OPT-157240 END */
  };

  return self.init();
})({});
/* OPT-156893 END */
