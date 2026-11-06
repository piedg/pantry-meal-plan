import { createContext, ReactNode, useContext } from 'react';
import { usePantry } from '../hooks/usePantry';

type PantryContextValue = ReturnType<typeof usePantry>;

const PantryContext = createContext<PantryContextValue | null>(null);

export function PantryProvider({ children }: { children: ReactNode }) {
    const pantry = usePantry();
    return <PantryContext.Provider value={pantry}>{children}</PantryContext.Provider>;
}

export function usePantryContext(): PantryContextValue {
    const ctx = useContext(PantryContext);
    if (ctx === null) {
        throw new Error('usePantryContext must be used inner a PantryProvider');
    }
    return ctx;
}