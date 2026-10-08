import { useRef, useState } from 'react'
import type { FeedbackKind, Lesson } from '../api'
import { learningClient as api } from '../platform/learning-client'
import { feedbackDate, feedbackLabels } from './feedback-copy'
import { feedbackReportText } from './feedback-report'
import { useFeedbackFeed } from './useFeedbackFeed'
import './feedback-ui.css'

type Props = {
  lesson: Pick<Lesson, 'title_vi' | 'title_en' | 'slug'>
  language: 'vi' | 'en'
  hosted: boolean
}

export function FeedbackPanel({ lesson, language, hosted }: Props) {
  const vi = language === 'vi'
  const labels = feedbackLabels[language]
  const feed = useFeedbackFeed(!hosted, lesson.slug)
  const [kind, setKind] = useState<FeedbackKind>('unclear')
  const [body, setBody] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const inFlight = useRef(false)
  const [saved, setSaved] = useState(false)
  const [failed, setFailed] = useState(false)
  const [report, setReport] = useState('')
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied' | 'failed'>('idle')
  const edited = () => {
    setSaved(false)
    setReport('')
    setCopyState('idle')
  }
  const createDraft = () => {
    if (body.trim().length < 5 || inFlight.current) return
    setReport(feedbackReportText(lesson, kind, body, displayName, language, hosted))
    setCopyState('idle')
  }
  const submit = async () => {
    if (body.trim().length < 5 || inFlight.current) return
    if (hosted) {
      createDraft()
      return
    }
    inFlight.current = true
    setSubmitting(true)
    setSaved(false)
    setFailed(false)
    try {
      await api.createFeedback({ lesson_slug: lesson.slug, kind, body: body.trim(),
        display_name: displayName.trim() || undefined })
      setBody('')
      setReport('')
      setSaved(true)
    } catch {
      setFailed(true)
    } finally {
      inFlight.current = false
      setSubmitting(false)
    }
  }
  const copyReport = async () => {
    setCopyState('copying')
    try {
      await navigator.clipboard.writeText(report)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  return <section className="feedback-panel" aria-labelledby="feedback-panel-title">
    <div className="section-heading">
      <div>
        <span className="eyebrow accent">{vi ? 'GÓP Ý BÀI HỌC' : 'LESSON FEEDBACK'}</span>
        <h4 id="feedback-panel-title">{vi ? 'Giúp bài học tốt hơn' : 'Help improve this lesson'}</h4>
      </div>
      {!hosted && <span className="tag">{feed.items.length} {vi ? 'đã duyệt' : 'approved'}</span>}
    </div>
    <p className="muted">{hosted
      ? (vi ? 'Web beta chưa nhận góp ý trực tiếp. Tạo bản nháp bên dưới, kiểm tra rồi tự chọn nơi gửi. Bản nháp chưa được gửi hoặc lưu vào tài khoản.'
        : 'Web beta does not accept feedback submissions yet. Prepare a draft below, review it and choose where to send it. Drafts are not submitted or saved to your account.')
      : (vi ? 'Góp ý được lưu trên máy này để chờ duyệt, không tự gửi lên web. Không nhập email, API key hoặc dữ liệu riêng tư.'
        : 'Feedback is saved on this computer for review and is not sent to the web. Do not include email, API keys or private data.')}</p>
    <form className="feedback-form" onSubmit={(event) => { event.preventDefault(); void submit() }}>
      <label>{vi ? 'Loại góp ý' : 'Feedback type'}
        <select value={kind} disabled={submitting}
          onChange={(event) => { setKind(event.target.value as FeedbackKind); edited() }}>
          {(Object.keys(labels) as FeedbackKind[]).map((option) =>
            <option key={option} value={option}>{labels[option]}</option>)}
        </select>
      </label>
      <label>{vi ? 'Tên hiển thị (tuỳ chọn)' : 'Display name (optional)'}
        <input value={displayName} disabled={submitting} maxLength={80}
          onChange={(event) => { setDisplayName(event.target.value); edited() }}
          placeholder={vi ? 'Ví dụ: Huy' : 'For example: Huy'} />
      </label>
      <label className="feedback-body-field">{vi ? 'Góp ý cụ thể' : 'Specific feedback'}
        <textarea value={body} disabled={submitting} minLength={5} maxLength={2000} required
          onChange={(event) => { setBody(event.target.value); edited() }}
          placeholder={vi ? 'Bạn bị vướng ở bước nào? Đề xuất ví dụ, tài liệu hoặc cách sửa.'
            : 'Which step is unclear? Suggest an example, resource or fix.'} />
        <small>{body.length}/2000</small>
      </label>
      <button className="secondary-button" type="submit" disabled={submitting || body.trim().length < 5}
        aria-busy={submitting}>
        {hosted ? (vi ? 'Tạo bản nháp góp ý' : 'Create feedback draft')
          : submitting ? (vi ? 'Đang lưu…' : 'Saving…') : (vi ? 'Lưu góp ý để duyệt' : 'Save for review')}
      </button>
    </form>
    {!hosted && <button type="button" className="text-button" onClick={createDraft}
      disabled={submitting || body.trim().length < 5}>
      {vi ? 'Tạo report để gửi GitHub' : 'Create GitHub report'}
    </button>}
    {report && <div className="feedback-report" aria-live="polite">
      <div className="feedback-report-heading">
        <strong>{vi ? 'Bản nháp chưa gửi' : 'Draft, not submitted'}</strong>
        <button type="button" className="text-button" onClick={() => void copyReport()}
          disabled={copyState === 'copying'} aria-busy={copyState === 'copying'}>
          {copyState === 'copying' ? (vi ? 'Đang copy…' : 'Copying…')
            : copyState === 'copied' ? (vi ? 'Đã copy ✓' : 'Copied ✓') : (vi ? 'Copy bản nháp' : 'Copy draft')}
        </button>
        <a className="text-button" href="https://github.com/Hzyl/JourneyAIEngineer/discussions"
          target="_blank" rel="noreferrer">{vi ? 'Mở Discussions ↗' : 'Open Discussions ↗'}</a>
      </div>
      <textarea className="feedback-report-preview" aria-label={vi ? 'Report feedback vừa tạo' : 'Generated feedback report'}
        readOnly value={report} onFocus={(event) => event.currentTarget.select()} />
      <small>{vi ? 'Kiểm tra trước khi chia sẻ. Chỉ một số mẫu credential phổ biến được che; thao tác này chưa gửi góp ý.'
        : 'Review before sharing. Only common credential patterns are redacted; nothing has been submitted.'}</small>
      {copyState === 'failed' && <p className="warning-note" role="alert">
        {vi ? 'Không copy được. Bạn vẫn có thể chọn và copy bản nháp ở trên.'
          : 'Could not copy. You can still select and copy the draft above.'}
      </p>}
    </div>}
    {saved && <p className="success-note" role="status">{vi ? 'Đã lưu góp ý trên máy, chờ duyệt.'
      : 'Feedback saved on this computer, awaiting review.'}</p>}
    {failed && <p className="warning-note" role="alert">{vi ? 'Chưa lưu được góp ý. Nội dung vẫn còn; hãy thử lại.'
      : 'Could not save feedback. Your text is preserved; please retry.'}</p>}
    {!hosted && <div className="feedback-list" aria-live="polite">
      {feed.loading ? <p className="muted">{vi ? 'Đang tải góp ý đã duyệt…' : 'Loading approved feedback…'}</p>
        : feed.failed ? <p className="warning-note" role="alert">
          {vi ? 'Chưa tải được góp ý.' : 'Could not load feedback.'}
          <button type="button" className="text-button" onClick={feed.retry}>{vi ? 'Thử lại' : 'Retry'}</button>
        </p> : feed.items.length === 0 ? <p className="muted">{vi ? 'Chưa có góp ý đã duyệt cho bài này.'
          : 'No approved feedback for this lesson yet.'}</p> : feed.items.map((item) =>
          <article className="feedback-item" key={item.id}>
            <div className="feedback-item-meta">
              <span className="tag">{labels[item.kind]}</span>
              <span>{feedbackDate(item.created_at, language)}{item.display_name ? ` · ${item.display_name}` : ''}</span>
            </div>
            <p>{item.body}</p>
            {item.status === 'implemented' && <small className="feedback-implemented">
              ✓ {vi ? 'Đã phản ánh vào chương trình' : 'Reflected in the curriculum'}
            </small>}
          </article>)}
    </div>}
  </section>
}
