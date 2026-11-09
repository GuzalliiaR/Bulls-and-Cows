import { resetGame, startGame } from './core/gameState.js';
import type { GameState } from './core/types.js';
import renderSettingsScreen from './ui/settingsScreen.js';

// Единственное место, где "живет" состояние игры
let state: GameState = resetGame();

const root = document.createElement('div');
root.id = 'app';
document.body.append(root);

function dispatch(next: GameState): void {
  state = next;
  render();
}

function render(): void {
  root.replaceChildren();

  if (state.status === 'settings') {
    const settingsScreen = renderSettingsScreen((settings) =>
      dispatch(startGame(settings)),
    );
    root.append(settingsScreen);
    return;
  }

  // Игрового экрана пока нет — заглушка, чтобы приложение не падало
  const placeholder = document.createElement('p');
  placeholder.textContent = `Игра началась: длина ${state.settings?.length}, база ${state.settings?.base}`;
  root.append(placeholder);
}

render();
