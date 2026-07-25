import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <p className="text-5xl mb-4">🤷</p>
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <Link to="/" className="text-teal-600 hover:text-teal-700 underline">
        Back to lessons
      </Link>
    </div>
  )
}
