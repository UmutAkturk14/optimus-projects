/* OPT-154234 START */
const cityConfig = {
    cityIds: [
        '1720920299',
        '1547800299'
    ],
    macroCityIds: [
        '11080299',
        '11050299'
    ]
};

const userCityId = Insider.utils.getDataFromDataLayer('cityId');
const userMacroCityId = Insider.utils.getDataFromDataLayer('macroCityId');

Insider.fns.has(cityConfig.cityIds, userCityId) || Insider.fns.has(cityConfig.macroCityIds, userMacroCityId);
/* OPT-154234 END */
