/* OPT-152569 START */
const excludedLinks = [
    'nikko-narita',
    'kyoto/karasuma'
];

const onclickAttributeValue = Insider.dom('#SmartHeader_LnkHotelTop1').attr('onclick');

!excludedLinks.some((link) => Insider.fns.has(onclickAttributeValue, link));
/* OPT-152569 END  */
