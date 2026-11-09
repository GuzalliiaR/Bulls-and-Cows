import type { GameSettings, GameState } from './types.js';

// Старт игры: передает настройки, случайно создает значение secret, записывает время старта игры
export function startGame(
  _settings: GameSettings,
  _random: () => number = Math.random,
  _timeNow: () => number = Date.now,
): GameState {
  return {
    status: 'playing',
    settings: null,
    secret: [],
    history: [],
    startedAt: null,
    finishedAt: null,
  };
}

// Один ход: принимает текущее состояение, возвращает новое
export function makeAttempt(
  state: GameState,
  _guess: string,
  _timeNow: () => number = Date.now,
): GameState {
  return state;
}

// Вызов к экрану настроек без перезагрузки страницы
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
  _state: GameState,
  _timeNow: () => number = Date.now,
): number {
  return 0;
}

// Сколько ходов сделано
export function getAttemptsCount(_state: GameState): number {
  return 0;
}
