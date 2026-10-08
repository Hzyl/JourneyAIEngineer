import { usePublicLanguage } from '../public/public-language'
import { AuthScreen } from './AuthScreen'

export function SessionExpired() {
  const [language] = usePublicLanguage()
  return <AuthScreen loading={false} language={language} expired />
}
