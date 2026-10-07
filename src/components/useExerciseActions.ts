import { useRef, useState } from 'react'
import type { Exercise } from '../api'
import { learningClient as api } from '../platform/learning-client'
import { runStatus, type ExerciseCopy } from './exercise-copy'

type Action = 'open' | 'folder' | 'run' | 'export' | 'history' | 'publish'
type Run = { id: number; status: string; duration_ms: number; created_at: string }
type Output = Awaited<ReturnType<typeof api.runWorkspace>>

export function useExerciseActions(hosted: boolean, gitAvailable: boolean, t: ExerciseCopy,
  onRefresh: () => Promise<void>) {
  const [pending, setPending] = useState<{ id: number; action: Action } | null>(null)
  const lock = useRef(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [output, setOutput] = useState<Output | null>(null)
  const [history, setHistory] = useState<Record<number, Run[]>>({})
  const [historyFor, setHistoryFor] = useState<number | null>(null)
  const [workspaces, setWorkspaces] = useState<Record<number, { id: number; path: string }>>({})
  const [exportedPaths, setExportedPaths] = useState<Record<number, string>>({})
  const [publishTarget, setPublishTarget] = useState<{ exercise: Exercise; path: string } | null>(null)
  const [publishMessage, setPublishMessage] = useState('')
  const [publishConfirmed, setPublishConfirmed] = useState(false)

  const workspaceId = (exercise: Exercise) => workspaces[exercise.id]?.id ?? exercise.workspace_id ?? null
  const ensureWorkspace = async (exercise: Exercise) => {
    const existing = workspaceId(exercise)
    if (existing) return existing
    const { workspace } = await api.createWorkspace(exercise.slug)
    setWorkspaces((current) => ({ ...current, [exercise.id]: workspace }))
    await onRefresh()
    return workspace.id
  }
  const perform = async (exercise: Exercise, action: Action, fallback: string, task: () => Promise<void>) => {
    if (hosted || lock.current) return
    lock.current = true
    setPending({ id: exercise.id, action })
    setError('')
    setNotice('')
    try {
      await task()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : fallback)
    } finally {
      lock.current = false
      setPending(null)
    }
  }
  const readHistory = async (exercise: Exercise, id: number | null) => {
    const runs = id ? (await api.workspaceRuns(id)).runs : []
    setHistory((current) => ({ ...current, [exercise.id]: runs }))
    setHistoryFor(exercise.id)
  }
  const open = (exercise: Exercise) => perform(exercise, 'open', t.openError, async () => {
    const result = await api.openWorkspace(await ensureWorkspace(exercise))
    setNotice(`${result.opened ? t.opened : t.manualCode} ${result.path}`)
  })
  const folder = (exercise: Exercise) => perform(exercise, 'folder', t.folderError, async () => {
    const result = await api.openFolder(await ensureWorkspace(exercise))
    setNotice(`${result.opened ? t.folderOpened : t.manualFolder} ${result.path}`)
  })
  const run = (exercise: Exercise) => perform(exercise, 'run', t.runError, async () => {
    setOutput(null)
    const id = await ensureWorkspace(exercise)
    const result = await api.runWorkspace(id)
    setOutput(result)
    const summary = `${result.assessment_kind === 'verified' ? t.runVerified : t.runReflection}: ${runStatus(result.status, t)}`
    if (result.status === 'passed') setNotice(summary)
    else setError(summary)
    try {
      await readHistory(exercise, id)
    } catch {
      setError(t.historyError)
    }
  })
  const loadHistory = (exercise: Exercise) => perform(exercise, 'history', t.historyError,
    () => readHistory(exercise, workspaceId(exercise)))
  const exportArtifact = (exercise: Exercise) => perform(exercise, 'export', t.exportError, async () => {
    if (!gitAvailable) {
      setError(t.localOnly)
      return
    }
    const result = await api.exportWorkspace(await ensureWorkspace(exercise))
    setExportedPaths((current) => ({ ...current, [exercise.id]: result.artifact_path }))
    setPublishTarget({ exercise, path: result.artifact_path })
    setPublishMessage(`learn(${exercise.slug}): save practice evidence`)
    setPublishConfirmed(false)
    setNotice(`${t.saved} ${result.artifact_path}`)
  })
  const publish = async () => {
    if (!gitAvailable || !publishTarget || !publishConfirmed || publishMessage.trim().length < 5) return
    await perform(publishTarget.exercise, 'publish', t.publishError, async () => {
      const result = await api.publishGit({ paths: [publishTarget.path], message: publishMessage.trim(), confirm: true })
      if (!result.pushed) throw new Error(t.publishError)
      setNotice(`${t.pushed} ${result.commit} → ${result.remote} (${result.branch}).`)
      setPublishTarget(null)
      setPublishConfirmed(false)
      setPublishMessage('')
      await onRefresh()
    })
  }
  const cancelPublish = () => {
    if (lock.current) return
    setPublishTarget(null)
    setPublishConfirmed(false)
  }
  return {
    pending, error, notice, output, history, historyFor, workspaces, exportedPaths,
    publishTarget, publishMessage, publishConfirmed, setPublishMessage, setPublishConfirmed,
    workspaceId, open, folder, run, loadHistory, exportArtifact, publish, cancelPublish,
  }
}
