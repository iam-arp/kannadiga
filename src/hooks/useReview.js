import { useCallback, useSyncExternalStore } from 'react'
import { recordProgress } from './useGamification'

const STORAGE_KEY = 'kannadiga-review'
const listeners = new Set()

// Simplified Leitner box system: 5 boxes, each with a longer re-review
// interval. A correct grade advances a card one box; a miss sends it back
// to box 1 and makes it due again immediately.
const INTERVAL_DAYS = { 1: 1, 2: 2, 3: 4, 4: 8, 5: 16 }
const XP_PER_CARD = 2

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { cards: {} }
  } catch {
    return { cards: {} }
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

export function cardId(lessonId, vocabIndex) {
  return `${lessonId}::${vocabIndex}`
}

export function getCardState(id) {
  return cache.cards[id] || { box: 1, dueAt: 0 }
}

export function isCardDue(id) {
  return getCardState(id).dueAt <= Date.now()
}

export function useReview() {
  const store = useSyncExternalStore(subscribe, getSnapshot)

  const gradeCard = useCallback((id, gotIt) => {
    const current = cache.cards[id] || { box: 1, dueAt: 0 }
    const box = gotIt ? Math.min(current.box + 1, 5) : 1
    const dueAt = gotIt ? Date.now() + INTERVAL_DAYS[box] * 24 * 60 * 60 * 1000 : Date.now()

    writeStore({ cards: { ...cache.cards, [id]: { box, dueAt } } })
    recordProgress(XP_PER_CARD)
  }, [])

  return {
    cards: store.cards,
    gradeCard,
    getCardState,
    isCardDue,
  }
}
