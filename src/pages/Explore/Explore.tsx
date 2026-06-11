import { useState, useEffect } from 'react'
import { getTrending, searchMovies, getMoviesByGenre, getGenres } from '../../services/tmdb'
import type { Movie, Genre } from '../../types'
import MovieCard from '../../components/MovieCard/MovieCard'
import styles from './Explore.module.css'

export default function Explore() {
  const [query, setQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [genres, setGenres] = useState<Genre[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)

  // Load genre list once on mount
  useEffect(() => {
    getGenres().then(setGenres).catch(() => {})
  }, [])

  // Load default trending on mount
  useEffect(() => {
    setLoading(true)
    getTrending()
      .then(setMovies)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Search or filter whenever query/genre changes (debounced 300ms)
  useEffect(() => {
    const controller = new AbortController()

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        if (query.trim()) {
          const results = await searchMovies(query.trim(), controller.signal)
          setMovies(results)
        } else if (selectedGenre) {
          const results = await getMoviesByGenre(Number(selectedGenre), controller.signal)
          setMovies(results)
        } else {
          const results = await getTrending()
          setMovies(results)
        }
      } catch {
        // Ignore abort errors
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query, selectedGenre])

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Explore Films</h1>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by title..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedGenre('')
          }}
          className={styles.input}
        />

        <select
          value={selectedGenre}
          onChange={(e) => {
            setSelectedGenre(e.target.value)
            setQuery('')
          }}
          className={styles.select}
        >
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g.id} value={String(g.id)}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className={styles.message}>Loading...</p>}

      {!loading && (
        <div className={styles.grid}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {!loading && movies.length === 0 && (
        <p className={styles.message}>No results found.</p>
      )}
    </main>
  )
}
