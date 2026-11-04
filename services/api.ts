type OffRepsonse = {
    status: number; // 1 = trovato, 0 = non trovato
    product?: {
        product_name?: string;
        product_name_it?: string;
        brands?: string;
    }
}

export const fetchProductName = async (barcode: string): Promise<string | null> => {
    const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?fields=product_name,brands`;
    const response = await fetch(url);
    const data = (await response.json()) as OffRepsonse;

    console.log(data)

    const name = data.product?.product_name_it || data.product?.product_name;
    if (data.status !== 1 || !name) {
        return null;
    }

    return name;
}