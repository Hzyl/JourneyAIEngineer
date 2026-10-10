import { LearningIllustration } from './LearningIllustration'
import { useRef, useState } from 'react'
import type { AppSettings } from '../api'
import { BackupSettings } from './BackupSettings'
import { CloudDataSettings } from './CloudDataSettings'
import { settingsChoices, settingsLabels } from './settings-copy'
import './settings-layout.css'

type Props = {
  settings: AppSettings
  hosted: boolean
  externalSaving?: boolean
  onRestored: () => Promise<void>
  onSave: (next: Partial<AppSettings>) => Promise<void>
}
type Field = keyof AppSettings

export function SettingsView({ settings, hosted, externalSaving = false, onSave, onRestored }: Props) {
  const vi = settings.language === 'vi'
  const labels = settingsLabels(vi)
  const [goalDraft, setGoal] = useState<string | null>(null)
  const goal = goalDraft ?? String(settings.weekly_goal_minutes)
  const [saved, setSaved] = useState<Field | null>(null)
  const [error, setError] = useState<Field | null>(null)
  const [pending, setPending] = useState<Field | null>(null)
  const [invalidGoal, setInvalidGoal] = useState(false)
  const submitting = useRef(false)
  const saving = pending !== null || externalSaving
  const save = async (next: Partial<AppSettings>, field: Field) => {
    if (submitting.current || externalSaving) return false
    submitting.current = true
    setPending(field)
    setSaved(null)
    setError(null)
    try {
      await onSave(next)
      setSaved(field)
      return true
    } catch {
      setError(field)
      return false
    } finally {
      submitting.current = false
      setPending(null)
    }
  }
  const saveGoal = async (event: React.FormEvent) => {
    event.preventDefault()
    if (submitting.current) return
    const value = Number(goal)
    if (!Number.isInteger(value) || value < 60 || value > 10080) {
      setInvalidGoal(true)
      setSaved(null)
      setError(null)
      return
    }
    setInvalidGoal(false)
    if (await save({ weekly_goal_minutes: value }, 'weekly_goal_minutes')) setGoal(null)
  }
  return <div className="settings-view">
    <LearningIllustration name="settings" />
    <div className="page-intro">
      <div>
        <span className="eyebrow accent">{vi ? 'CÀI ĐẶT CÁ NHÂN' : 'PERSONAL SETTINGS'}</span>
        <h2>{vi ? 'Thiết kế nhịp học bền vững.' : 'Build a sustainable learning rhythm.'}</h2>
      </div>
      <p>{hosted ? (vi ? 'Cài đặt được lưu riêng theo tài khoản web.' : 'Settings are saved privately to your web account.')
        : (vi ? 'Cài đặt được lưu trên máy này.' : 'Settings are saved on this device.')}</p>
    </div>
    <section className="section-card settings-card" aria-busy={saving}>
      <h3>{vi ? 'Tùy chọn học tập' : 'Learning preferences'}</h3>
      <p className="settings-help">{vi ? 'Các lựa chọn dưới đây tự lưu sau khi thay đổi.'
        : 'The choices below save automatically when changed.'}</p>
      {settingsChoices(vi).map(({ key, options }) => <label key={key}>
        {labels[key]}
        <select disabled={saving} aria-busy={pending === key} value={settings[key]}
          onChange={(event) => void save({ [key]: event.target.value }, key)}>
          {options.map(([value, title]) => <option key={value} value={value}>{title}</option>)}
        </select>
      </label>)}
      {(['show_completed_lessons', 'onboarding_complete'] as const).map((key) =>
        <label className="setting-check" key={key}>
          <input disabled={saving} type="checkbox" checked={settings[key]}
            onChange={(event) => void save({ [key]: event.target.checked }, key)} />
          {labels[key]}
        </label>)}
      <form className="settings-goal" onSubmit={(event) => void saveGoal(event)} noValidate>
        <h3>{labels.weekly_goal_minutes}</h3>
        <p id="weekly-goal-help" className="settings-help">{vi
          ? 'Nhập số phút bạn muốn dành mỗi tuần rồi bấm Lưu mục tiêu tuần. Có thể điều chỉnh theo lịch của bạn.'
          : 'Enter the minutes you want to study each week, then choose Save weekly goal. Adjust it to your schedule.'}</p>
        <label>{vi ? 'Mục tiêu mỗi tuần (phút)' : 'Weekly goal (minutes)'}
          <input disabled={saving} aria-label={vi ? 'Mục tiêu mỗi tuần, tính bằng phút' : 'Weekly goal in minutes'}
            type="number" min="60" max="10080" required value={goal} aria-invalid={invalidGoal}
            aria-describedby={invalidGoal ? 'weekly-goal-help weekly-goal-error' : 'weekly-goal-help'}
            onChange={(event) => {
              setGoal(event.target.value)
              setInvalidGoal(false)
              if (saved === 'weekly_goal_minutes') setSaved(null)
              if (error === 'weekly_goal_minutes') setError(null)
            }} />
        </label>
        {invalidGoal && <p id="weekly-goal-error" className="warning-note" role="alert">{vi
          ? 'Mục tiêu tuần phải là số nguyên từ 60 đến 10080 phút.'
          : 'Weekly goal must be a whole number from 60 to 10080 minutes.'}</p>}
        {goalDraft !== null && goal !== String(settings.weekly_goal_minutes) && <p className="settings-help">{vi
          ? 'Mục tiêu đang nhập chưa được lưu.' : 'Your edited weekly goal has not been saved yet.'}</p>}
        <button className="primary-button" disabled={saving} aria-busy={pending === 'weekly_goal_minutes'} type="submit">
          {pending === 'weekly_goal_minutes' ? (vi ? 'Đang lưu…' : 'Saving…')
            : (vi ? 'Lưu mục tiêu tuần' : 'Save weekly goal')}
        </button>
      </form>
      {pending && pending !== 'weekly_goal_minutes' && <p role="status">{vi ? 'Đang lưu: ' : 'Saving: '}{labels[pending]}</p>}
      {error && <p id="settings-error" className="warning-note" role="alert">
        {vi ? 'Không lưu được cài đặt.' : 'Could not save settings.'}
      </p>}
      {saved && <p className="success-note" role="status">{saved === 'weekly_goal_minutes'
        ? (vi ? 'Đã lưu mục tiêu tuần.' : 'Weekly goal saved.')
        : `${vi ? 'Đã lưu: ' : 'Saved: '}${labels[saved]}.`}</p>}
    </section>
    {hosted ? <CloudDataSettings language={settings.language} />
      : <BackupSettings language={settings.language} onRestored={async () => {
        await onRestored()
        setGoal(null)
        setSaved(null)
        setError(null)
        setInvalidGoal(false)
      }} />}
  </div>
}
