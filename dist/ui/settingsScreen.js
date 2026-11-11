import { countPossibleSecrets } from '../core/countPossibleSecrets.js';
import createCustomElement from './element.js';
import { BASES } from './format.js';
const LENGTHS = [2, 3, 4, 5, 6];
export default function renderSettingsScreen(onStart) {
    let base = 10;
    let length = 4;
    function refreshLengths() {
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
    function refreshHint() {
        const total = countPossibleSecrets(length, base);
        hint.textContent = `Возможных секретов: ${total.toLocaleString('ru-RU')}`;
    }
    // Селектор системы счисления
    const baseSelect = createCustomElement('select', {
        attrs: { id: 'base' },
        on: {
            change: (event) => {
                base = Number(event.target.value);
                refreshLengths();
                refreshHint();
            },
        },
    });
    for (const option of BASES) {
        baseSelect.append(createCustomElement('option', {
            text: option.label,
            attrs: { value: String(option.value) },
        }));
    }
    baseSelect.value = String(base);
    // Селектор длины угадываемого числа
    const lengthSelect = createCustomElement('select', {
        attrs: { id: 'length' },
        on: {
            change: (event) => {
                length = Number(event.target.value);
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
//# sourceMappingURL=settingsScreen.js.map