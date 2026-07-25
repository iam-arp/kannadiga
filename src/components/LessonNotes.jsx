import { useState } from 'react'

export default function LessonNotes({ lesson }) {
  const [open, setOpen] = useState(false)

  if (!lesson.grammarTip && !lesson.cultureNote) return null

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 transition"
      >
        <span>💡</span>
        {open ? 'Hide grammar & culture notes' : 'Show grammar & culture notes'}
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in-up">
          {lesson.grammarTip && (
            <div className="rounded-xl bg-teal-500/10 border border-teal-500/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-600 mb-1">
                📐 {lesson.grammarTip.title}
              </p>
              <p className="text-sm text-ink-900/80">{lesson.grammarTip.body}</p>
            </div>
          )}
          {lesson.cultureNote && (
            <div className="rounded-xl bg-saffron-500/10 border border-saffron-500/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-saffron-600 mb-1">
                🪔 {lesson.cultureNote.title}
              </p>
              <p className="text-sm text-ink-900/80">{lesson.cultureNote.body}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
