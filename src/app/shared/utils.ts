export function isValidAnswer(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return true;
    if (typeof value === 'number') return !isNaN(value);
    if (typeof value === 'boolean') return true;
    return false;
}
