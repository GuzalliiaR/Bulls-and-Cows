import { memoize } from './memoize.js';

/**
 *
 * Математически это число размещений без повторений:
 *   P(base, length) = base! / (base - length)!
 *
 * Рекуррентная запись той же формулы (каждый шаг снимает один множитель):
 *   P(base, length) = base * P(base - 1, length - 1)
 *   P(base, 0)      = 1
 *
 */
const computePossibleSecrets = (length: number, base: number): number => {
  if (length > base) return 0;
  if (length <= 0) return 1;

  // Рекурсия идёт через замемоизированную функцию, поэтому в кэш попадает
  // вся цепочка промежуточных значений, а не только верхний вызов.
  return base * countPossibleSecrets(length - 1, base - 1);
};

const memoizedCompute = memoize(computePossibleSecrets);

export function countPossibleSecrets(length: number, base: number): number {
  return memoizedCompute(length, base);
}
