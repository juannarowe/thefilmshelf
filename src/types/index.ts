// Movie returned by trending and search endpoints
export interface Movie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
  overview: string
  genre_ids: number[]
}

export interface Genre {
  id: number
  name: string
}

// Full movie details (Epic 2)
export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export interface CrewMember {
  id: number
  name: string
  job: string
  profile_path: string | null
}

export interface Credits {
  cast: CastMember[]
  crew: CrewMember[]
}

export interface Video {
  key: string
  site: string
  type: string
}

export interface Videos {
  results: Video[]
}

export interface MovieDetail extends Movie {
  genres: Genre[]
  runtime: number
  credits: Credits
  videos: Videos
}

// Person detail (Epic 2)
export interface Person {
  id: number
  name: string
  profile_path: string | null
  biography: string
  birthday: string | null
  place_of_birth: string | null
  known_for_department: string
  combined_credits: { cast: Movie[] }
}

// Favourite stored in Firestore (Epic 4)
export interface FavouriteItem {
  movieId: number
  title: string
  poster_path: string | null
  userRating: number
  addedAt: string
}
