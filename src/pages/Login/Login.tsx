import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Login.module.css'

function mapFirebaseError(code: string): string {
  const messages: Record<string, string> = {
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/weak-password': 'Password must be at least 6 characters.',
  }
  return messages[code] ?? 'An error occurred. Please try again.'
}

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { login, register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (isRegistering) {
        await register(email, password, name)
      } else {
        await login(email, password)
      }
      navigate('/')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      setError(mapFirebaseError(code))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          {isRegistering ? 'Create account' : 'Sign in'}
        </h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {isRegistering && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.input}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={submitting} className={styles.submit}>
            {submitting ? 'Please wait...' : isRegistering ? 'Register' : 'Sign in'}
          </button>
        </form>

        <button
          className={styles.toggle}
          onClick={() => {
            setIsRegistering(!isRegistering)
            setError('')
          }}
        >
          {isRegistering
            ? 'Already have an account? Sign in'
            : "Don't have an account? Register"}
        </button>
      </div>
    </main>
  )
}
