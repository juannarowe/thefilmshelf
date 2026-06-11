import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Home from './pages/Home/Home'
import Explore from './pages/Explore/Explore'
import MovieDetail from './pages/MovieDetail/MovieDetail'
import PersonDetail from './pages/PersonDetail/PersonDetail'
import Login from './pages/Login/Login'
import Favourites from './pages/Favourites/Favourites'
import Profile from './pages/Profile/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/person/:id" element={<PersonDetail />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes (require sign-in) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
