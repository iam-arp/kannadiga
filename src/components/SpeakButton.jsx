import { useSpeech } from '../hooks/useSpeech'

export default function SpeakButton({ text, size = 'md' }) {
  const { speak, isSpeaking, ttsSupported } = useSpeech()

  if (!ttsSupported) return null

  const sizeClasses = size === 'sm' ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-base'

  return (
    <button
      type="button"
      onClick={() => speak(text)}
      className={`${sizeClasses} shrink-0 inline-flex items-center justify-center rounded-full bg-teal-50 text-teal-600 hover:bg-teal-100 active:scale-95 transition disabled:opacity-50`}
      aria-label="Listen"
      title="Listen"
    >
      {isSpeaking ? '🔊' : '🔈'}
    </button>
  )
}
