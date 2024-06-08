/* OPT-139911 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 845 : 844; /* OPT-150501 */
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const productSpecificSizes = []; /* OPT-150501 */

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
        /* OPT-150501 START */
        {
            parameter: '2522',
            size: '2кг'
        },
        {
            parameter: '2522',
            size: '0.3кг'
        },
        {
            parameter: '2544',
            size: '0.4кг'
        },
        {
            parameter: '2544',
            size: '2кг'
        },
        {
            parameter: '2562',
            size: '0.4кг'
        },
        {
            parameter: '2562',
            size: '2кг'
        },
        {
            parameter: '1231',
            size: '0.4кг'
        },
        {
            parameter: '1231',
            size: '2кг'
        },
        {
            parameter: '2558',
            size: '0.4кг'
        },
        {
            parameter: '2558',
            size: '2кг'
        },
        {
            parameter: '2566',
            size: '0.4кг'
        },
        {
            parameter: '2566',
            size: '2кг'
        },
        {
            parameter: '1002',
            size: '0.5кг'
        },
        {
            parameter: '1002',
            size: '1.5кг'
        },
        {
            parameter: '3000',
            size: '0.8кг'
        },
        {
            parameter: '3000',
            size: '2кг'
        },
        {
            parameter: '2990',
            size: '1кг'
        },
        {
            parameter: '2990',
            size: '3кг'
        },
        {
            parameter: '3003',
            size: '3кг'
        },
        {
            parameter: '3006',
            size: '3кг'
        },
        {
            parameter: '3972',
            size: '0.5кг'
        },
        {
            parameter: '3972',
            size: '1.5кг'
        },
        {
            parameter: '2438',
            size: '0.5кг'
        },
        {
            parameter: '2438',
            size: '1.5кг'
        },
        {
            parameter: '4058',
            size: '28 x 0.085кг'
        },
        {
            parameter: '4150',
            size: '28 x 0.085кг'
        }
        /* OPT-150501 END */
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

    self.checkProduct = () => {
        /* OPT-150501 START */
        let hasMatch = false;

        productArray.forEach((product) => {
            const { parameter, size } = product;

            if (Insider.fns.hasParameter(parameter)) {
                productSpecificSizes.push(size);
                hasMatch = true;
            }
        });

        return hasMatch;
        /* OPT-150501 END */
    };

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
      border-color: red !important; /* OPT-150501 */
  }
  ${ specificSize }::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -10px;
      border-style: solid;
      border-width: 15px 15px 0 15px;
      border-color: red transparent transparent transparent; /* OPT-150501 */
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
        Insider.dom(`${ partnerSizeContainer }`).accessNodes((element) => {
            if (productSpecificSizes.some((size) => size.toLowerCase() === element.textContent.toLowerCase())) {
                Insider.dom(element).addClass(`${ relative } ${ goal }`);
                Insider.dom(element).find('span').addClass(specificSize);
            } /* OPT-150501 */
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
