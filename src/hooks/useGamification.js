import { useCallback, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'kannadiga-gamification'
const listeners = new Set()

const DEFAULT_STATE = { xp: 0, streak: { current: 0, longest: 0, lastActiveDate: null } }

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : { ...DEFAULT_STATE }
  } catch {
    return { ...DEFAULT_STATE }
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

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

function nextStreak(streak) {
  const today = todayStr()
  if (streak.lastActiveDate === today) return streak
  const current = streak.lastActiveDate === yesterdayStr() ? streak.current + 1 : 1
  return {
    current,
    longest: Math.max(streak.longest, current),
    lastActiveDate: today,
  }
}

// Awards XP and records a day of activity for the streak in a single atomic
// update — used whenever a lesson activity is completed for the first time.
export function recordProgress(xpAmount) {
  writeStore({
    xp: cache.xp + xpAmount,
    streak: nextStreak(cache.streak),
  })
}

export function levelFromXp(xp) {
  return Math.floor(xp / 100) + 1
}

export function useGamification() {
  const store = useSyncExternalStore(subscribe, getSnapshot)

  const addXP = useCallback((amount) => {
    writeStore({ ...cache, xp: cache.xp + amount })
  }, [])

  return {
    xp: store.xp,
    level: levelFromXp(store.xp),
    xpIntoLevel: store.xp % 100,
    streak: store.streak,
    addXP,
  }
}
