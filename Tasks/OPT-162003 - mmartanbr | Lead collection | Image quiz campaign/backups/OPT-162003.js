Insider.dom('.lead-collection, .page.centered').remove();
Insider.dom('#ins-frameless-overlay').css('z-index', '-1', 'important');

// Get the screen dimensions
const screenWidth = $(window).width();
const screenHeight = $(window).height();

// Calculate the card dimensions
const cardWidth = screenWidth * 1;
const cardHeight = screenHeight * 0.5;

// Create the pages
const pages = [];

for (var i = 0; i < 5; i++) {
    const page = $('<div class="lead-collection">').attr({
        class: 'page',
        style: `position: absolute; top: 0; left: ${ i * 100 }vw; width: ${ cardWidth }px; height: ${ cardHeight }px; background-color: #fff; text-align: center; padding: 20px; font-size: 24px; font-weight: bold; color: #333; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);`
    }).html(`<h2>Page ${ i + 1 }</h2>`);

    // Add the CSS to center the cards within each slide
    page.addClass('centered');

    pages.push(page);
}

// Wrap the pages in a pagesWrapper
const pagesWrapper = $('<div>').addClass('pagesWrapper');

pages.forEach(function (page) {
    pagesWrapper.append(page);
});

// Append the pagesWrapper to the body
$(document.body).append(pagesWrapper);

// Center the pagesWrapper vertically
pagesWrapper.css({
    top: `${ (screenHeight - cardHeight) / 2 }px`,
    left: '50%'
});

// Center the pagesWrapper horizontally
pagesWrapper.css({
    height: '50vh',
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    margin: 'auto'
});

// Create the navigation buttons
const leftButton = $('<button>').attr({
    class: 'left-button',
    style: 'position: absolute; top: 50%; left: 10px; transform: translateY(-50%); font-size: 24px; font-weight: bold; color: #333; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);'
}).html('&lt;');

const rightButton = $('<button>').attr({
    class: 'right-button',
    style: 'position: absolute; top: 50%; right: 10px; transform: translateY(-50%); font-size: 24px; font-weight: bold; color: #333; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);'
}).html('&gt;');

$(document.body).append(leftButton);
$(document.body).append(rightButton);

// Add the CSS for centered cards
$('.centered').css({
    'display': 'flex',
    'justify-content': 'center',
    'align-items': 'center'
});

// Set the initial left position for each card
// Set the initial left position for each card
for (var i = 0; i < pages.length; i++) {
    pages[i].css({
        left: `${ i * 100 }vw`
    });
}

// Set the initial page
let currentPage = 0;

// Handle navigation
let leftButtonClicked = false;
let rightButtonClicked = false;

leftButton.on('click', function () {
    if (!leftButtonClicked) {
        leftButtonClicked = true;

        if (currentPage > 0) {
            currentPage--;
            pages.forEach(function (page, index) {
                page.animate({
                    left: `+=${ 100 }vw`
                }, 500);
            });
        }
        setTimeout(function () {
            leftButtonClicked = false;
            currentPage = Math.max(0, currentPage); // Ensure currentPage is not negative
        }, 500);
    }
});

rightButton.on('click', function () {
    if (!rightButtonClicked) {
        rightButtonClicked = true;

        if (currentPage < pages.length - 1) {
            currentPage++;
            pages.forEach(function (page, index) {
                page.animate({
                    left: `-=${ 100 }vw`
                }, 500);
            });
        }
        setTimeout(function () {
            rightButtonClicked = false;
            currentPage = Math.min(currentPage, pages.length - 1); // Ensure currentPage is within bounds
        }, 500);
    }
});
