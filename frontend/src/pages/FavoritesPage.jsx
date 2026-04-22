import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getJson } from '../lib/api'

export default function FavoritesPage() {
  const { token, userId } = useAuth()
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    if (!token || !userId) return
    void (async () => {
      try {
        const data = await getJson(`/api/favorites/${userId}`, { token })
        setFavorites(data.favorites ?? [])
      } catch {
        setFavorites([])
      }
    })()
  }, [token, userId])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Favorites</h2>
      <div className="space-y-2">
        {favorites.length === 0 ? (
          <p className="text-sm text-neutral-500">No favorites yet.</p>
        ) : (
          favorites.map((f) => (
            <div key={f.questionId} className="rounded-xl border border-white/10 bg-neutral-950/60 px-4 py-3">
              <p className="text-sm text-neutral-200">{f.questionId}</p>
              <p className="mt-1 text-xs text-neutral-500">{f.categoryId}</p>
              <Link to={`/${f.categoryId || 'dsa'}`} className="mt-2 inline-block text-xs text-indigo-300 hover:text-indigo-200">
                Open module
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
