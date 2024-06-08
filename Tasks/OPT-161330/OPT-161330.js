/* OPT-161330 START */
const gdprAcceptButton = '#cookiespool-banner #banner-accept-button';
const storage = 'kvkk-optin-status-161330';

Insider.eventManager.once('click.gdpr:accepted', gdprAcceptButton, () => {
    Insider.storage.localStorage.set({
        name: storage,
        value: true,
        expires: Insider.dateHelper.addDay(365)
    });
});
/* OPT-161330 END */

return Insider.storage.localStorage.get(gdprAcceptButton) ?? false; /* OPT-161330 */
