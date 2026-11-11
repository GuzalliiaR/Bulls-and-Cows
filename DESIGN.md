# Design Document — Bulls and Cows

## 1. Структуры данных и алгоритмы

### Состояние игры (`src/main.ts`,`src/core/gameState.ts`)

Состояние игры хранится в объекте `state: GameState` с полями `status`, `settings`, `secret`,
`history`, `startedAt`, `finishedAt`. Все эти поля объявлены `readonly`, а массивы — `readonly string[]` / `readonly AttemptEntry[]`, поэтому любая попытка мутации (`state.history.push(...)`) вызовет ошибку компиляции.

Единственное место, где "живет" состояние игры `state` - это `main.ts`. Состояние игры изменяется с помощью единственной не чистой функции `dispatch`, которая принимает следующее значение состояния `GameState` и перезаписывает текущее. Следующее значение состояния игры `GameState` определяется одной из трех чистых функций поведения: `startGame`, `makeAttempt`, `resetGame`.

История попыток `history: readonly AttemptEntry[]` хранится в состоянии игры и представляет из себя массив объектов `{ guess: string, result: IBullsCows }`, расположенных в порядке добавления. В `history` не могут попасть дубликаты, так как они отсекаются на входе (`makeAttempt`). Структура массив выбрана вместо `Map` или `Set`, потому что порядок значим для отображения.

### Описание алгоритма `evaluateGuess` (`src/core/evaluateGuess.ts`)

Функция `evaluateGuess` сопоставляет секретную комбинацию `secret: readonly string[]` и попытку игрока `guess: string`, в результате чего на выходе получается объект `{ bulls: number, cows: number }` (bulls - число угаданных символов на своем месте, cows - число остальных угаданных символов не на своем месте).

Алгоритм расчета bulls - это посимвольный перебор `guess` и поиндексное сравнение с символами `secret`. В случае совпадения символа из `guess` и `secret` - bulls растет на 1, а из копии массива `secret` (`restSecret`) убирается совпавший элемент.

Алгоритм расчета cows - это фильтрация символов из `restSecret` (оставшихся символов от `secret`) по входимости в `guess`. Количество символов после фильтрации - это и есть число cows.

### Описание алгоритма `countPossibleSecrets` (`src/core/countPossibleSecrets.ts`)

Функция `countPossibleSecrets` вычисляет количество возможных комбинаций `secret` при выбранных в настройках игры `length` и `base`. Математически это число размещений без повторений: `P(base, length) = base! / (base - length)!`.

Реализация рекуррентная этой же формулы (именно эту рекурсию реализует функция `countPossibleSecrets`):
`P(base, length) = base · P(base−1, length−1)`, база `P(base, 0) = 1`,
`P(base, length) = 0` при `length > base`.

Мемоизация через HOF `memoize` (`src/core/memoize.ts`): кэш живёт в замыкании инстанса, ключ — аргументы `length:base`. Рекурсия идёт через мемоизированную обёртку, поэтому в кэш попадает вся цепочка промежуточных значений, а не только верхний вызов.

## 2. Сложность (Big O)

| Функция                                | Сложность                              | Обоснование                                                                                                                                                                            |
| -------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `generateSecret(length, base, random)` | O(length · (base + length))            | в цикле из `length` шагов: `splice` сдвигает до `base` элементов — O(length · base); спред `[...result, x]` копирует накопленный массив — O(length²). Итого O(length · base + length²) |
| `evaluateGuess(secret, guess)`         | O(n²)                                  | цикл подсчёта bulls: `reduce` по n элементам, внутри на каждый элемент `filter` - в худшем случае O(n²); подсчет cows: `includes` внутри `filter` даёт вложенный поиск O(n²)           |
| `isValidGuess(guess, length, base)`    | O(n)                                   | один проход `every` по массиву - O(n); построение `Set` из `n` символов - O(n)                                                                                                         |
| `countPossibleSecrets(length, base)`   | O(length) первый вызов, O(1) повторный | глубина рекурсии - `length + 1`; на каждом уровне рекурсии - по O(1) на `Map.set`, `Map.get` и умножение `base * P(base - 1, length - 1)` кэш хранит всю цепочку                       |

## 3. Принципы чистого кода

### Чистые функции и функциональный стиль

- `src/core/generateSecret.ts` — принимает источник случайности параметром
  (`random = Math.random`), поэтому тестируется детерминированно.
- `src/core/gameState.ts: makeAttempt` — редьюсер: принимает состояние,
  возвращает новое, использует `[...history, entry]` вместо `push`.
- `src/core/evaluateGuess.ts` — вычисление через `reduce`/`filter`, без ручных
  циклов со счётчиками.

### DRY (Don't Repeat Yourself)

- `src/core/memoize.ts` — общий HOF, а не копия логики кэша в каждой функции.
- `src/core/createDigitValidator.ts` — единственное место, где известно правило
  «допустимые цифры для base»; используется в `isValidGuess` и в UI.
  - `src/ui/format.ts` — `formatDuration` и `baseLabel` используются
    и в `gameScreen.ts`, и в `recordsTable.ts`, поэтому формат отображения
    задан в одном месте и не расходится между экранами.
- `src/ui/element.ts` — `createCustomElement` единственное место вызова
  `document.createElement`; все экраны собирают DOM через него.

### Имена

- `src/core/isValidGuess.ts` — три булевы переменные названы как утверждения:
  `guessHasCorrectLength`, `allDigitsAllowedBase`, `guessHasUniqueDigits`.
  Возврат `return a && b && c` читается как формулировка требований к попытке.
- `src/storage/records.ts` — `isRecordEntry`, `compareRecords`, `loadRecords`,
  `saveRecord`: из имени понятно, что функция делает с данными и не делает лишнего.
- `src/ui/gameScreen.ts` — `renderGameScreen` возвращает `GameScreenResult`
  с полями `element` и `cleanup`; смысл `cleanup` (освободить таймер)
  понятен без комментария.

### Маленькие функции с одной обязанностью

- `src/ui/gameScreen.ts: renderAttemptRow` — построение одной строки истории
  вынесено из общего рендера; `renderGameScreen` не знает, как выглядит запись.
- `src/core/countPossibleSecrets.ts` — вычисление (`computePossibleSecrets`)
  отделено от мемоизации (`memoizedCompute`): каждая часть меняется независимо.
- `src/storage/records.ts` — `isRecordEntry` (валидация), `compareRecords`
  (правило сортировки), `loadRecords`/`saveRecord` (I/O). Правило «топ-10 по
  (попытки, время)» не размазано по функциям.

  ### Отказ от innerHTML

- `src/ui/element.ts` — весь DOM строится через `createElement` +
  `textContent` + `append`. Динамический контент (попытки, рекорды)
  не проходит через `innerHTML`/`insertAdjacentHTML`, что требуется
  в `task.md:70`.
