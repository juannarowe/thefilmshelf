import type { Movie, Genre, MovieDetail, Person } from '../types'

const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE = 'https://image.tmdb.org/t/p'

function getToken(): string {
  const token = import.meta.env.VITE_TMDB_API_KEY
  if (!token) throw new Error('VITE_TMDB_API_KEY is not set')
  return token
}

function headers(): HeadersInit {
  return {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  }
}

export function getImageUrl(path: string | null, size = 'w500'): string {
  if (!path) return '/placeholder.png'
  return `${IMAGE_BASE}/${size}${path}`
}

export async function getTrending(): Promise<Movie[]> {
  const res = await fetch(`${BASE_URL}/trending/movie/week?language=en-US`, { headers: headers() })
  if (!res.ok) throw new Error('Failed to fetch trending movies')
  const data = await res.json()
  return data.results as Movie[]
}

export async function getGenres(): Promise<Genre[]> {
  const res = await fetch(`${BASE_URL}/genre/movie/list?language=en-US`, { headers: headers() })
  if (!res.ok) throw new Error('Failed to fetch genres')
  const data = await res.json()
  return data.genres as Genre[]
}

export async function searchMovies(query: string, signal?: AbortSignal): Promise<Movie[]> {
  const url = `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=en-US`
  const res = await fetch(url, { headers: headers(), signal })
  if (!res.ok) throw new Error('Search failed')
  const data = await res.json()
  return data.results as Movie[]
}

export async function getMoviesByGenre(genreId: number, signal?: AbortSignal): Promise<Movie[]> {
  const url = `${BASE_URL}/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&language=en-US`
  const res = await fetch(url, { headers: headers(), signal })
  if (!res.ok) throw new Error('Failed to fetch movies by genre')
  const data = await res.json()
  return data.results as Movie[]
}

export async function getMovieDetail(id: number): Promise<MovieDetail> {
  const url = `${BASE_URL}/movie/${id}?append_to_response=credits,videos&language=en-US`
  const res = await fetch(url, { headers: headers() })
  if (!res.ok) throw new Error('Failed to fetch movie details')
  return (await res.json()) as MovieDetail
}

export async function getPersonDetail(id: number): Promise<Person> {
  const url = `${BASE_URL}/person/${id}?append_to_response=combined_credits&language=en-US`
  const res = await fetch(url, { headers: headers() })
  if (!res.ok) throw new Error('Failed to fetch person details')
  return (await res.json()) as Person
}
