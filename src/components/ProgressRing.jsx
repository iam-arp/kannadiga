export default function ProgressRing({ completed, total, size = 40, trackClassName = 'text-ink-900/10', labelClassName = 'text-ink-900' }) {
  const radius = size / 2 - 4
  const circumference = 2 * Math.PI * radius
  const fraction = total === 0 ? 0 : completed / total
  const offset = circumference * (1 - fraction)

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        className={trackClassName}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={fraction === 1 ? '#0f9d8e' : '#f5941f'}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-all duration-500"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={size * 0.28}
        fontWeight="600"
        fill="currentColor"
        className={labelClassName}
      >
        {completed}/{total}
      </text>
    </svg>
  )
}
