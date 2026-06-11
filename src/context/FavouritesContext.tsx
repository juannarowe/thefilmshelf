import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDocs,
} from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from './AuthContext'
import type { FavouriteItem, Movie } from '../types'

interface FavouritesContextValue {
  favourites: FavouriteItem[]
  addFavourite: (movie: Movie) => Promise<void>
  removeFavourite: (movieId: number) => Promise<void>
  updateRating: (movieId: number, rating: number) => Promise<void>
  isFavourite: (movieId: number) => boolean
}

const FavouritesContext = createContext<FavouritesContextValue | null>(null)

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [favourites, setFavourites] = useState<FavouriteItem[]>([])

  // Load favourites from Firestore when user signs in
  useEffect(() => {
    if (!user) {
      setFavourites([])
      return
    }

    async function load() {
      const snapshot = await getDocs(collection(db, 'users', user!.uid, 'favourites'))
      const items = snapshot.docs.map((d) => d.data() as FavouriteItem)
      setFavourites(items)
    }

    load()
  }, [user])

  function isFavourite(movieId: number): boolean {
    return favourites.some((f) => f.movieId === movieId)
  }

  async function addFavourite(movie: Movie) {
    if (!user) return

    const item: FavouriteItem = {
      movieId: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      userRating: 0,
      addedAt: new Date().toISOString(),
    }

    await setDoc(doc(db, 'users', user.uid, 'favourites', String(movie.id)), item)
    setFavourites((prev) => [...prev, item])
  }

  async function removeFavourite(movieId: number) {
    if (!user) return

    await deleteDoc(doc(db, 'users', user.uid, 'favourites', String(movieId)))
    setFavourites((prev) => prev.filter((f) => f.movieId !== movieId))
  }

  async function updateRating(movieId: number, rating: number) {
    if (!user) return

    await updateDoc(doc(db, 'users', user.uid, 'favourites', String(movieId)), {
      userRating: rating,
    })
    setFavourites((prev) =>
      prev.map((f) => (f.movieId === movieId ? { ...f, userRating: rating } : f))
    )
  }

  return (
    <FavouritesContext.Provider value={{ favourites, addFavourite, removeFavourite, updateRating, isFavourite }}>
      {children}
    </FavouritesContext.Provider>
  )
}

export function useFavourites(): FavouritesContextValue {
  const context = useContext(FavouritesContext)
  if (!context) throw new Error('useFavourites must be used inside FavouritesProvider')
  return context
}
