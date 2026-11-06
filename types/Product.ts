import { PackUnit } from "./PackUnit";

export type Product = {
    id: string;
    name: string;
    quantity: number;
    packSize?: number;
    packUnit?: PackUnit;
    barcode?: string;
};