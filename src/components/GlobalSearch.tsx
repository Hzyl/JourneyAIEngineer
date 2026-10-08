import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { SearchResult } from '../api'
import { learningClient as api } from '../platform/learning-client'
import './global-search.css'

export function GlobalSearch({ language, onSelect }: {
  language: 'vi' | 'en'
  onSelect: (result: SearchResult) => void
}) {
  const vi = language === 'vi'
  const inputId = useId()
  const listId = useId()
  const input = useRef<HTMLInputElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [attempt, setAttempt] = useState(0)
  const [response, setResponse] = useState({ query: '', attempt: 0, items: [] as SearchResult[], failed: false })
  const trimmed = query.trim()
  const eligible = trimmed.length >= 2
  const busy = eligible && (response.query !== trimmed || response.attempt !== attempt)
  const items = !busy && eligible && !response.failed ? response.items : []
  const visible = open && eligible
  const selected = visible && items[active] ? `${listId}-${active}` : undefined
  const kinds: Record<string, string> = vi
    ? { lesson: 'Bài học', phase: 'Giai đoạn', module: 'Chủ đề', exercise: 'Bài tập', resource: 'Tài liệu' }
    : { lesson: 'Lesson', phase: 'Phase', module: 'Module', exercise: 'Exercise', resource: 'Resource' }

  useEffect(() => {
    if (!eligible) return
    let current = true
    const timer = window.setTimeout(() => {
      void api.search(trimmed, { limit: 12 }).then((result) => {
        if (current) setResponse({ query: trimmed, attempt, items: result.results, failed: false })
      }).catch(() => {
        if (current) setResponse({ query: trimmed, attempt, items: [], failed: true })
      })
    }, 220)
    return () => { current = false; window.clearTimeout(timer) }
  }, [trimmed, eligible, attempt])
  useEffect(() => {
    const shortcut = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        input.current?.focus()
        input.current?.select()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [])
  useEffect(() => {
    if (selected) document.getElementById(selected)?.scrollIntoView?.({ block: 'nearest' })
  }, [selected])

  const choose = (result: SearchResult) => {
    setOpen(false)
    setQuery('')
    setActive(-1)
    onSelect(result)
  }
  const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      setActive(-1)
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      if (items.length) setActive(event.key === 'ArrowDown'
        ? (active + 1) % items.length : active <= 0 ? items.length - 1 : active - 1)
    } else if (event.key === 'Enter' && visible && items[active]) {
      event.preventDefault()
      choose(items[active])
    }
  }

  return <div className={`global-search ${open ? 'open' : ''}`} ref={root}
    onBlur={(event) => {
      if (!root.current?.contains(event.relatedTarget as Node | null)) { setOpen(false); setActive(-1) }
    }}>
    <label className="sr-only" htmlFor={inputId}>{vi ? 'Tìm bài học, chủ đề, tài liệu hoặc bài tập'
      : 'Search lessons, phases, resources or exercises'}</label>
    <input id={inputId} ref={input} type="search" role="combobox" maxLength={120}
      aria-autocomplete="list" aria-expanded={visible} aria-controls={visible ? listId : undefined}
      aria-activedescendant={selected} value={query} placeholder={vi ? 'Tìm kiếm…' : 'Search…'}
      onKeyDown={keyDown} onFocus={() => setOpen(true)} onChange={(event) => {
        setQuery(event.target.value)
        setActive(-1)
        setOpen(true)
      }} />
    <kbd aria-hidden="true">Ctrl K</kbd>
    {query && <button type="button" className="global-search-clear" aria-label={vi ? 'Xóa tìm kiếm' : 'Clear search'}
      onClick={() => { setQuery(''); setActive(-1); input.current?.focus() }}>×</button>}
    {visible && <div className="global-search-results">
      {busy ? <p className="global-search-status" role="status">{vi ? 'Đang tìm…' : 'Searching…'}</p>
        : response.failed ? <div className="global-search-status" role="alert">
          <p>{vi ? 'Chưa tìm kiếm được. Từ khóa vẫn còn.' : 'Search failed. Your query is preserved.'}</p>
          <button type="button" className="text-button" onClick={() => {
            setActive(-1)
            setAttempt((value) => value + 1)
            input.current?.focus()
          }}>{vi ? 'Thử lại' : 'Retry'}</button>
        </div> : <p className="global-search-status" role="status">
          {items.length ? `${items.length} ${vi ? 'kết quả · ↑ ↓ chọn, Enter mở'
            : `${items.length === 1 ? 'result' : 'results'} · ↑ ↓ select, Enter opens`}`
            : vi ? 'Không tìm thấy kết quả. Thử từ khóa khác.' : 'No results. Try another search.'}
        </p>}
      <div id={listId} role="listbox" aria-label={vi ? 'Kết quả tìm kiếm' : 'Search results'} aria-busy={busy}>
        {items.map((result, index) => <button key={`${result.type}-${result.id}`} id={`${listId}-${index}`}
          type="button" role="option" tabIndex={-1} aria-selected={active === index}
          className="global-search-result" onMouseDown={(event) => event.preventDefault()}
          onClick={() => choose(result)}>
          <strong>{vi ? result.title : result.title_en || result.title}</strong>
          <small>{kinds[result.type] ?? result.type}</small>
        </button>)}
      </div>
    </div>}
  </div>
}
