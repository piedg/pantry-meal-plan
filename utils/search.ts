/** Lowercase and strip accents, so "caffe" matches "Caffè". */
export function normalizeForSearch(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .trim();
}

export function matchesQuery(name: string, query: string): boolean {
    const q = normalizeForSearch(query);
    return q === '' || normalizeForSearch(name).includes(q);
}
