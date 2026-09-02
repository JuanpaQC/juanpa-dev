import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist', 'coverage'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Sin esta regla, ESLint no ve que un identificador usado dentro de JSX
      // (por ejemplo <Icon /> o <motion.div>) está en uso, y lo marca como
      // variable sin usar. Era el origen de los 9 errores falsos que tenía
      // el proyecto.
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'off', // innecesario con el JSX transform de React 17+
      'react/react-in-jsx-scope': 'off',
      'react/jsx-key': 'error',
      'react/no-unknown-property': 'error',

      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    // Ficheros de test: añaden los globales de Vitest
    files: ['**/*.{test,spec}.{js,jsx}', 'src/test/**/*.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    // Configuración del proyecto: se ejecuta en Node, no en el navegador
    files: ['*.config.js', 'vite.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
]
