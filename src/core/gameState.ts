import type { GameSettings, GameState } from './types.js';
import { generateSecret } from './generateSecret.js';
import { evaluateGuess } from './evaluateGuess.js';

// Старт игры: передает настройки, случайно создает значение secret, записывает время старта игры
export function startGame(
  settings: GameSettings,
  random: () => number = Math.random,
  timeNow: () => number = Date.now,
): GameState {
  return {
    status: 'playing',
    settings: { ...settings },
    secret: generateSecret(settings.length, settings.base, random),
    history: [],
    startedAt: timeNow(),
    finishedAt: null,
  };
}

// Один ход: принимает текущее состояение, возвращает новое
export function makeAttempt(
  state: GameState,
  guess: string,
  timeNow: () => number = Date.now,
): GameState {
  const normalizedGuess = guess.toLowerCase();

  if (state.status !== 'playing' || state.settings === null) return state;

  // если в history найдется повтор попытки, то ход не меняет состояние state
  const isRepeatAttempt = state.history.some(
    (attempt) => attempt.guess === normalizedGuess,
  );
  if (isRepeatAttempt) return state;

  const result = evaluateGuess(state.secret, normalizedGuess);

  // В этой попытке победа?
  const isWon = result.bulls === state.settings.length;

  return {
    ...state,
    history: [...state.history, { guess: normalizedGuess, result }],
    status: isWon ? 'won' : state.status,
    finishedAt: isWon ? timeNow() : state.finishedAt,
  };
}

// Переход к экрану настроек без перезагрузки страницы
export function resetGame(): GameState {
  return {
    status: 'settings',
    settings: null,
    secret: [],
    history: [],
    startedAt: null,
    finishedAt: null,
  };
}

// Сколько мс длился раунд
export function getRoundDurationMs(
  state: GameState,
  timeNow: () => number = Date.now,
): number {
  if (state.startedAt === null) return 0;
  const end = state.finishedAt ?? timeNow();
  return end - state.startedAt;
}

// Сколько ходов сделано
export function getAttemptsCount(state: GameState): number {
  return state.history.length;
}
