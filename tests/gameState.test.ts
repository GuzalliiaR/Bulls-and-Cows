import { describe, it, expect } from 'vitest';
import {
  startGame,
  makeAttempt,
  resetGame,
  getRoundDurationMs,
  getAttemptsCount,
} from '../src/core/gameState.js';
import type { GameState } from '../src/core/types.js';

/** Всегда выбирает первый доступный символ: для length=2, base=2 → ['0','1'] */
const firstIndex = (): number => 0;

/** Часы с фиксированным значением */
const clockAt = (value: number) => (): number => value;

/** Состояние в статусе playing с секретом ['0','1'] (length 2, base 2) */
const playingState = (startedAt = 1000): GameState =>
  startGame({ length: 2, base: 2 }, firstIndex, clockAt(startedAt));

describe('resetGame', () => {
  it('returns a fresh settings state', () => {
    const state = resetGame();

    expect(state.status).toBe('settings');
    expect(state.settings).toBeNull();
    expect(state.history).toEqual([]);
    expect(state.secret).toEqual([]);
    expect(state.startedAt).toBeNull();
    expect(state.finishedAt).toBeNull();
  });
});

describe('startGame', () => {
  it('starts a round with settings, secret, start time and empty history', () => {
    const state = playingState(5000);

    expect(state.status).toBe('playing');
    expect(state.settings).toEqual({ length: 2, base: 2 });
    expect(state.secret).toEqual(['0', '1']);
    expect(state.startedAt).toBe(5000);
    expect(state.finishedAt).toBeNull();
    expect(state.history).toEqual([]);
  });

  it('does not mutate the settings argument', () => {
    const settings = { length: 2, base: 8 };

    startGame(settings, firstIndex, clockAt(1000));

    expect(settings).toEqual({ length: 2, base: 8 });
  });
});

describe('makeAttempt', () => {
  it('appends one entry with the evaluated result and keeps playing', () => {
    const state = playingState(); // secret ['0','1']
    const next = makeAttempt(state, '10', clockAt(2000));

    // добавляет только 1 запись в историю
    expect(next.history).toHaveLength(1);
    expect(next.history[0]).toEqual({
      guess: '10',
      result: { bulls: 0, cows: 2 },
    });
    expect(next.status).toBe('playing');
  });

  it('does not mutate the previous state (immutability)', () => {
    const state = playingState();
    const next = makeAttempt(state, '10', clockAt(2000));

    expect(state.history).toHaveLength(0);
    expect(next.history).toHaveLength(1);
  });

  it('returns a new object for an accepted attempt and the same one for a repeat', () => {
    const state = playingState();
    const afterFirst = makeAttempt(state, '10', clockAt(2000));
    const afterSecond = makeAttempt(afterFirst, '10', clockAt(3000));

    expect(afterSecond).not.toBe(state);

    // при повторе guess не задваивает историю
    expect(afterSecond).toBe(afterFirst);
    expect(afterSecond.history).toHaveLength(1);
  });

  it('marks the game as won when all digits are bulls and freezes the finish time', () => {
    const state = playingState(); // secret ['0','1']
    const won = makeAttempt(state, '01', clockAt(2000));

    // установка верных поелй в состоянии
    expect(won.status).toBe('won');
    expect(won.finishedAt).toBe(2000);

    // после победы ходы игнорируются
    expect(makeAttempt(won, '10', clockAt(3000))).toBe(won);
  });

  it('normalizes hex digits and rejects a repeated attempt in any case', () => {
    const hexState = startGame(
      { length: 2, base: 16 },
      firstIndex,
      clockAt(1000),
    );
    const afterFirst = makeAttempt(hexState, '0A', clockAt(2000));
    const afterSecond = makeAttempt(afterFirst, '0a', clockAt(3000));

    // первая попытка приводит к нижнему регистру
    expect(afterFirst.history[0].guess).toBe('0a');
    // повторная попытка не чувствительна к регистру
    expect(afterSecond).toBe(afterFirst);
  });
});

describe('getAttemptsCount', () => {
  it('returns 0 for a fresh game', () => {
    expect(getAttemptsCount(playingState())).toBe(0);
  });

  it('grows with each accepted attempt', () => {
    const state = playingState();
    const afterOne = makeAttempt(state, '10', clockAt(2000));
    const afterTwo = makeAttempt(afterOne, '01', clockAt(3000));

    expect(getAttemptsCount(afterTwo)).toBe(2);
  });
});

describe('getRoundDurationMs', () => {
  it('counts from start while playing and freezes at the finish time', () => {
    expect(getRoundDurationMs(resetGame(), clockAt(9000))).toBe(0);

    const playing = playingState(1000);
    expect(getRoundDurationMs(playing, clockAt(3500))).toBe(2500);

    const won = makeAttempt(playing, '01', clockAt(4000));
    expect(getRoundDurationMs(won, clockAt(9999))).toBe(3000);
  });
});
