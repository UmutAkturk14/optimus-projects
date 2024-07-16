/* OPT-84299 START */
var cityIds = ((window.dataLayer || []).filter(function (element) {
    return element.cityIds;
}).pop() || {}).cityIds;
var cityIds = [
'32260299', '29120299', '36970299'/* ZEN-157185 */
];
  
cityIds.indexOf(Insider.utils.getDataFromDataLayer('cityId')) > -1;
/*OPT-84299 END */