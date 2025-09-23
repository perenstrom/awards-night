import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

const config = [
  ...compat.extends(
    'next',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ),
  {
    plugins: {
      '@typescript-eslint': (await import('@typescript-eslint/eslint-plugin'))
        .default,
      import: (await import('eslint-plugin-import')).default
    },
    languageOptions: {
      parser: (await import('@typescript-eslint/parser')).default,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true
      }
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index'
          ]
        }
      ],
      'react/prop-types': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@next/next/no-img-element': 'off',
      '@next/next/no-html-link-for-pages': 'off'
    }
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', 'dist/**']
  }
];

export default config;
