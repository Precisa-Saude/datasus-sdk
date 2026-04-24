const base = require('@precisa-saude/commitlint-config');

/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  ...base,
  rules: {
    ...base.rules,
    'scope-enum': [2, 'always', ['core', 'deps', 'docs', 'ci', 'lint', 'config']],
  },
};
