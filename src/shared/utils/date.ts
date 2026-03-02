export function formatDateDdMmYyyy(isoDate: string): string {
    const [y, m, d] = isoDate.split('-');
    if (!y || !m || !d) return isoDate;
    return `${d}.${m}.${y}`;
}
