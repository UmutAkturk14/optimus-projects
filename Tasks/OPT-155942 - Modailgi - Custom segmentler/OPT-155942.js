/* OPT-155942 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 1 : 1;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const classes = {
        badge: `ins-badge-${ variationId }`,
        join: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        /* Add your selectors here if needed */
    });

    const categories = {
        etek: {
            URLs: [
                'https://www.modailgi.com.tr/yeni-sezon-etek',
                'https://www.modailgi.com.tr/etek',
                'https://www.modailgi.com.tr/etek-indirim'
            ],
            storageName: 'ins-storage-etek-155942',
            productCategories: ['Kadın Giyim', 'Modailgi Kadın Giyim', 'Etek']
        },
        pantolon: {
            URLs: [
                'https://www.modailgi.com.tr/yeni-sezon-kadin-pantolon',
                'https://www.modailgi.com.tr/kadin-pantolon',
                'https://www.modailgi.com.tr/kadin-pantolon-indirim'
            ],
            storageName: 'ins-storage-pantolon-155942',
            productCategories: ['Kadın Giyim', 'Modailgi Kadın Giyim', 'Pantolon']
        },
        penyeTriko: {
            URLs: [
                'https://www.modailgi.com.tr/kadin-triko'
            ],
            storageName: 'ins-storage-penyeTriko-155942',
            productCategories: ['Kadın Giyim', 'Modailgi Kadın Giyim', 'Triko']
        },
        tunik: {
            URLs: [
                'https://www.modailgi.com.tr/yeni-sezon-tunik',
                'https://www.modailgi.com.tr/tunik',
                'https://www.modailgi.com.tr/tunik-indirim'
            ],
            storageName: 'ins-storage-tunik-155942',
            productCategories: ['Kadın Giyim', 'Modailgi Kadın Giyim', 'Tunik']
        },
        bluz: {
            URLs: [
                'https://www.modailgi.com.tr/yeni-sezon-bluz',
                'https://www.modailgi.com.tr/kadin-bluz',
                'https://www.modailgi.com.tr/bluz-indirim'
            ],
            storageName: 'ins-storage-bluz-155942',
            productCategories: ['Kadın Giyim', 'Modailgi Kadın Giyim', 'Bluz']
        },
        gomlek: {
            URLs: [
                'https://www.modailgi.com.tr/yeni-sezon-kadin-gomlek',
                'https://www.modailgi.com.tr/kadin-gomlek',
                'https://www.modailgi.com.tr/kadin-gomlek-indirim'
            ],
            storageName: 'ins-storage-gomlek-155942',
            productCategories: ['Kadın Giyim', 'Modailgi Kadın Giyim', 'Gömlek']
        },
        tulum: {
            URLs: [
                'https://www.modailgi.com.tr/yeni-sezon-kadin-tulum',
                'https://www.modailgi.com.tr/kadin-tulum',
                'https://www.modailgi.com.tr/kadin-tulum-indirim'
            ],
            storageName: 'ins-storage-tulum-155942',
            productCategories: ['Kadın Giyim', 'Modailgi Kadın Giyim', 'Tulum']
        },
        kap: {
            URLs: [
                'https://www.modailgi.com.tr/yeni-sezon-kap-trenckot',
                'https://www.modailgi.com.tr/kadin-kap-trenckot',
                'https://www.modailgi.com.tr/kadin-kap-indirim'
            ],
            storageName: 'ins-storage-kap-155942',
            productCategories: ['Kadın Giyim', 'Modailgi Kadın Giyim', 'Kap']
        },
        mont: {
            URLs: [
                'https://www.modailgi.com.tr/yeni-sezon-mont-kaban',
                'https://www.modailgi.com.tr/kadin-mont-indirim',
                'https://www.modailgi.com.tr/kadin-mont'
            ],
            storageName: 'ins-storage-mont-155942',
            productCategories: ['Kadın Giyim', 'Modailgi Kadın Giyim', 'Mont']
        },
        casual: {
            URLs: [
                'https://www.modailgi.com.tr/casual'
            ],
            storageName: 'ins-storage-casual-155942',
            productCategories: ['Casual']
        },
        yelek: {
            URLs: [
                'https://www.modailgi.com.tr/yelek6',
                'https://www.modailgi.com.tr/kadin-yelek',
                'https://www.modailgi.com.tr/kadin-yelek-indirim'
            ],
            storageName: 'ins-storage-yelek-155942',
            productCategories: ['Kadın Giyim', 'Modailgi Kadın Giyim', 'Yelek']
        },
        buyukBedenEtek: {
            URLs: [
                'https://www.modailgi.com.tr/buyuk-beden-etek'
            ],
            storageName: 'ins-storage-buyukBedenEtek-155942',
            productCategories: ['Kadın Giyim', 'Gilda Büyük Beden', 'Etek']
        },
        yeniSezon: {
            URLs: [
                'https://www.modailgi.com.tr/yeni-sezon'
            ],
            storageName: 'ins-storage-yeniSezon-155942',
            productCategories: ['Kadın Giyim', 'Modailgi Kadın Giyim', 'Yeni sezon']
        },
        tumUrunler: {
            URLs: [
                'https://www.modailgi.com.tr/tum-urunler'
            ],
            storageName: 'ins-storage-tumUrunler-155942',
            productCategories: ['Kadın Giyim', 'Modailgi Kadın Giyim', 'Tum Urunler']
        },
        kampanyaliUrunler: {
            URLs: [
                'https://www.modailgi.com.tr/kampanyali-urunler'
            ],
            storageName: 'ins-storage-kampanyaliUrunler-155942',
            productCategories: ['Kadın Giyim', 'Modailgi Kadın Giyim', 'Kampanyalı ürünler']
        },
        buyukBedenCeket: {
            URLs: [
                'https://www.modailgi.com.tr/yeni-sezon-buyuk-beden-ceket',
                'https://www.modailgi.com.tr/buyuk-beden-ceket',
                'https://www.modailgi.com.tr/buyuk-beden-ceket-indirim'
            ],
            storageName: 'ins-storage-buyukBedenCeket-155942',
            productCategories: ['Kadın Giyim', 'Gilda Büyük Beden', 'Ceket']
        },
        buyukBedenPantolon: {
            URLs: [
                'https://www.modailgi.com.tr/yeni-sezon-buyuk-beden-pantolon',
                'https://www.modailgi.com.tr/buyuk-beden-pantolon',
                'https://www.modailgi.com.tr/buyuk-beden-pantolon-indirim'
            ],
            storageName: 'ins-storage-buyukBedenPantolon-155942',
            productCategories: ['Kadın Giyim', 'Gilda Büyük Beden', 'Pantolon']
        },
        buyukBedenGomlek: {
            URLs: [
                'https://www.modailgi.com.tr/yeni-sezon-buyuk-beden-gomlek',
                'https://www.modailgi.com.tr/buyuk-beden-gomlek',
                'https://www.modailgi.com.tr/buyuk-beden-gomlek-indirim'
            ],
            storageName: 'ins-storage-buyukBedenGomlek-155942',
            productCategories: ['TÜM KOLEKSİYON', 'Gilda Büyük Beden', 'Gömlek']
        },
        buyukBedenElbise: {
            URLs: [
                'https://www.modailgi.com.tr/yeni-sezon-buyuk-beden-elbise',
                'https://www.modailgi.com.tr/buyuk-beden-elbise',
                'https://www.modailgi.com.tr/buyuk-beden-elbise-indirim'
            ],
            storageName: 'ins-storage-buyukBedenElbise-155942',
            productCategories: ['Kadın Giyim', 'Gilda Büyük Beden', 'Elbise']
        },
        buyukBedenTunik: {
            URLs: [
                'https://www.modailgi.com.tr/yeni-sezon-buyuk-beden-tunik',
                'https://www.modailgi.com.tr/buyuk-beden-tunik',
                'https://www.modailgi.com.tr/buyuk-beden-tunik-indirim'
            ],
            storageName: 'ins-storage-buyukBedenTunik-155942',
            productCategories: ['Kadın Giyim', 'Gilda Büyük Beden', 'Tunik']
        },
        buyukBedenBluz: {
            URLs: [
                'https://www.modailgi.com.tr/yeni-sezon-buyuk-beden-bluz',
                'https://www.modailgi.com.tr/buyuk-beden-bluz',
                'https://www.modailgi.com.tr/buyuk-beden-bluz-indirim'
            ],
            storageName: 'ins-storage-buyukBedenBluz-155942',
            productCategories: ['Kadın Giyim', 'Gilda Büyük Beden', 'Bluz']
        }
    };

    self.init = () => {
        if (true) {
            if (true) {
                self.setEvents();
            }

            return true;
        }
    };

    self.getCategoryKeys = (referrer) => {
        const productCategories = Insider.systemRules.getProductCategories();
        const matchingCategories = [];

        for (const categoryKey in categories) {
            const { URLs, productCategories: categoryProductCategories } = categories[categoryKey];

            if (URLs.some((url) => referrer.includes(url)) || Insider.fns.stringify(productCategories) === Insider.fns.stringify(categoryProductCategories)) {
                matchingCategories.push(categoryKey);
            }
        }

        return matchingCategories;
    };

    self.handleAfterPaymentPage = () => {
        const filteredStorage = Insider.fns.keys(localStorage)
            .filter((key) => Insider.fns.has(key, '155942'))
            .reduce((obj, key) => {
                obj[key] = Insider.storage.localStorage.get(key);

                return obj;
            }, {});

        const paidProducts = Insider.systemRules.getPaidProducts();

        paidProducts.forEach((product) => {
            const productId = product.id;
            const storageKeys = Object.keys(filteredStorage);

            storageKeys.forEach((storageKey) => {
                const matchingStorageKey = filteredStorage[storageKey][productId] || null;

                if (matchingStorageKey === 'pending') {
                    Insider.storage.localStorage.set({ name: storageKey, value: true });
                }

            });
        });

        setTimeout(() => {
            self.removeUnusedStorages(filteredStorage);
        }, 1000);
    };

    self.removeUnusedStorages = (filteredStorage) => {
        for (const storageKey in filteredStorage) {
            const storageData = filteredStorage[storageKey];
            const hasTrueValue = storageData === true;

            if (!hasTrueValue) {
                Insider.storage.localStorage.remove(storageKey);
            }
        }
    };

    self.handleProductPage = (categoryKeys, referrer) => {
        categoryKeys.forEach((categoryKey) => {
            const { URLs, storageName, productCategories } = categories[categoryKey];

            if (Insider.fns.has(URLs, referrer) || Insider.fns.stringify(Insider.systemRules.getProductCategories()) === Insider.fns.stringify(productCategories)) {
                const productID = Insider.systemRules.getCurrentProduct().id;
                const storageData = Insider.storage.localStorage.get(storageName);

                if (Insider.fns.isFalsy(storageData)) {
                    Insider.storage.localStorage.set({ name: storageName, value: { [productID]: 'pending' }});
                } else {
                    const newData = 'pending';

                    Insider.storage.localStorage.set({ name: storageName, value: { ...storageData, [productID]: newData }});
                }
            }
        });
    };

    const referrer = Insider.storage.localStorage.get('ins-default-attributes').last_visited_category_url;
    const categoryKeys = self.getCategoryKeys(referrer);

    self.setEvents = () => {
        const addToCartSelector = '.Addtobasket';

        if (Insider.systemRules.call('isOnAfterPaymentPage')) {
            self.handleAfterPaymentPage();
        } else if (Insider.systemRules.call('isOnProductPage')) {
            Insider.eventManager.once(`click.set:storage:${ variationId }`, addToCartSelector, () => {
                self.handleProductPage(categoryKeys, referrer);
            });
        }
    };

    return self.init();
})({});
/* OPT-155942 END */
