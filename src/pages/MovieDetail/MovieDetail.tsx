import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMovieDetail, getImageUrl } from '../../services/tmdb'
import type { MovieDetail as MovieDetailType } from '../../types'
import styles from './MovieDetail.module.css'

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [movie, setMovie] = useState<MovieDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const numId = Number(id)
    if (!id || isNaN(numId)) {
      setError('Invalid movie ID.')
      setLoading(false)
      return
    }

    async function load() {
      try {
        const data = await getMovieDetail(numId)
        setMovie(data)
      } catch {
        setError('Could not load movie details.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  if (loading) return <p className={styles.message}>Loading...</p>

  if (error || !movie) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error ?? 'Movie not found.'}</p>
        <button className={styles.back} onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    )
  }

  const director = movie.credits.crew.find((c) => c.job === 'Director')
  const cast = movie.credits.cast.slice(0, 10)
  const trailer = movie.videos.results.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  )
  const year = movie.release_date?.split('-')[0] ?? '—'
  const hours = Math.floor(movie.runtime / 60)
  const mins = movie.runtime % 60

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <img
          src={getImageUrl(movie.poster_path, 'w342')}
          alt={movie.title}
          className={styles.poster}
        />

        <div className={styles.info}>
          <h1 className={styles.title}>{movie.title}</h1>

          <p className={styles.meta}>
            {year}
            {movie.runtime > 0 && ` · ${hours}h ${mins}m`}
            {` · ★ ${movie.vote_average.toFixed(1)}`}
          </p>

          <div className={styles.genres}>
            {movie.genres.map((g) => (
              <span key={g.id} className={styles.genre}>
                {g.name}
              </span>
            ))}
          </div>

          {director && (
            <p className={styles.director}>
              Directed by{' '}
              <span
                className={styles.directorLink}
                onClick={() => navigate(`/person/${director.id}`)}
              >
                {director.name}
              </span>
            </p>
          )}

          <p className={styles.overview}>{movie.overview}</p>
        </div>
      </div>

      {cast.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Cast</h2>
          <div className={styles.castList}>
            {cast.map((member) => (
              <div
                key={member.id}
                className={styles.castMember}
                onClick={() => navigate(`/person/${member.id}`)}
              >
                <img
                  src={getImageUrl(member.profile_path, 'w185')}
                  alt={member.name}
                  className={styles.castPhoto}
                />
                <p className={styles.castName}>{member.name}</p>
                <p className={styles.castRole}>{member.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {trailer && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Trailer</h2>
          <div className={styles.trailerWrapper}>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Trailer"
              allowFullScreen
              className={styles.trailer}
            />
          </div>
        </section>
      )}

      {/* Recommended films grid — reuses MovieCard with similar movies */}
      <section className={styles.section}>
        <button className={styles.back} onClick={() => navigate(-1)}>
          ← Go back
        </button>
      </section>
    </main>
  )
}
