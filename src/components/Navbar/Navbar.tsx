import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.brand}>
        The Film Shelf
      </NavLink>
      <div className={styles.links}>
        <NavLink to="/" end className={({ isActive }) => (isActive ? styles.active : styles.link)}>
          Home
        </NavLink>
        <NavLink to="/explore" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
          Explore
        </NavLink>
        {user ? (
          <>
            <NavLink to="/favourites" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
              Favourites
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
              Profile
            </NavLink>
          </>
        ) : (
          <NavLink to="/login" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
            Sign in
          </NavLink>
        )}
      </div>
    </nav>
  )
}
