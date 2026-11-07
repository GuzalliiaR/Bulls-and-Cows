import { ALL_DIGITS } from './alphabet.js';

export function createDigitValidator(base: number): (char: string) => boolean {
  return (char: string) => {
    const validDigits = ALL_DIGITS.slice(0, base);
    return validDigits.includes(char.toLowerCase());
  };
}
