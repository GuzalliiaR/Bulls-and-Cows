import { describe, it, expect, vi } from 'vitest';
import { memoize } from '../src/core/memoize.js';

describe('Checking the function memoize', () => {
  it('calls the wrapped function only once for identical arguments', () => {
    const spy = vi.fn((length: number, base: number) => length * base);
    const memoized = memoize(spy);

    expect(memoized(2, 8)).toBe(16);
    expect(memoized(2, 8)).toBe(16);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('calls the wrapped function again for a different argument set', () => {
    const spy = vi.fn((length: number, base: number) => length * base);
    const memoized = memoize(spy);

    memoized(2, 8);
    memoized(8, 2);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('keeps an independent cache for each memoized instance', () => {
    const spy = vi.fn((value: number) => value * 2);
    const first = memoize(spy);
    const second = memoize(spy);

    first(5);
    second(5);

    expect(spy).toHaveBeenCalledTimes(2);
  });
});
