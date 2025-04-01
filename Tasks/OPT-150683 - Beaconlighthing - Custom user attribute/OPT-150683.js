/* OPT-150683 START */
const vipTypes = ['VIP', 'VIPRTL'];
const vipStatusIO = Insider.utils.getDataFromIO('user', 'custom', {}).customer_group;
const storage = 'ins-vip-status-150683';

if (Insider.fns.has(vipTypes, vipStatusIO)) {
    Insider.storage.localStorage.set({
        name: storage,
        value: true,
        expires: Insider.dateHelper.addDay(14)
    });
}

!!Insider.storage.localStorage.get(storage);
/* OPT-150683 END */
