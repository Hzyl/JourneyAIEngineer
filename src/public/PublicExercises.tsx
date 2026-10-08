import { ExercisesView } from '../components/ExercisesView'
import { catalogExercises } from '../platform/hosted/exercise-catalog'

export default function PublicExercises({ language }: { language: 'vi' | 'en' }) {
  return <ExercisesView exercises={catalogExercises} hosted gitPublishAvailable={false}
    language={language} onRefresh={async () => {}} />
}
