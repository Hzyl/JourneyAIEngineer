type AuthErrorLike = { code?: unknown; message?: unknown }

function details(error: unknown): { code: string; message: string } {
  if (typeof error !== 'object' || error === null) return { code: '', message: '' }
  const value = error as AuthErrorLike
  return {
    code: typeof value.code === 'string' ? value.code.toLowerCase() : '',
    message: typeof value.message === 'string' ? value.message.toLowerCase() : '',
  }
}

export function isUnconfirmedEmailError(error: unknown): boolean {
  const { code, message } = details(error)
  return code === 'email_not_confirmed' || message.includes('email not confirmed')
}

export function passwordValidationError(password: string, confirmation: string): string | null {
  if (password.length < 8) return 'Mật khẩu cần có ít nhất 8 ký tự.'
  if (password !== confirmation) return 'Hai mật khẩu chưa trùng khớp.'
  return null
}

export function describeAuthError(error: unknown): string {
  const { code, message } = details(error)
  if (isUnconfirmedEmailError(error)) return 'Email này chưa được xác nhận. Hãy mở email xác nhận hoặc yêu cầu gửi lại.'
  if (code === 'invalid_credentials' || message.includes('invalid login credentials')) return 'Email hoặc mật khẩu chưa đúng.'
  if (code === 'over_email_send_rate_limit' || message.includes('rate limit')) return 'Bạn vừa yêu cầu quá nhiều email. Hãy chờ ít phút rồi thử lại.'
  if (message.includes('password should be at least')) return 'Mật khẩu cần có ít nhất 8 ký tự.'
  return 'Không thể hoàn tất xác thực lúc này. Hãy thử lại sau ít phút.'
}
