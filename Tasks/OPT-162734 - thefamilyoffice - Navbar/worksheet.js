// This is working!

const $firstElement = Insider.dom('.chakra-accordion__item:first');
const $secondElement = $firstElement.next();
const navbar = 'nav:not(.chakra-breadcrumb)';
const navbarActiveClass = 'css-1t5951b';
const navbarPassiveClass = 'css-1cbouum';
const svgActiveClass = 'css-1vx205z';
const svgPassiveClass = 'css-hjvhmo';

// Swap the elements
$firstElement.before($secondElement);

const accordionItems = Insider.dom('.chakra-accordion .chakra-accordion__item:not(:last), .chakra-accordion__item:not(:last) .svg.chakra-icon');
let openedDropdown = false;

Insider.eventManager.once('click.rearea:rewrewrew:rewrew', accordionItems, (event) => {
    // Insider.logger.log(openedDropdown);
    Insider.logger.log(Insider.dom(event.target));

    // Insider.logger.log(Insider.dom(event.target).closest('.chakra-link'));
    if (openedDropdown && Insider.dom(event.target).closest('.chakra-link')) {
        Insider.logger.log(Insider.dom(event.target).closest('.chakra-link'));
        // if (Insider.dom('.chakra-accordion__panel:visible').length > 1) {
        //     clearAll();
        //     setButtonStyle(clickedElement);
        // } else {
        //     Insider.logger.log('Clearing up from inside the if');
        //     clearAll();
        // }

        if (navbarPassiveClass) {
            const clickedElement = Insider.dom(event.target).closest('.chakra-accordion__item');
            const clickedElementContent = clickedElement.find('.chakra-collapse').children();

            // Clear styles for all buttons
            Insider.logger.log(Insider.dom('.chakra-accordion__panel:visible').length);
            Insider.logger.log('Clearing up from inside the if inside the if...');
            clearAll();

            // Set styles for the clicked button
            setButtonStyle(clickedElement);
            Insider.dom(clickedElementContent).css('display', 'block', 'important');
            Insider.logger.log('Toggled opened dropdown1');
            openedDropdown = !openedDropdown;
            Insider.logger.log(Insider.dom('.chakra-collapse:visible').length);

            if (Insider.dom('.chakra-collapse:visible').length === 0) {
                Insider.logger.log('No visible panel, clearing it out...');
                clearAll();
            }

            setTimeout(() => {
                if (Insider.dom('.chakra-collapse:visible').length === 0) {
                    Insider.logger.log('Waited some time, but no visible panel, clearing it out...');
                    clearAll();
                }
            }, 400);
        } else {
            Insider.logger.log('Clearing up from inside the if');
            clearAll();
            Insider.logger.log('Toggled opened dropdown2');
            openedDropdown = !openedDropdown;
        }
    } else {
        const clickedElement = Insider.dom(event.target).closest('.chakra-accordion__item');
        const clickedElementContent = clickedElement.find('.chakra-collapse').children();

        // Clear styles for all buttons
        Insider.logger.log('Clearing up from inside the else');
        clearAll();

        // Set styles for the clicked button
        setButtonStyle(clickedElement);

        // Show the content of the clicked element
        Insider.dom(clickedElementContent).css('display', 'block', 'important');

        // Toggle openedDropdown
        Insider.logger.log('Toggled opened dropdown3');
        openedDropdown = !openedDropdown;
    }

    if (Insider.dom('.chakra-collapse:visible').length === 0) {
        clearAll();
    }
});

Insider.eventManager.once('click.track:window:clicks', window, (event) => {
    if (openedDropdown && !event.target.matches('a.chakra-link') && !event.target.matches('.chakra-accordion__button')) {
        Insider.logger.log('Clearing up from inside the event listener');
        clearAll();
    }
});

const setButtonStyle = (button) => {
    Insider.dom(button).find('button').attr('aria-expanded', 'true');
    Insider.dom(button).find('button svg').removeClass(svgPassiveClass).addClass(svgActiveClass);
    Insider.dom(navbar).removeClass(navbarPassiveClass).addClass(navbarActiveClass);
};

const clearAll = () => {
    Insider.dom('.chakra-accordion__item:visible:not(:last)').find('button').attr('aria-expanded', 'false');
    Insider.dom('.chakra-accordion__item:visible:not(:last)').find('button svg').removeClass(svgActiveClass).addClass(svgPassiveClass);
    Insider.dom('.chakra-collapse:not(:last)').children().css('display', 'none', 'important');
    Insider.dom(navbar).removeClass(navbarActiveClass).addClass(navbarPassiveClass);

    openedDropdown = false;
};

if (Insider.dom('.chakra-collapse:visible').length === 0) {
    clearAll();
}
