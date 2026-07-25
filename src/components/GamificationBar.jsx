import { useGamification } from '../hooks/useGamification'

export default function GamificationBar() {
  const { level, xpIntoLevel, streak } = useGamification()

  return (
    <div className="flex items-center gap-2">
      <div
        className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-600 text-xs font-semibold"
        title={`${xpIntoLevel} / 100 XP to next level`}
      >
        <span>Lv {level}</span>
        <span className="w-14 h-1.5 rounded-full bg-teal-500/20 overflow-hidden">
          <span
            className="block h-full bg-teal-500 transition-all"
            style={{ width: `${xpIntoLevel}%` }}
          />
        </span>
      </div>
      {streak.current > 0 && (
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-saffron-500/10 text-saffron-600 text-xs font-semibold"
          title={`${streak.current}-day streak (best: ${streak.longest})`}
        >
          <span className="animate-flame inline-block">🔥</span>
          {streak.current}
        </div>
      )}
    </div>
  )
}
