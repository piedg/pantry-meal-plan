import { createContext, ReactNode, useContext } from 'react';
import { useMealPlan } from '../hooks/useMealPlan';

type MealPlanContextValue = ReturnType<typeof useMealPlan>;

const MealPlanContext = createContext<MealPlanContextValue | null>(null);

export function MealPlanProvider({ children }: { children: ReactNode }) {
    const mealPlan = useMealPlan();
    return <MealPlanContext.Provider value={mealPlan}>{children}</MealPlanContext.Provider>;
}

export function useMealPlanContext(): MealPlanContextValue {
    const ctx = useContext(MealPlanContext);
    if (ctx === null) {
        throw new Error('useMealPlanContext va usato dentro MealPlanProvider');
    }
    return ctx;
}
