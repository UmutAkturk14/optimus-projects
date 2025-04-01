/* SRTR-23462 START */
return (Insider.utils.getDataFromIO('page', 'type').toLowerCase().trim() === 'basket' ||
        window.location.pathname.toLowerCase().replace('/zakelijk/', '').replace(/\//g, '') ===
        'shopbestellenwinkelwagen') && !Insider.dom('[data-role=ajax-loading-spinner].modal.show p').exists();
/* SRTR-23462 END */
