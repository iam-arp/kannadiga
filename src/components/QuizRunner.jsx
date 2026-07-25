import { useState } from 'react'
import { useProgress } from '../hooks/useProgress'
import { fuzzyMatch } from '../utils/textMatch'

export default function QuizRunner({ lesson }) {
  const { saveQuizResult, getLessonProgress } = useProgress()
  const bestScore = getLessonProgress(lesson.id).quiz?.bestScore
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [fillValue, setFillValue] = useState('')
  const [answered, setAnswered] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = lesson.quiz[index]
  const isLast = index === lesson.quiz.length - 1

  const isCorrect = () => {
    if (question.type === 'mcq') return selected === question.answer
    if (question.type === 'truefalse') return selected === question.answer
    if (question.type === 'fill')
      return fuzzyMatch(fillValue, question.answer, question.altAnswers || []).isMatch
    return false
  }

  const needsSelection = question.type === 'mcq' || question.type === 'truefalse'

  const handleSubmit = () => {
    if (answered) return
    setAnswered(true)
    if (isCorrect()) setCorrectCount((c) => c + 1)
  }

  const handleNext = () => {
    if (isLast) {
      saveQuizResult(lesson.id, correctCount, lesson.quiz.length)
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setFillValue('')
    setAnswered(false)
  }

  const restart = () => {
    setIndex(0)
    setSelected(null)
    setFillValue('')
    setAnswered(false)
    setCorrectCount(0)
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="rounded-2xl bg-surface border border-ink-900/10 p-8 text-center shadow-sm">
        <p className="text-4xl mb-2">{correctCount === lesson.quiz.length ? '🎉' : '📝'}</p>
        <h3 className="text-xl font-semibold">
          You scored {correctCount} / {lesson.quiz.length}
        </h3>
        {bestScore != null && (
          <p className="text-sm text-ink-900/50 mt-1">Best score: {bestScore} / {lesson.quiz.length}</p>
        )}
        <button
          type="button"
          onClick={restart}
          className="mt-5 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition"
        >
          Retry quiz
        </button>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-ink-900/60 mb-4">
        Question {index + 1} of {lesson.quiz.length}
      </p>
      <div className="rounded-2xl bg-surface border border-ink-900/10 p-6 shadow-sm">
        <p className="font-medium text-lg mb-4">{question.question}</p>

        {question.type === 'mcq' && (
          <div className="space-y-2">
            {question.options.map((opt, i) => {
              let style = 'border-ink-900/15 hover:border-teal-300'
              if (answered) {
                if (i === question.answer) style = 'border-teal-500 bg-teal-500/10'
                else if (i === selected) style = 'border-red-500/40 bg-red-500/10'
              } else if (i === selected) {
                style = 'border-teal-500 bg-teal-500/10'
              }
              return (
                <button
                  key={i}
                  type="button"
                  disabled={answered}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition ${style}`}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        )}

        {question.type === 'fill' && (
          <input
            type="text"
            value={fillValue}
            onChange={(e) => setFillValue(e.target.value)}
            disabled={answered}
            placeholder="Type your answer (transliteration)..."
            className="w-full px-4 py-3 rounded-xl border border-ink-900/15 focus:border-teal-500 outline-none disabled:bg-ink-900/5"
          />
        )}

        {question.type === 'truefalse' && (
          <div className="grid grid-cols-2 gap-3">
            {[true, false].map((value) => {
              let style = 'border-ink-900/15 hover:border-teal-300'
              if (answered) {
                if (value === question.answer) style = 'border-teal-500 bg-teal-500/10'
                else if (value === selected) style = 'border-red-500/40 bg-red-500/10'
              } else if (value === selected) {
                style = 'border-teal-500 bg-teal-500/10'
              }
              return (
                <button
                  key={String(value)}
                  type="button"
                  disabled={answered}
                  onClick={() => setSelected(value)}
                  className={`px-4 py-3 rounded-xl border font-medium transition ${style}`}
                >
                  {value ? 'True' : 'False'}
                </button>
              )
            })}
          </div>
        )}

        {answered && (
          <div
            className={`mt-4 p-3 rounded-xl text-sm ${
              isCorrect() ? 'bg-teal-500/10 text-teal-600' : 'bg-red-500/10 text-red-600'
            }`}
          >
            {isCorrect()
              ? '✓ Correct!'
              : `✗ Correct answer: ${
                  question.type === 'mcq'
                    ? question.options[question.answer]
                    : question.type === 'truefalse'
                      ? question.answer
                        ? 'True'
                        : 'False'
                      : question.answer
                }`}
            {question.explanation && (
              <p className="mt-1 text-ink-900/60">{question.explanation}</p>
            )}
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          {!answered ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={needsSelection ? selected === null : !fillValue.trim()}
              className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 disabled:opacity-40 transition"
            >
              Check answer
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition"
            >
              {isLast ? 'Finish quiz' : 'Next question →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
