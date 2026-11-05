import { Product } from './types/Product';
import { PackUnit } from './types/PackUnit';

export const formatAmount = (value: number, unit: PackUnit): string => {
    if (value >= 1000) {
        const big = Math.round(value) / 1000;
        return `${big} ${unit === 'g' ? 'kg' : 'l'}`;
    }
    return `${value} ${unit}`;
};

export const totalLabel = (p: Product): string | null => {
    if (p.packSize === undefined || p.packUnit === undefined) return null;
    return formatAmount(p.quantity * p.packSize, p.packUnit);
};

export const parsePack = (
    text: string | undefined
): { packSize: number; packUnit: PackUnit } | null => {
    if (!text) return null;

    const match = text.match(/^\s*(\d+(?:[.,]\d+)?)\s*(g|kg|ml|cl|l)\s*$/i);
    if (!match) return null;

    const value = parseFloat(match[1].replace(',', '.'));
    const unit = match[2].toLowerCase();

    switch (unit) {
        case 'g':
            return { packSize: value, packUnit: 'g' };
        case 'kg':
            return { packSize: Math.round(value * 1000), packUnit: 'g' };
        case 'ml':
            return { packSize: value, packUnit: 'ml' };
        case 'cl':
            return { packSize: Math.round(value * 10), packUnit: 'ml' };
        case 'l':
            return { packSize: Math.round(value * 1000), packUnit: 'ml' };
        default:
            return null;
    }
};