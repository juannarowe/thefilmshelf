import { useState, useEffect } from 'react'
import { getTrending } from '../../services/tmdb'
import type { Movie } from '../../types'
import MovieCard from '../../components/MovieCard/MovieCard'
import styles from './Home.module.css'

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getTrending()
        setMovies(data)
      } catch {
        setError('Could not load trending movies.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <p className={styles.message}>Loading...</p>
  if (error) return <p className={styles.message}>{error}</p>

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Trending This Week</h1>
      <div className={styles.grid}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </main>
  )
}
