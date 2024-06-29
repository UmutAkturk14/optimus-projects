const nextArrow = '.ins-slider-arrow-wrapper.ins-element-content.ins-arrow-with-border';
const prevArrow = '.ins-slider-arrow-wrapper.ins-arrow-with-border';

Insider.dom(prevArrow).addClass('ins-display-none');

Insider.eventManager.once('click.on:next:arrow:', nextArrow, () => {
    Insider.dom(nextArrow).addClass('ins-display-none');
    Insider.dom(prevArrow).removeClass('ins-display-none');
});

Insider.eventManager.once('click.on:prev:arrow', prevArrow, () => {
    Insider.dom(prevArrow).addClass('ins-display-none');
    Insider.dom(nextArrow).removeClass('ins-display-none');
});

//

const nextArrow = '.ins-slider-arrow-wrapper.ins-element-content.ins-arrow-with-border';
const prevArrow = '.ins-slider-arrow-wrapper.ins-arrow-with-border:first';
const productFirst = '.ins-mobile-web-smart-recommender-box-item:first';

Insider.dom('.ins-slider-arrow-element:first').addClass('ins-display-none');
Insider.dom(prevArrow).addClass('ins-display-none');

Insider.eventManager.once(`click.on:next:arrow:${ camp.id }`, '.ins-slider-arrow-element:first', () => {
    Insider.dom(nextArrow).addClass('ins-display-none');
    Insider.dom(prevArrow).removeClass('ins-display-none');
    Insider.dom('.ins-slider-arrow-element:first').addClass('ins-display-none');
    Insider.dom('.ins-slider-arrow-element:last').removeClass('ins-display-none');

    Insider.dom(productFirst).addClass('ins-display-none');
});

Insider.eventManager.once(`click.on:prev:arrow:${ camp.id }`, '.ins-slider-arrow-element:last', () => {
    Insider.dom(prevArrow).addClass('ins-display-none');
    Insider.dom(nextArrow).removeClass('ins-display-none');
    Insider.dom('.ins-slider-arrow-element:first').addClass('ins-display-none');
    Insider.dom('.ins-slider-arrow-element:last').removeClass('ins-display-none');

    Insider.dom(productFirst).removeClass('ins-display-none');
});
