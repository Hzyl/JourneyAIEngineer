import type { FeedbackKind, Lesson } from '../api'
import { version } from '../../package.json'
import { feedbackLabels } from './feedback-copy'

const patterns = [
  /(?:sk|rk)-[A-Za-z0-9_-]{20,}/g,
  /gh[pousr]_[A-Za-z0-9_]{20,}/g,
  /AKIA[0-9A-Z]{16}/g,
  /-----BEGIN [A-Z ]+ PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+ PRIVATE KEY-----/g,
]
const redact = (value: string) => patterns.reduce((result, pattern) => result.replace(pattern, '[REDACTED]'), value)

export function feedbackReportText(lesson: Pick<Lesson, 'title_vi' | 'title_en' | 'slug'>,
  kind: FeedbackKind, body: string, displayName: string, language: 'vi' | 'en', hosted: boolean) {
  return [
    'Journey AI Engineer feedback draft', '', `Version: v${version}`,
    `Mode: ${hosted ? 'Web beta' : 'Local app'}`, 'Status: Draft, not submitted',
    `Lesson: ${language === 'vi' ? lesson.title_vi : lesson.title_en} (${lesson.slug})`,
    `Feedback type: ${feedbackLabels[language][kind]}`,
    ...(displayName.trim() ? [`Display name: ${redact(displayName.trim())}`] : []),
    '', 'Feedback:', redact(body.trim()), '',
    'Review this draft for credentials and private data before sharing it.',
  ].join('\n')
}
