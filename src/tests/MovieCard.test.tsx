import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import MovieCard from '../components/MovieCard/MovieCard'
import type { Movie } from '../types'

// navigateMock must be defined at module scope so the vi.mock factory can reference it.
// vi.mock calls are hoisted to the top of the file by Vitest, before any test runs.
const navigateMock = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => navigateMock }
})

const fakeMovie: Movie = {
  id: 42,
  title: 'Interstellar',
  poster_path: '/poster.jpg',
  release_date: '2014-11-07',
  vote_average: 8.6,
  overview: 'A team of explorers...',
  genre_ids: [12, 18],
}

function renderCard() {
  return render(
    <MemoryRouter>
      <MovieCard movie={fakeMovie} />
    </MemoryRouter>
  )
}

describe('MovieCard', () => {
  beforeEach(() => navigateMock.mockClear())

  it('displays the movie title', () => {
    renderCard()
    expect(screen.getByText('Interstellar')).toBeInTheDocument()
  })

  it('displays the release year extracted from the date', () => {
    renderCard()
    expect(screen.getByText('2014')).toBeInTheDocument()
  })

  it('renders the poster image with the correct alt text', () => {
    renderCard()
    const img = screen.getByRole('img', { name: 'Interstellar' })
    expect(img).toBeInTheDocument()
  })

  it('navigates to the film detail page when clicked', async () => {
    renderCard()
    await userEvent.click(screen.getByText('Interstellar'))
    expect(navigateMock).toHaveBeenCalledWith('/movie/42')
  })
})
