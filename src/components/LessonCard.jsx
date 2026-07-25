import { Link } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import ProgressRing from './ProgressRing'

export default function LessonCard({ lesson }) {
  const { getLessonProgress } = useProgress()
  const p = getLessonProgress(lesson.id)
  const completed = [p.vocabDone, p.conversationDone, p.quizDone, p.dictationDone].filter(
    Boolean,
  ).length

  return (
    <Link
      to={`/lesson/${lesson.id}`}
      className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-black/5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
    >
      <div className="text-3xl">{lesson.emoji}</div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-ink-900 group-hover:text-teal-600 transition truncate">
          {lesson.title}
        </h3>
        <p className="text-sm text-ink-900/60 truncate">{lesson.scenario}</p>
      </div>
      <ProgressRing completed={completed} total={4} />
    </Link>
  )
}
