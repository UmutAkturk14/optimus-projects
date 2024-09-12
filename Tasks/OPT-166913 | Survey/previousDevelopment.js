/* OPT-164541 START */
Insider.__external.ShowSurveyCampaign164541 = (config) => {
    'use strict';

    const { survey } = config;
    const isMobile = Insider.browser.isMobile();
    const builderIds = {
        surveyS1: isMobile ? 1830 : 1829,
        surveyS2: isMobile ? 1832 : 1831,
        surveyS3: isMobile ? 1834 : 1833,
    };

    const variationIds = Insider.fns.keys(builderIds).reduce((accumulator, key) => {
        accumulator[key] = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderIds[key]);

        return accumulator;
    }, {});

    const activeVariationId = variationIds[survey];
    const pageUrls = {
        surveyS1: ['https://www.muangthai.co.th/th'],
        surveyS2: [
            'https://www.muangthai.co.th/th/article/health',
            'https://www.muangthai.co.th/th/article/tax'
        ],
        surveyS3: [
            'https://www.muangthai.co.th/th/whole-life-insurance',
            'https://www.muangthai.co.th/th/health-insurance',
            'https://www.muangthai.co.th/th/critical-illness-insurance',
            'https://www.muangthai.co.th/th/retirement-insurance',
            'https://www.muangthai.co.th/th/savings-insurance',
            'https://www.muangthai.co.th/th/personal-accident-insurance'
        ]
    }[survey];

    const storagePrefix = 'ins-campaign-seen-';
    const shownEligibility = Insider.fns.keys(variationIds).filter((key) => key !== survey)
        .every((key) => !Insider.storage.session.get(`${ storagePrefix }${ variationIds[key] }`));

    const pageEligibility = pageUrls.some((url) => Insider.fns.has(window.location.href, url));

    if (activeVariationId && Insider.segmentModules.newReturningUser('new') && shownEligibility && pageEligibility) {
        Insider.fns.onElementLoaded(`.ins-preview-wrapper-${ activeVariationId }`, () => {
            Insider.storage.session.set({
                name: `${ storagePrefix }${ activeVariationId }`,
                value: true
            });
        }).listen();

        return true;
    }
};

true;
/* OPT-164541 END */