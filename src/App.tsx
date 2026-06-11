import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Home from './pages/Home/Home'
import Explore from './pages/Explore/Explore'
import MovieDetail from './pages/MovieDetail/MovieDetail'
import PersonDetail from './pages/PersonDetail/PersonDetail'
import Login from './pages/Login/Login'

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
          <Route path="/favourites" element={<div>Favourites — coming in Epic 4</div>} />
          <Route path="/profile" element={<div>Profile — coming in Epic 4</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
