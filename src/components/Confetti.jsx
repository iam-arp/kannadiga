import { useEffect, useState } from 'react'

const COLORS = ['#0f9d8e', '#f5941f', '#e0ac1f', '#0b7f73', '#ffedc9']

// Fires a lightweight confetti burst whenever `trigger` changes to a truthy,
// distinct value — pass a value that changes identity each time you want a
// new burst (e.g. a counter or a unique key).
export default function Confetti({ trigger }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    if (!trigger) return
    const next = Array.from({ length: 36 }, (_, i) => ({
      id: `${trigger}-${i}`,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.3,
      rotate: Math.random() * 360,
    }))
    setPieces(next)
    const timeout = setTimeout(() => setPieces([]), 1600)
    return () => clearTimeout(timeout)
  }, [trigger])

  if (pieces.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 h-0 z-50 overflow-visible">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}
