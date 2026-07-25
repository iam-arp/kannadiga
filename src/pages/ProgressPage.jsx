import { categories } from '../data/categories'
import { lessons, getLessonsByCategory } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import { useGamification } from '../hooks/useGamification'
import ProgressRing from '../components/ProgressRing'
import BadgeGrid from '../components/BadgeGrid'

export default function ProgressPage() {
  const { getLessonProgress, isLessonComplete, resetProgress } = useProgress()
  const { xp, level, xpIntoLevel, streak } = useGamification()

  const completedLessons = lessons.filter((l) => isLessonComplete(l.id))

  let quizCorrect = 0
  let quizTotal = 0
  let dictationCorrect = 0
  let dictationTotal = 0
  lessons.forEach((l) => {
    const p = getLessonProgress(l.id)
    if (p.quiz) {
      quizCorrect += p.quiz.bestScore ?? 0
      quizTotal += p.quiz.total ?? 0
    }
    if (p.dictation) {
      dictationCorrect += p.dictation.bestScore ?? 0
      dictationTotal += p.dictation.total ?? 0
    }
  })

  const quizAccuracy = quizTotal > 0 ? Math.round((quizCorrect / quizTotal) * 100) : null
  const dictationAccuracy =
    dictationTotal > 0 ? Math.round((dictationCorrect / dictationTotal) * 100) : null

  const resetEverything = () => {
    if (!confirm('Reset all progress, XP, streak, and review data? This cannot be undone.')) return
    resetProgress()
    localStorage.removeItem('kannadiga-gamification')
    localStorage.removeItem('kannadiga-review')
    window.location.reload()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Progress</h1>

      <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 text-white p-6 mb-8 flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-teal-100 text-xs uppercase tracking-widest font-semibold mb-1">
            Level {level}
          </p>
          <p className="text-2xl font-bold">{xp} XP total</p>
          <div className="w-48 h-2 rounded-full bg-white/20 mt-2 overflow-hidden">
            <div className="h-full bg-white transition-all" style={{ width: `${xpIntoLevel}%` }} />
          </div>
          <p className="text-xs text-teal-100 mt-1">{xpIntoLevel} / 100 XP to level {level + 1}</p>
        </div>
        <div className="text-center">
          <p className="text-4xl animate-flame inline-block">🔥</p>
          <p className="text-2xl font-bold">{streak.current}</p>
          <p className="text-xs text-teal-100">day streak (best {streak.longest})</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="rounded-2xl bg-surface border border-ink-900/10 p-5 shadow-sm flex items-center gap-4">
          <ProgressRing completed={completedLessons.length} total={lessons.length} size={52} />
          <div>
            <p className="text-2xl font-bold">{completedLessons.length}/{lessons.length}</p>
            <p className="text-sm text-ink-900/50">Lessons completed</p>
          </div>
        </div>
        <div className="rounded-2xl bg-surface border border-ink-900/10 p-5 shadow-sm">
          <p className="text-2xl font-bold text-teal-600">
            {quizAccuracy != null ? `${quizAccuracy}%` : '—'}
          </p>
          <p className="text-sm text-ink-900/50">Quiz accuracy (best scores)</p>
        </div>
        <div className="rounded-2xl bg-surface border border-ink-900/10 p-5 shadow-sm">
          <p className="text-2xl font-bold text-saffron-500">
            {dictationAccuracy != null ? `${dictationAccuracy}%` : '—'}
          </p>
          <p className="text-sm text-ink-900/50">Dictation accuracy (best scores)</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3">Badges</h2>
      <div className="mb-10">
        <BadgeGrid />
      </div>

      <h2 className="text-lg font-semibold mb-3">By Category</h2>
      <div className="space-y-3 mb-10">
        {categories.map((cat) => {
          const catLessons = getLessonsByCategory(cat.key)
          if (catLessons.length === 0) return null
          const done = catLessons.filter((l) => isLessonComplete(l.id)).length
          return (
            <div
              key={cat.key}
              className="flex items-center gap-4 rounded-xl bg-surface border border-ink-900/10 p-4"
            >
              <span className="text-xl">{cat.emoji}</span>
              <div className="flex-1">
                <p className="font-medium">{cat.name}</p>
                <div className="h-2 rounded-full bg-ink-900/5 mt-1 overflow-hidden">
                  <div
                    className="h-full bg-teal-500 transition-all"
                    style={{ width: `${(done / catLessons.length) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm text-ink-900/50 whitespace-nowrap">
                {done}/{catLessons.length}
              </span>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={resetEverything}
        className="text-sm text-red-500 hover:text-red-600 underline"
      >
        Reset all progress
      </button>
    </div>
  )
}
