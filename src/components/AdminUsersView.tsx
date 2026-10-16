/* oxlint-disable react/set-state-in-effect */
import { useCallback, useEffect, useRef, useState } from 'react'
import { mutateAdminUser, readAdminUsers, type AdminDirectoryPage } from '../platform/hosted/admin-client'
import { useAdminBanClock } from './useAdminBanClock'
import './admin-users.css'

function date(value: string | null, vi: boolean) {
  if (!value) return vi ? 'Chưa có' : 'Never'
  return new Intl.DateTimeFormat(vi ? 'vi-VN' : 'en-US', { dateStyle: 'medium' }).format(new Date(value))
}

function adminErrorMessage(error: unknown, vi: boolean) {
  const code = error instanceof Error ? error.message : ''
  const messages = vi ? {
    authentication_required: 'Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.',
    admin_required: 'Tài khoản này không có quyền quản trị.',
    rate_limited: 'Có quá nhiều yêu cầu. Hãy chờ một lát rồi thử lại.',
    provider_unavailable: 'Dịch vụ quản trị tạm thời không khả dụng.',
    provider_operation_failed: 'Supabase không hoàn tất được thao tác này.',
    audit_failed: 'Không ghi được nhật ký quản trị; thao tác chưa được xác nhận.',
    self_lockout_not_allowed: 'Không thể khóa chính tài khoản quản trị hiện tại.',
    admin_target_protected: 'Không thể thao tác với tài khoản quản trị khác.',
    user_not_found: 'Không tìm thấy tài khoản này.',
    user_email_missing: 'Tài khoản này chưa có email để gửi đặt lại mật khẩu.',
  } : {
    authentication_required: 'Your session expired. Sign in again.',
    admin_required: 'This account is not authorized for administration.',
    rate_limited: 'Too many requests. Wait a moment and try again.',
    provider_unavailable: 'The admin service is temporarily unavailable.',
    provider_operation_failed: 'Supabase could not complete this action.',
    audit_failed: 'The admin audit entry was not recorded; the action is unconfirmed.',
    self_lockout_not_allowed: 'You cannot lock the current admin account.',
    admin_target_protected: 'You cannot change another admin account.',
    user_not_found: 'This account was not found.',
    user_email_missing: 'This account has no email for password recovery.',
  }
  return code in messages ? messages[code as keyof typeof messages] : (vi ? 'Không thể hoàn tất thao tác quản trị.' : 'The admin action could not be completed.')
}

