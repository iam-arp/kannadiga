import { useProgress } from '../hooks/useProgress'
import SpeakButton from './SpeakButton'

export default function LessonTeaching({ lesson, onContinue }) {
  const { markLessonRead, getLessonProgress } = useProgress()
  const done = getLessonProgress(lesson.id).lessonDone
  const teaching = lesson.teaching

  if (!teaching) {
    return (
      <p className="text-sm text-ink-900/60">
        No detailed walkthrough for this lesson yet — head straight to the vocab below.
      </p>
    )
  }

  return (
    <div>
      <div className="rounded-2xl bg-surface border border-ink-900/10 p-6 shadow-elevate mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-600 mb-2">
          Before you start
        </p>
        <p className="text-ink-900/80 leading-relaxed">{teaching.overview}</p>
      </div>

      {teaching.grammar?.length > 0 && (
        <section className="mb-8">
          <h3 className="font-semibold text-lg mb-3">📐 Grammar & Sentence Patterns</h3>
          <div className="space-y-3">
            {teaching.grammar.map((point, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-2xl bg-surface border border-ink-900/10 p-5 shadow-elevate"
              >
                <span className="shrink-0 w-8 h-8 rounded-full bg-teal-500/10 text-teal-600 font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold mb-1">{point.heading}</p>
                  <p className="text-sm text-ink-900/70 leading-relaxed">{point.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {teaching.sentenceLab?.length > 0 && (
        <section className="mb-8">
          <h3 className="font-semibold text-lg mb-1">🔬 Sentence Anatomy</h3>
          <p className="text-sm text-ink-900/50 mb-3">
            How these sentences are actually built, piece by piece.
          </p>
          <div className="space-y-4">
            {teaching.sentenceLab.map((sentence, i) => (
              <div key={i} className="rounded-2xl bg-surface border border-ink-900/10 p-5 shadow-elevate">
                <div className="flex items-center gap-2 mb-1">
                  <span className="kannada-text text-lg font-medium">{sentence.kannada}</span>
                  <SpeakButton text={sentence.kannada} size="sm" />
                </div>
                <p className="text-sm text-ink-900/50 mb-3">
                  {sentence.translit} — "{sentence.english}"
                </p>
                <div className="flex flex-wrap gap-2">
                  {sentence.parts.map((part, j) => (
                    <div
                      key={j}
                      className="rounded-lg bg-saffron-500/10 border border-saffron-500/20 px-3 py-2 min-w-[88px] text-center"
                    >
                      <p className="kannada-text text-sm font-medium">{part.chunk}</p>
                      <p className="text-[11px] text-ink-900/50 mt-0.5">{part.translit}</p>
                      <p className="text-[11px] text-saffron-600 font-medium mt-1">{part.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {lesson.vocab?.length > 0 && (
        <section className="mb-6">
          <h3 className="font-semibold text-lg mb-1">📚 Vocabulary Deep-Dive</h3>
          <p className="text-sm text-ink-900/50 mb-3">
            Every important word from this lesson, with how and when to actually use it.
          </p>
          <div className="space-y-2">
            {lesson.vocab.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl bg-surface border border-ink-900/10 p-4"
              >
                <SpeakButton text={item.kannada} size="sm" />
                <div className="min-w-0">
                  <p>
                    <span className="kannada-text font-medium">{item.kannada}</span>{' '}
                    <span className="text-ink-900/50 text-sm">({item.translit})</span> —{' '}
                    <span className="text-teal-600 font-medium">{item.english}</span>
                  </p>
                  {(item.usage || item.note) && (
                    <p className="text-sm text-ink-900/60 mt-1">{item.usage || item.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => {
          markLessonRead(lesson.id)
          onContinue?.()
        }}
        disabled={done}
        className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 active:scale-[0.98] disabled:bg-teal-500/15 disabled:text-teal-600 transition"
      >
        {done ? '✓ Lesson read — on to practice!' : "I've read this, take me to practice"}
      </button>
    </div>
  )
}
