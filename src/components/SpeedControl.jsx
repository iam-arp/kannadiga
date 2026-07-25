import { useSpeech } from '../hooks/useSpeech'

export default function SpeedControl() {
  const { rate, cycleRate, ttsSupported } = useSpeech()

  if (!ttsSupported) return null

  return (
    <button
      type="button"
      onClick={cycleRate}
      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-ink-900/5 text-ink-900/60 hover:bg-teal-500/10 hover:text-teal-600 transition"
      title="Cycle text-to-speech playback speed"
    >
      🔈 {rate}x
    </button>
  )
}
