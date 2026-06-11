import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'

// Mock useAuth so we can control what user is "logged in" in each test.
// We don't want real Firebase calls during testing.
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../context/AuthContext'

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  )
}

describe('Navbar', () => {
  it('shows "Sign in" link when no user is logged in', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    })

    renderNavbar()

    expect(screen.getByText('Sign in')).toBeInTheDocument()
    expect(screen.queryByText('Favourites')).not.toBeInTheDocument()
    expect(screen.queryByText('Profile')).not.toBeInTheDocument()
  })

  it('shows Favourites and Profile links when a user is logged in', () => {
    vi.mocked(useAuth).mockReturnValue({
      // A minimal fake Firebase User object — only the fields Navbar uses
      user: { uid: '123', email: 'test@test.com' } as never,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    })

    renderNavbar()

    expect(screen.getByText('Favourites')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.queryByText('Sign in')).not.toBeInTheDocument()
  })

  it('always shows the Home and Explore links', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    })

    renderNavbar()

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Explore')).toBeInTheDocument()
  })
})
