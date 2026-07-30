import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Team from './pages/Team'
import CCiC from './pages/CCiC'
import Ambassador from './pages/Ambassador'
import Contact from './pages/Contact'
import Impact from './pages/Impact'
import Partnerships from './pages/Partnerships'
import Curriculum from './pages/Curriculum'
import LastPush from './pages/LastPush'
import Blog from './pages/Blog'
import TakeAction from './pages/TakeAction'
import AdvisoryBoard from './pages/AdvisoryBoard'
import Speaker from './pages/Speaker'
import Consultancy from './pages/Consultancy'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/curriculum" element={<Curriculum />} />
          <Route path="/ccic" element={<CCiC />} />
          <Route path="/ambassador" element={<Ambassador />} />
          <Route path="/last-push" element={<LastPush />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/partnerships" element={<Partnerships />} />
          <Route path="/advisory-board" element={<AdvisoryBoard />} />
          <Route path="/speaker" element={<Speaker />} />
          <Route path="/consultancy" element={<Consultancy />} />
          <Route path="/takeaction" element={<TakeAction />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
