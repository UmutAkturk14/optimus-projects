/* OPT-153196 START */
const storage = 'ins-check-camp-eligibility-153196';
const localValue = Insider.storage.localStorage.get(storage);
const isEligible = () => (localValue !== null ? localValue : true);
const closeButton = '.buttonSelectorHere';

if (!isEligible) {
    Insider.eventManager.once('touchend.some:namespace:153196', closeButton, () => {
        Insider.storage.localStorage.set({
            name: storage,
            value: false,
            expires: Insider.dateHelper.addDay(360)
        });
    });
}

Insider.storage.localStorage.get(storage);
/* OPT-153196 END */
