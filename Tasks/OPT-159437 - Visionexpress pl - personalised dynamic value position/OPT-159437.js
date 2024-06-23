/* OPT-157642 START */
const changeDynamicText = () => {
    const selector = {
        /* OPT-159437 START */
        web: '#text-1714039519028010',
        mobile: '#text-1714039519028011',
        tablet: '#text-1714039519028012'
        /* OPT-159437 END */
    }[Insider.browser.getPlatform()];

    /* OPT-159437 START */
    setTimeout(() => {
        Insider.fns.onElementLoaded(selector, () => {
            /* OPT-159437 END */
            const campaignText = Insider.dom(selector).text().trim();
            const productPrice = Insider.systemRules.call('getCurrentProduct').price.toFixed(2) * 0.10;
            const newFirstWord = `+${ productPrice.toFixed(2) }`;
            const newText = campaignText.replace(/\+0\.00|\+\d+,\d+\szł/, newFirstWord); /* OPT-159437 */

            Insider.dom(selector).text(newText);
            /* OPT-159437 START */
            Insider.dom(previewWrapper).css('display', 'block', 'important');
        }).listen();
    }, 3000);
    /* OPT-159437 END */
};
/* OPT-157642 END */
