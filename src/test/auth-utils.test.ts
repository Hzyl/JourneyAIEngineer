import { describe, expect, it } from 'vitest'
import { describeAuthError, isUnconfirmedEmailError, passwordValidationError } from '../auth/auth-utils'

describe('hosted authentication helpers', () => {
  it('requires two matching passwords for sign-up', () => {
    expect(passwordValidationError('short', 'short')).toContain('ít nhất 8')
    expect(passwordValidationError('secure-pass', 'different-pass')).toContain('trùng khớp')
    expect(passwordValidationError('secure-pass', 'secure-pass')).toBeNull()
  })

  it('turns an unconfirmed-email response into a recoverable flow', () => {
    const error = { code: 'email_not_confirmed', message: 'Email not confirmed' }
    expect(isUnconfirmedEmailError(error)).toBe(true)
    expect(describeAuthError(error)).toContain('chưa được xác nhận')
  })

  it('does not expose raw provider errors to learners', () => {
    expect(describeAuthError(new Error('unexpected upstream failure'))).toContain('Không thể hoàn tất')
  })
})
