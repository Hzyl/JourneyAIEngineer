import './learning-illustration.css'

import type { IllustrationId } from './learning-illustrations'

type Props = {
  name: IllustrationId
  variant?: 'section' | 'hero' | 'thumbnail'
  eager?: boolean
}

/** Editorial artwork only; learning instructions remain accessible HTML. */
export function LearningIllustration({ name, variant = 'section', eager = false }: Props) {
  return <img className={`flow-art flow-art--${variant}`}
    src={`/images/flow/${name}-480.webp`}
    srcSet={`/images/flow/${name}-480.webp 480w, /images/flow/${name}-960.webp 960w`}
    sizes={variant === 'thumbnail' ? '96px' : '(max-width: 600px) 90vw, 480px'}
    width={960} height={536} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" />
}
