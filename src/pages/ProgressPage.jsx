import { categories } from '../data/categories'
import { lessons, getLessonsByCategory } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import ProgressRing from '../components/ProgressRing'

export default function ProgressPage() {
  const { getLessonProgress, isLessonComplete, resetProgress } = useProgress()

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Progress</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="rounded-2xl bg-white border border-black/5 p-5 shadow-sm flex items-center gap-4">
          <ProgressRing completed={completedLessons.length} total={lessons.length} size={52} />
          <div>
            <p className="text-2xl font-bold">{completedLessons.length}/{lessons.length}</p>
            <p className="text-sm text-ink-900/50">Lessons completed</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-black/5 p-5 shadow-sm">
          <p className="text-2xl font-bold text-teal-600">
            {quizAccuracy != null ? `${quizAccuracy}%` : '—'}
          </p>
          <p className="text-sm text-ink-900/50">Quiz accuracy (best scores)</p>
        </div>
        <div className="rounded-2xl bg-white border border-black/5 p-5 shadow-sm">
          <p className="text-2xl font-bold text-saffron-500">
            {dictationAccuracy != null ? `${dictationAccuracy}%` : '—'}
          </p>
          <p className="text-sm text-ink-900/50">Dictation accuracy (best scores)</p>
        </div>
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
              className="flex items-center gap-4 rounded-xl bg-white border border-black/5 p-4"
            >
              <span className="text-xl">{cat.emoji}</span>
              <div className="flex-1">
                <p className="font-medium">{cat.name}</p>
                <div className="h-2 rounded-full bg-black/5 mt-1 overflow-hidden">
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
        onClick={() => {
          if (confirm('Reset all progress? This cannot be undone.')) resetProgress()
        }}
        className="text-sm text-red-500 hover:text-red-600 underline"
      >
        Reset all progress
      </button>
    </div>
  )
}
