const whatsappButton = Insider.dom('.css-1sj3b23-whatsapp.e1bx6iyb1').parent();
const chatbotButton = Insider.dom('.backpack-chat-concierge-wrapper.hide-mobile.is-hidden-mobile');
const position = window.innerWidth * 0.9;

whatsappButton.hide();
chatbotButton.css('left', `${ position }px`);
