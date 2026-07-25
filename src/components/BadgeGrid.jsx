import { badges } from '../data/badges'
import { lessons } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import { useGamification } from '../hooks/useGamification'

export default function BadgeGrid() {
  const { progress, isLessonComplete } = useProgress()
  const { streak, level } = useGamification()

  const ctx = {
    lessons,
    progress: progress.lessons,
    isComplete: (p) => !!(p && p.vocabDone && p.conversationDone && p.pronunciationDone && p.quizDone && p.dictationDone),
    streak,
    level,
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {badges.map((badge) => {
        const unlocked = badge.isUnlocked(ctx)
        return (
          <div
            key={badge.id}
            className={`rounded-2xl border p-4 text-center transition ${
              unlocked
                ? 'bg-surface border-ink-900/10 shadow-sm'
                : 'bg-ink-900/5 border-ink-900/5 opacity-50'
            }`}
          >
            <p className={`text-3xl mb-1 ${unlocked ? '' : 'grayscale'}`}>{badge.emoji}</p>
            <p className="text-sm font-semibold">{badge.name}</p>
            <p className="text-xs text-ink-900/50 mt-1">{badge.description}</p>
          </div>
        )
      })}
    </div>
  )
}
