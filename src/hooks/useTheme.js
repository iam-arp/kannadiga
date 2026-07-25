import { useCallback, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'kannadiga-theme'
const listeners = new Set()

function systemPrefersDark() {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
}

function readTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // ignore
  }
  return systemPrefersDark() ? 'dark' : 'light'
}

function applyTheme(theme) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

let cache = readTheme()
applyTheme(cache)

function writeTheme(theme) {
  cache = theme
  localStorage.setItem(STORAGE_KEY, theme)
  applyTheme(theme)
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return cache
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot)

  const toggleTheme = useCallback(() => {
    writeTheme(cache === 'dark' ? 'light' : 'dark')
  }, [])

  return { theme, isDark: theme === 'dark', toggleTheme }
}
