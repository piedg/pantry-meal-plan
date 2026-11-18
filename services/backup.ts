import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { MealPlan } from '../types/MealPlan';
import { Product } from '../types/Product';
import { toDateKey } from '../utils/week';

const BACKUP_APP_ID = 'pantry';
const BACKUP_FORMAT = 1;

export type BackupData = {
    products: Product[];
    mealPlan: MealPlan;
};

type BackupFile = BackupData & {
    app: string;
    format: number;
    version: string;
    exportedAt: string;
};

export class BackupError extends Error {}

// ---------- Export ----------

export async function exportBackup(data: BackupData, appVersion: string): Promise<void> {
    const backup: BackupFile = {
        app: BACKUP_APP_ID,
        format: BACKUP_FORMAT,
        version: appVersion,
        exportedAt: new Date().toISOString(),
        ...data,
    };

    const file = new File(Paths.cache, `pantry-backup-${toDateKey(new Date())}.json`);
    file.create({ overwrite: true });
    await file.write(JSON.stringify(backup, null, 2));

    if (!(await Sharing.isAvailableAsync())) {
        throw new BackupError('La condivisione non è disponibile su questo dispositivo.');
    }
    await Sharing.shareAsync(file.uri, {
        mimeType: 'application/json',
        dialogTitle: 'Salva o invia il backup',
        UTI: 'public.json',
    });
}

// ---------- Import ----------

// Restituisce null se l'utente annulla la scelta del file
export async function pickBackup(): Promise<BackupData | null> {
    const result = await DocumentPicker.getDocumentAsync({
        // Alcuni gestori file su Android non riconoscono .json come application/json
        type: ['application/json', 'text/plain', 'application/octet-stream'],
        copyToCacheDirectory: true,
    });
    if (result.canceled) return null;

    const text = await new File(result.assets[0].uri).text();
    return parseBackup(text);
}

export function parseBackup(text: string): BackupData {
    let raw: unknown;
    try {
        raw = JSON.parse(text);
    } catch {
        throw new BackupError('Il file non è un JSON valido.');
    }

    if (!isObject(raw) || raw.app !== BACKUP_APP_ID) {
        throw new BackupError('Questo file non è un backup di Pantry.');
    }
    if (typeof raw.format === 'number' && raw.format > BACKUP_FORMAT) {
        throw new BackupError("Il backup è stato creato da una versione più recente dell'app. Aggiornala e riprova.");
    }

    const products = Array.isArray(raw.products) ? raw.products.filter(isProduct) : null;
    const mealPlan = isObject(raw.mealPlan) ? sanitizeMealPlan(raw.mealPlan) : null;
    if (products === null || mealPlan === null) {
        throw new BackupError('Il backup è incompleto o danneggiato.');
    }

    return { products, mealPlan };
}

// ---------- Validazione ----------

function isObject(v: unknown): v is Record<string, unknown> {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isProduct(v: unknown): v is Product {
    return (
        isObject(v) &&
        typeof v.id === 'string' &&
        typeof v.name === 'string' &&
        typeof v.quantity === 'number' &&
        (v.packSize === undefined || typeof v.packSize === 'number') &&
        (v.packUnit === undefined || v.packUnit === 'g' || v.packUnit === 'ml') &&
        (v.barcode === undefined || typeof v.barcode === 'string')
    );
}

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

function sanitizeMealPlan(raw: Record<string, unknown>): MealPlan {
    const plan: MealPlan = {};
    for (const [dateKey, day] of Object.entries(raw)) {
        if (!DATE_KEY.test(dateKey) || !isObject(day)) continue;
        for (const slot of ['lunch', 'dinner'] as const) {
            const meal = day[slot];
            if (isObject(meal) && typeof meal.text === 'string' && meal.text.trim() !== '') {
                plan[dateKey] ??= {};
                plan[dateKey][slot] = {
                    text: meal.text,
                    ...(typeof meal.recipeId === 'string' ? { recipeId: meal.recipeId } : {}),
                };
            }
        }
    }
    return plan;
}
