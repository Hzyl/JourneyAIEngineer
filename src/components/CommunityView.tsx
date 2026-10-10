import { LearningIllustration } from './LearningIllustration'
import { useState } from 'react'
import type { FeedbackKind } from '../api'
import { feedbackDate, feedbackLabels } from './feedback-copy'
import { useFeedbackFeed } from './useFeedbackFeed'
import './feedback-ui.css'

export function CommunityView({ language, hosted, onOpenLesson, onOpenRoadmap }: {
  language: 'vi' | 'en'
  hosted: boolean
  onOpenLesson: (slug: string) => void
  onOpenRoadmap: () => void
}) {
  const vi = language === 'vi'
  const labels = feedbackLabels[language]
  const feed = useFeedbackFeed(!hosted)
  const [kind, setKind] = useState<FeedbackKind | 'all'>('all')
  const visible = kind === 'all' ? feed.items : feed.items.filter((item) => item.kind === kind)
  return <div className="community-layout">
    <LearningIllustration name="community" />
    <section className="community-hero">
      <span className="eyebrow accent">{vi ? 'CÙNG CẢI THIỆN BÀI HỌC' : 'IMPROVE THE LESSONS TOGETHER'}</span>
      <h2>{vi ? 'Học cùng nhau,' : 'Learn together,'}<br /><em>{vi ? 'góp ý cụ thể.' : 'share useful feedback.'}</em></h2>
      <p>{vi ? 'Góp ý về chỗ chưa rõ, ví dụ hoặc bài tập ngay trong từng bài học.'
        : 'Share feedback about unclear explanations, examples or exercises from each lesson.'}</p>
      <div className="community-boundary">
        <strong>{hosted ? 'Web beta' : (vi ? 'Dữ liệu trên máy' : 'Local data')}</strong>
        <span>{hosted ? (vi ? 'Bảng góp ý công khai chưa hoạt động. Bản nháp không tự gửi hoặc lưu vào tài khoản.'
          : 'The public feedback feed is not available yet. Drafts are not automatically submitted or saved to your account.')
          : (vi ? 'Chỉ hiển thị góp ý đã duyệt trên máy này; không tự đồng bộ lên web.'
            : 'Only approved feedback on this computer appears here; it is not automatically synced to the web.')}</span>
      </div>
    </section>
    <section className="section-card community-feed" aria-busy={!hosted && feed.loading}>
      {hosted ? <div className="empty-state">
        <h3>{vi ? 'Tạo bản nháp từ bài học' : 'Prepare a draft from a lesson'}</h3>
        <p>{vi ? 'Mở bài học, viết góp ý và kiểm tra bản nháp trước khi tự chia sẻ.'
          : 'Open a lesson, write your feedback and review the draft before sharing it yourself.'}</p>
        <button className="secondary-button" onClick={onOpenRoadmap}>{vi ? 'Mở lộ trình' : 'Open roadmap'}</button>
      </div> : <>
        <div className="section-heading">
          <div>
            <span className="eyebrow">{vi ? 'GÓP Ý ĐÃ DUYỆT' : 'APPROVED FEEDBACK'}</span>
            <h3>{vi ? 'Nhận xét gần đây' : 'Recent feedback'}</h3>
          </div>
          <label className="community-filter">
            <span className="sr-only">{vi ? 'Lọc loại góp ý' : 'Filter feedback type'}</span>
            <select value={kind} onChange={(event) => setKind(event.target.value as FeedbackKind | 'all')}>
              <option value="all">{vi ? 'Mọi loại' : 'All types'}</option>
              {(Object.keys(labels) as FeedbackKind[]).map((option) =>
                <option key={option} value={option}>{labels[option]}</option>)}
            </select>
          </label>
        </div>
        {feed.loading ? <p role="status">{vi ? 'Đang tải góp ý đã duyệt…' : 'Loading approved feedback…'}</p>
          : feed.failed ? <div className="warning-note" role="alert">
            <p>{vi ? 'Chưa tải được góp ý. Hãy thử lại.' : 'Could not load feedback. Please retry.'}</p>
            <button className="secondary-button" onClick={feed.retry}>{vi ? 'Thử lại' : 'Retry'}</button>
          </div> : visible.length === 0 ? <div className="empty-state">
            <h3>{vi ? 'Chưa có nhận xét phù hợp' : 'No matching feedback'}</h3>
            <p>{vi ? 'Thử loại khác hoặc mở bài học để viết góp ý.' : 'Try another type or open a lesson to write feedback.'}</p>
            <button className="secondary-button" onClick={onOpenRoadmap}>{vi ? 'Mở lộ trình' : 'Open roadmap'}</button>
          </div> : <div className="community-feed-list">
            {visible.map((item) => <article className="community-feedback-card" key={item.id}>
              <div className="feedback-item-meta">
                <span className="tag">{labels[item.kind]}</span>
                <span>{feedbackDate(item.created_at, language)}{item.display_name ? ` · ${item.display_name}` : ''}</span>
              </div>
              <p>{item.body}</p>
              <button className="text-button" onClick={() => onOpenLesson(item.lesson_slug)}>
                {vi ? 'Mở bài học' : 'Open lesson'}: {vi ? item.lesson_title_vi : item.lesson_title_en} →
              </button>
              {item.status === 'implemented' && <small className="feedback-implemented">
                ✓ {vi ? 'Đã cập nhật' : 'Implemented'}
              </small>}
            </article>)}
          </div>}
      </>}
    </section>
  </div>
}
