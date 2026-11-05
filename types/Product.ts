import { PackUnit } from "./PackUnit";
import { QuantityUnit } from "./QuantityUnit";

export type Product = {
    id: string;
    name: string;
    quantity: number;
    packSize?: number;
    packUnit?: PackUnit;
    barcode?: string;
};