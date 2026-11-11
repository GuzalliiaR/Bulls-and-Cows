import { describe, it, expect } from 'vitest';
import { countPossibleSecrets } from '../src/core/countPossibleSecrets.js';

// Ожидания посчитаны по формуле P(base, length) = base! / (base - length)!
const CASES = [
  { length: 2, base: 2, expected: 2 },
  { length: 2, base: 8, expected: 56 },
  { length: 4, base: 8, expected: 1680 },
  { length: 2, base: 10, expected: 90 },
  { length: 6, base: 8, expected: 20160 },
  { length: 6, base: 10, expected: 151200 },
  { length: 3, base: 16, expected: 3360 },
  { length: 6, base: 16, expected: 5765760 },
];

describe('Checking the function countPossibleSecrets', () => {
  it.each(CASES)(
    'returns $expected secrets for length=$length and base=$base',
    ({ length, base, expected }) => {
      expect(countPossibleSecrets(length, base)).toBe(expected);
    },
  );

  it('returns factorial of base when length equals base', () => {
    expect(countPossibleSecrets(16, 16)).toBe(20922789888000);
  });

  it('returns 0 when length is greater than base', () => {
    expect(countPossibleSecrets(3, 2)).toBe(0);
  });

  it('returns the same value on repeated calls', () => {
    const first = countPossibleSecrets(6, 16);
    const second = countPossibleSecrets(6, 16);

    expect(second).toBe(first);
  });
});
