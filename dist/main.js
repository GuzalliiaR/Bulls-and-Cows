import { getAttemptsCount, getRoundDurationMs, makeAttempt, resetGame, startGame, } from './core/gameState.js';
import { loadRecords, saveRecord } from './storage/records.js';
import createCustomElement from './ui/element.js';
import { renderGameScreen } from './ui/gameScreen.js';
import renderSettingsScreen from './ui/settingsScreen.js';
// Единственное место, где "живет" состояние игры
let state = resetGame();
// Освобождение ресурсов предыдущего экрана
let screenCleanup = null;
const root = createCustomElement('div', { attrs: { id: 'app' } });
document.body.append(root);
function dispatch(next) {
    const prevState = state;
    state = next;
    // Сохранение рекорда в момент перехода в статус won
    if (prevState.status !== 'won' && state.status === 'won') {
        if (state.settings !== null) {
            saveRecord({
                length: state.settings.length,
                base: state.settings.base,
                attempts: getAttemptsCount(state),
                durationMs: getRoundDurationMs(state),
                achievedAt: Date.now(),
            });
        }
    }
    render();
}
function render() {
    screenCleanup?.();
    screenCleanup = null;
    root.replaceChildren();
    if (state.status === 'settings') {
        const settingsScreen = renderSettingsScreen((settings) => dispatch(startGame(settings)));
        root.append(settingsScreen);
        return;
    }
    const settings = state.settings;
    if (settings === null)
        return;
    const gameScreen = renderGameScreen(state, settings, loadRecords(), {
        onSubmitGuess: (guess) => dispatch(makeAttempt(state, guess)),
        onNewGame: () => dispatch(resetGame()),
    });
    screenCleanup = gameScreen.cleanup;
    root.append(gameScreen.element);
}
render();
//# sourceMappingURL=main.js.map