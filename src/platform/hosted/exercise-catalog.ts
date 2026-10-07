import exercisePayload from '../../../content/exercises.json'

type Manifest = {
  schema_version: number
  exercise_slug: string
  title_vi: string
  title_en: string
  assessment_kind: 'verified'
  test_command: string
}

const manifests = import.meta.glob<Manifest>('../../../content/exercise_templates/*/manifest.json', {
  eager: true,
  import: 'default',
})
const documents = import.meta.glob<string>('../../../content/exercise_templates/*/README.*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

export const catalogExercises = exercisePayload.exercises.map((exercise) => {
  const directory = `../../../content/exercise_templates/${exercise.slug}`
  const template = manifests[`${directory}/manifest.json`]
  if (!template) return { ...exercise, assessment_kind: 'reflection' as const }
  return {
    ...exercise,
    ...template,
    description_vi: documents[`${directory}/README.vi.md`],
    description_en: documents[`${directory}/README.en.md`],
  }
})
