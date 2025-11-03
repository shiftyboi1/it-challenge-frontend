export function formatPrice(value) {
  if (value == null) return '';
  // Accept numbers or strings like "€12" or "12€" etc.
  const n = Number(String(value).replace(/[^0-9.-]+/g, ''));
  if (Number.isFinite(n)) {
    return n.toFixed(2) + '€';
  }
  return String(value);
}

export default formatPrice;
