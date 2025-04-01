/* OPT-142367 START */
((self) => {
    'use strict';

    const builderId = 634;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const selectors = {
        button: `.ins-preview-wrapper-${ variationId } #link-button-1503346604`,
        partnerStoreName: '.storeName:contains(Click-&-Collect)',
        sideButton: '.ins-side-menu-container'
    };

    const goals = {
        sideMenuExpandGoal: 109,
        clickAndCollectGoal: 110
    };

    self.setEvents = () => {
        const { button, sideButton, partnerStoreName } = selectors;
        const { sideMenuExpandGoal, clickAndCollectGoal } = goals;

        Insider.eventManager.once(`pointerup.select:store:${ variationId }`, button, (event) => event.isPrimary &&
            Insider.dom(partnerStoreName).click());

        Insider.eventManager.once(`click.send:goal:${ variationId }`,
            `${ partnerStoreName }, ${ button }, ${ sideButton }`, (event) => {
                const isSideButton = Insider.dom(event.currentTarget).getNode(0) === Insider.dom(sideButton).getNode(0);

                Insider.fns.isFunction(Insider.__external.sendCustomGoal) ?
                    Insider.__external
                        .sendCustomGoal(builderId, isSideButton ? sideMenuExpandGoal : clickAndCollectGoal, true) :
                    Insider.logger.log('sendCustomGoal is not a function');
            });
    };

    Insider.fns.onElementLoaded(`${ selectors.partnerStoreName }:visible`, () => {
        !Insider.campaign.isControlGroup(Number(variationId)) && self.setEvents();

        Insider.campaign.info.show(variationId);
    }).listen();
})({});

false;
/* OPT-142367 END */
