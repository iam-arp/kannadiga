import { useState } from 'react'
import SpeakButton from './SpeakButton'
import { useProgress } from '../hooks/useProgress'
import { fuzzyMatch } from '../utils/textMatch'

export default function DictationExercise({ lesson }) {
  const { saveDictationResult, getLessonProgress } = useProgress()
  const bestScore = getLessonProgress(lesson.id).dictation?.bestScore
  const [index, setIndex] = useState(0)
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const item = lesson.dictation[index]
  const isLast = index === lesson.dictation.length - 1
  const result = checked ? fuzzyMatch(value, item.translit) : null

  const handleCheck = () => {
    if (checked) return
    const r = fuzzyMatch(value, item.translit)
    setChecked(true)
    if (r.isMatch) setCorrectCount((c) => c + 1)
  }

  const handleNext = () => {
    if (isLast) {
      saveDictationResult(lesson.id, correctCount, lesson.dictation.length)
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setValue('')
    setChecked(false)
    setRevealed(false)
  }

  const restart = () => {
    setIndex(0)
    setValue('')
    setChecked(false)
    setCorrectCount(0)
    setFinished(false)
    setRevealed(false)
  }

  if (finished) {
    return (
      <div className="rounded-2xl bg-surface border border-ink-900/10 p-8 text-center shadow-elevate">
        <p className="text-4xl mb-2">{correctCount === lesson.dictation.length ? '🎧' : '✍️'}</p>
        <h3 className="text-xl font-semibold">
          You got {correctCount} / {lesson.dictation.length} right
        </h3>
        {bestScore != null && (
          <p className="text-sm text-ink-900/50 mt-1">
            Best score: {bestScore} / {lesson.dictation.length}
          </p>
        )}
        <button
          type="button"
          onClick={restart}
          className="mt-5 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 active:scale-[0.98] transition"
        >
          Retry dictation
        </button>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-ink-900/60 mb-4">
        Listen and type what you hear, using English letters (transliteration).
      </p>
      <div className="rounded-2xl bg-surface border border-ink-900/10 p-6 shadow-elevate">
        <p className="text-xs uppercase tracking-wide text-ink-900/40 mb-3">
          Phrase {index + 1} of {lesson.dictation.length}
        </p>
        <div className="flex items-center gap-3 mb-4">
          <SpeakButton text={item.kannada} />
          <span className="text-sm text-ink-900/50">Tap to hear the phrase</span>
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={checked}
          placeholder="Type what you heard..."
          className="w-full px-4 py-3 rounded-xl border border-ink-900/15 focus:border-teal-500 outline-none disabled:bg-ink-900/5"
        />

        {checked && (
          <div
            className={`mt-4 p-3 rounded-xl text-sm ${
              result.isMatch ? 'bg-teal-500/10 text-teal-600' : 'bg-red-500/10 text-red-600'
            }`}
          >
            {result.isMatch ? '✓ Correct!' : `✗ Expected: ${item.translit}`}
          </div>
        )}

        {!revealed && !checked && (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="mt-3 text-sm text-ink-900/40 hover:text-ink-900/70 underline"
          >
            Show hint
          </button>
        )}
        {revealed && !checked && (
          <p className="mt-2 text-sm text-ink-900/50 kannada-text">{item.kannada}</p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          {!checked ? (
            <button
              type="button"
              onClick={handleCheck}
              disabled={!value.trim()}
              className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 active:scale-[0.98] disabled:opacity-40 transition"
            >
              Check
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 active:scale-[0.98] transition"
            >
              {isLast ? 'Finish' : 'Next →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
