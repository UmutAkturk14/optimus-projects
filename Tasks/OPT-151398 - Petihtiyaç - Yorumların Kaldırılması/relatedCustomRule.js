if (Insider.dom('#commentTab').text().indexOf('Yorumlar (0)') > -1) {
    Insider.dom('#commentTab').addClass('ins-hide');
    Insider.dom('.fl.productComment.text-center').addClass('ins-hide');

    Insider.dom('.ins-hide').hide();
}

Insider.dom('#commentTab').text().indexOf('Yorumlar (0)') > -1;
