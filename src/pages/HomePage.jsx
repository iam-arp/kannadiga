import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { lessons, getLessonsByCategory } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import LessonCard from '../components/LessonCard'
import ProgressRing from '../components/ProgressRing'

export default function HomePage() {
  const { isLessonComplete } = useProgress()

  const completedLessons = lessons.filter((l) => isLessonComplete(l.id))
  const nextLesson = lessons.find((l) => !isLessonComplete(l.id))

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <section className="rounded-3xl bg-gradient-to-br from-teal-600 to-teal-700 text-white p-8 sm:p-10 shadow-lg mb-8">
        <p className="uppercase tracking-widest text-teal-100 text-xs font-semibold mb-2">
          ನಮ್ಮ ಬೆಂಗಳೂರು ಕನ್ನಡ
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Learn Urban Conversational Kannada</h1>
        <p className="text-teal-50 max-w-2xl mb-6">
          Real, everyday Kannada for autos, markets, neighbors, and daily life in the city —
          not textbook grammar. Vocab, live conversations, pronunciation practice, quizzes, and
          dictation, lesson by lesson.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
            <ProgressRing completed={completedLessons.length} total={lessons.length} size={48} />
            <div className="text-sm">
              <p className="font-semibold">{completedLessons.length} / {lessons.length} lessons</p>
              <p className="text-teal-100">completed</p>
            </div>
          </div>
          {nextLesson && (
            <Link
              to={`/lesson/${nextLesson.id}`}
              className="px-5 py-3 rounded-2xl bg-white text-teal-700 font-semibold hover:bg-teal-50 transition"
            >
              {completedLessons.length === 0 ? 'Start learning' : 'Continue'} — {nextLesson.title} →
            </Link>
          )}
        </div>
      </section>

      {categories.map((cat) => {
        const catLessons = getLessonsByCategory(cat.key)
        if (catLessons.length === 0) return null
        return (
          <section key={cat.key} className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{cat.emoji}</span>
              <h2 className="text-lg font-semibold">{cat.name}</h2>
            </div>
            <p className="text-sm text-ink-900/50 mb-3">{cat.description}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {catLessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
