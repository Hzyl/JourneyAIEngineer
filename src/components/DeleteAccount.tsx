import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { requireSupabase } from '../platform/hosted/supabase-client'
import './delete-account.css'

type Failure = 'account' | 'delete' | 'signout' | null

export function DeleteAccount({ language }: { language: 'vi' | 'en' }) {
  const { session } = useAuth()
  const owner = session?.user.id ?? null
  const vi = language === 'vi'
  const [expanded, setExpanded] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<Failure>(null)
  const [deleted, setDeleted] = useState(false)
  const mounted = useRef(false)
  const inFlight = useRef(false)
  const version = useRef(0)
  const opener = useRef<HTMLButtonElement>(null)
  const passwordInput = useRef<HTMLInputElement>(null)
  const messages = vi ? {
    account: 'Phiên tài khoản đã thay đổi. Hãy đăng nhập lại và xác nhận từ đầu.',
    delete: 'Chưa xác nhận được việc xóa tài khoản. Kiểm tra mật khẩu và kết nối rồi thử lại. Tài khoản có MFA chưa hỗ trợ xóa ở đây.',
    signout: 'Tài khoản đã được xóa, nhưng chưa đăng xuất được phiên trên thiết bị này. Hãy thử đăng xuất lại.',
  } : {
    account: 'The account session changed. Sign in again and start a new confirmation.',
    delete: 'Account deletion could not be confirmed. Check your password and connection, then retry. MFA accounts cannot be deleted here yet.',
    signout: 'The account was deleted, but this device could not sign out. Please retry signing out.',
  }

  useEffect(() => {
    mounted.current = true
    let observedOwner = owner
    const { data } = requireSupabase().auth.onAuthStateChange((event, nextSession) => {
      if (!mounted.current) return
      const nextOwner = nextSession?.user.id ?? null
      if (event === 'SIGNED_OUT' || nextOwner !== observedOwner) {
        version.current += 1
        setPassword('')
        setConfirmation('')
        setExpanded(false)
        setError(null)
        setDeleted(false)
      }
      observedOwner = nextOwner
    })
    return () => {
      mounted.current = false
      version.current += 1
      data.subscription.unsubscribe()
    }
  }, [owner])
  useEffect(() => { if (expanded) passwordInput.current?.focus() }, [expanded])

  const signOutDeletedOwner = async (client: ReturnType<typeof requireSupabase>, id: string,
    current: () => boolean) => {
    const { data, error: failure } = await client.auth.getSession()
    if (!current()) return
    if (failure) throw failure
    if (!data.session) return
    if (data.session.user.id !== id) return
    const { error: signOutFailure } = await client.auth.signOut({ scope: 'local' })
    if (signOutFailure) throw signOutFailure
  }
  const remove = async () => {
    if (inFlight.current || deleted || confirmation !== 'DELETE' || !password) return
    if (!session || !owner) { setError('account'); return }
    inFlight.current = true
    const startedAt = version.current
    const current = () => mounted.current && version.current === startedAt
    setBusy(true)
    setError(null)
    let confirmedDeleted = false
    try {
      const client = requireSupabase()
      const { data: auth, error: authFailure } = await client.auth.getSession()
      if (!current()) return
      if (authFailure || auth.session?.user.id !== owner) { setError('account'); return }
      const token = auth.session.access_token
      const { data, error: failure } = await client.functions.invoke('delete-account', {
        body: { confirmation, password }, headers: { Authorization: `Bearer ${token}` },
      })
      if (!current()) return
      if (failure || data?.code !== 'account_deleted') { setError('delete'); return }
      confirmedDeleted = true
      setDeleted(true)
      setPassword('')
      setConfirmation('')
      await signOutDeletedOwner(client, owner, current)
    } catch {
      if (current()) setError(confirmedDeleted ? 'signout' : 'delete')
    } finally {
      inFlight.current = false
      if (mounted.current) setBusy(false)
    }
  }
  const retrySignOut = async () => {
    if (inFlight.current || !deleted || !owner) return
    inFlight.current = true
    const startedAt = version.current
    const current = () => mounted.current && version.current === startedAt
    setBusy(true)
    setError(null)
    try { await signOutDeletedOwner(requireSupabase(), owner, current) }
    catch { if (current()) setError('signout') }
    finally {
      inFlight.current = false
      if (mounted.current) setBusy(false)
    }
  }
  if (deleted) return <section className="section-card delete-account">
    <p role="status">{busy
      ? (vi ? 'Tài khoản đã được xóa. Đang đăng xuất…' : 'Account deleted. Signing out…')
      : (vi ? 'Tài khoản đã được xóa.' : 'Account deleted.')}</p>
    {error === 'signout' && <>
      <p role="alert" className="warning-note">{messages.signout}</p>
      <button className="secondary-button" disabled={busy} aria-busy={busy} onClick={() => void retrySignOut()}>
        {vi ? 'Thử đăng xuất lại' : 'Retry sign-out'}
      </button>
    </>}
  </section>
  return <section className="section-card delete-account">
    <h3>{vi ? 'Xóa tài khoản' : 'Delete account'}</h3>
    <p>{vi ? 'Xóa vĩnh viễn tài khoản và dữ liệu học trên web. Hãy tải bản xuất trước nếu bạn muốn giữ lại.'
      : 'Permanently delete your account and web learning data. Export first if you want to keep a copy.'}</p>
    {!expanded ? <button ref={opener} className="text-button" disabled={busy} onClick={() => setExpanded(true)}>
      {vi ? 'Mở bước xác nhận xóa' : 'Open deletion confirmation'}</button> : <form onSubmit={(event) => {
        event.preventDefault()
        void remove()
      }}>
      <label>{vi ? 'Nhập lại mật khẩu' : 'Re-enter password'}
        <input ref={passwordInput} type="password" autoComplete="current-password" required maxLength={4096}
          value={password} disabled={busy} onChange={(event) => setPassword(event.target.value)} /></label>
      <label>{vi ? 'Nhập DELETE để xác nhận' : 'Type DELETE to confirm'}
        <input autoComplete="off" value={confirmation} disabled={busy} required maxLength={6}
          onChange={(event) => setConfirmation(event.target.value)} /></label>
      <div className="backup-actions">
        <button className="secondary-button" type="button" disabled={busy} onClick={() => {
          setExpanded(false)
          setPassword('')
          setConfirmation('')
          setError(null)
          requestAnimationFrame(() => opener.current?.focus())
        }}>{vi ? 'Hủy' : 'Cancel'}</button>
        <button className="danger-button" aria-busy={busy} disabled={busy || confirmation !== 'DELETE' || !password}>
          {busy ? (vi ? 'Đang xóa…' : 'Deleting…') : (vi ? 'Xóa vĩnh viễn' : 'Delete permanently')}
        </button>
      </div>
    </form>}
    {error && <p role="alert" className="warning-note">{messages[error]}</p>}
  </section>
}
