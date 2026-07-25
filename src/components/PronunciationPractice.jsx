import { useState } from 'react'
import SpeakButton from './SpeakButton'
import { useSpeech } from '../hooks/useSpeech'
import { useProgress } from '../hooks/useProgress'
import { fuzzyMatch } from '../utils/textMatch'

export default function PronunciationPractice({ lesson }) {
  const { listen, isListening, sttSupported } = useSpeech()
  const { markPronunciationDone, getLessonProgress } = useProgress()
  const done = getLessonProgress(lesson.id).pronunciationDone
  const phrases = lesson.vocab.slice(0, 6)
  const [index, setIndex] = useState(0)
  const [heard, setHeard] = useState('')
  const [feedback, setFeedback] = useState(null)

  const phrase = phrases[index]

  const handleRecord = () => {
    setFeedback(null)
    setHeard('')
    listen({
      onResult: (transcript) => {
        setHeard(transcript)
        const result = fuzzyMatch(transcript, phrase.translit)
        setFeedback(result)
      },
      onError: () => setFeedback({ isMatch: false, closeness: 0, error: true }),
    })
  }

  const next = () => {
    setFeedback(null)
    setHeard('')
    setIndex((i) => (i + 1) % phrases.length)
    if (index === phrases.length - 1) markPronunciationDone(lesson.id)
  }

  return (
    <div>
      <p className="text-sm text-ink-900/60 mb-4">
        Listen, then try saying it yourself. Speech recognition works best in Chrome.
      </p>

      <div className="rounded-2xl bg-white border border-black/5 p-6 shadow-sm text-center">
        <p className="text-xs uppercase tracking-wide text-ink-900/40 mb-2">
          Phrase {index + 1} of {phrases.length}
        </p>
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="kannada-text text-2xl font-medium">{phrase.kannada}</span>
          <SpeakButton text={phrase.kannada} />
        </div>
        <p className="text-ink-900/60">{phrase.translit}</p>
        <p className="text-sm text-ink-900/50 italic">{phrase.english}</p>

        {sttSupported ? (
          <button
            type="button"
            onClick={handleRecord}
            disabled={isListening}
            className={`mt-5 w-16 h-16 rounded-full text-2xl inline-flex items-center justify-center transition ${
              isListening
                ? 'bg-red-100 text-red-600 animate-pulse'
                : 'bg-saffron-500 text-white hover:bg-saffron-600'
            }`}
            aria-label="Record your voice"
          >
            🎙️
          </button>
        ) : (
          <p className="mt-5 text-sm text-red-500">
            Speech recognition isn't supported in this browser — try Chrome on desktop or
            Android.
          </p>
        )}

        {heard && (
          <p className="mt-3 text-sm text-ink-900/60">
            Heard: <span className="font-medium">{heard}</span>
          </p>
        )}

        {feedback && !feedback.error && (
          <p
            className={`mt-2 font-medium ${
              feedback.isMatch ? 'text-teal-600' : 'text-saffron-600'
            }`}
          >
            {feedback.isMatch
              ? '✓ Great match!'
              : feedback.closeness > 0.4
                ? 'Close — try again'
                : "Not quite — listen again and retry"}
          </p>
        )}
        {feedback?.error && (
          <p className="mt-2 text-red-500 text-sm">
            Couldn't access the microphone. Check your browser permissions.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-ink-900/50">{done ? '✓ Practice complete' : ''}</p>
        <button
          type="button"
          onClick={next}
          className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition"
        >
          Next phrase →
        </button>
      </div>
    </div>
  )
}
