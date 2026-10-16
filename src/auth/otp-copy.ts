export const signupConfirmationCopy = {
  vi: {
    step: 'XÁC NHẬN EMAIL', title: 'Kiểm tra email của bạn',
    intro: 'Mở email xác nhận bạn vừa nhận được và bấm liên kết trong thư. Bạn có thể giữ tab này để theo dõi kết quả.',
    destination: 'Email bạn đã nhập',
    confirmedTitle: 'Email đã được xác nhận',
    confirmed: 'Xác nhận thành công. Bạn có thể tiếp tục học ngay trong tab này.',
    continue: 'Tiếp tục học', check: 'Tôi đã bấm liên kết — kiểm tra lại', checking: 'Đang kiểm tra…',
    unavailable: 'Chưa kiểm tra được trạng thái xác nhận. Kiểm tra kết nối rồi thử lại.',
    otherAccount: 'Trình duyệt đang dùng một tài khoản khác. Hãy mở liên kết xác nhận của đúng địa chỉ email ở trên.',
    resend: 'Gửi lại email xác nhận', sending: 'Đang gửi…', wait: (seconds: number) => `Gửi lại sau ${seconds}s`,
    sent: 'Đã tiếp nhận yêu cầu. Nếu địa chỉ này cần xác nhận, hãy kiểm tra hộp thư và thư rác để tìm email xác nhận.',
    changeEmail: 'Sửa địa chỉ email', back: 'Quay về đăng nhập',
    help: 'Tab này tự cập nhật khi bạn xác nhận trong cùng trình duyệt. Nếu mở thư trên thiết bị hoặc trình duyệt khác, hãy quay về đăng nhập. Chưa thấy thư? Kiểm tra cả mục thư rác.',
    rateLimit: 'Bạn đã thử quá nhiều lần. Hãy chờ ít phút rồi thử lại.',
    resendFailure: 'Chưa thể gửi email xác nhận lúc này. Hãy chờ một lát rồi thử lại.',
  },
  en: {
    step: 'VERIFY YOUR EMAIL', title: 'Check your email',
    intro: 'Open your confirmation email and follow its confirmation link. You can keep this tab open to see the result.',
    destination: 'Email you entered',
    confirmedTitle: 'Email confirmed',
    confirmed: 'Your email is confirmed. You can continue learning in this tab.',
    continue: 'Continue learning', check: 'I followed the link — check again', checking: 'Checking…',
    unavailable: 'We could not check your confirmation status. Check your connection and try again.',
    otherAccount: 'This browser is using a different account. Open the confirmation link for the email address shown above.',
    resend: 'Resend confirmation email', sending: 'Sending…', wait: (seconds: number) => `Resend in ${seconds}s`,
    sent: 'Request received. If this address needs confirmation, check your inbox and spam folder for a confirmation email.',
    changeEmail: 'Correct email address', back: 'Back to sign in',
    help: 'This tab updates when you confirm in the same browser. If you open the email on another device or browser, return here to sign in. No email yet? Check your spam folder too.',
    rateLimit: 'Too many attempts. Wait a few minutes before trying again.',
    resendFailure: 'The confirmation email could not be sent. Wait a moment before trying again.',
  },
}

export function resendFailure(error: unknown): 'rateLimit' | 'resendFailure' {
  const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : ''
  if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit') return 'rateLimit'
  return 'resendFailure'
}
