export function isValidCzechIco(value: string) {
  if (!/^\d{8}$/.test(value)) return false;
  const digits = [...value].map(Number);
  const sum = digits.slice(0, 7).reduce((total, digit, index) => total + digit * (8 - index), 0);
  const remainder = sum % 11;
  const check = remainder === 0 ? 1 : remainder === 1 ? 0 : 11 - remainder;
  return check === digits[7];
}
