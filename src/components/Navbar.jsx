import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { lessons } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import { useReview, cardId } from '../hooks/useReview'
import GamificationBar from './GamificationBar'
import ThemeToggle from './ThemeToggle'

const linkClasses = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition ${
    isActive ? 'bg-teal-600 text-white' : 'text-ink-900/70 hover:bg-teal-500/10'
  }`

export default function Navbar() {
  const { progress } = useProgress()
  const { cards, getCardState } = useReview()

  const dueCount = useMemo(() => {
    const now = Date.now()
    let count = 0
    lessons.forEach((lesson) => {
      if (!progress.lessons[lesson.id]?.vocabDone) return
      lesson.vocab.forEach((_, i) => {
        if (getCardState(cardId(lesson.id, i)).dueAt <= now) count += 1
      })
    })
    return count
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, cards])

  return (
    <header className="sticky top-0 z-10 bg-surface/70 backdrop-blur-xl backdrop-saturate-150 border-b border-ink-900/10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <NavLink to="/" className="flex items-center gap-2 font-semibold text-lg shrink-0">
          <span className="text-2xl">ಕ</span>
          <span className="hidden sm:inline">
            Kannad<span className="text-saffron-500">iga</span>
          </span>
        </NavLink>

        <GamificationBar />

        <nav className="flex items-center gap-1 ml-auto">
          <NavLink to="/" end className={linkClasses}>
            Lessons
          </NavLink>
          <NavLink to="/review" className={linkClasses}>
            <span className="inline-flex items-center gap-1.5">
              Review
              {dueCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-saffron-500 text-white text-[10px] font-bold">
                  {dueCount}
                </span>
              )}
            </span>
          </NavLink>
          <NavLink to="/progress" className={linkClasses}>
            Progress
          </NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
