module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  plugins: ['@typescript-eslint'],
  extends: [
    // 'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'standard'],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
  }
}
