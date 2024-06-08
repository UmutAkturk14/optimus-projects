const updateCart = (cartID, SKU, quantity) => {
    fetch('https://api.itcstore.in/graphql', {
        headers: {
            'accept': '*/*',
            'accept-language': 'en-GB,en;q=0.9',
            'authorization': '',
            'browser_code': '',
            'content-type': 'application/json',
            'delivery_method': 'courier,standard,express',
            'journey_code': '03d530-6827-cd28-021a-8510818bd5',
            'operationname': 'categories',
            'priority': 'u=1, i',
            'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'source_code': 'MAA',
            'vin_instance': 'ITC'
        },
        referrer: 'https://www.itcstore.in/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: `{"operationName":"AddProductToCart","variables":{"cartId":${ cartID },"product":{"quantity":${ quantity },"sku":${ SKU }}},"query":"fragment AddToCartFields on Cart {\\n id\\n total_quantity\\n total_item_count\\n email\\n general\\n customized\\n confectionery\\n items_v2 {\\n group_name\\n items {\\n id\\n uid\\n quantity\\n prices {\\n price {\\n value\\n currency\\n __typename\\n }\\n  row_total {\\n value\\n currency\\n __typename\\n  }\\n row_total_including_tax {\\n value\\n currency\\n __typename\\n }\\n total_item_discount {\\n value\\n currency\\n __typename\\n }\\n discounts {\\n  amount {\\n value\\n currency\\n __typename\\n }\\n label\\n __typename\\n }\\n __typename\\n }\\n product {\\n id\\n uid\\n name\\n sku\\n stock_status\\n available_qty\\n weight\\n weight_unit\\n display_weight_value\\n url_key\\n brand\\n sub_brand\\n image {\\n url\\n label\\n __typename\\n  }\\n small_image {\\n url\\n label\\n __typename\\n }\\n __typename\\n }\\n ... on ConfigurableCartItem {\\n id\\n configured_variant {\\n name\\n sku\\n  url_key\\n stock_status\\n id\\n uid\\n thumbnail {\\n url\\n label\\n __typename\\n }\\n __typename\\n }\\n configurable_options {\\n id\\n value_id\\n value_label\\n option_label\\n __typename\\n }\\n __typename\\n }\\n ... on BundleCartItem {\\n bundle_options {\\n uid\\n label\\n type\\n  id\\n values {\\n id\\n label\\n price\\n quantity\\n __typename\\n }\\n __typename\\n }\\n __typename\\n }\\n __typename\\n }\\n __typename\\n }\\n billing_address {\\n city\\n country {\\n code\\n label\\n __typename\\n }\\n firstname\\n lastname\\n postcode\\n region {\\n code\\n label\\n __typename\\n }\\n street\\n telephone\\n __typename\\n }\\n shipping_addresses {\\n firstname\\n lastname\\n street\\n city\\n postcode\\n region {\\n code\\n label\\n __typename\\n }\\n country {\\n code\\n label\\n __typename\\n }\\n telephone\\n available_shipping_methods {\\n amount {\\n currency\\n value\\n __typename\\n }\\n available\\n carrier_code\\n carrier_title\\n error_message\\n method_code\\n method_title\\n price_excl_tax {\\n value\\n currency\\n __typename\\n }\\n price_incl_tax {\\n value\\n currency\\n __typename\\n }\\n __typename\\n }\\n selected_shipping_method {\\n  amount {\\n value\\n currency\\n __typename\\n }\\n carrier_code\\n carrier_title\\n method_code\\n method_title\\n __typename\\n }\\n __typename\\n }\\n items {\\n id\\n uid\\n prices {\\n total_item_discount {\\n value\\n __typename\\n }\\n  price {\\n value\\n __typename\\n }\\n discounts {\\n  label\\n amount {\\n value\\n __typename\\n }\\n  __typename\\n }\\n __typename\\n }\\n product {\\n uid\\n  name\\n sku\\n url_key\\n thumbnail {\\n url\\n __typename\\n }\\n categories {\\n uid\\n is_top_parent\\n top_parent_id\\n top_parent_name\\n parent_id\\n parent_name\\n  name\\n path\\n __typename\\n }\\n price_range {\\n  minimum_price {\\n regular_price {\\n value\\n __typename\\n }\\n final_price {\\n value\\n  __typename\\n }\\n __typename\\n }\\n __typename\\n  }\\n stock_status\\n price_tiers {\\n quantity\\n final_price {\\n value\\n __typename\\n }\\n discount {\\n amount_off\\n percent_off\\n __typename\\n }\\n  __typename\\n }\\n ... on ConfigurableProduct {\\n variants {\\n attributes {\\n uid\\n __typename\\n }\\n product {\\n uid\\n thumbnail {\\n url\\n __typename\\n }\\n __typename\\n }\\n __typename\\n }\\n __typename\\n }\\n __typename\\n }\\n quantity\\n prices {\\n price {\\n currency\\n value\\n __typename\\n }\\n __typename\\n }\\n ... on ConfigurableCartItem {\\n configured_variant {\\n name\\n sku\\n url_key\\n stock_status\\n id\\n uid\\n thumbnail {\\n  url\\n label\\n __typename\\n }\\n __typename\\n }\\n configurable_options {\\n configurable_product_option_uid\\n option_label\\n configurable_product_option_value_uid\\n value_label\\n __typename\\n }\\n __typename\\n }\\n __typename\\n }\\n available_payment_methods {\\n code\\n title\\n __typename\\n }\\n selected_payment_method {\\n code\\n title\\n __typename\\n }\\n applied_coupons {\\n code\\n __typename\\n }\\n prices {\\n discounts {\\n label\\n amount {\\n value\\n __typename\\n }\\n label\\n __typename\\n }\\n subtotal_excluding_tax {\\n currency\\n value\\n __typename\\n }\\n subtotal_including_tax {\\n currency\\n  value\\n __typename\\n }\\n applied_taxes {\\n label\\n amount {\\n value\\n __typename\\n }\\n __typename\\n }\\n grand_total {\\n value\\n currency\\n __typename\\n }\\n discount {\\n amount {\\n value\\n currency\\n __typename\\n }\\n label\\n __typename\\n }\\n delivery_tip {\\n amount {\\n  value\\n currency\\n __typename\\n }\\n label\\n __typename\\n }\\n __typename\\n }\\n __typename\\n applied_delivery_slot {\\n  delivery_mode\\n general_slot_id\\n general_slot\\n customised_slot_id\\n customised_slot\\n itc_nut_meg_slot_id\\n itc_nut_meg_slot\\n __typename\\n }\\n}\\n\\nmutation AddProductToCart($cartId: String!, $product: CartItemInput!) {\\n addProductsToCart(cartId: $cartId, cartItems: [$product]) {\\n cart {\\n id\\n ...CartTriggerFragment\\n ...AddToCartFields\\n __typename\\n }\\n user_errors {\\n code\\n message\\n __typename\\n  }\\n __typename\\n }\\n}\\n\\nfragment CartTriggerFragment on Cart {\\n id\\n total_quantity\\n __typename\\n}"}`,
        method: 'POST',
        mode: 'cors',
        credentials: 'include'
    });
};

