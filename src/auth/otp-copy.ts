export const otpCopy = {
  vi: {
    step: 'XÁC NHẬN EMAIL', title: 'Kiểm tra email của bạn', codeTitle: 'Nhập mã xác nhận',
    intro: 'Mở email xác nhận và bấm liên kết trong thư để tiếp tục. Nếu thư có mã bằng số, bạn có thể nhập mã tại đây.',
    enterCode: 'Email của tôi có mã xác nhận', useLink: 'Xem hướng dẫn dùng liên kết',
    destination: 'Email bạn đã nhập', label: 'Mã xác nhận', placeholder: 'Nhập mã trong email',
    hint: 'Có thể dán toàn bộ mã. Mã chỉ dùng một lần; không chia sẻ cho người khác.',
    verify: 'Xác nhận và tiếp tục', verifying: 'Đang xác nhận…',
    confirmed: 'Email đã được xác nhận. Đang mở tài khoản của bạn…',
    resend: 'Gửi lại email xác nhận', sending: 'Đang gửi…', wait: (seconds: number) => `Gửi lại sau ${seconds}s`,
    sent: 'Đã tiếp nhận yêu cầu. Nếu địa chỉ này cần xác nhận, hãy kiểm tra hộp thư và thư rác để tìm email xác nhận.',
    changeEmail: 'Sửa địa chỉ email', back: 'Quay về đăng nhập',
    help: 'Chưa thấy thư? Kiểm tra địa chỉ email và mục thư rác. Sau khi mở liên kết xác nhận, bạn có thể quay về đăng nhập.',
    validation: 'Nhập mã bằng số trong email xác nhận.',
    invalid: 'Mã không đúng hoặc đã hết hạn. Kiểm tra lại mã hoặc yêu cầu gửi lại email xác nhận.',
    rateLimit: 'Bạn đã thử quá nhiều lần. Hãy chờ ít phút rồi thử lại.',
    failure: 'Chưa thể xác nhận lúc này. Kiểm tra kết nối rồi thử lại.',
    resendFailure: 'Chưa thể gửi email xác nhận lúc này. Hãy chờ một lát rồi thử lại.',
  },
  en: {
    step: 'VERIFY YOUR EMAIL', title: 'Check your email', codeTitle: 'Enter your confirmation code',
    intro: 'Open your confirmation email and follow its confirmation link to continue. If it contains a numeric code, you can enter it here.',
    enterCode: 'My email contains a confirmation code', useLink: 'Show confirmation link instructions',
    destination: 'Email you entered', label: 'Confirmation code', placeholder: 'Code from your email',
    hint: 'You can paste the entire code. It is single-use; never share it with anyone.',
    verify: 'Verify and continue', verifying: 'Verifying…',
    confirmed: 'Email confirmed. Opening your account…',
    resend: 'Resend confirmation email', sending: 'Sending…', wait: (seconds: number) => `Resend in ${seconds}s`,
    sent: 'Request received. If this address needs confirmation, check your inbox and spam folder for a confirmation email.',
    changeEmail: 'Correct email address', back: 'Back to sign in',
    help: 'No email yet? Check the address and your spam folder. After following the confirmation link, you can return to sign in.',
    validation: 'Enter the numeric code from your confirmation email.',
    invalid: 'The code is incorrect or expired. Check it or request another confirmation email.',
    rateLimit: 'Too many attempts. Wait a few minutes before trying again.',
    failure: 'Verification could not be completed. Check your connection and retry.',
    resendFailure: 'The confirmation email could not be sent. Wait a moment before trying again.',
  },
}

export function otpFailure(error: unknown): 'invalid' | 'rateLimit' | 'failure' {
  const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : ''
  if (code === 'otp_expired' || code === 'validation_failed') return 'invalid'
  if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit') return 'rateLimit'
  return 'failure'
}
