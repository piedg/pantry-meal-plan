export type QuantityUnit = 'pz' | 'g' | 'kg' | 'ml' | 'l';

// quanto vale 1 unità, espressa nell'unità "base" della sua famiglia
export const UNIT_FACTOR: Record<QuantityUnit, { family: 'count' | 'mass' | 'volume'; toBase: number }> = {
    pz: { family: 'count', toBase: 1 },
    g: { family: 'mass', toBase: 1 },
    kg: { family: 'mass', toBase: 1000 },
    ml: { family: 'volume', toBase: 1 },
    l: { family: 'volume', toBase: 1000 },
};