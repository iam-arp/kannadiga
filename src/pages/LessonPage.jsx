import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getLesson, getAdjacentLessons } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import VocabList from '../components/VocabList'
import ConversationPlayer from '../components/ConversationPlayer'
import PronunciationPractice from '../components/PronunciationPractice'
import QuizRunner from '../components/QuizRunner'
import DictationExercise from '../components/DictationExercise'

const TABS = [
  { key: 'vocab', label: 'Vocab', icon: '📚' },
  { key: 'conversation', label: 'Conversation', icon: '💬' },
  { key: 'pronunciation', label: 'Pronunciation', icon: '🎙️' },
  { key: 'quiz', label: 'Quiz', icon: '📝' },
  { key: 'dictation', label: 'Dictation', icon: '✍️' },
]

export default function LessonPage() {
  const { lessonId } = useParams()
  const lesson = getLesson(lessonId)
  const [tab, setTab] = useState('vocab')
  const { getLessonProgress } = useProgress()

  if (!lesson) return <Navigate to="/" replace />

  const progress = getLessonProgress(lesson.id)
  const doneMap = {
    vocab: progress.vocabDone,
    conversation: progress.conversationDone,
    pronunciation: progress.pronunciationDone,
    quiz: progress.quizDone,
    dictation: progress.dictationDone,
  }
  const { prev, next } = getAdjacentLessons(lesson.id)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-ink-900/50 hover:text-teal-600 transition">
        ← All lessons
      </Link>

      <div className="flex items-center gap-3 mt-3 mb-1">
        <span className="text-3xl">{lesson.emoji}</span>
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
      </div>
      <p className="text-ink-900/60 mb-6">{lesson.scenario}</p>

      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
              tab === t.key
                ? 'bg-teal-600 text-white'
                : 'bg-white border border-black/5 text-ink-900/70 hover:border-teal-300'
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
            {doneMap[t.key] && <span className="text-xs">✓</span>}
          </button>
        ))}
      </div>

      {tab === 'vocab' && <VocabList lesson={lesson} />}
      {tab === 'conversation' && <ConversationPlayer lesson={lesson} />}
      {tab === 'pronunciation' && <PronunciationPractice lesson={lesson} />}
      {tab === 'quiz' && <QuizRunner lesson={lesson} />}
      {tab === 'dictation' && <DictationExercise lesson={lesson} />}

      <div className="flex justify-between mt-10 pt-6 border-t border-black/5">
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
