module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-use-before-define': 'off'
  },
  env: {
    node: true,
    browser: true,
    es6: true,
    mocha: true
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    },
    {
      files: ['./cypress/**/*.js', './cypress/**/*.ts'],
      plugins: ['cypress'],
      env: {
        'cypress/globals': true
      }
    },
    {
      files: ['./wdio/**/*.test.js', './wdio/**/*.test.ts'],
      plugins: ['wdio'],
      extends: ['plugin:wdio/recommended']
    }
  ]
}
