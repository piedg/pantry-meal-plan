const DAY_NAMES = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const MONTH_SHORT = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];

// Chiave in ora locale (toISOString userebbe UTC e sposterebbe il giorno vicino alla mezzanotte)
export function toDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
}

// Lunedì della settimana che contiene `date`, alle 00:00 locali
export function startOfWeek(date: Date): Date {
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const offset = (start.getDay() + 6) % 7;
    return addDays(start, -offset);
}

export function weekDays(weekStart: Date): Date[] {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

export function dayName(date: Date): string {
    return DAY_NAMES[date.getDay()];
}

export function shortDate(date: Date): string {
    return `${date.getDate()} ${MONTH_SHORT[date.getMonth()]}`;
}

export function weekLabel(weekStart: Date): string {
    const end = addDays(weekStart, 6);
    if (weekStart.getMonth() === end.getMonth()) {
        return `${weekStart.getDate()} – ${shortDate(end)}`;
    }
    return `${shortDate(weekStart)} – ${shortDate(end)}`;
}
