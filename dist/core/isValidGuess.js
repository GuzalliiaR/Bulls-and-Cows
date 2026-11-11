import { createDigitValidator } from './createDigitValidator.js';
export function isValidGuess(guess, length, base) {
    const normalizedGuess = guess.toLocaleLowerCase();
    const guessHasCorrectLength = normalizedGuess.length === length;
    const digitValidator = createDigitValidator(base);
    const allDigitsAllowedBase = [...normalizedGuess].every((char) => digitValidator(char));
    const setGuess = new Set([...normalizedGuess]);
    const guessHasUniqueDigits = setGuess.size === normalizedGuess.length;
    return guessHasCorrectLength && allDigitsAllowedBase && guessHasUniqueDigits;
}
//# sourceMappingURL=isValidGuess.js.map