Insider.eventManager.once('click.set:product:quantity:in:cart', '#dynamic-text-1715264407828000', (event) => {
    const cartID = Insider.fns.parse(Insider.storage.localStorage.get('nextjs-shop'))?.cartState?.cart?.id ?? '';
    const button = Insider.dom(event.target);
    const productID = Insider.dom(button).closest('li').attr('data-product-id');
    const cartedItem = Insider.utils.getDataFromIO('basket', 'line_items', '').find((lineItem) =>
        lineItem.product.id === productID);

    updateCart(cartID, productID, cartedItem.quantity - 1);
});

smartRecommender.setProductQuantityInCart = () => {
    const updateCart = (cartID, SKU, quantity) => {
        fetch('https://api.itcstore.in/graphql', {
            headers: {
                'accept': '*/*',
                'accept-language': 'en-GB,en;q=0.9',
                'authorization': '',
                'browser_code': '',
                'content-type': 'application/json',
                'delivery_method': 'courier,standard,express',
                'journey_code': '03d530-6827-cd28-021a-8510818bd5',
                'operationname': 'categories',
                'priority': 'u=1, i',
                'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Linux"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'source_code': 'MAA',
                'vin_instance': 'ITC'
            },
            referrer: 'https://www.itcstore.in/',
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: `{"operationName":"AddProductToCart","variables":{"cartId":"${ cartID }","product":{"quantity":${ quantity },"sku":${ SKU }}},"query":"fragment AddToCartFields on Cart {\\n id\\n total_quantity\\n total_item_count\\n email\\n general\\n customized\\n confectionery\\n items_v2 {\\n group_name\\n items {\\n id\\n uid\\n quantity\\n prices {\\n price {\\n value\\n currency\\n __typename\\n }\\n  row_total {\\n value\\n currency\\n __typename\\n  }\\n row_total_including_tax {\\n value\\n currency\\n __typename\\n }\\n total_item_discount {\\n value\\n currency\\n __typename\\n }\\n discounts {\\n  amount {\\n value\\n currency\\n __typename\\n }\\n label\\n __typename\\n }\\n __typename\\n }\\n product {\\n id\\n uid\\n name\\n sku\\n stock_status\\n available_qty\\n weight\\n weight_unit\\n display_weight_value\\n url_key\\n brand\\n sub_brand\\n image {\\n url\\n label\\n __typename\\n  }\\n small_image {\\n url\\n label\\n __typename\\n }\\n __typename\\n }\\n ... on ConfigurableCartItem {\\n id\\n configured_variant {\\n name\\n sku\\n  url_key\\n stock_status\\n id\\n uid\\n thumbnail {\\n url\\n label\\n __typename\\n }\\n __typename\\n }\\n configurable_options {\\n id\\n value_id\\n value_label\\n option_label\\n __typename\\n }\\n __typename\\n }\\n ... on BundleCartItem {\\n bundle_options {\\n uid\\n label\\n type\\n  id\\n values {\\n id\\n label\\n price\\n quantity\\n __typename\\n }\\n __typename\\n }\\n __typename\\n }\\n __typename\\n }\\n __typename\\n }\\n billing_address {\\n city\\n country {\\n code\\n label\\n __typename\\n }\\n firstname\\n lastname\\n postcode\\n region {\\n code\\n label\\n __typename\\n }\\n street\\n telephone\\n __typename\\n }\\n shipping_addresses {\\n firstname\\n lastname\\n street\\n city\\n postcode\\n region {\\n code\\n label\\n __typename\\n }\\n country {\\n code\\n label\\n __typename\\n }\\n telephone\\n available_shipping_methods {\\n amount {\\n currency\\n value\\n __typename\\n }\\n available\\n carrier_code\\n carrier_title\\n error_message\\n method_code\\n method_title\\n price_excl_tax {\\n value\\n currency\\n __typename\\n }\\n price_incl_tax {\\n value\\n currency\\n __typename\\n }\\n __typename\\n }\\n selected_shipping_method {\\n  amount {\\n value\\n currency\\n __typename\\n }\\n carrier_code\\n carrier_title\\n method_code\\n method_title\\n __typename\\n }\\n __typename\\n }\\n items {\\n id\\n uid\\n prices {\\n total_item_discount {\\n value\\n __typename\\n }\\n  price {\\n value\\n __typename\\n }\\n discounts {\\n  label\\n amount {\\n value\\n __typename\\n }\\n  __typename\\n }\\n __typename\\n }\\n product {\\n uid\\n  name\\n sku\\n url_key\\n thumbnail {\\n url\\n __typename\\n }\\n categories {\\n uid\\n is_top_parent\\n top_parent_id\\n top_parent_name\\n parent_id\\n parent_name\\n  name\\n path\\n __typename\\n }\\n price_range {\\n  minimum_price {\\n regular_price {\\n value\\n __typename\\n }\\n final_price {\\n value\\n  __typename\\n }\\n __typename\\n }\\n __typename\\n  }\\n stock_status\\n price_tiers {\\n quantity\\n final_price {\\n value\\n __typename\\n }\\n discount {\\n amount_off\\n percent_off\\n __typename\\n }\\n  __typename\\n }\\n ... on ConfigurableProduct {\\n variants {\\n attributes {\\n uid\\n __typename\\n }\\n product {\\n uid\\n thumbnail {\\n url\\n __typename\\n }\\n __typename\\n }\\n __typename\\n }\\n __typename\\n }\\n __typename\\n }\\n quantity\\n prices {\\n price {\\n currency\\n value\\n __typename\\n }\\n __typename\\n }\\n ... on ConfigurableCartItem {\\n configured_variant {\\n name\\n sku\\n url_key\\n stock_status\\n id\\n uid\\n thumbnail {\\n  url\\n label\\n __typename\\n }\\n __typename\\n }\\n configurable_options {\\n configurable_product_option_uid\\n option_label\\n configurable_product_option_value_uid\\n value_label\\n __typename\\n }\\n __typename\\n }\\n __typename\\n }\\n available_payment_methods {\\n code\\n title\\n __typename\\n }\\n selected_payment_method {\\n code\\n title\\n __typename\\n }\\n applied_coupons {\\n code\\n __typename\\n }\\n prices {\\n discounts {\\n label\\n amount {\\n value\\n __typename\\n }\\n label\\n __typename\\n }\\n subtotal_excluding_tax {\\n currency\\n value\\n __typename\\n }\\n subtotal_including_tax {\\n currency\\n  value\\n __typename\\n }\\n applied_taxes {\\n label\\n amount {\\n value\\n __typename\\n }\\n __typename\\n }\\n grand_total {\\n value\\n currency\\n __typename\\n }\\n discount {\\n amount {\\n value\\n currency\\n __typename\\n }\\n label\\n __typename\\n }\\n delivery_tip {\\n amount {\\n  value\\n currency\\n __typename\\n }\\n label\\n __typename\\n }\\n __typename\\n }\\n __typename\\n applied_delivery_slot {\\n  delivery_mode\\n general_slot_id\\n general_slot\\n customised_slot_id\\n customised_slot\\n itc_nut_meg_slot_id\\n itc_nut_meg_slot\\n __typename\\n }\\n}\\n\\nmutation AddProductToCart($cartId: String!, $product: CartItemInput!) {\\n addProductsToCart(cartId: $cartId, cartItems: [$product]) {\\n cart {\\n id\\n ...CartTriggerFragment\\n ...AddToCartFields\\n __typename\\n }\\n user_errors {\\n code\\n message\\n __typename\\n  }\\n __typename\\n }\\n}\\n\\nfragment CartTriggerFragment on Cart {\\n id\\n total_quantity\\n __typename\\n}"}`,
            method: 'POST',
            mode: 'cors',
            credentials: 'include'
        });
    };

    Insider.eventManager.once('click.set:product:quantity:in:cart', '#dynamic-text-1715264407828000', (event) => {
        const cartID = Insider.fns.parse(Insider.storage.localStorage.get('nextjs-shop'))?.cartState?.cart?.id ?? '';
        const button = Insider.dom(event.target);
        const productID = Insider.dom(button).closest('li').attr('data-product-id');
        const cartedItem = Insider.utils.getDataFromIO('basket', 'line_items', '').find((lineItem) =>
            lineItem.product.id === productID);

        updateCart(cartID, productID, cartedItem.quantity - 1);
    });
};

