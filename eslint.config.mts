import js from '@eslint/js'; // в объект js есть свойство configs.recommended — рекомендованный набор правил
import globals from 'globals'; // globals - библиотека для описания глобальных переменных для разных окружений (globals.browser, globals.node, globals.es2021 и т.д.)
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config'; // функция defineConfig - принимает массив конфигураций и возвращает его же, но с проверками
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig([
  // 1. Что не проверяет ESLint
  globalIgnores(['dist', 'coverage', 'node_modules']),

  // 2. Базовые правила ESLint для JS/TS
  js.configs.recommended,

  // 3. Правила TS - это массив конфигов, поэтому через спред-оператор
  ...tseslint.configs.recommended,

  // 4. Код приложения: браузерное окружение + собственные правила проекта
  {
    files: ['src/**/*.{ts,mts}'], // первый объект конфига применяется к файлам с указанным расширением
    languageOptions: { globals: globals.browser }, // добавление глобальных переменных window, document, console, alert, localStorage и т.д.
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // 5. Тесты, конфиги и скрипты исполняются в своем глобальном окружении Node
  {
    files: [
      'tests/**/*.{ts,mts}',
      '**/*.config.{ts,mts,js,mjs}',
      'eslint.config.mts',
    ],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      'no-console': 'off',
    },
  },

  // 6. В последнюю очередь отключаем форматирование у ESLint (за форматирование отвечает Prettier)
  eslintConfigPrettier,
]);
