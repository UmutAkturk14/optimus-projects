/* OPT-147690 START */
Insider.fns.onElementLoaded('.vtex-minicart-2-x-drawer.vtex-minicart-2-x-opened', () => {
    setTimeout(() => {
        Insider.dom('#proceed-to-checkout > div').text('Fechar pedido');
    }, 1000);
}).listen();
/* OPT-147690 END */
