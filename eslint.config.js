import pluginJs from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginPromise from 'eslint-plugin-promise';
import globals from 'globals';

export default [
  {
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 'latest',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  pluginJs.configs.recommended,
  pluginImport.flatConfigs.recommended,
  pluginPromise.configs['flat/recommended'],
  pluginPrettierRecommended,
  {
    rules: {
      'no-console': 'warn',
      'import/no-unresolved': 'off',
      'import/named': 'off',
      'import/namespace': 'off',
      'import/no-named-as-default': 'off',
      'import/default': 'off',
      'import/no-named-as-default-member': 'off',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
];
