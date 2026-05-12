import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  // Ignore built artifacts and tooling dirs
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.turbo/**',
      '**/coverage/**',
      'apps/catalog/src/app/**', // generated page routes
    ],
  },

  // TypeScript + React for all source files
  ...tseslint.configs.recommended,
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      // React
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // React 17+ JSX transform
      'react/prop-types': 'off',         // TypeScript handles this

      // React hooks — spread recommended then tune down rules that flag valid library patterns
      ...reactHooksPlugin.configs.recommended.rules,
      // set-state-in-effect flags the valid "sync external API state to React state" pattern
      // (e.g. embla carousel, controlled color pickers). Disabled for library code.
      'react-hooks/set-state-in-effect': 'off',
      // purity and incompatible-library are React compiler hints — not applicable to a
      // design system that explicitly targets non-compiler builds.
      'react-hooks/purity': 'off',
      'react-hooks/incompatible-library': 'off',

      // TypeScript — relax for real-world library patterns
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // Test files — relax some rules
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Prettier must be last — disables formatting rules that conflict
  prettierConfig,
)
