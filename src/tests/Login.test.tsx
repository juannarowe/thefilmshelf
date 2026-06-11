import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Login from '../pages/Login/Login'

// Mock useAuth and useNavigate — we don't want real Firebase calls in tests.
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    user: null,
    loading: false,
  }),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => vi.fn() }
})

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
}

describe('Login page', () => {
  it('shows the sign-in form by default', () => {
    renderLogin()
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
    // The "Your name" field only appears in register mode
    expect(screen.queryByPlaceholderText('Your name')).not.toBeInTheDocument()
  })

  it('shows the registration form after clicking the toggle button', async () => {
    renderLogin()

    const toggle = screen.getByText(/Don't have an account/i)
    await userEvent.click(toggle)

    expect(screen.getByRole('heading', { name: 'Create account' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument()
  })

  it('switches back to sign-in when the toggle is clicked a second time', async () => {
    renderLogin()

    const toggle = screen.getByText(/Don't have an account/i)
    await userEvent.click(toggle)
    await userEvent.click(screen.getByText(/Already have an account/i))

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('has an email and password input', () => {
    renderLogin()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
  })
})
