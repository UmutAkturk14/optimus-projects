const parseLocationData = {
    country: 'AE',
    cName: 'United Arab Emirates',
    city: 'Dubai',
    geoId: 'DU',
    latitude: '2e13bd43dfbce1b92fdd039a27fc41fc',
    longitude: 'c6d6dc8ba8a63e8cfea7f61eb20f2b8c'
};

Insider.storage.localStorage.set({
    name: 'userLocation',
    value: parseLocationData
});
