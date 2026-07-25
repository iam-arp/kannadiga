import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getLesson, getAdjacentLessons } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import VocabList from '../components/VocabList'
import ConversationPlayer from '../components/ConversationPlayer'
import PronunciationPractice from '../components/PronunciationPractice'
import QuizRunner from '../components/QuizRunner'
import DictationExercise from '../components/DictationExercise'
import LessonNotes from '../components/LessonNotes'
import SpeedControl from '../components/SpeedControl'
import Confetti from '../components/Confetti'

const TABS = [
  { key: 'vocab', label: 'Vocab', icon: '📚' },
  { key: 'conversation', label: 'Conversation', icon: '💬' },
  { key: 'pronunciation', label: 'Pronunciation', icon: '🎙️' },
  { key: 'quiz', label: 'Quiz', icon: '📝' },
  { key: 'dictation', label: 'Dictation', icon: '✍️' },
]

const DIFFICULTY_STYLES = {
  Beginner: 'bg-teal-500/10 text-teal-600',
  Intermediate: 'bg-saffron-500/10 text-saffron-600',
  Advanced: 'bg-red-500/10 text-red-600',
}

export default function LessonPage() {
  const { lessonId } = useParams()
  const lesson = getLesson(lessonId)
  const [tab, setTab] = useState('vocab')
  const { getLessonProgress } = useProgress()
  const [celebration, setCelebration] = useState(0)
  const wasFullyDone = useRef(false)

  const progress = lesson ? getLessonProgress(lesson.id) : {}
  const doneMap = {
    vocab: progress.vocabDone,
    conversation: progress.conversationDone,
    pronunciation: progress.pronunciationDone,
    quiz: progress.quizDone,
    dictation: progress.dictationDone,
  }
  const allDone = Object.values(doneMap).every(Boolean)

  useEffect(() => {
    wasFullyDone.current = false
  }, [lessonId])

  useEffect(() => {
    if (allDone && !wasFullyDone.current) {
      setCelebration((c) => c + 1)
    }
    wasFullyDone.current = allDone
  }, [allDone])

  if (!lesson) return <Navigate to="/" replace />

  const { prev, next } = getAdjacentLessons(lesson.id)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Confetti trigger={celebration || null} />
      <Link to="/" className="text-sm text-ink-900/50 hover:text-teal-600 transition">
        ← All lessons
      </Link>

      <div className="flex items-center gap-3 mt-3 mb-1">
        <span className="text-3xl">{lesson.emoji}</span>
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
      </div>
      <p className="text-ink-900/60 mb-2">{lesson.scenario}</p>
      <div className="flex items-center gap-2 mb-4">
        {lesson.difficulty && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_STYLES[lesson.difficulty] || 'bg-ink-900/5 text-ink-900/60'}`}
          >
            {lesson.difficulty}
          </span>
        )}
        {lesson.estimatedMinutes && (
          <span className="text-xs text-ink-900/40">⏱ {lesson.estimatedMinutes} min</span>
        )}
      </div>

      <LessonNotes lesson={lesson} />

      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                tab === t.key
                  ? 'bg-teal-600 text-white'
                  : 'bg-surface border border-ink-900/10 text-ink-900/70 hover:border-teal-300'
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
              {doneMap[t.key] && <span className="text-xs">✓</span>}
            </button>
          ))}
        </div>
        <SpeedControl />
      </div>

      {allDone && (
        <div className="mb-6 rounded-xl bg-teal-500/10 border border-teal-500/20 px-4 py-3 text-sm text-teal-600 animate-fade-in-up">
          🎉 Lesson complete! Great work — check your progress and streak on the{' '}
          <Link to="/progress" className="underline font-medium">
            Progress page
          </Link>
          .
        </div>
      )}

      {tab === 'vocab' && <VocabList lesson={lesson} />}
      {tab === 'conversation' && <ConversationPlayer lesson={lesson} />}
      {tab === 'pronunciation' && <PronunciationPractice lesson={lesson} />}
      {tab === 'quiz' && <QuizRunner lesson={lesson} />}
      {tab === 'dictation' && <DictationExercise lesson={lesson} />}

      <div className="flex justify-between mt-10 pt-6 border-t border-ink-900/10">
        {prev ? (
          <Link
            to={`/lesson/${prev.id}`}
            className="text-sm text-ink-900/60 hover:text-teal-600 transition"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/lesson/${next.id}`}
            className="text-sm font-medium text-teal-600 hover:text-teal-700 transition"
          >
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}
