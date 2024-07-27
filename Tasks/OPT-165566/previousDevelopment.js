
/* OPT-156229 START */
((self) => {
    'use strict';

    const $previewWrapper = Insider.dom(templateConfig.selectors.previewWrapper);
    const hideImageClass = 'ins-hide-image';

    self.init = () => {
        if (camp.id === 0) {
            return;
        }

        if (document.readyState === 'complete') {
            self.checkEventStatus();
        } else {
            self.setWindowLoadEvent(self.checkEventStatus);
        }
    };

    self.checkEventStatus = () => {
        self.getPositionEligibility() ? self.showImage() : self.setEvents();
    };

    self.getPositionEligibility = () => {
        const $window = Insider.dom(window);

        return $previewWrapper.offset().top < ($window.scrollTop() + $window.height() + 100);
    };

    self.showImage = () => {
        $previewWrapper.find(`.${ hideImageClass }`).removeClass(hideImageClass);
    };

    self.setEvents = () => {
        Insider.eventManager.once(`scroll.on:scroll:${ camp.id }`, window, Insider.fns.throttle(() => {
            if (self.getPositionEligibility()) {
                self.showImage();
            }
        }, 1000));
    };

    self.setWindowLoadEvent = (callback) => {
        Insider.eventManager.once(`load.window:loaded:${ camp.id }`, window, callback);
    };

    self.init();

})({});
/* OPT-156229 END */
