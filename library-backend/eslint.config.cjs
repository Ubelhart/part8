module.exports = [
  {
    env: {
      node: true,
    },
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
    },
    ignore: ['node_modules'],
    rules: {
      'no-undef': 'off',
      semi: 'error',
      'prefer-const': 'error',
    },
  },
]
