import { describe, it, expect } from 'vitest';
import { generateSecret } from '../src/core/generateSecret';
import { ALL_DIGITS } from '../src/core/alphabet.js';

// Детерминированный источник random: всегда будет возвращать первый символ алфавита (index = 0)
const firstAvailableIndex = (): number => 0;

// Детерминированный источник random: всегда будет возвращать последний символ алфавита (index = alphabet.length-1)
const lastAvailableIndex = (): number => 0.999;

const CASES = [
  { length: 2, base: 2, expected: ['0', '1'] },
  { length: 4, base: 8, expected: ['0', '1', '2', '3'] },
  { length: 5, base: 10, expected: ['0', '1', '2', '3', '4'] },
  { length: 3, base: 16, expected: ['0', '1', '2'] },
];

const CASES_LAST_INDEX = [
  { length: 3, base: 16, expected: ['f', 'e', 'd'] },
  { length: 4, base: 8, expected: ['7', '6', '5', '4'] },
];

describe('Checking the function generateSecret', () => {
  it.each(CASES)(
    'should return array of strings (with length=$length, base=$base)',
    ({ length, base }) => {
      const secret = generateSecret(length, base, firstAvailableIndex);
      const filteredSecret = secret.filter(
        (digit) => typeof digit !== 'string',
      );

      expect(Array.isArray(secret)).toBe(true);
      expect(filteredSecret).toEqual([]);
    },
  );

  it.each(CASES)(
    'should return array with given length (with length=$length, base=$base)',
    ({ length, base }) => {
      const secret = generateSecret(length, base, firstAvailableIndex);

      expect(secret.length).toBe(length);
    },
  );

  it.each(CASES)(
    'should return array with unique digits (with length=$length, base=$base)',
    ({ length, base }) => {
      const secret = generateSecret(length, base, firstAvailableIndex);

      expect(new Set(secret).size).toBe(secret.length);
    },
  );

  it.each(CASES)(
    'should return array with digits from a given base system (with length=$length, base=$base)',
    ({ length, base }) => {
      const secret = generateSecret(length, base, firstAvailableIndex);
      const allowableAlphabet = ALL_DIGITS.slice(0, base).split('');
      const filteredSecret = secret.filter(
        (digit) => !allowableAlphabet.includes(digit),
      );

      expect(filteredSecret).toEqual([]);
    },
  );

  it.each(CASES)(
    'should return certain values from first available digit (with length=$length, base=$base)',
    ({ length, base, expected }) => {
      const secret = generateSecret(length, base, firstAvailableIndex);

      expect(secret).toEqual(expected);
    },
  );

  it.each(CASES_LAST_INDEX)(
    'should return certain values from last available digit (with length=$length, base=$base)',
    ({ length, base, expected }) => {
      const secret = generateSecret(length, base, lastAvailableIndex);

      expect(secret).toEqual(expected);
    },
  );

  it('It should throw an error if length > alphabet.length', () => {
    expect(() => generateSecret(5, 2, firstAvailableIndex)).toThrow();
  });
});
