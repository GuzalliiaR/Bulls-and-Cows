const ALL_DIGITS = '0123456789abcdef';

export function createDigitValidator(base: number): (char: string) => boolean {
  return (char: string) => {
    const validDigits = ALL_DIGITS.slice(0, base);
    return validDigits.includes(char.toLowerCase());
  };
}
