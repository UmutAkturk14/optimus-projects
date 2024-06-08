/* OPT-139911 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 819 : 818; /* ZEN-142337 */
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    let productSpecificSize = '';

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        hintBox: `ins-hint-box-${ variationId }`,
        relative: `ins-relative-${ variationId }`,
        overflowVisible: `ins-overflow-visible-${ variationId }`,
        specificSize: `ins-specific-size-${ variationId }`,
        goal: `sp-custom-${ variationId }-1`,
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        partnerSizeWrapper: '.rc-swatch',
        partnerSizeContainer: '.rc-swatch__item'
    });

    const hintBoxUrl = isDesktop ? 'https://image.useinsider.com/royalcanin/defaultImageLibrary/Hint-1697802217.png' :
        'https://image.useinsider.com/royalcanin/defaultImageLibrary/Mob_hint-1698221336.png';

    const productArray = [
        /* OPT-142337 START */
        {
            parameter: '2522',
            size: '2кг'
        },
        {
            parameter: '3000',
            size: '2кг'
        },
        {
            parameter: '2544',
            size: '2кг'
        },
        {
            parameter: '2558',
            size: '2кг'
        },
        {
            parameter: '1002',
            size: '1.5кг'
        },
        {
            parameter: '3972',
            size: '1.5кг'
        },
        {
            parameter: '2562',
            size: '2кг'
        },
        {
            parameter: '1231',
            size: '2кг'
        },
        {
            parameter: '2566',
            size: '2кг'
        },
        {
            parameter: '2438',
            size: '1.5кг'
        },
        {
            parameter: '2537',
            size: '4кг'
        },
        {
            parameter: '2560',
            size: '3.5кг'
        },
        {
            parameter: '2550',
            size: '4кг'
        },
        {
            parameter: '2557',
            size: '4кг'
        },
        {
            parameter: '2521',
            size: '4кг'
        },
        {
            parameter: '2565',
            size: '4кг'
        },
        {
            parameter: '2531',
            size: '4кг'
        },
        {
            parameter: '2520',
            size: '3.5кг'
        },
        {
            parameter: '2548',
            size: '3.5кг'
        },
        {
            parameter: '2529',
            size: '4кг'
        },
        {
            parameter: '2542',
            size: '4кг'
        },
        /* ZEN-142337 END */
    ];

    self.init = () => {
        if (variationId && self.checkProduct()) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.buildCSS();
                self.addClass();
                self.setEvents();
            }

            return true;
        }
    };

    self.checkProduct = () => productArray.some((product) => {
        const { parameter, size } = product;

        if (Insider.fns.hasParameter(parameter)) {
            productSpecificSize = size;

            return true;
        }
    });

    self.reset = () => {
        const { style, hintBox, specificSize, overflowVisible, partnerSizeContainer } = selectors;
        const { specificSize: specificSizeClass, overflowVisible: overflowVisibleClass, relative, goal } = classes;

        Insider.dom(`${ style }, ${ hintBox }`).remove();
        Insider.dom(specificSize).removeClass(specificSizeClass);
        Insider.dom(overflowVisible).removeClass(overflowVisibleClass);
        Insider.dom(partnerSizeContainer).removeClass(`${ relative } ${ goal }`);
    };

    self.buildCSS = () => {
        const { hintBox, specificSize, overflowVisible, relative } = selectors;

        const customStyle =
      `${ hintBox } {
          position: absolute;
          top: -80px;
          max-width: 135px !important; /* OPT-142745 */
          left: 10%;
      }
      ${ specificSize } {
          position: relative;
          border-color: yellow !important;
      }
      ${ specificSize }::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -10px;
          border-style: solid;
          border-width: 15px 15px 0 15px;
          border-color: yellow transparent transparent transparent;
          rotate: 135deg;
      }
      ${ specificSize }::before {
          content: '%';
          position: absolute;
          top: -1px;
          left: 2px;
          z-index: 2;
          color: black;
          font-size: 10px;
      }
      ${ overflowVisible } {
          overflow: visible !important;
      }
      ${ relative } {
          position: relative;
      }
      @media screen and (max-width: 1100px) {
          ${ hintBox } {
              /* OPT-142745 START */
              top: -77px;
              max-width: 136px !important;
              /* OPT-142745 END */
              left: -70%;
          }
      }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.addClass = () => {
        const { partnerSizeContainer, partnerSizeWrapper } = selectors;
        const { specificSize, overflowVisible, relative, goal } = classes;

        /* OPT-142745 START */
        Insider.dom(`${ partnerSizeContainer }`).accessNodes((node) => {
            if ( node.textContent === productSpecificSize) {
                Insider.dom(node).addClass(`${ relative } ${ goal }`);
                Insider.dom(node).find('span').addClass(specificSize);
            }
        });
        /* OPT-142745 END */

        Insider.dom(partnerSizeWrapper).addClass(overflowVisible);
    };

    self.setEvents = () => {
        const { partnerSizeContainer, hintBox } = selectors;

        Insider.eventManager.once(`click.toggle:hint:container:${ variationId }`, partnerSizeContainer,
            (event) => {
                self.addClass();

                if (event.currentTarget.firstChild.classList.contains(classes.specificSize)) {
                    self.createHintContainer(event.currentTarget);
                } else {
                    Insider.dom(hintBox).remove();
                }
            });
    };

    self.createHintContainer = (specificSizeSelector) => {
        Insider.dom(selectors.hintBox).exists() && Insider.dom(selectors.hintBox).remove(); /* OPT-142745 */

        const outerHTML = `<img class="${ classes.hintBox }" src="${ hintBoxUrl }">`;

        Insider.dom(specificSizeSelector).append(outerHTML);
    };

    return self.init();
})({});
/* OPT-139911 END */
