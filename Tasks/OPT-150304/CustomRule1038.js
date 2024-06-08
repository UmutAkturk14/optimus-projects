/* OPT-139873 START */
(function (self) {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 962 : 963;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isOldUser = Insider.storage.localStorage.get('ins-logged-in-history') || false;
    const sessionStorageName = `ins-banner-seen-before-${ variationId }`;
    const timeSpentStorageName = `ins-time-spent-on-site-${ variationId }`;
    let currentTimeSpendOnSite = 0;
    const requiredTimeSpendOnSite = 15;
    let timer;

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        goal: `sp-custom-${ variationId }-1`,
        arrowBox: `ins-arrow-${ variationId }`,
        separator: `ins-separator-box-${ variationId }`,
        loginHeader: `ins-login-header-${ variationId }`,
        loginButton: `ins-login-button-${ variationId }`,
        registerButton: `ins-register-button-${ variationId }`,
        close: `ins-close-${ variationId }`
    };

    const campaignConfig = {
        oldUserCampaignText: 'Log In to enjoy Membership Benefits & Special Offers.',
        newUserCampaignText: 'Sign Up to enjoy Membership Benefits & Special Offers.',
        loginUrl: 'https://www.kiehls.com.sg/en_SG/account-login',
        registerUrl: 'https://www.kiehls.com.sg/en_SG/account-login?r=TG95YWx0eS1EYXNoYm9hcmQ%3D#tab=create-account',
        loginCTAContent: 'Login',
        registerCTAContent: 'Register'
    };

    const selectors = Insider.fns.keys(classes).reduce(function (createdSelector, key) {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        appendElement: '.l-header__top-nav-item.m-search'
    });

    self.init = function () {
        variationId && !Insider.systemRules.call('isUserLoggedIn') && !Insider.storage.session.get(sessionStorageName)
          && self.setTimerInterval();
    };

    self.setTimerInterval = function () {
        timer = setInterval(function () {
            self.setTimeSpendOnSite(Insider.storage.localStorage.get(timeSpentStorageName) || 0);
        }, 1000);
    };

    self.setTimeSpendOnSite = function (initialValue) {
        currentTimeSpendOnSite = initialValue;

        if (currentTimeSpendOnSite === requiredTimeSpendOnSite) {
            if (Insider.systemRules.call('isOnCategoryPage')) {
                Insider.campaign.custom.show(variationId);

                if (!Insider.campaign.isControlGroup(variationId)) {
                    self.reset();
                    self.buildCSS();
                    self.buildHTML();
                    self.setEvents();
                }
            }

            clearInterval(timer);
        } else {
            currentTimeSpendOnSite++;
        }

        Insider.storage.localStorage.set({
            name: timeSpentStorageName,
            value: currentTimeSpendOnSite
        });
    };

    self.reset = function () {
        Insider.dom(`${ selectors.style }, ${ selectors.wrapper }`).remove();
    };

    self.buildCSS = function () {
        const customStyle =
      `${ selectors.wrapper } {` +
          'display: inline-flex;' +
          'flex-direction: column;' +
          'position: absolute;' +
          'top: calc(50%);' +
          'z-index: 10;' +
          'width: 200px;' +
          'text-align: center;' +
          'margin-right: 3px;' +
          'margin-left: 3px;' +
          'border: 1px solid black;' +
          'background: white;' +
          'padding: 11px 0;' +
          'border-radius: 10px;' +
          'line-height: 0.85rem;' +
          'gap: 7px;' +
          'box-shadow: rgb(0 0 0 / 35%) 0px 5px 15px;' +
      `}${
          selectors.arrowBox } {` +
          'content: "";' +
          'background: white;' +
          'width: 16px;' +
          'height: 16px;' +
          'position: absolute;' +
          'transform: rotate(45deg);' +
          'z-index: 10;' +
          'top: -6px;' +
          'left: 36px;' +
      `}${
          selectors.separator } {` +
          'display: block;' +
          'height: 1px;' +
          'border: 0;' +
          'border-top: 1px solid #ccc;' +
      `}${
          selectors.loginHeader } {` +
          'font-size: 12px;' +
      `}${
          selectors.loginButton } {` +
          'text-decoration: unset !important;' +
          'font-weight: bold;' +
      `}${
          selectors.registerButton } {` +
          'text-decoration: unset !important;' +
          'font-weight: bold;' +
      `}${
          selectors.close } {` +
          'position: absolute;' +
          'top: 7px;' +
          'right: 8px;' +
          'font-size: 19px;' +
          'cursor: pointer;' +
      '}' +
      `@media only screen and (max-width: 1199px) {${
          selectors.wrapper } {` +
              'top: calc(50% + 35px);' +
              'z-index: 9;' +
              'right: 0;' +
          `}${
              selectors.arrowBox } {` +
              'right: 15px;' +
          '}' +
      '}';

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = function () {
        const outerHTML =
      `<div class="${ classes.wrapper }">` +
          `<div class="${ classes.close }">x</div>` +
          `<div class="${ classes.arrowBox }"></div>` +
          `<div class="${ classes.loginHeader }">${
              isOldUser ? campaignConfig.oldUserCampaignText : campaignConfig.newUserCampaignText
          }</div>` +
          `<a class="${ classes.loginButton } ${ classes.goal }" href="${ campaignConfig.loginUrl }">${
              campaignConfig.loginCTAContent
          }</a>` +
          `<div class="${ classes.separator }"></div>` +
          `<a class="${ classes.registerButton } ${ classes.goal }" ` +
              `href="${ campaignConfig.registerUrl }">${ campaignConfig.registerCTAContent
              }</a>` +
      '</div>';

        Insider.dom(selectors.appendElement).after(outerHTML);
    };

    self.setEvents = function () {
        Insider.eventManager.once(`click.close:button:${ variationId }`, selectors.close, function () {
            self.reset();

            Insider.campaign.info.storeCloseLog(variationId);

            Insider.campaign.info.updateCampaignCookie({ closed: true },
                Insider.campaign.custom.addCampaignIdPrefix(variationId));

            Insider.storage.session.set({
                name: sessionStorageName,
                value: true
            });
        });
    };

    return self.init();
})({});
/* OPT-139873 END */
