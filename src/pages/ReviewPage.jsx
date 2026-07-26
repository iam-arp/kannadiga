import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { lessons } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import { useReview, cardId } from '../hooks/useReview'
import SpeakButton from '../components/SpeakButton'

const SESSION_SIZE = 20

export default function ReviewPage() {
  const { progress } = useProgress()
  const { gradeCard, getCardState } = useReview()
  const [sessionCards, setSessionCards] = useState(null)
  const [sessionIndex, setSessionIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const pool = useMemo(() => {
    const items = []
    lessons.forEach((lesson) => {
      if (!progress.lessons[lesson.id]?.vocabDone) return
      lesson.vocab.forEach((item, i) => {
        items.push({ id: cardId(lesson.id, i), lessonTitle: lesson.title, ...item })
      })
    })
    return items
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress])

  // Snapshot the due list once per session — grading a card changes its due
  // date immediately, and we don't want the list reshuffling mid-session.
  useEffect(() => {
    if (sessionCards !== null) return
    const now = Date.now()
    const due = pool
      .map((item) => ({ item, state: getCardState(item.id) }))
      .filter(({ state }) => state.dueAt <= now)
      .sort((a, b) => a.state.box - b.state.box || a.state.dueAt - b.state.dueAt)
      .slice(0, SESSION_SIZE)
      .map(({ item }) => item)
    setSessionCards(due)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, sessionCards])

  const startNewSession = () => {
    setSessionCards(null)
    setSessionIndex(0)
    setReviewedCount(0)
    setRevealed(false)
    setFinished(false)
  }

  if (pool.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🗂️</p>
        <h1 className="text-2xl font-bold mb-2">No vocab to review yet</h1>
        <p className="text-ink-900/60 mb-6">
          Finish the vocab section of a lesson and its words will show up here for spaced-repetition
          review.
        </p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 active:scale-[0.98] transition"
        >
          Browse lessons
        </Link>
      </div>
    )
  }

  if (sessionCards === null) return null

  if (sessionCards.length === 0 && !finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">✅</p>
        <h1 className="text-2xl font-bold mb-2">All caught up!</h1>
        <p className="text-ink-900/60 mb-6">
          You have {pool.length} words in your review deck and none are due right now. Check back
          later, or complete more lessons to grow your deck.
        </p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 active:scale-[0.98] transition"
        >
          Browse lessons
        </Link>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🎉</p>
        <h1 className="text-2xl font-bold mb-2">Review session complete!</h1>
        <p className="text-ink-900/60 mb-6">You reviewed {reviewedCount} words.</p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 active:scale-[0.98] transition"
          >
            Back to lessons
          </Link>
          <button
            type="button"
            onClick={startNewSession}
            className="px-5 py-2.5 rounded-xl bg-surface border border-ink-900/10 font-medium hover:border-teal-300 transition"
          >
            Review more
          </button>
        </div>
      </div>
    )
  }

  const card = sessionCards[sessionIndex]

  const handleGrade = (gotIt) => {
    gradeCard(card.id, gotIt)
    setReviewedCount((c) => c + 1)
    setRevealed(false)
    if (sessionIndex + 1 >= sessionCards.length) {
      setFinished(true)
    } else {
      setSessionIndex((i) => i + 1)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-ink-900/50 hover:text-teal-600 transition">
        ← All lessons
      </Link>
      <h1 className="text-2xl font-bold mt-3 mb-1">Vocab Review</h1>
      <p className="text-ink-900/60 mb-6">
        Card {sessionIndex + 1} of {sessionCards.length} · spaced repetition keeps bringing back
        words you're still learning.
      </p>

      <div className="rounded-2xl bg-surface border border-ink-900/10 p-8 text-center shadow-elevate animate-fade-in-up">
        <p className="text-xs uppercase tracking-wide text-ink-900/40 mb-3">{card.lessonTitle}</p>
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="kannada-text text-3xl font-medium">{card.kannada}</span>
          <SpeakButton text={card.kannada} />
        </div>
        <p className="text-ink-900/60 mb-4">{card.translit}</p>

        {revealed ? (
          <p className="text-lg font-medium text-teal-600 animate-fade-in-up">{card.english}</p>
        ) : (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 active:scale-[0.98] transition"
          >
            Reveal meaning
          </button>
        )}

        {revealed && (
          <div className="flex gap-3 justify-center mt-6">
            <button
              type="button"
              onClick={() => handleGrade(false)}
              className="px-5 py-2.5 rounded-xl bg-red-500/10 text-red-600 font-medium hover:bg-red-500/20 transition"
            >
              😅 Still learning
            </button>
            <button
              type="button"
              onClick={() => handleGrade(true)}
              className="px-5 py-2.5 rounded-xl bg-teal-500/10 text-teal-600 font-medium hover:bg-teal-500/20 transition"
            >
              ✅ Got it
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
