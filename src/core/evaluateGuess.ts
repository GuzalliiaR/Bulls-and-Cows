import type { IBullsCows } from './types.js';

export function evaluateGuess(
  secret: readonly string[],
  guess: string,
): IBullsCows {
  const normalizedSecret = secret.map((element) => element.toLowerCase());
  let restSecret = [...normalizedSecret];
  const arrGuess = guess.toLowerCase().split('');

  const bulls = arrGuess.reduce(
    (sumBulls: number, element: string, index: number) => {
      if (element === normalizedSecret[index]) {
        restSecret = restSecret.filter((el) => el !== element);
        sumBulls += 1;
      }
      return sumBulls;
    },
    0,
  );

  const cows = restSecret.filter((element: string) =>
    arrGuess.includes(element),
  ).length;

  return { bulls, cows };
}
