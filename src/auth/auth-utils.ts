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

export function describeAuthError(
  error: unknown, language: 'vi' | 'en' = 'vi', operation: 'sign_in' | 'sign_up' | 'reset' | 'callback' = 'callback',
): string {
  const { code, message } = details(error)
  if (language === 'en') {
    if (isUnconfirmedEmailError(error)) return 'This email is not confirmed. Open the confirmation email or request a new one.'
    if (operation === 'sign_in' && (code === 'invalid_credentials' || message.includes('invalid login credentials'))) {
      return "We couldn't sign you in with these details. Check your email and password, or create an account if you haven't registered."
    }
    if (code === 'over_email_send_rate_limit' || message.includes('rate limit')) return 'Too many email requests. Wait a few minutes and retry.'
    if (message.includes('password should be at least')) return 'Your password needs at least 8 characters.'
    if (operation === 'sign_up') return 'Your account could not be created. Check your details and try again in a few minutes.'
    return 'Authentication could not be completed. Please try again in a few minutes.'
  }
  if (isUnconfirmedEmailError(error)) return 'Email này chưa được xác nhận. Hãy mở email xác nhận hoặc yêu cầu gửi lại.'
  if (operation === 'sign_in' && (code === 'invalid_credentials' || message.includes('invalid login credentials'))) {
    return 'Không thể đăng nhập bằng thông tin này. Hãy kiểm tra lại email, mật khẩu hoặc chọn Tạo tài khoản nếu bạn chưa đăng ký.'
  }
  if (code === 'over_email_send_rate_limit' || message.includes('rate limit')) return 'Bạn vừa yêu cầu quá nhiều email. Hãy chờ ít phút rồi thử lại.'
  if (message.includes('password should be at least')) return 'Mật khẩu cần có ít nhất 8 ký tự.'
  if (operation === 'sign_up') return 'Chưa thể tạo tài khoản. Hãy kiểm tra thông tin và thử lại sau ít phút.'
  return 'Không thể hoàn tất xác thực lúc này. Hãy thử lại sau ít phút.'
}
