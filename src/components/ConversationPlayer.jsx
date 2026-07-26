import SpeakButton from './SpeakButton'
import { useProgress } from '../hooks/useProgress'

export default function ConversationPlayer({ lesson }) {
  const { markConversationDone, getLessonProgress } = useProgress()
  const done = getLessonProgress(lesson.id).conversationDone

  return (
    <div>
      <p className="text-sm text-ink-900/60 mb-4">
        A realistic back-and-forth for this scenario. Listen line by line.
      </p>
      <div className="space-y-3">
        {lesson.conversation.map((line, i) => (
          <div
            key={i}
            className={`flex gap-3 p-3 rounded-xl border ${
              line.speaker === 'You'
                ? 'bg-teal-500/10 border-teal-500/20 ml-0 mr-0'
                : 'bg-surface border-ink-900/10'
            }`}
          >
            <SpeakButton text={line.kannada} size="sm" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-900/40">
                {line.speaker}
              </p>
              <p className="kannada-text text-lg">{line.kannada}</p>
              <p className="text-sm text-ink-900/60">{line.translit}</p>
              <p className="text-sm text-ink-900/80 italic">{line.english}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => markConversationDone(lesson.id)}
        disabled={done}
        className="mt-6 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 active:scale-[0.98] disabled:bg-teal-500/15 disabled:text-teal-600 transition"
      >
        {done ? '✓ Conversation reviewed' : "I've gone through the conversation"}
      </button>
    </div>
  )
}
