import { describe, it, expect } from 'vitest'

describe('sleep quiz flow', () => {
  it('answers length equals steps', () => {
    const STEPS = 4
    const answers = ['cold','slim','mid','winter']
    expect(answers.length).toBe(STEPS)
  })
})
