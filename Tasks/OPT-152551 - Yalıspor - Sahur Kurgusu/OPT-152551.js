/* OPT-152551 START */
const cart = dataLayer.filter((element) => element.event === 'cart')[0] ?? {};
const newSeasonProducts = cart?.products?.filter((product) => product.dimension8 === product.dimension10) ?? [];
const totalCartPrice = newSeasonProducts.reduce((total, product) =>
    total + parseFloat(product?.price ?? 0), 0);

totalCartPrice < 3999;
/* OPT-152551 END */

//
/* OPT-152551 START */
const cart = dataLayer.filter((element) => element.event === 'cart')[0] ?? {};
const newSeasonProducts = cart?.products?.filter((product) => product.dimension8 === product.dimension10) ?? [];
const totalCartPrice = newSeasonProducts.reduce((total, product) =>
    total + (parseFloat(product?.price ?? 0) * (product?.quantity ?? 1)), 0);

totalCartPrice < 3999;
/* OPT-152551 END */
const checkCampaign = () => {
  console.log(Insider.systemRules.isUserLoggedIn());
  console.log(!Insider.systemRules.isUserLoggedIn());
  Insider.campaign.info.clearVisibleCampaignsByType('ON-PAGE');
  Insider.campaign.info.show(1746);
}

checkCampaign();