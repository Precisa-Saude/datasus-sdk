import base from '@precisa-saude/eslint-config/base';

export default [
  ...base,
  {
    // Test files are excluded from package tsconfigs (to keep tsc --noEmit
    // tight), so disable type-aware parsing for them or ESLint errors
    // trying to locate a project.
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/__tests__/**'],
    languageOptions: {
      parserOptions: { project: false },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
    },
  },
  {
    // Scripts internos de manutenção (build-sigtap-mapping, extract-ans-xlsx,
    // fix-fhir-brasil-tuss) rodam uma vez por maintainer, não entram no
    // bundle publicado. Console é o canal esperado.
    files: ['packages/core/scripts/**/*.ts'],
    languageOptions: {
      parserOptions: { project: false },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
      'max-lines': 'off',
      'no-console': 'off',
    },
  },
];
