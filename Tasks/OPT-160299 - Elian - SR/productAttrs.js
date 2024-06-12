// Discount text
Insider.dom('.oibem-custom-0-x-customInstallment').text(); /* OPT-160299 */

// Cashback text
Insider.dom('.vtex-flex-layout-0-x-flexRowContent--block-pix-cashback').nodes[0]?.outerHTML ?? ''; /* OPT-160299 */
Insider.dom('.vtex-flex-layout-0-x-flexRowContent--block-pix-cashback')?.nodes?.[0]?.innerText?.split('\n')?.filter(
    (element) => !Insider.fns.isFalsy(element))?.[0]?.match(/[\d.,]+/)?.[0] ?? '0.00'; /* OPT-160299 */

// Colors list
Insider.dom('.oibem-custom-0-x-colorSkuContainerList').nodes[0]?.outerHTML ?? ''; /* OPT-160299 */

// Product brand
window.dataLayer?.filter((element) => element.event === "productDetail")[0]?.ecommerce?.detail?.products[0]?.brand ?? 'Elian'; /* OPT-160299 */
