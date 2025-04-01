/* OPT-164578 START */
((self) => {
    'use strict';

    const builderId = 123;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isControlGroup = Insider.campaign.isControlGroup(variationId);

    const classes = {
        join: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        configButton: `ins-custom-config-button-${ variationId }`,
        productPageButton: `ins-custom-product-page-button-${ variationId }`,
        configButtonSvg: `ins-custom-config-button-svg-${ variationId }`,
        configButtonText: `ins-custom-config-button-text-${ variationId }`,
        configButtonTextWrapper: `ins-custom-config-button-text-wrapper-${ variationId }`,
        productPageButtonSvg: `ins-custom-product-page-button-svg-${ variationId }`,
        ghostButtonWrapper: `ins-custom-ghost-button-wrapper-${ variationId }`,
        configButtonWrapper: `ins-custom-config-button-wrapper-${ variationId }`,
        redButton: `ins-custom-red-button-${ variationId }`,
        whiteButton: `ins-custom-white-button-${ variationId }`,
        blackSingleButton: `ins-custom-black-single-button-${ variationId }`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        productListWrapper: 'section[data-testid="category-grid"]',
        appendLocation: 'span:last',
        productTitle: 'a:first'
    });

    const textConfig = {
        configurator: 'Samenstellen',
        productPage: 'Bekjik product',
        blackButton: 'Boxspring naar eigen wens samenstellen'
    };

    const configuratorUrls = [{
        urlKey: 'https://www.swisssense.nl/boxspring-capella-cresto',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-CA-Cresto&search=8787879002114&sku=1002'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-capella-falco',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-CA-Falco&search=8787879002138&sku=1005'
    },
    {
        urlKey: 'https://www.www.swisssense.nl/boxspring-diks-artesano',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=Diks_Artesano&search=8787879006556&sku=1101'
    },
    {
        urlKey: 'https://www.www.swisssense.nl/boxspring-diks-cellini',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=Diks_Cellini&search=8787879007508&sku=1102'
    },
    {
        urlKey: 'https://www.www.swisssense.nl/boxspring-diks-floreana',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=Diks_Floreana&search=8787879006549&sku=1103'
    },
    {
        urlKey: 'https://www.www.swisssense.nl/boxspring-diks-ivoire',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=Diks_Ivoire&search=8787879007515&sku=1104'
    },
    {
        urlKey: 'https://www.www.swisssense.nl/boxspring-diks-sereno',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=Diks_Sereno&search=8787879006563&sku=1105'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-night-atlanta',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-NI-Atlanta&search=8787879002091&sku=1046'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-night-barcelona',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-NI-Barcelon&search=8787879001957&sku=1047'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-night-boston',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-NI-Boston&search=8787879002008&sku=1048'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-night-florence',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-NI-Flor-STD&search=8787879002022&sku=1049'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-night-hamburg',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-NI-Hamburg&search=8787879001995&sku=1050'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-night-sydney',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-NI-Sydn-STD&search=8787879002077&sku=1051'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-night-vienna',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-NI-Vien-STD&search=8787879001988&sku=1052'
    },
    {
        urlKey: 'https://www.swisssense.nl/van-der-valk-hotelboxspring-ariana',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HB-Ariana&search=8787879003661&sku=1071'
    },
    {
        urlKey: 'https://www.swisssense.nl/van-der-valk-hotelboxspring-ariana-deluxe',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HB-ArianDL&search=8787879003685&sku=1072'
    },
    {
        urlKey: 'https://www.swisssense.nl/van-der-valk-hotelboxspring-charlotte',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HB-Charlott&search=8787879003708&sku=1073'
    },
    {
        urlKey: 'https://www.swisssense.nl/van-der-valk-hotelboxspring-charlotte-deluxe',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HB-CharlDL&search=8787879003746&sku=1074'
    },
    {
        urlKey: 'https://www.swisssense.nl/van-der-valk-hotelboxspring-heritage',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HB-Heritage&search=8787879003845&sku=1076'
    },
    {
        urlKey: 'https://www.swisssense.nl/van-der-valk-hotelboxspring-nora',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HB-Nora&search=8787879003760&sku=1077'
    },
    {
        urlKey: 'https://www.swisssense.nl/van-der-valk-hotelboxspring-nora-deluxe',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HB-NoraDL&search=8787879003784&sku=1078'
    },
    {
        urlKey: 'https://www.swisssense.nl/gestoffeerd-ledikant-dream-stellar',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-DR-Stellar&search=8787879004569&sku=401'
    },
    {
        urlKey: 'https://www.swisssense.nl/gestoffeerd-ledikant-dream-lunar',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-DR-Lunar&search=8787222005436&sku=402'
    },
    {
        urlKey: 'https://www.swisssense.nl/gestoffeerd-ledikant-dream-moon',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-DR-Moon&search=8787879005443&sku=403'
    },
    {
        urlKey: 'https://www.swisssense.nl/tiener-boxspring-jolie',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=TB-Jolie&search=8787879003043&sku=1069'
    },
    {
        urlKey: 'https://www.swisssense.nl/tiener-boxspring-maxim',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=TB-Maxim&search=8787879003111&sku=1070'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-120',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO120&search=8787273337348&sku=1201'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-135',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO135&search=8787879007867&sku=1203'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-140',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO140-STD&search=8787879007850&sku=1204'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-160',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO160&search=8744879007355&sku=1205'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-170',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO170&search=8787879007966&sku=1207'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-195',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO195&search=8787879004279&sku=1208'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-240',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO240-STD&search=8787879008024&sku=1209'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-320',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO320-STD&search=8787879007836&sku=1212'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-330',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO330&search=8787879001568&sku=1214'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-340',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO340-STD&search=8787879001575&sku=1215'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-350',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO350-STD&search=8787879001582&sku=1216'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-400',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO400-STD&search=8787879001704&sku=1217'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-405v',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO405V&search=8787879001841&sku=1220'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-415',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO415-STD&search=8787879001858&sku=1221'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-500',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO500&search=8787879001919&sku=1225'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-smart-storage-02',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB_SMA_02_STD&search=8500000000533&sku=1226'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-smart-storage-01',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB_SMA_01_STD&search=8500000000526&sku=1227'
    },
    {
        urlKey: 'https://www.swisssense.nl/gestoffeerd-ledikant-dream-star',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-DR-Star&search=8787879005504&sku=305'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-sparkle-deluxe',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-OO-Orion&search=8500000028759&sku=1950'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-online-only-spirit-deluxe',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-WO-Spir-DL&search=8787879007621&sku=1951'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-sparkle',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-WO-Sparkle&search=8787879001469&sku=1960'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-online-only-spirit',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-WO-Spirit&search=8787879001513&sku=1961'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-smart-storage-03',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB_SMA_03_STD&search=8500000000540&sku=1228'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-lifestyle-pepper',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-LI-Pepp-STD&search=8500000002766&sku=1303'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-lifestyle-cinnamon',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-LI-Cinn-STD&search=8500000002797&sku=1305'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-lifestyle-ginger',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-LI-Ging-STD&search=8500000002858&sku=1304'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-405-n',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO405N&search=8500000001868&sku=1229'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-180',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO180-STD&search=8500000001646&sku=1231'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspringbett-capella-mosso',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-CA-Mosso&search=8500000002643&sku=1010'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-seasons',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO-Seas-STD&search=8500000002674&sku=1230'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-510',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO510&search=8500000001448&sku=1232'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-510-deluxe',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO510DL&search=8500000001462&sku=1233'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-lifestyle-thyme',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-LI-Thym-STD&search=8500000000977&sku=1301'
    },
    {
        urlKey: 'https://www.swisssense.nl/bedframe-balance-focus',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-BFFocus&search=8500000003435&sku=410'
    },
    {
        urlKey: 'https://www.swisssense.nl/bedframe-balance-pure',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-BFPure&search=8500000004036&sku=411'
    },
    {
        urlKey: 'https://www.swisssense.nl/bedframe-balance-raw',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-BFRAW&search=8500000004333&sku=412'
    },
    {
        urlKey: 'https://www.swisssense.nl/bedframe-balance-timeless',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-BFTimeless&search=8500000004326&sku=413'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-online-only-snooze-adjustable-deluxe',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-WO-Snooze&search=8500000004432&sku=1971'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-lifestyle-by-vtwonen-thyme-voorraad',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-VRD-LiThyme&search=8500000007334&sku=1093'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-250',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO250-STD&search=8500000007068&sku=1088'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-lifestyle-by-vtwonen-basil',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-LI-Basi-STD&search=8500000006955&sku=1089'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-essential',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=Home_Essential&search=8500000007037&sku=1091'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-seasons-op-voorraad',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=VRD-HOSEAS&search=8500000007358&sku=1094'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-250-op-voorraad',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-VRD-HO250&search=8500000007808&sku=1095'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-310',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO310-STD&search=8787879001506&sku=1211'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-royal-babylon',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-RO-Baby-STD&search=8500000008539&sku=1401'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-royal-atlantis',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-RO-Atla-STD&search=8500000008508&sku=1402'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-royal-aurora',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-RO-Auro-STD&search=8500000008461&sku=1403'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-royal-serengeti',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-RO-Sere-STD&search=8500000008126&sku=1404'
    },
    {
        urlKey: 'https://www.swisssense.nl/bedframe-balance-focus-op-voorraad',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-BFFOCUS-VRD&search=8500000019795&sku=418'
    },
    {
        urlKey: 'https://www.swisssense.nl/bedframe-balance-pure-op-voorraad',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-BFPURE-VRD&search=8787879010911&sku=419'
    },
    {
        urlKey: 'https://www.swisssense.nl/bedframe-balance-raw-op-voorraad',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-VRD-Raw&search=8500000019801&sku=420'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-royal-humar',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-RO-Huma-STD&search=8500000008843&sku=1405'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-online-only-rest',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-WO-Rest&search=8500000007662&sku=1090'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-royal-metropolis',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-RO-Metr-STD&search=8500000008751&sku=1406'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-royal-olympus',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-RO-Olym-STD&search=8500000008829&sku=1407'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-royal-luxor',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-RO-Luxo-STD&search=8500000008720&sku=1408'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-online-only-relax-deluxe',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-WO-Relax&search=8500000004425&sku=1970'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-capella-novaro',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-CA-Nova-STD&search=8500000009635&sku=1501'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-capella-ravello',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-CA-Rave-STD&search=8500000009642&sku=1502'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-capella-modeno',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-CA-Mode-STD&search=8500000009659&sku=1503'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-capella-matero',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-CA-Matero&search=8500000009703&sku=1504'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-capella-castello',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-CA-Castello&search=8500000008966&sku=1505'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-sparkle-deluxe-v',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=WO-SPAR-DL&search=8787879007614&sku=1950-v'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-web-only-spirit-deluxe-v',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=WO-SPIR-DL&search=8787879007621&sku=1951-v'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-410',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO410-STD&search=8500000010013&sku=1237'
    },
    {
        urlKey: 'https://www.swisssense.nl/bedframe-balance-tender',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-BFTender&search=8500000010167&sku=421'
    },
    {
        urlKey: 'https://www.swisssense.nl/bedframe-balance-tender-op-voorraad',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-VRD-Tender&search=8787879013783&sku=422'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-101',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=HO101&search=8500000010792&sku=1238'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-101-op-voorraad',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=VRD-HO101-LDG&search=8787879008734&sku=1239'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-102-op-voorraad',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-VRD-HO102&search=8500000011089&sku=1241'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-102',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO102-STD&search=8500000010679&sku=1240'
    },
    {
        urlKey: 'https://www.swisssense.nl/gestoffeerd-bedframe-online-only-dream-comet',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-VRD-Comet&search=8500000014561&sku=423'
    },
    {
        urlKey: 'https://www.swisssense.nl/gestoffeerd-bedframe-online-only-dream-cosmos',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-VRD-Cosmos&search=8500000014578&sku=424'
    },
    {
        urlKey: 'https://www.swisssense.nl/gestoffeerd-bedframe-online-only-dream-galaxy',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-VRD-Galaxy&search=8500000014585&sku=425'
    },
    {
        urlKey: 'https://www.swisssense.nl/bedframe-balance-gentle',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=CMS_Bed_Gentle&search=8500000014912&sku=426'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-101-op-voorraad-mercato-greige',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=VRD-HO101-MG&search=8500000011072&sku=1972'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-103',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO103-STD&search=8500000020098&sku=1973'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-103-voorraad',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-VRD-HO103&search=8500000021736&sku=1974'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-180-voorraad',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=VRD-HO180&search=8500000001936&sku=1235'
    },
    {
        urlKey: 'https://www.swisssense.nl/box-web-only-serenity',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-FO-Serenity&search=8787879010775&sku=1978'
    },
    {
        urlKey: 'https://www.swisssense.nl/box-web-only-soothing',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-FO-Soothing&search=8787879010768&sku=1979'
    },
    {
        urlKey: 'https://www.swisssense.nl/box-web-only-calmness',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-FO-Calmness&search=8787879010782&sku=1980'
    },
    {
        urlKey: 'https://www.swisssense.nl/box-web-only-embrace',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-FO-Embrace&search=8500000022610&sku=1981'
    },
    {
        urlKey: 'https://www.swisssense.nl/box-web-only-smooth',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-FO-Smooth&search=8787879010836&sku=1982'
    },
    {
        urlKey: 'https://www.swisssense.nl/tienerbed-justin',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-TB-Just-STD&search=8500000024294&sku=1984'
    },
    {
        urlKey: 'https://www.swisssense.nl/tienerbed-nicki',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-TB-Nick-STD&search=8500000024287&sku=1985'
    },
    {
        urlKey: 'https://www.swisssense.nl/gestoffeerd-bedframe-capella-celia-op-voorraad',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-VRD-Celia&search=8500000027530&sku=1096'
    },
    {
        urlKey: 'https://www.swisssense.nl/gestoffeerd-bedframe-home-51-op-voorraad',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-VRD-HO51&search=8500000027523&sku=1097'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-lifestyle-by-vtwonen-pepper-op-voorraad',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-VRD-LiPepp&search=8500000027509&sku=1298'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-105',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO105-STD&search=8787879013974&sku=1242'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-105-voorraad',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-VRD-HO105&search=8787879014018&sku=1243'
    },
    {
        urlKey: 'https://www.swisssense.nl/bedframe-balance-timeless-op-voorraad',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-BFTIME-VRD&search=8500000028193&sku=427'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-night-milan',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-NI-Mila-STD&search=8500000028308&sku=1053'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-capella-cuscino',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-CA-Cusc-STD&search=8500000028292&sku=1506'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-online-only-vela',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-OO-Vela&search=8500000028735&sku=1507'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-223',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO223-STD&search=8787879014155&sku=164289'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-capella-celia',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-CA-Celi-STD&search=8787879014148&sku=164328'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-online-only-lynx',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-OO-Lynx&search=8500000028742&sku=1508'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-capella-cuscino-op-voorraad',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-VRD-Cuscino&search=8787879015312&sku=1986'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-online-only-orion',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-OO-Orion&search=8500000028759&sku=1509'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-online-only-gemini',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-OO-Gemini&search=8500000028766&sku=1510'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-online-only-corvus',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-OO-Corvus&search=8500000028773&sku=1511'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-online-only-pegasus',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-OO-Pegasus&search=8500000028780&sku=1512'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-406-split',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO406-S-STD&search=8500000030080&sku=1987'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-home-406',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-HO406-STD&search=8500000030073&sku=1988'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-start',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-BX-Start&search=8500000030172&sku=1989'
    },
    {
        urlKey: 'https://www.swisssense.nl/polsterbett-night-santiago',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-BF-NI-Santi&search=8500000030295&sku=1019'
    },
    {
        urlKey: 'https://www.swisssense.nl/polsterbett-night-saigon',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-BF-NI-Saigo&search=8500000030301&sku=1020'
    },
    {
        urlKey: 'https://www.swisssense.nl/polsterbett-night-rio',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-BF-NI-Rio&search=8500000030318&sku=1021'
    },
    {
        urlKey: 'https://www.swisssense.nl/boxspring-royal-horizon',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-RO-Hori-STD&search=8500000031582&sku=169086'
    },
    {
        urlKey: 'https://www.swisssense.nl/gestoffeerd-bedframe-night-santiago-snel-leverbaar',
        configuratorUrl: 'https://www.swisssense.nl/configurator?catalogAlias=A-WEB-VRD-NI-SANT&search=8787879015626&sku=205759'
    }];

    self.init = () => {
        if (variationId) {
            if (!isControlGroup) {
                self.reset();
                self.buildCSS();
                self.setCampaign();
                self.sendGoal();
            }

            return true;
        }
    };

    self.reset = () => {
        const { style, wrapper } = selectors;

        Insider.dom(`${ style }, ${ wrapper }`).remove();

    };

    self.buildCSS = () => {
        const { wrapper, configButton, configButtonSvg, configButtonTextWrapper,
            configurationPageLink, configButtonWrapper, ghostButtonWrapper, productPageButton,
            redButton, whiteButton, blackSingleButton } = selectors;

        const customStyle =
        `${ wrapper } {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            height: 50px;
            gap: 1vw;
        }
        ${ wrapper } p {
            font-size: 0.7rem;
        }
        ${ configButtonTextWrapper } {
            margin-left: 0.5vw;
        }
        ${ configButtonWrapper } {
            height: 6vh !important;
            width: 100% !important;
        }
        ${ ghostButtonWrapper } {
            height: 6vh !important;
            width: 100% !important;
        }
        ${ ghostButtonWrapper } a {
            display: flex;
        }
        ${ productPageButton } {
            border: 1px solid;
            padding 10px 5px;
            border-radius: 6px;
            height: 6vh !important;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100% !important;
        }
        ${ wrapper } a {
            width: 100% !important;
        }
        ${ configurationPageLink } {
            background-color: red;
        }
        ${ configButton } {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px 5px;
            border-radius: 6px;
            height: 6vh !important;
        }
        ${ configButtonSvg } {
            height: 20px;
            width: 20px;
        }
        ${ redButton } {
            background-color: #E61E51;
        }
        ${ redButton } svg path {
            fill: #ffffff;
        }
        ${ whiteButton } {
            background-color: #ffffff;
            border: 1px solid #E61E51;
        }
        ${ whiteButton } svg path {
            fill: #E61E51;
        }
        ${ blackSingleButton } {
            background-color: #000000;
        }
        ${ blackSingleButton } p {
            color: #ffffff;
            font-size: 0.6rem;
        }
        @media (max-width: 1225px) {
            ${ wrapper } p {
                font-size: 0.6rem;
            }
            ${ blackSingleButton } p {
                font-size: 0.5rem;
            }
        }
        `;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.setCampaign = () => {
        const { appendLocation, productListWrapper, productTitle } = selectors;
        const $wrapper = Insider.dom(productListWrapper);
        const $products = $wrapper.children();

        $products.accessNodes((node) => {
            const $node = Insider.dom(node);
            const $appendElement = $node.find(appendLocation);
            const productPageLink = $node.find(productTitle).attr('href');
            const matchProduct = (product) => product.urlKey === productPageLink;

            if (configuratorUrls.some(matchProduct)) {
                const matchedProduct = configuratorUrls.find(matchProduct);
                const campaignHTML = self.buildHTML(matchedProduct.configuratorUrl, productPageLink);

                $appendElement.after(campaignHTML);
            }
        });
    };

    self.buildHTML = (configurationPageLink, productPageLink) => {
        const { wrapper, join, productPageButton, configButton, configButtonSvg, configButtonText,
            configButtonTextWrapper, configButtonWrapper, ghostButtonWrapper, productPageButtonSvg,
            redButton, whiteButton, blackSingleButton } = classes;
        const { configurator, productPage, blackButton } = textConfig;

        const buttonClass = {
            c186: redButton,
            c187: whiteButton,
            c188: blackSingleButton
        }[variationId];

        const isSingleButton = buttonClass === blackSingleButton;
        const ghostButton =
        `<div class="${ ghostButtonWrapper } ${ join }">
            <a href="${ productPageLink }">
                <div class="${ productPageButton }">
                    <p>${ productPage }</p>
                    <div class="${ productPageButtonSvg }">
                        <svg fill="#000000" height="15px" width="15px" version="1.1" id="XMLID_287_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="next"> <g> <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 "></polygon> </g> </g> </g></svg>
                    </div>
                </div>
            </a>
        </div>`;

        const campaignHTML =
        `<div class="${ wrapper }">
            <div class="${ configButtonWrapper }">
                <a href="${ configurationPageLink }">
                    <div class="${ configButton } ${ buttonClass }">
                        <div class="${ configButtonSvg }">
                            <svg version="1.1" id="SETTINGS" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"   viewBox="0 0 1800 1800" enable-background="new 0 0 1800 1800" xml:space="preserve" fill="#ffffff" stroke="#ffffff">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <g>
                                        <path d="M1468.436,32.467v188.211c-98.748,15.249-174.595,100.822-174.595,203.777s75.847,188.521,174.595,203.777 v1139.302c0,17.453,14.146,31.608,31.607,31.608c17.454,0,31.609-14.155,31.609-31.608V628.232 c98.748-15.257,174.59-100.822,174.59-203.777s-75.842-188.529-174.59-203.777V32.467c0-17.454-14.155-31.608-31.609-31.608 C1482.581,0.858,1468.436,15.013,1468.436,32.467z M1643.029,424.455c0,67.979-47.703,124.986-111.377,139.423 c-10.179,2.302-20.744,3.563-31.609,3.563s-21.43-1.261-31.607-3.563c-63.684-14.438-111.378-71.444-111.378-139.423 c0-67.988,47.694-124.995,111.378-139.424c10.178-2.311,20.742-3.563,31.607-3.563s21.431,1.252,31.609,3.563 C1595.326,299.46,1643.029,356.467,1643.029,424.455z"></path>
                                        <path d="M331.574,1767.534V628.232c98.758-15.257,174.603-100.822,174.603-203.777s-75.845-188.529-174.603-203.777 V32.467c0-17.454-14.146-31.608-31.608-31.608c-17.454,0-31.608,14.155-31.608,31.608v188.211 C169.609,235.926,93.763,321.5,93.763,424.455s75.846,188.521,174.594,203.777v1139.302c0,17.453,14.155,31.608,31.608,31.608 C317.428,1799.143,331.574,1784.987,331.574,1767.534z M156.98,424.455c0-67.988,47.703-124.995,111.377-139.424 c10.178-2.311,20.752-3.563,31.608-3.563c10.865,0,21.431,1.252,31.608,3.563c63.684,14.429,111.387,71.436,111.387,139.424 c0,67.979-47.703,124.986-111.387,139.423c-10.178,2.302-20.743,3.563-31.608,3.563c-10.856,0-21.431-1.261-31.608-3.563 C204.683,549.441,156.98,492.434,156.98,424.455z"></path>
                                        <path d="M931.617,1767.534V1419.51c98.748-15.257,174.594-100.822,174.594-203.777s-75.846-188.529-174.594-203.777 V32.467c0-17.454-14.154-31.608-31.608-31.608c-17.462,0-31.608,14.155-31.608,31.608v979.488 c-98.757,15.248-174.603,100.822-174.603,203.777s75.846,188.521,174.603,203.777v348.024c0,17.453,14.146,31.608,31.608,31.608 C917.463,1799.143,931.617,1784.987,931.617,1767.534z M757.015,1215.732c0-67.986,47.703-124.995,111.386-139.424 c10.177-2.309,20.743-3.563,31.608-3.563c10.865,0,21.431,1.254,31.608,3.563c63.676,14.429,111.378,71.438,111.378,139.424 c0,67.979-47.702,124.986-111.378,139.424c-10.178,2.303-20.743,3.563-31.608,3.563c-10.865,0-21.431-1.26-31.608-3.563 C804.717,1340.719,757.015,1283.711,757.015,1215.732z"></path>
                                    </g>
                                </g>
                            </svg>
                        </div>
                        <div class="${ configButtonTextWrapper }">
                            <p class="${ configButtonText }">${ isSingleButton ? blackButton : configurator }</p>
                        </div>
                    </div>
                </a>
            </div>
            ${ !isSingleButton ? ghostButton : '' }
        </div>`;

        return campaignHTML;
    };

    self.sendGoal = () => {
        Insider.eventManager.once(`click.send:join:goal:${ variationId }`, selectors.join, () => {
            if (!Insider.campaign.getCampaignStorage(variationId)?.joined) {
                Insider.campaign.custom.storeJoinLog(variationId);

                Insider.campaign.updateCampaignCookie({
                    joined: true
                }, Insider.campaign.custom.addCampaignIdPrefix(variationId));
            }
        });
    };

    return self.init();
})({});
/* OPT-164578 END */
