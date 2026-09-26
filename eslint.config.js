import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importX, { createNodeResolver } from 'eslint-plugin-import-x'
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

  // Accessibility — critical for a component library
  jsxA11y.flatConfigs.recommended,

  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'import-x': importX,
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
      // static-components flags `const Icon = useIcon(name); <Icon />` and
      // `const Link = useLink()` / `useLayerRenderer(type)`. Those hooks return
      // stable, module-level components looked up from a registry/context — not
      // components created during render — so every hit is a false positive.
      'react-hooks/static-components': 'off',
      // refs flags reading/writing ref.current during render. The motion
      // components rely on it deliberately (proximity-hover session keys,
      // stable run-id caches for merge/split animations, has-mounted flags,
      // latest-value refs read by pointer handlers). Those are safe without the
      // React Compiler, which this library doesn't target. Kept as a warning so
      // new occurrences stay visible in review.
      'react-hooks/refs': 'warn',

      // TypeScript — relax for real-world library patterns
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // Accessibility tuning
      // `role` on our own components (e.g. <Row role={null}>) is component API,
      // not an ARIA attribute on a DOM node.
      'jsx-a11y/aria-role': ['error', { ignoreNonDOM: true }],
      // role="list" on <ul>/<ol> is intentional: Safari/VoiceOver drops list
      // semantics from lists styled with `list-style: none` (Tailwind's reset).
      'jsx-a11y/no-redundant-roles': ['error', { ul: ['list'], ol: ['list'] }],

      // Imports — catch circular deps that break tree-shaking.
      // Unbounded, the rule walks the full transitive import graph of every
      // file (including node_modules) and runs out of memory. Cycles that
      // matter here are short intra-package ones, so bound the depth and skip
      // external modules.
      'import-x/no-cycle': ['error', { maxDepth: 4, ignoreExternal: true }],
    },
    settings: {
      react: { version: 'detect' },
      // Resolve relative TS/TSX imports so no-cycle can actually follow them
      // (the default resolver only knows .js and silently finds no cycles).
      'import-x/resolver-next': [
        createNodeResolver({ extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json'] }),
      ],
      // …and parse the resolved TS files when walking the graph.
      'import-x/extensions': ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
      'import-x/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
      'import-x/external-module-folders': ['node_modules'],
    },
  },

  // Test files — relax some rules
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'jsx-a11y/no-autofocus': 'off', // autofocus in test scenarios is intentional
    },
  },

  // Prettier must be last — disables formatting rules that conflict
  prettierConfig,
)
