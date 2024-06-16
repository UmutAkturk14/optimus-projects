// This is working!

const $firstElement = Insider.dom('.chakra-accordion__item').first();
const $secondElement = $firstElement.next();

// Swap the elements
$firstElement.before($secondElement);

const accordionItems = Insider.dom('.chakra-accordion__item');
let openedDropdown = false;

Insider.eventManager.once('click.rearea:rewrewrew:rewrew', accordionItems, (event) => {
    const clickedElement = Insider.dom(event.target).closest('.chakra-accordion__item');
    const clickedElementContent = clickedElement.find('.chakra-collapse').children();

    // Hide all other contents
    accordionItems.each((index, item) => {
        Insider.dom(item).find('.chakra-collapse').children().css('display', 'none', 'important');
        clearStuff(item);
    });

    // Clear styles for all buttons
    clearAll();

    // Set styles for the clicked button
    Insider.dom(clickedElement).find('button').css('border-bottom', '1px solid var(--components-colors-tfo-primary-500)', 'important');
    Insider.dom(clickedElement).find('button svg').css('color', 'var(--components-colors-tfo-primary-500)', 'important');
    Insider.dom(clickedElement).find('svg').css('transform', 'rotate(-180deg)', 'important');

    // Show the content of the clicked element
    Insider.dom(clickedElementContent).css('display', 'block', 'important');

    // Toggle openedDropdown
    if (openedDropdown) {
        clearAll();
    }

    openedDropdown = !openedDropdown;
});

Insider.eventManager.once('click.track:window:clicks', window, (event) => {
    if (openedDropdown && !event.target.matches('a.chakra-link') && !event.target.matches('.chakra-accordion__button')) {
        clearAll();
    }
});

const clearStuff = (element) => {
    Insider.dom(element).find('button').css('border-bottom', 'unset', 'important');
    Insider.dom(element).find('svg').css('color', 'unset', 'important');
    Insider.dom(element).find('svg').css('transform', 'unset', 'important');
};

const clearAll = () => {
    Insider.dom('.chakra-accordion__item').find('button').css('border-bottom', 'unset', 'important');
    Insider.dom('.chakra-accordion__item').find('svg').css('color', 'unset', 'important');
    Insider.dom('.chakra-accordion__item').find('svg').css('transform', 'unset', 'important');
    Insider.dom('.chakra-collapse').children().css('display', 'none', 'important');

    openedDropdown = false;
};

//
// Insider.eventManager.once('click.track:window:clicks', window, (event) => {
//     const selectors = ['a.chakra-link', '.chakra-accordion__button'];

//     if (openedDropdown && !selectors.some((selector) => event.target.matches(selector))) {
//         clearAll();
//     }
// });
