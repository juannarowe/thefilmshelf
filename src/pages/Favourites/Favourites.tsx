import { useNavigate } from 'react-router-dom'
import { useFavourites } from '../../context/FavouritesContext'
import { getImageUrl } from '../../services/tmdb'
import styles from './Favourites.module.css'

export default function Favourites() {
  const { favourites, removeFavourite, updateRating } = useFavourites()
  const navigate = useNavigate()

  if (favourites.length === 0) {
    return (
      <main className={styles.page}>
        <h1 className={styles.heading}>My Favourites</h1>
        <p className={styles.empty}>
          You have no favourites yet. Browse films and click "Add to favourites".
        </p>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>My Favourites ({favourites.length})</h1>

      <ul className={styles.list}>
        {favourites.map((item) => (
          <li key={item.movieId} className={styles.item}>
            <img
              src={getImageUrl(item.poster_path, 'w92')}
              alt={item.title}
              className={styles.poster}
              onClick={() => navigate(`/movie/${item.movieId}`)}
            />

            <div className={styles.info}>
              <p
                className={styles.title}
                onClick={() => navigate(`/movie/${item.movieId}`)}
              >
                {item.title}
              </p>

              <div className={styles.ratingRow}>
                <label className={styles.ratingLabel}>
                  My rating: {item.userRating > 0 ? item.userRating : '—'} / 10
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={item.userRating || 1}
                  onChange={(e) => updateRating(item.movieId, Number(e.target.value))}
                  className={styles.slider}
                />
              </div>
            </div>

            <button
              className={styles.remove}
              onClick={() => removeFavourite(item.movieId)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
