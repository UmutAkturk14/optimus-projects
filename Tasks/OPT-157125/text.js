/* OPT-156593 START */
((self) => {
    'use strict';

    const builderIds = {
        /* OPT-157125 START */
        web: {
            daily: 563,
            dailyPurchase: 562,
        },
        mobile: {
            daily: 563,
            dailyPurchase: 562,
        }
        /* OPT-157125 END */
    }[Insider.browser.getPlatform()];

    const variationIds = {};

    Insider.fns.keys(builderIds).forEach((key) => {
        variationIds[key] = Insider.campaign.userSegment.getVariationsByBuilderId(builderIds[key])
            .filter((variation) => variation.type === 'n')
            .map((variation) => variation.vi);
    });

    const endpoints = [
        'https://abacus.api.useinsider.com/get-purchase-stats',
        'https://abacus.api.useinsider.com/view-stats'
    ];

    const partnerName = Insider.partner.name;
    const productId = Insider.systemRules.call('getCurrentProduct').id;

    const payloads = [
        {
            partner: partnerName,
            daily: true,
            rv: {},
            ms: {},
            noi: {},
            uniqueId: productId
        },
        {
            partner: partnerName,
            isUniqueView: true,
            campId: variationIds.dailyView,
            daily: true,
            rv: {},
            ms: {},
            noi: {},
            uniqueId: productId
        },
    ];

    const thresholdCoefficients = {
        /* OPT-157125 START */
        daily: 2,
        dailyPurchase: 1,
        minimumValue: 2,
        /* OPT-157125 END */
    };

    const comparisonStatistics = {
        daily: 0,
        dailyPurchase: 0,
    };

    self.init = () => {
        if (Insider.fns.objectValues(variationIds).every((variationId) => !!variationId)) {
            self.setCampaignStatus();
        }
    };

    self.setCampaignStatus = () => {
        Promise.all(self.fetchRequests()).then((responses) => {
            responses.some((data) => {
                const responseData = Insider.fns.parse(data || '{}');
                const attributeType = Insider.fns.keys(responseData)[0];
                const attributeCount = Insider.fns.objectValues(responseData)[0];

                if (attributeType in comparisonStatistics) {
                    comparisonStatistics[attributeType] = attributeCount * thresholdCoefficients[attributeType];
                }

                if (attributeCount > thresholdCoefficients.minimumValue) {
                    const { daily, dailyPurchase } = comparisonStatistics;
                    let selectedVariationId;

                    if (dailyPurchase > 2 ) { /* OPT-157125 */
                        selectedVariationId =
                  variationIds['dailyPurchase'][Math.floor(Math.random() * variationIds['dailyPurchase'].length)];
                    } else if (daily > 10) { /* OPT-157125 */
                        selectedVariationId =
                  variationIds['daily'][Math.floor(Math.random() * variationIds['daily'].length)];
                    }

                    if (selectedVariationId) {
                        self.showCampaign(selectedVariationId, attributeCount);
                    }

                    return true;
                }
            });
        });
    };

    self.fetchRequests = () => endpoints.map((endpoint, index) => {
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            }
        };

        fetchOptions.body = Insider.fns.encode(Insider.fns.stringify(payloads[index]));

        return fetch(endpoint, fetchOptions).then((response) => response.text()).catch((error) => {
            Insider.logger.log(`Request Error: ${ error }`);
        });
    });

    self.showCampaign = (variationId, attributeCount) => {
        Insider.campaign.info.clearVisibleCampaignsByType('ON-PAGE');
        Insider.campaign.info.show(variationId);

        Insider.fns.onElementLoaded(`.ins-preview-wrapper-${ variationId } .ins-dynamic-attribute`, ($element) => {
            $element.text(attributeCount);
        }).listen();
    };

    self.init();
})({});
/* OPT-156593 END */
