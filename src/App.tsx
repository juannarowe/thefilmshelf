import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Explore from './pages/Explore/Explore'
import MovieDetail from './pages/MovieDetail/MovieDetail'
import PersonDetail from './pages/PersonDetail/PersonDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/person/:id" element={<PersonDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
