module.exports = {
  extends: ['../../.eslintrc.js', 'plugin:react/jsx-runtime', 'plugin:@next/next/recommended'],
  rules: {
      'no-use-before-define': 'off',
      'space-before-function-paren': 'off',
      'ascii/valid-name': 'off',
      'arrow-parens': ['error', 'always'],
      'quote-props': 'off',
      'dot-notation': 'off',
      'require-await': 'error',
      'operator-linebreak': 'off',
      'indent': 0,
      'brace-style': 0,
      '@next/next/no-html-link-for-pages': 'off',
      'react/jsx-curly-brace-presence': [2, { props: 'never' }],
      'react/jsx-no-bind': 'off',
      'react/jsx-indent': 'off',
      'max-len': ['error', { 'code': 120, 'ignoreStrings': true }]
  },
};
