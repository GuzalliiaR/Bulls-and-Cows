import { ALL_DIGITS } from './alphabet.js';
export function createDigitValidator(base) {
    return (char) => {
        const validDigits = ALL_DIGITS.slice(0, base);
        return validDigits.includes(char.toLowerCase());
    };
}
//# sourceMappingURL=createDigitValidator.js.map