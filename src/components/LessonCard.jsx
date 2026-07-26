import { Link } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import ProgressRing from './ProgressRing'

const DIFFICULTY_STYLES = {
  Beginner: 'bg-teal-500/10 text-teal-600',
  Intermediate: 'bg-saffron-500/10 text-saffron-600',
  Advanced: 'bg-red-500/10 text-red-600',
}

export default function LessonCard({ lesson }) {
  const { getLessonProgress } = useProgress()
  const p = getLessonProgress(lesson.id)
  const completed = [
    p.lessonDone,
    p.vocabDone,
    p.conversationDone,
    p.pronunciationDone,
    p.quizDone,
    p.dictationDone,
  ].filter(Boolean).length

  return (
    <Link
      to={`/lesson/${lesson.id}`}
      className="group flex items-center gap-4 p-4 rounded-2xl bg-surface border border-ink-900/10 shadow-elevate hover:shadow-elevate-lg hover:-translate-y-0.5 transition"
    >
      <div className="text-3xl">{lesson.emoji}</div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-ink-900 group-hover:text-teal-600 transition truncate">
          {lesson.title}
        </h3>
        <p className="text-sm text-ink-900/60 truncate">{lesson.scenario}</p>
        <div className="flex items-center gap-2 mt-1.5">
          {lesson.difficulty && (
            <span
              className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${DIFFICULTY_STYLES[lesson.difficulty] || 'bg-ink-900/5 text-ink-900/60'}`}
            >
              {lesson.difficulty}
            </span>
          )}
          {lesson.estimatedMinutes && (
            <span className="text-[11px] text-ink-900/40">⏱ {lesson.estimatedMinutes} min</span>
          )}
        </div>
      </div>
      <ProgressRing completed={completed} total={6} />
    </Link>
  )
}
