import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useFavourites } from '../../context/FavouritesContext'
import styles from './Profile.module.css'

export default function Profile() {
  const { user, logout } = useAuth()
  const { favourites } = useFavourites()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  const initial = user?.displayName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.avatar}>{initial}</div>

        <h1 className={styles.name}>{user?.displayName ?? 'User'}</h1>
        <p className={styles.email}>{user?.email}</p>
        <p className={styles.count}>{favourites.length} favourites saved</p>

        <button className={styles.logout} onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </main>
  )
}
