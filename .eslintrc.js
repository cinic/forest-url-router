module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
    project: ['./tsconfig.json', './tsconfig.eslint.json'],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.js', '.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
      alias: {
        map: [
          ['@lib', './src/lib/'],
          ['@features', './src/features/'],
          ['@pages', './src/pages/'],
          ['@ui', './src/ui/'],
        ],
        extensions: ['.ts', '.tsx', '.js'],
      },
    },
  },
  extends: [
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  plugins: ['@typescript-eslint', 'import', 'jest'],
  ignorePatterns: ['dist'],
  rules: {
    'import/no-cycle': 2,
  },
  globals: {
    it: true,
    describe: true,
    expect: true,
    beforeAll: true,
    localStorage: true,
    getComputedStyle: true,
    WebSocket: true,
  },
}
