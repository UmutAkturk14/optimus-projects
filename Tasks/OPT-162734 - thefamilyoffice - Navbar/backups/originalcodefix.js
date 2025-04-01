/* ZEN-169115 START */
(() => {
    'use strict';

    const builderId = 578;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isControlGroup = Insider.campaign.isControlGroup(variationId);
    let lastClickedElement;

    const classes = {
        header: `ins-custom-item-${ variationId }-1`,
        navbarActive: 'css-1t5951b',
        navbarPassive: 'css-1cbouum',
        svgActive: 'css-1vx205z',
        svgPassive: 'css-hjvhmo'
    };

    const selectors = Insider.fns.keys(classes).reduce(function (createdSelector, key) {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        headerMenuSelector: '.chakra-accordion__item:first',
        item: '.chakra-accordion__item:eq(1)',
        /* fixOriginalCode START */
        collapsible: '.chakra-collapse',

        /* fixOriginalCode END */
    });

    self.init = () => {
        if (variationId) {
            if (!isControlGroup) {
                Insider.fns.onElementLoaded(selectors.headerMenuSelector, () => {
                    setTimeout(() => {
                        self.reset();
                        self.addClass();
                        self.setEvents();
                    }, 100);
                }).listen();
            }

            self.sendCustomGoal();
        }
    };

    self.reset = () => {
        const { headerMenuSelector } = selectors;
        const { header } = classes;

        Insider.dom(headerMenuSelector).removeClass(`${ header }`);
    };

    self.setEvents = () => {
        const { headerMenuSelector, item, collapsible } = selectors;
        const { svgActive, svgPassive, navbarActive, navbarPassive } = classes;

        const handleVisibility = (element, visibility) => {
            element.children('.chakra-collapse').css('visibility', visibility, 'important');
        };

        const updatePanel = (element, otherElement) => {
            if (element.find('button').attr('aria-expanded') === 'true') {
                element.find('button').attr('aria-expanded', 'false');
                element.find('button svg').removeClass(svgActive).addClass(svgPassive);
                handleVisibility(element, 'hidden');
                handleVisibility(otherElement, 'visible');
                otherElement.find('.chakra-accordion__panel').css('height', '250px', 'important');
            }
        };

        Insider.eventManager.once(`click.track:window:clicks:${ variationId }`, window, (event) => {
            lastClickedElement = event.target;

            setTimeout(() => {
                if (Insider.dom('.chakra-accordion__panel:visible').length === 0) {
                    Insider.dom(selectors.navbarActive).addClass(navbarPassive).removeClass(navbarActive);
                }
            }, 500);
        });

        Insider.eventManager.once(`click.track:clicks:${ variationId }`, `${ headerMenuSelector }, ${ item }`, (event) => {
            const clickedElement = Insider.dom(event.target).closest('.chakra-accordion__item');
            const [firstElement, secondElement] = [Insider.dom('.chakra-accordion__item:eq(0)'), Insider.dom('.chakra-accordion__item:eq(1)')];
            const otherElement = clickedElement.getNode(0) === firstElement.getNode(0) ? secondElement : firstElement;

            if (clickedElement.find('a').getNode(0) !== lastClickedElement) {
                setTimeout(() => {
                    clickedElement.find('.chakra-collapse').css('display', 'block', 'important');
                }, 400);
            }

            if (clickedElement.getNode(0) === firstElement.getNode(0)) {
                updatePanel(secondElement, firstElement);
                setTimeout(() => {
                    handleVisibility(firstElement, 'visible');
                }, 500);
            } else if (clickedElement.getNode(0) === secondElement.getNode(0)) {
                updatePanel(firstElement, secondElement);
                setTimeout(() => {
                    handleVisibility(secondElement, 'visible');
                }, 500);
            }

            if (otherElement.getNode(0) === lastClickedElement.closest('.chakra-accordion__item')) {
                setTimeout(() => {
                    clickedElement.find('.chakra-link').click();
                    setTimeout(() => {
                        clearElement(otherElement);
                        Insider.dom('.css-1v2vw2c').css('visibility', 'visible', 'important');
                    }, 500);
                }, 400);
            }

            if (lastClickedElement.closest('.chakra-accordion__item') === otherElement.closest('.chakra-accordion__item')) {
                setTimeout(() => {
                    clickedElement.find('.chakra-collapse').css('display', 'block', 'important');
                }, 500);
            }
        });
    };

    self.addClass = () => {
        const { headerMenuSelector, item } = selectors;
        const { header } = classes;

        Insider.dom(item).after(Insider.dom(headerMenuSelector).addClass(`${ header }`));
    };

    self.sendCustomGoal = () => {
        const { headerMenuSelector } = selectors;

        Insider.eventManager.once(`click.hamberger:menu:${ variationId }`, headerMenuSelector, () => {
            Insider.utils.opt.sendCustomGoal(builderId, 49, true);
        });
    };

    const clearElement = (item) => {
        const svgActiveClass = 'css-1vx205z';
        const svgPassiveClass = 'css-hjvhmo';

        Insider.dom('.css-1v2vw2c').css('visibility', 'hidden', 'important');
        Insider.dom(item).find('button').attr('aria-expanded', 'false');
        Insider.dom(item).find('button svg').removeClass(svgActiveClass).addClass(svgPassiveClass);
        Insider.dom(item).find('.chakra-collapse').css('display', 'none', 'important');
    };

    self.init();
})({});

true;
/* ZEN-169115 END */
