import { ALL_DIGITS } from './alphabet.js';
export function generateSecret(length, base, random = Math.random) {
    const alphabetDigits = ALL_DIGITS.slice(0, base).split('');
    if (length > alphabetDigits.length) {
        throw new Error('The length of the generated number cannot be greater than the base of the number system.');
    }
    let result = [];
    while (result.length < length) {
        const index = Math.floor(random() * alphabetDigits.length);
        const newElement = alphabetDigits.splice(index, 1)[0];
        result = [...result, newElement];
    }
    return result;
}
//# sourceMappingURL=generateSecret.js.map