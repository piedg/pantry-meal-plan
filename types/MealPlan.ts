export type MealSlot = 'lunch' | 'dinner';

export type Meal = {
    // Nome del pasto scritto a mano (sempre presente, anche quando c'è una ricetta collegata)
    text: string;
    // Riservato per il futuro collegamento con la sezione Ricette
    recipeId?: string;
};

export type DayPlan = Partial<Record<MealSlot, Meal>>;

// Chiave: data locale nel formato YYYY-MM-DD
export type MealPlan = Record<string, DayPlan>;
