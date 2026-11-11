import { createDigitValidator } from './createDigitValidator.js';

export function isValidGuess(
  guess: string,
  length: number,
  base: number,
): boolean {
  const normalizedGuess = guess.toLocaleLowerCase();

  const guessHasCorrectLength = normalizedGuess.length === length;

  const digitValidator = createDigitValidator(base);
  const allDigitsAllowedBase = [...normalizedGuess].every((char: string) =>
    digitValidator(char),
  );

  const setGuess = new Set([...normalizedGuess]);
  const guessHasUniqueDigits = setGuess.size === normalizedGuess.length;

  return guessHasCorrectLength && allDigitsAllowedBase && guessHasUniqueDigits;
}
