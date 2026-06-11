import { useNavigate } from 'react-router-dom'
import type { Movie } from '../../types'
import { getImageUrl } from '../../services/tmdb'
import styles from './MovieCard.module.css'

interface Props {
  movie: Movie
}

export default function MovieCard({ movie }: Props) {
  const navigate = useNavigate()
  const year = movie.release_date?.split('-')[0] ?? '—'

  return (
    <div className={styles.card} onClick={() => navigate(`/movie/${movie.id}`)}>
      <img
        src={getImageUrl(movie.poster_path)}
        alt={movie.title}
        className={styles.poster}
      />
      <div className={styles.info}>
        <p className={styles.title}>{movie.title}</p>
        <p className={styles.year}>{year}</p>
      </div>
    </div>
  )
}
