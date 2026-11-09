import { countPossibleSecrets } from '../core/countPossibleSecrets.js';
import type { GameSettings } from '../core/types.js';
import createCustomElement from './element.js';

const LENGTHS = [2, 3, 4, 5, 6];
const BASES = [
  { value: 2, label: 'bin' },
  { value: 8, label: 'oct' },
  { value: 10, label: 'dec' },
  { value: 16, label: 'hex' },
];

export default function renderSettingsScreen(
  onStart: (settings: GameSettings) => void,
): HTMLElement {
  let base = 10;
  let length = 4;

  function refreshLengths(): void {
    const maxAvailable = Math.min(6, base);

    lengthSelect.replaceChildren();
    for (const value of LENGTHS) {
      const option = createCustomElement('option', {
        text: String(value),
        attrs: { value: String(value) },
      });
      // base 2 → доступна только длина 2
      option.disabled = value > maxAvailable;
      lengthSelect.append(option);
    }

    length = Math.min(length, maxAvailable);
    lengthSelect.value = String(length);
  }

  function refreshHint(): void {
    const total = countPossibleSecrets(length, base);

    hint.textContent = `Возможных секретов: ${total.toLocaleString('ru-RU')}`;
  }

  // Селектор системы счисления
  const baseSelect = createCustomElement('select', {
    attrs: { id: 'base' },
    on: {
      change: (event) => {
        base = Number((event.target as HTMLSelectElement).value);
        refreshLengths();
        refreshHint();
      },
    },
  });

  for (const option of BASES) {
    baseSelect.append(
      createCustomElement('option', {
        text: option.label,
        attrs: { value: String(option.value) },
      }),
    );
  }
  baseSelect.value = String(base);

  // Селектор длины угадываемого числа
  const lengthSelect = createCustomElement('select', {
    attrs: { id: 'length' },
    on: {
      change: (event) => {
        length = Number((event.target as HTMLSelectElement).value);
        refreshHint();
      },
    },
  });

  // Подсказка
  const hint = createCustomElement('p', { className: 'hint' });

  refreshLengths();
  refreshHint();

  const startButton = createCustomElement('button', {
    text: 'Начать игру',
    attrs: { type: 'button' },
    on: {
      click: () => onStart({ length, base }),
    },
  });

  const sectionSettings = createCustomElement('section', {
    children: [
      createCustomElement('h1', { text: 'Bulls and Cows' }),
      createCustomElement('div', {
        className: 'field',
        children: [
          createCustomElement('label', {
            text: 'Система счисления',
            attrs: { for: 'base' },
          }),
          baseSelect,
        ],
      }),
      createCustomElement('div', {
        className: 'field',
        children: [
          createCustomElement('label', {
            text: 'Длина секрета',
            attrs: { for: 'length' },
          }),
          lengthSelect,
          hint,
        ],
      }),
      startButton,
    ],
  });

  return sectionSettings;
}
