// Get the screen dimensions
const screenWidth = $(window).width();
const screenHeight = $(window).height();

// Calculate the card dimensions
const cardWidth = screenWidth * 1;
const cardHeight = screenHeight * 0.5;

// Create the pages
const pages = [];

// Create the config
const config = {
    question1: {
        title: 'Question 1',
        images: ['https://example.com/image1', 'https://example.com/image2']
    },
    question2: {
        title: 'Question 2',
        images: ['https://example.com/image3', 'https://example.com/image4']
    },
    question3: {
        title: 'Question 3',
        images: ['https://example.com/image5', 'https://example.com/image6']
    },
    question4: {
        title: 'Question 4',
        images: ['https://example.com/image7', 'https://example.com/image8']
    },
    question5: {
        title: 'Question 5',
        images: ['https://example.com/image9', 'https://example.com/image10']
    }
};

// Create the pages
for (var i = 0; i < Object.keys(config).length; i++) {
    const page = $('<div class="lead-collection">').attr({
        class: 'page',
        style: `position: absolute; top: 0; left: ${ i * 100 }vw; width: ${ cardWidth }px; height: ${ cardHeight }px; background-color: #fff; text-align: center; padding: 20px; font-size: 24px; font-weight: bold; color: #333; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0.2);`
    }).html(`<h2>${ config[Object.keys(config)[i].title] }</h2>`);

    // Add the CSS to center the cards within each slide
    page.addClass('centered');

    pages.push(page);
}

// Append the pages to the page
$(document.body).append(pages);

// Center the pages vertically
for (var i = 0; i < pages.length; i++) {
    pages[i].css({
        top: `${ (screenHeight - cardHeight) / 2 }px`
    });
}

// Create the navigation buttons
const leftButton = $('<button>').attr({
    class: 'left-button',
    style: 'position: absolute; top: 50%; left: 10px; transform: translateY(-50%); font-size: 24px; font-weight: bold; color: #333; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0.2);'
}).html('&lt;');

const rightButton = $('<button>').attr({
    class: 'right-button',
    style: 'position: absolute; top: 50%; right: 10px; transform: translateY(-50%); font-size: 24px; font-weight: bold; color: #333; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0.2);'
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
        }, 500);
    }
});
