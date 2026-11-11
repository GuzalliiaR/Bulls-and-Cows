import { describe, it, expect } from 'vitest';
import { evaluateGuess } from '../src/core/evaluateGuess';

const CASES = [
  { secret: ['3', '7', '5'], guess: '274', expected: { bulls: 1, cows: 0 } },
  { secret: ['3', '7', '5'], guess: '573', expected: { bulls: 1, cows: 2 } },
  { secret: ['3', '7', '5'], guess: '129', expected: { bulls: 0, cows: 0 } },
  {
    secret: ['9', 'a', 'b', '8'],
    guess: '8AB3',
    expected: { bulls: 2, cows: 1 },
  },
  {
    secret: ['5', 'F', '6', 'e'],
    guess: '5f6e',
    expected: { bulls: 4, cows: 0 },
  },
];

describe('Checking the function evaluateGuess', () => {
  it('should return object with properties "bulls" and "cows"', () => {
    const resEvaluateGuess = evaluateGuess([], '');

    expect(resEvaluateGuess).toEqual({ bulls: 0, cows: 0 });
  });

  it.each(CASES)(
    'should return object=$expected when secret=$secret, guess=$guess',
    ({ secret, guess, expected }) => {
      const originSecret = structuredClone(secret);
      const resEvaluateGuess = evaluateGuess(secret, guess);

      expect(resEvaluateGuess).toEqual(expected);
      expect(originSecret).toEqual(secret);
    },
  );
});
