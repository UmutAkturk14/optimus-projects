const addToCartButtonSelector = '.sc-brKeYL.sc-ktEKTO.hwCFiR.cjcXew.button-root';
const badgeClass = `ins-custom-banner-${ camp.id }`;
const textSelector = '#text-16460455247710';

Insider.fns.onElementLoaded(addToCartButtonSelector, () => {
    Insider.fns.onElementLoaded(textSelector, () => {
        const text = Insider.dom(textSelector).text().trim();
        const peopleCount = text.match(/\d+/g);

        Insider.dom(addToCartButtonSelector).before(`<p class="${ badgeClass }">🔥 ${ peopleCount } people added this style to their bag</p>`);
    }).listen();
}).listen();
