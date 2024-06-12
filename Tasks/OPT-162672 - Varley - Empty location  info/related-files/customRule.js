/* ZEN-168515 START */
const isDesktop = Insider.browser.isDesktop();
const builderId = isDesktop ? 22 : 21;
const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

(() => {
    fetch(`https://locationv2.api.useinsider.com/?v=2&pId=${ Insider.partner.partnerId }`)
        .then((response) => response.json()).then((response) => {
            if (typeof response === 'object') {
                locationCheck(response.cityName);
            }
        });
})({});

const locationCheck = (city) => {
    Insider.request.post({
        url: 'https://cronus.useinsider.com/api/inone/product-list/check',
        data: Insider.fns.stringify({
            partnerName: Insider.partner.name,
            lists: {
                londoncities_ZEN168515: [city],
            },
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        success(xhr) {
            const productList = Insider.fns.parse(xhr.response).data.londoncities_ZEN168515;

            if (productList.length > 0 && Insider.fns.parseURL().pathname === '/') { /* ZEN-171235 */
                Insider.campaign.custom.show(variationId);
            }
        },
        error(xhr) {
            Insider.logger.log(`Product List Checker - error - ${ xhr.body }`);
        }
    });
};

false;
/* ZEN-168515 END */
