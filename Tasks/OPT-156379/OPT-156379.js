/* OPT-156379 START */
const pushId = 79;

Insider.__external.ajaxListenerSrtr22450((url, method) => {
    if (method === 'POST' && url.includes('token-collector')) {
        Insider.__external.SendTriggerPushById = function (pushId) {
            this.push = Insider.webPush.campaigns.filter((campaign) => (campaign.id.toString() === pushId.toString()))[0];
            this.otherSettings = (this.push.otherSettings || {});
            this.enums = {
                secondaryButtonType: 2,
                prefix: 'ins-wp-',
                displayed: 'step1-displayed',
                defaultAttributes: 'default-attributes',
                defaultAttributesPrefix: 'd_',
                customAttributesPrefix: 'c_',
                singlePushEndpoint: 'https://carrier.useinsider.com/v2/web-push/single-push',
            };
            Insider.worker.pm({
                type: 'getPushStorageData',
                success: function (pushStorageData) {
                    if (pushStorageData.insdrSubsId) {
                        this.pushStorageData = pushStorageData;
                        this.send();
                    }
                }.bind(this)
            });
        };
        Insider.__external.SendTriggerPushById.prototype = {
            constructor: Insider.__external.SendTriggerPushById,
            send() {
                if (this.otherSettings.frameVisibilityChange) {
                    Insider.eventManager.once(
                        `visibilitychange.${ this.push.id }`,
                        document,
                        this.visibilityChangeHandler.bind(this)
                    );
                } else {
                    this.request();
                }

                return true;
            },
            visibilityChangeHandler() {
                if (document.hidden) {
                    setTimeout(this.request.bind(this), this.otherSettings.frameVisibilityChangeTime);

                    return true;
                }

                return false;
            },
            request() {
                if (this.getStorage(this.push.id) || !this.hasValidPushLinks(this.push)) {
                    return false;
                }
                Insider.request.post({
                    url: this.enums.singlePushEndpoint,
                    headers: {
                        'Content-Type': 'application/json',
                        'partner': Insider.partner.name,
                    },
                    data: Insider.fns.stringify({
                        partner: Insider.partner.name,
                        campId: this.push.id,
                        userId: Insider.getUserId(),
                        browser: Insider.browser.getBrowserNameForWebPushToken(),
                        title: this.parsePushContent(this.push.title).content,
                        description: this.parsePushContent(this.push.description).content,
                        link: this.parsePushContent(this.push.link).content,
                        image: this.parsePushContent(this.push.image).content,
                        buttonFirstUrl: 'https://www.homyped.com.au/?insTestPush',
                        buttonSecondUrl: 'https://www.homyped.com.au/?insTestPush',
                        banner: this.parsePushContent(this.push.banner).content,
                        token: Insider.storage.localStorage.get('ins-wp-token')
                    }),
                });
                this.updateStorageData(this.push.id, Insider.dateHelper.addDay(this.push.ct));

                return true;
            },
            getStorage(pushId) {
                return Insider.storage.get(this.enums.prefix + pushId);
            },
            hasValidPushLinks(push) {
                return !this.isEmptyLink(push.link) && this.hasValidButtonSettings(push);
            },
            isEmptyLink(link) {
                return Insider.fns.isEmptyString(this.parsePushContent(link).content);
            },
            hasValidButtonSettings(push) {
                if (!push.ebs) {
                    return true;
                }

                return !(
                    this.isEmptyLink(push.buttonFirstUrl) ||
                this.isSecondaryActionButtonActive(push.bt) &&
                this.isEmptyLink(push.buttonSecondUrl)
                );
            },
            isSecondaryActionButtonActive(buttonType) {
                return buttonType === this.enums.secondaryButtonType;
            },
            parsePushContent(content) {
                const attributeExist = false;
                const placeholderMatcher = /{([^}]*)}/g;
                const dynamicParameterList = content?.match(placeholderMatcher);

                if (Insider.webPush.webPush.settings.webPushDynamicContent && dynamicParameterList) {
                    dynamicParameterList.forEach(function (parameter) {
                        const dynamicParameter = parameter.replace(/[{}]/g, '').split('|');
                        const attributeKey = dynamicParameter[0];
                        const replaceValue = dynamicParameter[1];
                        const defaultAttributes = Insider.storage.get(this.enums.defaultAttributes);
                        const customAttributes = Insider.storageAccessor.customAttributes();
                        const attributes = {};

                        if (Insider.fns.startsWith(attributeKey, this.enums.defaultAttributesPrefix)) {
                            attributeKey = attributeKey.substr(this.enums.defaultAttributesPrefix.length);
                            attributes = defaultAttributes;
                        } else if (Insider.fns.startsWith(attributeKey, this.enums.customAttributesPrefix)) {
                            attributeKey = attributeKey.substr(this.enums.customAttributesPrefix.length);
                            attributes = customAttributes;
                        } else {
                            attributes = Insider.fns.assign(defaultAttributes, customAttributes);
                        }

                        if (attributes && attributes[attributeKey]) {
                            replaceValue = decodeURIComponent(attributes[attributeKey]);
                            attributeExist = true;
                        }
                        content = this.getParameter(content, parameter, replaceValue);
                    }.bind(this));
                }

                return {
                    content,
                    attributeExist
                };
            },
            getParameter(content, parameterName, parameterValue) {
                return content.replace(parameterName, parameterValue || '');
            },
            updateStorageData(pushId, expires) {
                const value = {
                    viDa: Insider.dateHelper.now()
                };

                value[this.enums.displayed] = true;
                Insider.storage.update({
                    name: this.enums.prefix + pushId,
                    value,
                    expires
                });

                return true;
            },
        };

        setTimeout(() => {
            new Insider.__external.SendTriggerPushById(pushId);
        }, 1000);
    }
});
/* OPT-156379 END */
