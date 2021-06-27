module.exports = {
  extends: ['airbnb-typescript/base'],
  parserOptions: {
    createDefaultProgram: true,
    project: './tsconfig.json',
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': 'off',
    'no-restricted-syntax': 'off',
    'no-continue': 'off',
    // 禁止使用 var
    'no-var': 'error',
    'max-len': 'off',
    'no-await-in-loop': 'off',
    // 优先使用 interface 而不是 type
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  },
};
