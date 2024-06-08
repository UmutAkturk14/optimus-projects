/* OPT-154618 START */
Insider.eventManager.once(`click.close:sidebar:${ camp.id }`, ('.close-button-154618'), () => {
    Insider.dom('.reset-button-style-1503346604').click();
});

Insider.eventManager.once(`click.toggle:hide:button:${ camp.id }`, '.ins-preview-wrapper-1064', () => {
    Insider.dom('.close-button-icon-154618').toggle();
});
/* OPT-154618 END */
