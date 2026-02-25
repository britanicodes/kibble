export function normalizeBarcode(raw: string): string {
  return raw.replace(/\D/g, '');
}

export function isLikelyBarcode(raw: string): boolean {
  const value = normalizeBarcode(raw);
  return value.length === 8 || value.length === 12 || value.length === 13 || value.length === 14;
}
