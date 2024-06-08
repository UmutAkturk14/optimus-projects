/* OPT-150683 START */
const vipTypes = ['VIP', 'VIPRTL'];
const vipStatusIO = Insider.utils.getDataFromIO('user', 'custom', {}).customer_group;
const userID = Insider.getUserId();
const storage = 'ins-vip-status-150683';

if (!Insider.fns.has(Insider.storage.localStorage.get(storage), userID) ||
    JSON.parse(Insider.storage.localStorage.get(storage)).vipStatus === false) {
    const currentUserStatus = { user: userID, vipStatus: Insider.fns.has(vipTypes, vipStatusIO) };

    Insider.storage.localStorage.set({
        name: storage,
        value: JSON.stringify(currentUserStatus),
        expires: Insider.dateHelper.addDay(14)
    });
}

!!JSON.parse(Insider.storage.localStorage.get(storage)).vipStatus;
/* OPT-150683 END */
