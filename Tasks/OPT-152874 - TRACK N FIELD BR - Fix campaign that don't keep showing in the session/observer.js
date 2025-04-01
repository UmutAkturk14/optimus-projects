const observer152874 = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
                if (node instanceof Element && typeof node.closest === 'function') {
                    if (node.closest('.vtex-button')) {
                        Insider.dom('.vtex-add-to-cart-button-0-x-buttonText').text('Fechar pedido');
                    }
                }
            });
        }
    });
});

observer152874.observe(document.body, { childList: true, subtree: true });
