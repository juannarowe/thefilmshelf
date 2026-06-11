import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPersonDetail, getImageUrl } from '../../services/tmdb'
import type { Person, Movie } from '../../types'
import MovieCard from '../../components/MovieCard/MovieCard'
import styles from './PersonDetail.module.css'

export default function PersonDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [person, setPerson] = useState<Person | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const numId = Number(id)
    if (!id || isNaN(numId)) {
      setError('Invalid person ID.')
      setLoading(false)
      return
    }

    async function load() {
      try {
        const data = await getPersonDetail(numId)
        setPerson(data)
      } catch {
        setError('Could not load person details.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  if (loading) return <p className={styles.message}>Loading...</p>

  if (error || !person) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error ?? 'Person not found.'}</p>
        <button className={styles.back} onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    )
  }

  const filmography: Movie[] = (person.combined_credits.cast ?? [])
    .filter((m) => m.poster_path)
    .slice(0, 20)

  function formatDate(date: string | null): string | null {
    if (!date) return null
    const [y, m, d] = date.split('-')
    return `${d}/${m}/${y}`
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <img
          src={getImageUrl(person.profile_path, 'w300')}
          alt={person.name}
          className={styles.photo}
        />

        <div className={styles.info}>
          <h1 className={styles.name}>{person.name}</h1>
          <p className={styles.department}>{person.known_for_department}</p>

          {(person.birthday || person.place_of_birth) && (
            <p className={styles.meta}>
              {person.birthday && `Born ${formatDate(person.birthday)}`}
              {person.place_of_birth && ` · ${person.place_of_birth}`}
            </p>
          )}

          {person.biography ? (
            <p className={styles.bio}>{person.biography}</p>
          ) : (
            <p className={styles.bio}>No biography available.</p>
          )}
        </div>
      </div>

      {filmography.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Filmography ({filmography.length} films)
          </h2>
          <div className={styles.grid}>
            {filmography.map((film) => (
              <MovieCard key={film.id} movie={film} />
            ))}
          </div>
        </section>
      )}

      <button className={styles.back} onClick={() => navigate(-1)}>
        ← Go back
      </button>
    </main>
  )
}
