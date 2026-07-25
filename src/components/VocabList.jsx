import { useState } from 'react'
import SpeakButton from './SpeakButton'
import { useProgress } from '../hooks/useProgress'

export default function VocabList({ lesson }) {
  const { markVocabDone, getLessonProgress } = useProgress()
  const done = getLessonProgress(lesson.id).vocabDone
  const [flipped, setFlipped] = useState({})

  const toggleFlip = (i) => setFlipped((f) => ({ ...f, [i]: !f[i] }))

  return (
    <div>
      <p className="text-sm text-ink-900/60 mb-4">
        Tap a card to flip it. Use 🔈 to hear the pronunciation.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {lesson.vocab.map((item, i) => (
          <div
            key={i}
            onClick={() => toggleFlip(i)}
            className="cursor-pointer rounded-xl border border-ink-900/10 bg-surface p-4 shadow-sm hover:shadow-md transition min-h-[104px] flex flex-col justify-between"
          >
            {!flipped[i] ? (
              <>
                <div className="flex items-start justify-between gap-2">
                  <span className="kannada-text text-xl font-medium">{item.kannada}</span>
                  <span onClick={(e) => e.stopPropagation()}>
                    <SpeakButton text={item.kannada} size="sm" />
                  </span>
                </div>
                <p className="text-sm text-ink-900/60 mt-2">{item.translit}</p>
              </>
            ) : (
              <>
                <p className="font-medium text-teal-600">{item.english}</p>
                {item.note && <p className="text-xs text-ink-900/50 mt-2">{item.note}</p>}
              </>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => markVocabDone(lesson.id)}
        disabled={done}
        className="mt-6 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 disabled:bg-teal-500/15 disabled:text-teal-600 transition"
      >
        {done ? '✓ Vocab reviewed' : "I've reviewed all the vocab"}
      </button>
    </div>
  )
}
