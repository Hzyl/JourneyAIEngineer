export const phaseIllustrations = [
  'hero', 'python', 'math', 'machine-learning', 'deep-learning', 'deployment',
  'retrieval', 'practice', 'python', 'machine-learning', 'deep-learning',
  'system-design', 'retrieval', 'retrieval', 'agents', 'agents', 'agents',
  'evaluation', 'evaluation', 'deployment', 'fine-tuning', 'local-inference', 'system-design',
] as const

export type IllustrationId = typeof phaseIllustrations[number]
  | 'review' | 'journal' | 'resources' | 'community' | 'settings'

export function illustrationForLesson(slug: string): IllustrationId {
  const match = /^phase-(\d{2})-/.exec(slug)
  return match ? phaseIllustrations[Number(match[1])] ?? 'practice' : 'practice'
}
