import type { Exercise } from '../api'
import { exerciseGuides } from './exercise-guides'

// Starter downloads are separate from the explicitly revealed reference solutions.
// Only authored exercise files are bundled; never read learner workspaces.
const documents = import.meta.glob<string>('../../content/exercise_templates/*/README.*.md', {
  eager: true, query: '?raw', import: 'default',
})
const sources = import.meta.glob<string>([
  '../../content/exercise_templates/*/starter.py',
  '../../content/exercise_templates/*/test_exercise.py',
], { eager: true, query: '?raw', import: 'default' })

export function exerciseLevel(difficulty: string) {
  return ({ starter: 'easy', intermediate: 'medium', advanced: 'hard' } as Record<string, string>)[difficulty]
    ?? difficulty.toLowerCase()
}

export function exerciseMaterial(exercise: Exercise, language: 'vi' | 'en') {
  const vi = language === 'vi'
  const directory = `../../content/exercise_templates/${exercise.slug}`
  const description = documents[`${directory}/README.${language}.md`]
    ?? (vi ? exercise.description_vi : exercise.description_en)
  const paragraphs = description.replace(/^# .*(?:\r?\n|$)/, '').trim().split(/\r?\n\s*\r?\n/)
  const brief = paragraphs[0]?.replace(/\s+/g, ' ').replace(/`/g, '') ?? ''
  const checkpoint = paragraphs.find((text) => text.startsWith('Checkpoint:'))?.replace(/^Checkpoint:\s*/, '')
  const curated = exerciseGuides[exercise.slug]?.[language]
  const guide = curated ?? {
    summary: brief.length > 160 ? `${brief.slice(0, 157).trimEnd()}…` : brief,
    steps: vi ? [
      'Đọc yêu cầu bên trên. Viết ra đầu vào, đầu ra mong đợi và một ví dụ nhỏ trước khi bắt đầu.',
      'Làm phiên bản nhỏ nhất đáp ứng yêu cầu. Ghi lại giả định và các quyết định quan trọng khi làm.',
      'Kiểm tra một trường hợp thông thường và ít nhất một trường hợp biên; so sánh với kết quả đã dự đoán.',
      'Lưu bài làm, kết quả kiểm tra và điều còn vướng. Dùng tiêu chí bên dưới để tự đánh giá.',
    ] : [
      'Read the requirements above. Write down inputs, expected outputs and one small example before starting.',
      'Build the smallest version that meets the requirements. Record assumptions and important decisions.',
      'Check a normal case and at least one edge case; compare them with your predicted results.',
      'Keep your work, check results and open questions. Use the criteria below to assess your understanding.',
    ],
    checks: [checkpoint ?? (vi
      ? 'Giải thích được bài làm, cách kiểm tra và một giới hạn còn lại.'
      : 'Explain your work, how you checked it and one remaining limitation.')],
    hints: vi ? exercise.hints : [],
    example: undefined,
  }
  return {
    ...guide, description: curated ? paragraphs[0] : description,
    files: ['starter.py', 'test_exercise.py'].flatMap((name) => {
      const content = sources[`${directory}/${name}`]
      return content === undefined ? [] : [{ name, content }]
    }),
  }
}
