import { createDigitValidator } from '../core/createDigitValidator.js';
import { getAttemptsCount, getRoundDurationMs } from '../core/gameState.js';
import { isValidGuess } from '../core/isValidGuess.js';
import type { AttemptEntry, GameSettings, GameState } from '../core/types.js';
import type { RecordEntry } from '../storage/records.js';
import createCustomElement from './element.js';
import { baseLabel, formatDuration } from './format.js';
import { renderRecordsTable } from './recordsTable.js';

export interface GameScreenHandlers {
  onSubmitGuess: (guess: string) => void;
  onNewGame: () => void;
}

export interface GameScreenResult {
  element: HTMLElement;
  cleanup: () => void;
}

// Ход, который отклонён как повтор — UI может подсветить поле
function renderAttemptRow(entry: AttemptEntry): HTMLElement {
  return createCustomElement('li', {
    className: 'attempt',
    children: [
      createCustomElement('span', {
        className: 'attempt-guess',
        text: entry.guess,
      }),
      createCustomElement('span', {
        className: 'attempt-score',
        text: `🐂 ${entry.result.bulls} · 🐄 ${entry.result.cows}`,
      }),
    ],
  });
}

export function renderGameScreen(
  state: GameState,
  settings: GameSettings,
  records: readonly RecordEntry[],
  handlers: GameScreenHandlers,
): GameScreenResult {
  const digitValidator = createDigitValidator(settings.base);
  const isWon = state.status === 'won';

  // --- таймер: обновляется сам, не перерисовывая экран ---
  const timer = createCustomElement('span', {
    className: 'timer',
    text: formatDuration(getRoundDurationMs(state)),
  });

  const timerId = isWon
    ? null
    : window.setInterval(() => {
        timer.textContent = formatDuration(getRoundDurationMs(state));
      }, 500);

  const cleanup = (): void => {
    if (timerId !== null) window.clearInterval(timerId);
  };

  // --- поле ввода ---
  const input = createCustomElement('input', {
    className: 'guess-input',
    attrs: {
      type: 'text',
      inputmode: 'text',
      autocomplete: 'off',
      autocapitalize: 'off',
      spellcheck: 'false',
      maxlength: String(settings.length),
      placeholder: '0'.repeat(settings.length),
      'aria-label': 'Попытка',
    },
  });

  const error = createCustomElement('p', { className: 'error' });

  // Фильтрация в реальном времени через ту же фабрику, что и валидация.
  input.addEventListener('input', () => {
    const filtered = [...input.value]
      .filter((char) => digitValidator(char))
      .join('')
      .slice(0, settings.length);

    if (filtered !== input.value) input.value = filtered;
    error.textContent = '';
  });

  const form = createCustomElement('form', {
    className: 'guess-form',
    children: [
      input,
      createCustomElement('button', {
        text: 'Проверить',
        attrs: { type: 'submit' },
      }),
      error,
    ],
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!isValidGuess(input.value, settings.length, settings.base)) {
      error.textContent = `Нужно ${settings.length} различных цифр из набора ${baseLabel(settings.base)}`;
      return;
    }

    const guess = input.value;
    input.value = '';
    handlers.onSubmitGuess(guess);
  });

  // --- история ---
  const historyList = createCustomElement('ul', {
    className: 'history',
    children: state.history.map(renderAttemptRow),
  });

  const attemptsLabel = createCustomElement('span', {
    text: `Попыток: ${getAttemptsCount(state)}, время: `,
  });

  // --- шапка ---
  const header = createCustomElement('header', {
    className: 'game-header',
    children: [
      createCustomElement('h1', { text: 'Bulls and Cows' }),
      createCustomElement('p', {
        className: 'hint',
        text: `Режим: ${baseLabel(settings.base)}, длина ${settings.length} · Секрет может начинаться с нуля`,
      }),
      createCustomElement('p', {
        className: 'stats',
        children: [attemptsLabel, timer],
      }),
    ],
  });

  const newGameButton = createCustomElement('button', {
    text: 'Новая игра',
    attrs: { type: 'button' },
    on: { click: () => handlers.onNewGame() },
  });

  // --- экран победы ---
  if (isWon) {
    const totalMs = getRoundDurationMs(state);

    return {
      element: createCustomElement('section', {
        children: [
          header,
          createCustomElement('h2', { text: 'Вы угадали!' }),
          createCustomElement('p', {
            text: `Попыток: ${getAttemptsCount(state)}, время: ${formatDuration(totalMs)}`,
          }),
          newGameButton,
          createCustomElement('h2', { text: 'Таблица рекордов' }),
          renderRecordsTable(records),
          historyList,
        ],
      }),
      cleanup: () => {},
    };
  }

  return {
    element: createCustomElement('section', {
      children: [header, form, historyList, newGameButton],
    }),
    cleanup,
  };
}
