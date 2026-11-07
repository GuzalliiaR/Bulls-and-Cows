import { describe, it, expect } from 'vitest';
import { createDigitValidator } from '../src/core/createDigitValidator';

describe('Checking the function createDigitValidator', () => {
  it('should return a function', () => {
    const validate = createDigitValidator(10);
    expect(typeof validate).toBe('function');
  });

  it('For base: 2 are acceptable the digits 0-1', () => {
    const isBinary = createDigitValidator(2);
    expect(isBinary('0')).toBe(true);
    expect(isBinary('1')).toBe(true);
    expect(isBinary('3')).toBe(false);
  });

  it('For base: 8 are acceptable the digits 0-7', () => {
    const isOctal = createDigitValidator(8);
    expect(isOctal('0')).toBe(true);
    expect(isOctal('3')).toBe(true);
    expect(isOctal('7')).toBe(true);
    expect(isOctal('a')).toBe(false);
  });

  it('For base: 10 are acceptable the digits 0-9', () => {
    const isDecimal = createDigitValidator(10);
    expect(isDecimal('0')).toBe(true);
    expect(isDecimal('5')).toBe(true);
    expect(isDecimal('9')).toBe(true);
    expect(isDecimal('b')).toBe(false);
  });

  it('For base: 16 are acceptable the digits 0-9', () => {
    const isDecimal = createDigitValidator(16);
    expect(isDecimal('0')).toBe(true);
    expect(isDecimal('5')).toBe(true);
    expect(isDecimal('9')).toBe(true);
    expect(isDecimal('a')).toBe(true);
    expect(isDecimal('f')).toBe(true);
    expect(isDecimal('A')).toBe(true);
    expect(isDecimal('F')).toBe(true);
    expect(isDecimal('g')).toBe(false);
    expect(isDecimal('G')).toBe(false);
  });
});
