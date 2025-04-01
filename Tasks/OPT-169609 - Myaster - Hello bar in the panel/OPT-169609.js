/* OPT-169609 START */
((self) => {
    'use strict';

    const builderId = 647;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isEligiblePartner = Insider.fns.hasParameter('myaster');

    const classes = {
        badge: `ins-custom-badge-${ variationId }`,
        badgeWrapper: `ins-custom-badge-wrapper-${ variationId }`,
        badgeText: `ins-custom-badge-text-${ variationId }`,
        badgeSvg: `ins-custom-badge-svg-${ variationId }`,
        closeButton: `ins-custom-close-button-${ variationId }`,
        hidden: `ins-custom-hidden-element-${ variationId }`,
        join: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        appendLocation: '.router-view'
    });

    self.init = () => {
        if (isEligiblePartner && variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.buildCSS();
                self.buildHTML();
                self.setEvents();
            }

            return true;
        }
    };

    self.reset = () => {
        const { style, badgeWrapper } = selectors;

        Insider.dom(`${ style }, ${ badgeWrapper }`).remove();
    };

    self.buildCSS = () => {
        const { badgeWrapper, badge, closeButton, hidden } = selectors;

        const customStyle =
        `${ badgeWrapper } {
            display: flex;
            justify-content: space-between;
            padding: 16px 32px;
            font-weight: 600;
            background-color: #e7ab29 !important;
            color: #2c3546 !important;
            position: relative;
        }
        ${ badge } {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 2vw;
        }
        ${ closeButton } {
            position: absolute;
            top: 1vh !important;
            cursor: pointer;
        }
        ${ hidden } {
            display: none !important;
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const { badge, badgeWrapper, badgeText, badgeSvg, closeButton, join } = classes;

        const text = Insider.fns.hasParameter('launch')
            ? 'Have you excluded Global Control Group?'
            : 'Ensure that you exclude global control group from your target segment';

        const html =
        `<div class="${ badgeWrapper } ${ join }">
            <div class="${ badge }">
                <svg width="24" height="24" class="${ badgeSvg }">
                    <use href="/sprite.svg#filled-caution-triangle"></use>
                </svg>
                <div class="${ badgeText }">
                    <p>${ text }</p>
                </div>
            </div>
            <div>
                <svg width="20" height="20" class="${ closeButton }">
                    <use href="/sprite.svg#line-close-netural"></use>
                </svg>
            </div>
        </div>`;

        Insider.dom(selectors.appendLocation).prepend(html);
    };

    self.setEvents = () => {
        const { closeButton, badgeWrapper } = selectors;

        Insider.eventManager.once(`click.close:button:${ variationId }`, closeButton, () => {
            Insider.utils.opt.sendCustomGoal(builderId, 107, true);
            Insider.dom(badgeWrapper).addClass(classes.hidden);
        });
    };

    return self.init();
})({});
/* OPT-169609 END */