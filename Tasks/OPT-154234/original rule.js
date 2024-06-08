/* OPT-151759 START */
const cityConfig = {
    'Москва': {
        cityId: '1720920299',
        macroCityId: '11080299'
    },
    'Санкт-Петербург': {
        cityId: '1547800299',
        macroCityId: '11050299'
    }
};

const isMatchedCity = (window.dataLayer ?? [])
    .filter(({ cityId, macroCityId, cityName }) => cityId && macroCityId && cityName)
    .some((filteredCityData) => {
        const expectedCity = cityConfig[filteredCityData.cityName];

        return expectedCity && Insider.fns.keys(expectedCity).every((id) => filteredCityData[id] === expectedCity[id]);
    });

isMatchedCity;
/* OPT-151759 END */
