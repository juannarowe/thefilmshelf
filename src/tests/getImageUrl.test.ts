import { describe, it, expect } from 'vitest'
import { getImageUrl } from '../services/tmdb'

// Unit tests for getImageUrl — a pure function, no network calls needed.

describe('getImageUrl', () => {
  it('returns the placeholder when path is null', () => {
    const result = getImageUrl(null)
    expect(result).toBe('/placeholder.png')
  })

  it('builds the correct TMDB image URL with the default size', () => {
    const result = getImageUrl('/abc123.jpg')
    expect(result).toBe('https://image.tmdb.org/t/p/w500/abc123.jpg')
  })

  it('uses the size passed as the second argument', () => {
    const result = getImageUrl('/abc123.jpg', 'w185')
    expect(result).toBe('https://image.tmdb.org/t/p/w185/abc123.jpg')
  })
})
