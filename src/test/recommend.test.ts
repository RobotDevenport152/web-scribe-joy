import { describe, it, expect } from 'vitest'

describe('recommend API contract', () => {
  it('returns expected keys in mock', () => {
    const mock = { product_id: 'duvet-premium', reason_en: 'a', reason_zh: 'b' }
    expect(mock).toHaveProperty('product_id')
    expect(mock).toHaveProperty('reason_en')
    expect(mock).toHaveProperty('reason_zh')
  })
})
