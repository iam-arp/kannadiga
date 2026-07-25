import { NavLink } from 'react-router-dom'

const linkClasses = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition ${
    isActive ? 'bg-teal-600 text-white' : 'text-ink-900/70 hover:bg-teal-50'
  }`

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-black/5">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="text-2xl">ಕ</span>
          <span>
            Kannad<span className="text-saffron-500">iga</span>
          </span>
        </NavLink>
        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={linkClasses}>
            Lessons
          </NavLink>
          <NavLink to="/progress" className={linkClasses}>
            Progress
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
