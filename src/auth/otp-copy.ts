export const otpCopy = {
  vi: {
    step: 'XÁC NHẬN EMAIL', title: 'Nhập mã xác nhận',
    intro: 'Mở thư từ Journey AI Engineer và nhập mã tại đây để hoàn tất đăng ký.',
    destination: 'Email bạn đã nhập', label: 'Mã xác nhận', placeholder: 'Nhập mã trong email',
    hint: 'Có thể dán toàn bộ mã. Mã chỉ dùng một lần; không chia sẻ cho người khác.',
    verify: 'Xác nhận và tiếp tục', verifying: 'Đang xác nhận…',
    confirmed: 'Email đã được xác nhận. Đang mở tài khoản của bạn…',
    resend: 'Gửi lại mã', sending: 'Đang gửi…', wait: (seconds: number) => `Gửi lại sau ${seconds}s`,
    sent: 'Nếu địa chỉ này cần xác nhận, mã mới đã được gửi. Hãy kiểm tra cả thư rác.',
    changeEmail: 'Sửa địa chỉ email', back: 'Quay về đăng nhập',
    help: 'Chưa thấy thư? Kiểm tra địa chỉ email và mục thư rác. Tìm thư có tên Journey AI Engineer.',
    validation: 'Nhập mã bằng số trong email xác nhận.',
    invalid: 'Mã không đúng hoặc đã hết hạn. Kiểm tra lại mã hoặc yêu cầu gửi mã mới.',
    rateLimit: 'Bạn đã thử quá nhiều lần. Hãy chờ ít phút rồi thử lại.',
    failure: 'Chưa thể xác nhận lúc này. Kiểm tra kết nối rồi thử lại.',
    resendFailure: 'Chưa thể gửi mã lúc này. Hãy chờ một lát rồi thử lại.',
  },
  en: {
    step: 'VERIFY YOUR EMAIL', title: 'Enter your confirmation code',
    intro: 'Open the email from Journey AI Engineer and enter its code here to finish signing up.',
    destination: 'Email you entered', label: 'Confirmation code', placeholder: 'Code from your email',
    hint: 'You can paste the entire code. It is single-use; never share it with anyone.',
    verify: 'Verify and continue', verifying: 'Verifying…',
    confirmed: 'Email confirmed. Opening your account…',
    resend: 'Resend code', sending: 'Sending…', wait: (seconds: number) => `Resend in ${seconds}s`,
    sent: 'If this address needs confirmation, a new code has been sent. Check your spam folder too.',
    changeEmail: 'Correct email address', back: 'Back to sign in',
    help: 'No email yet? Check the address and your spam folder. Look for Journey AI Engineer.',
    validation: 'Enter the numeric code from your confirmation email.',
    invalid: 'The code is incorrect or expired. Check it or request a new code.',
    rateLimit: 'Too many attempts. Wait a few minutes before trying again.',
    failure: 'Verification could not be completed. Check your connection and retry.',
    resendFailure: 'The code could not be sent. Wait a moment before trying again.',
  },
}

export function otpFailure(error: unknown): 'invalid' | 'rateLimit' | 'failure' {
  const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : ''
  if (code === 'otp_expired' || code === 'validation_failed') return 'invalid'
  if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit') return 'rateLimit'
  return 'failure'
}
