import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Meal, MealPlan, MealSlot } from '../types/MealPlan';

const STORAGE_KEY = 'meal-plan';

export function useMealPlan() {
    const [plan, setPlan] = useState<MealPlan>({});
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                if (raw) {
                    setPlan(JSON.parse(raw) as MealPlan);
                }
            } catch (e) {
                console.warn('Errore nel caricamento del meal plan', e);
            }
            setLoaded(true);
        };
        load();
    }, []);

    useEffect(() => {
        if (!loaded) return;
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    }, [plan, loaded]);

    const getMeal = (dateKey: string, slot: MealSlot): Meal | undefined => plan[dateKey]?.[slot];

    // meal === null rimuove il pasto; i giorni rimasti vuoti vengono eliminati
    const setMeal = (dateKey: string, slot: MealSlot, meal: Meal | null) => {
        setPlan((prev) => {
            const day = { ...prev[dateKey] };
            if (meal === null) {
                delete day[slot];
            } else {
                day[slot] = meal;
            }

            const next = { ...prev };
            if (Object.keys(day).length === 0) {
                delete next[dateKey];
            } else {
                next[dateKey] = day;
            }
            return next;
        });
    };

    const clearPlan = () => setPlan({});
    const replacePlan = (next: MealPlan) => setPlan(next);

    return { plan, loaded, getMeal, setMeal, clearPlan, replacePlan };
}
