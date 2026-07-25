import { useCallback, useSyncExternalStore } from 'react'
import { recordProgress } from './useGamification'

const STORAGE_KEY = 'kannadiga-progress'
const listeners = new Set()

const XP = {
  vocab: 15,
  conversation: 15,
  pronunciation: 20,
  quiz: 25,
  dictation: 20,
  lessonComplete: 50,
}

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

// A lesson counts as fully complete once all five activities are done.
function isFullyDone(p) {
  return !!(
    p &&
    p.vocabDone &&
    p.conversationDone &&
    p.pronunciationDone &&
    p.quizDone &&
    p.dictationDone
  )
}

// Applies an activity-completion patch and awards XP + streak credit only the
// first time that activity is completed, to prevent farming XP via retries.
function completeActivity(lessonId, activityKey, extraPatch, xpAmount) {
  const existing = cache.lessons[lessonId] || {}
  const firstTime = !existing[activityKey]
  const wasFullyComplete = isFullyDone(existing)

  updateLesson(lessonId, { ...extraPatch, [activityKey]: true })

  if (firstTime) {
    const nowFullyComplete = isFullyDone(cache.lessons[lessonId])
    const bonus = !wasFullyComplete && nowFullyComplete ? XP.lessonComplete : 0
    recordProgress(xpAmount + bonus)
  }
}

export function useProgress() {
  const store = useSyncExternalStore(subscribe, getSnapshot)

  const markVocabDone = useCallback((lessonId) => {
    completeActivity(lessonId, 'vocabDone', {}, XP.vocab)
  }, [])

  const markConversationDone = useCallback((lessonId) => {
    completeActivity(lessonId, 'conversationDone', {}, XP.conversation)
  }, [])

  const markPronunciationDone = useCallback((lessonId) => {
    completeActivity(lessonId, 'pronunciationDone', {}, XP.pronunciation)
  }, [])

  const saveQuizResult = useCallback((lessonId, correct, total) => {
    const existing = cache.lessons[lessonId] || {}
    const bestScore = Math.max(existing.quiz?.bestScore ?? 0, correct)
    completeActivity(lessonId, 'quizDone', { quiz: { correct, total, bestScore } }, XP.quiz)
  }, [])

  const saveDictationResult = useCallback((lessonId, correct, total) => {
    const existing = cache.lessons[lessonId] || {}
    const bestScore = Math.max(existing.dictation?.bestScore ?? 0, correct)
    completeActivity(
      lessonId,
      'dictationDone',
      { dictation: { correct, total, bestScore } },
      XP.dictation,
    )
  }, [])

  const getLessonProgress = useCallback(
    (lessonId) => store.lessons[lessonId] || {},
    [store],
  )

  const isLessonComplete = useCallback(
    (lessonId) => isFullyDone(store.lessons[lessonId]),
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
