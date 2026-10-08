import { Fragment } from 'react'

// The authored briefs use paragraphs, headings, numbered steps and inline code.
// Render that small subset as React text nodes; never interpret HTML or link URLs.
function inline(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, index) => part.startsWith('`')
    ? <code key={index}>{part.slice(1, -1)}</code> : <Fragment key={index}>{part}</Fragment>)
}

export function ExerciseProse({ text }: { text: string }) {
  const blocks = text.replace(/^# .*(?:\r?\n|$)/, '').trim().split(/\r?\n\s*\r?\n/)
  return <div className="exercise-prose">{blocks.map((block, index) => {
    if (/^\d+\. /m.test(block)) {
      const items = block.split(/(?:^|\r?\n)\d+\. /).filter(Boolean)
      return <ol key={index}>{items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}</ol>
    }
    if (/^#{1,6} /.test(block)) return <h4 key={index}>{inline(block.replace(/^#{1,6} /, ''))}</h4>
    return <p key={index}>{inline(block)}</p>
  })}</div>
}
