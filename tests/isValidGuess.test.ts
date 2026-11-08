import { describe, it, expect } from 'vitest';
import { isValidGuess } from '../src/core/isValidGuess';

const CASES = [
  { guess: '01', length: 2, base: 2, expected: true },
  { guess: '4523', length: 4, base: 8, expected: true },
  { guess: '972', length: 3, base: 10, expected: true },
  { guess: 'Ab05D4', length: 6, base: 16, expected: true },
  { guess: '0123', length: 4, base: 10, expected: true },
  { guess: '33', length: 2, base: 10, expected: false },
  { guess: 'aA', length: 2, base: 16, expected: false },
  { guess: '4523', length: 6, base: 8, expected: false },
  { guess: 'Ab05D4', length: 6, base: 8, expected: false },
  { guess: '13', length: 2, base: 2, expected: false },
  { guess: '', length: 2, base: 10, expected: false },
];

describe('Checking the function isValidGuess', () => {
  it('should return boolean value', () => {
    const isValid = isValidGuess('', 2, 10);
    expect(isValid).toBeTypeOf('boolean');
  });

  it.each(CASES)(
    'should return $expected when guess=$guess, length=$length, base=$base',
    ({ guess, length, base, expected }) => {
      const isValid = isValidGuess(guess, length, base);
      expect(isValid).toBe(expected);
    },
  );
});
