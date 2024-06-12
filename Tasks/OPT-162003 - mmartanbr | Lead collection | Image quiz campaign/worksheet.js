/* OPT-159864 START */
((self) => {
    'use strict';

    const config = {
        1: {
            question: 'Example question',
            images: {
                title: 'image title',
                urls: [
                    'https://images.unsplash.com/photo-1717407304660-032cd25ba06d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    'https://images.unsplash.com/photo-1717407304660-032cd25ba06d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    'https://images.unsplash.com/photo-1717407304660-032cd25ba06d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                ]
            }
        },
        2: {
            question: 'Example question',
            images: {
                title: 'image title',
                urls: [
                    'https://plus.unsplash.com/premium_photo-1688678097388-a0c77ea9ace1?q=80&w=2046&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    'https://plus.unsplash.com/premium_photo-1688678097388-a0c77ea9ace1?q=80&w=2046&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    'https://plus.unsplash.com/premium_photo-1688678097388-a0c77ea9ace1?q=80&w=2046&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                ]
            }
        },
        3: {
            question: 'Example question',
            images: {
                title: 'image title',
                urls: [
                    'https://images.unsplash.com/photo-1717407304660-032cd25ba06d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    'https://images.unsplash.com/photo-1717407304660-032cd25ba06d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    'https://images.unsplash.com/photo-1717407304660-032cd25ba06d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                ]
            }
        },
        4: {
            question: 'Example question',
            images: {
                title: 'image title',
                urls: [
                    'https://images.unsplash.com/photo-1717407304660-032cd25ba06d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    'https://images.unsplash.com/photo-1717407304660-032cd25ba06d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    'https://images.unsplash.com/photo-1717407304660-032cd25ba06d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                ]
            }
        },
        5: {
            question: 'Example question',
            images: {
                title: 'image title',
                urls: [
                    'https://images.unsplash.com/photo-1717407304660-032cd25ba06d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    'https://images.unsplash.com/photo-1717407304660-032cd25ba06d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    'https://images.unsplash.com/photo-1717407304660-032cd25ba06d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                ]
            }
        }
    };

    const classes = {
        page: 'page',
        leadCollection: 'lead-collection',
        centered: 'centered',
        pagesWrapper: 'pagesWrapper',
        leftButton: 'left-button',
        rightButton: 'right-button'
    };

    self.init = () => {
        self.reset();
        self.buildCSS();
        self.buildHTML();
    };

    self.reset = () => {
        Insider.dom(`.${ classes.leadCollection }, .${ classes.page }.${ classes.centered }`).remove();
        Insider.dom('#ins-frameless-overlay').css('z-index', '-1', 'important');
    };

    self.buildCSS = () => {
        const customStyle = `
          .${ classes.page } {
              position: absolute;
              top: 0;
              width: 100vw;
              height: 50vh;
              background-color: #fff;
              text-align: center;
              padding: 20px;
              font-size: 24px;
              font-weight: bold;
              color: #333;
              border: 1px solid #ddd;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          }
          .${ classes.centered } {
              display: flex;
              justify-content: center;
              align-items: center;
          }
          .${ classes.pagesWrapper } {
              height: 50vh;
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              margin: auto;
          }
          .${ classes.leftButton }, .${ classes.rightButton } {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              font-size: 24px;
              font-weight: bold;
              color: #333;
              border: 1px solid #ddd;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          }
          .${ classes.leftButton } {
              left: 10px;
          }
          .${ classes.rightButton } {
              right: 10px;
          }
      `;

        Insider.dom('<style>').html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const pages = [];

        // Get the screen dimensions
        const screenWidth = $(window).width();
        const screenHeight = $(window).height();

        // Calculate the card dimensions
        const cardWidth = screenWidth * 1;
        const cardHeight = screenHeight * 0.5;

        // Loop through the config object
        for (const key in config) {
            const page = $('<div>').addClass(`${ classes.page } ${ classes.leadCollection }`).css({
                left: `${ (parseInt(key) - 1) * 100 }vw`
            }).html(`<h2>${ config[key].question }</h2>`);

            // Add the images to the page
            config[key].images.urls.forEach((imageURL, index) => {
                const imageContainer = $('<div>').css({
                    position: 'relative',
                    display: 'inline-block',
                    margin: '10px'
                });

                const image = $('<img>').attr({
                    src: imageURL,
                    style: `width: ${ cardWidth / 3 }px; height: ${ cardHeight / 3 }px;`
                });

                const imageTitle = $('<h3>').text(config[key].images.title).css({
                    position: 'absolute',
                    bottom: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    padding: '5px',
                    borderRadius: '5px'
                });

                imageContainer.append(image, imageTitle);
                page.append(imageContainer);
            });

            // Add the CSS to center the cards within each slide
            page.addClass(classes.centered);

            pages.push(page);
        }

        // Wrap the pages in a pagesWrapper
        const pagesWrapper = $('<div>').addClass(classes.pagesWrapper);

        pages.forEach(function (page) {
            pagesWrapper.append(page);
        });

        // Append the pagesWrapper to the body
        $(document.body).append(pagesWrapper);

        // Create the navigation buttons
        const leftButton = $('<button>').addClass(classes.leftButton).html('&lt;');
        const rightButton = $('<button>').addClass(classes.rightButton).html('&gt;');

        $(document.body).append(leftButton);
        $(document.body).append(rightButton);

        // Set the initial left position for each card
        for (let i = 0; i < pages.length; i++) {
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
    };

    return self.init();
})({});
/* OPT-159864 END */
