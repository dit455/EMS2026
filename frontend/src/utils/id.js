export function generateNumericCode(length = 6) {
  const min = 10 ** (length - 1);
  const range = 9 * min;

  if (globalThis.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    globalThis.crypto.getRandomValues(values);
    return String(min + (values[0] % range)).padStart(length, '0');
  }

  return String(min + (Date.now() % range)).padStart(length, '0');
}

export function currentYear() {
  return new Date().getFullYear();
}
