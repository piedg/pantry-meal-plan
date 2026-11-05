type OffResponse = {
    status: number; // 1 = trovato, 0 = non trovato
    product?: {
        product_name?: string;
        product_name_it?: string;
        brands?: string;
        quantity?: string
    }
}

export type OffProduct = {
    name: string,
    packText?: string
}

export const fetchProduct = async (barcode: string): Promise<OffProduct | null> => {
    const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?fields=product_name,product_name_it,brands,quantity`;
    const response = await fetch(url);
    const data = (await response.json()) as OffResponse;

    console.log(data)

    const name = data.product?.product_name_it || data.product?.product_name;
    if (data.status !== 1 || !name) return null;
    return { name, packText: data.product?.quantity };
}