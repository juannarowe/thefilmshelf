import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
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
      </div>
    </nav>
  )
}