export function AdminUsersView({ language }: { language: 'vi' | 'en' }) {
  const vi = language === 'vi'
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<AdminDirectoryPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const requestId = useRef(0)
  const mounted = useRef(true)
  const actionPending = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])
  const load = useCallback(async () => {
    if (!mounted.current) return
    const request = ++requestId.current
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const next = await readAdminUsers(page, 25, submitted)
      if (mounted.current && request === requestId.current) setResult(next)
    } catch (caught) {
      if (mounted.current && request === requestId.current) setError(caught)
    } finally {
      if (mounted.current && request === requestId.current) setLoading(false)
    }
  }, [page, submitted])
  useEffect(() => {
    void load()
    return () => { requestId.current += 1 }
  }, [load])
  const now = useAdminBanClock(result?.users)
  const banned = result?.users.filter((user) => user.banned_until && Date.parse(user.banned_until) > now).length ?? 0
  const action = async (userId: string, kind: 'ban' | 'unban' | 'send_reset', duration?: string) => {
    if (actionPending.current) return
    const confirmation = kind === 'ban' ? (vi ? 'Khoá tài khoản này 24 giờ?' : 'Ban this account for 24 hours?')
      : kind === 'unban' ? (vi ? 'Mở khoá tài khoản này?' : 'Unban this account?')
        : (vi ? 'Gửi email đặt lại mật khẩu?' : 'Send a password reset email?')
    if (!window.confirm(confirmation)) return
    actionPending.current = true
    setBusy(`${kind}:${userId}`)
    setError(null)
    try {
      await mutateAdminUser(kind, userId, duration)
      if (mounted.current) await load()
    } catch (caught) {
      if (mounted.current) {
        setError(caught)
        if (caught instanceof Error && ['admin_required', 'authentication_required'].includes(caught.message)) {
          setResult(null)
        }
      }
    } finally {
      actionPending.current = false
      if (mounted.current) setBusy(null)
    }
  }
  return <section className="admin-users-view" aria-labelledby="admin-users-title">
    <div className="page-intro">
      <div><span className="eyebrow accent">{vi ? 'QUẢN TRỊ' : 'ADMINISTRATION'}</span>
        <h2 id="admin-users-title">{vi ? 'Người dùng' : 'User directory'}</h2></div>
      <p>{vi ? 'Quản lý tài khoản beta bằng ID người dùng ổn định.' : 'Manage beta accounts by stable user ID.'}</p>
    </div>
    <div className="admin-stats" aria-label={vi ? 'Thống kê người dùng' : 'User statistics'}>
      <div><span>{vi ? 'Tổng tài khoản' : 'Total users'}</span><strong>{result?.total ?? '—'}</strong></div>
      <div><span>{vi ? 'Trong trang này' : 'On this page'}</span><strong>{result?.users.length ?? '—'}</strong></div>
      <div><span>{vi ? 'Đang khóa trong trang' : 'Banned on this page'}</span><strong>{banned}</strong></div>
    </div>
    <form className="admin-search" onSubmit={(event) => { event.preventDefault(); setPage(1); setSubmitted(query.trim()) }}>
      <label htmlFor="admin-user-search">{vi ? 'Tìm email hoặc ID' : 'Search email or ID'}</label>
      <input id="admin-user-search" type="search" value={query} maxLength={200} disabled={busy !== null} onChange={(event) => setQuery(event.target.value)} />
      <button className="primary-button" type="submit" disabled={busy !== null}>{vi ? 'Tìm' : 'Search'}</button>
    </form>
    {error != null && <p className="admin-error" role="alert">{adminErrorMessage(error, vi)} <button className="text-button" disabled={busy !== null} onClick={() => void load()}>{vi ? 'Thử lại' : 'Retry'}</button></p>}
    {loading && <p role="status">{vi ? 'Đang tải…' : 'Loading…'}</p>}
    {!loading && result && <div className="admin-table-wrap"><table className="admin-table"><thead><tr>
      <th scope="col">{vi ? 'Email' : 'Email'}</th><th scope="col">ID</th><th scope="col">{vi ? 'Tạo lúc' : 'Created'}</th><th scope="col">{vi ? 'Xác nhận email' : 'Confirmed'}</th><th scope="col">{vi ? 'Đăng nhập cuối' : 'Last sign-in'}</th><th scope="col">{vi ? 'Trạng thái' : 'Status'}</th><th scope="col">{vi ? 'Thao tác' : 'Actions'}</th>
    </tr></thead><tbody>{result.users.map((user) => { const bannedNow = Boolean(user.banned_until && Date.parse(user.banned_until) > now); return <tr key={user.id}>
      <td data-label="Email">{user.email ?? '—'}</td><td data-label="ID"><code>{user.id}</code></td><td data-label={vi ? 'Tạo lúc' : 'Created'}>{date(user.created_at ?? null, vi)}</td><td data-label={vi ? 'Xác nhận email' : 'Confirmed'}>{date(user.confirmed_at ?? null, vi)}</td><td data-label={vi ? 'Đăng nhập cuối' : 'Last sign-in'}>{date(user.last_sign_in_at ?? null, vi)}</td>
      <td data-label={vi ? 'Trạng thái' : 'Status'}><span className={bannedNow ? 'admin-badge banned' : 'admin-badge'}>{bannedNow ? (vi ? 'Đang khoá' : 'Banned') : (vi ? 'Hoạt động' : 'Active')}</span></td>
      <td data-label={vi ? 'Thao tác' : 'Actions'} className="admin-actions"><button className="secondary-button" disabled={busy !== null} onClick={() => void action(user.id, bannedNow ? 'unban' : 'ban', '24h')}>{busy === `${bannedNow ? 'unban' : 'ban'}:${user.id}` ? '…' : (bannedNow ? (vi ? 'Mở khoá' : 'Unban') : (vi ? 'Khoá 24h' : 'Ban 24h'))}</button><button className="text-button" disabled={busy !== null} onClick={() => void action(user.id, 'send_reset')}>{vi ? 'Đặt lại mật khẩu' : 'Reset password'}</button></td>
    </tr> })}</tbody></table></div>}
    {!loading && result && <div className="admin-pagination"><button className="secondary-button" disabled={page <= 1 || busy !== null} onClick={() => setPage((value) => value - 1)}>{vi ? '‹ Trước' : '‹ Previous'}</button><span>{page} / {result.pages}</span><button className="secondary-button" disabled={page >= result.pages || busy !== null} onClick={() => setPage((value) => value + 1)}>{vi ? 'Sau ›' : 'Next ›'}</button></div>}
  </section>
}
