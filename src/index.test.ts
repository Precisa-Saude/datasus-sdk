import { describe, expect, it } from 'vitest';

import { VERSION } from './index.js';

describe('@precisa-saude/datasus', () => {
  it('exports VERSION constant', () => {
    expect(VERSION).toBe('0.1.0');
  });
});
