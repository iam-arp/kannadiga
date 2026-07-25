import { useCallback, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'kannadiga-progress'
const listeners = new Set()

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { lessons: {} }
  } catch {
    return { lessons: {} }
  }
}

let cache = readStore()

function writeStore(next) {
  cache = next
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return cache
}

function updateLesson(lessonId, patch) {
  const next = { lessons: { ...cache.lessons } }
  const existing = next.lessons[lessonId] || {}
  next.lessons[lessonId] = { ...existing, ...patch }
  writeStore(next)
}

export function useProgress() {
  const store = useSyncExternalStore(subscribe, getSnapshot)

  const markVocabDone = useCallback((lessonId) => {
    updateLesson(lessonId, { vocabDone: true })
  }, [])

  const markConversationDone = useCallback((lessonId) => {
    updateLesson(lessonId, { conversationDone: true })
  }, [])

  const markPronunciationDone = useCallback((lessonId) => {
    updateLesson(lessonId, { pronunciationDone: true })
  }, [])

  const saveQuizResult = useCallback((lessonId, correct, total) => {
    const existing = cache.lessons[lessonId] || {}
    const bestScore = Math.max(existing.quiz?.bestScore ?? 0, correct)
    updateLesson(lessonId, { quiz: { correct, total, bestScore }, quizDone: true })
  }, [])

  const saveDictationResult = useCallback((lessonId, correct, total) => {
    const existing = cache.lessons[lessonId] || {}
    const bestScore = Math.max(existing.dictation?.bestScore ?? 0, correct)
    updateLesson(lessonId, { dictation: { correct, total, bestScore }, dictationDone: true })
  }, [])

  const getLessonProgress = useCallback(
    (lessonId) => store.lessons[lessonId] || {},
    [store],
  )

  const isLessonComplete = useCallback(
    (lessonId) => {
      const p = store.lessons[lessonId]
      return !!(p && p.vocabDone && p.conversationDone && p.quizDone && p.dictationDone)
    },
    [store],
  )

  const resetProgress = useCallback(() => {
    writeStore({ lessons: {} })
  }, [])

  return {
    progress: store,
    markVocabDone,
    markConversationDone,
    markPronunciationDone,
    saveQuizResult,
    saveDictationResult,
    getLessonProgress,
    isLessonComplete,
    resetProgress,
  }
}
