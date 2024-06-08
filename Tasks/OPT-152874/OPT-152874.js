/* OPT-147690 START */
Insider.fns.onElementLoaded('#proceed-to-checkout > div', () => { /* OPT-152874 */
    Insider.dom('#proceed-to-checkout > div').text('Fechar pedido');
}).listen();
/* OPT-147690 END */
