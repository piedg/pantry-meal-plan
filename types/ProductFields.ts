import { Product } from "./Product";

export type ProductFields = Omit<Product, 'id' | 'barcode'>;