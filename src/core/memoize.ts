/**
 * Оборачивает функцию кэшем результатов.
 *
 * Кэш живёт в замыкании конкретного memoized-инстанса, поэтому разные
 * вызовы memoize не делят между собой состояние.
 */
type PossibleSecretsCounter = (length: number, base: number) => number;

export function memoize(fn: PossibleSecretsCounter): PossibleSecretsCounter {
  const cache = new Map<string, number>();

  return (length: number, base: number): number => {
    const key = `${length}:${base}`;
    const cached = cache.get(key);

    if (cached !== undefined) return cached;

    const value = fn(length, base);
    cache.set(key, value);

    return value;
  };
}
