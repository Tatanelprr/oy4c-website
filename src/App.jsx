import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
import Services from './pages/Services'
import LastPush from './pages/LastPush'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import TakeAction from './pages/TakeAction'
// Temporarily hidden per Ava's request — to be reworked in ~3 months. Keep the file.
// import AdvisoryBoard from './pages/AdvisoryBoard'
import Speaker from './pages/Speaker'
import Consultancy from './pages/Consultancy'
import Legal from './pages/Legal'
import Privacy from './pages/Privacy'
import Cookies from './pages/Cookies'
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
          <Route path="/services" element={<Services />} />
          <Route path="/ccic" element={<CCiC />} />
          <Route path="/ambassador" element={<Ambassador />} />
          <Route path="/last-push" element={<LastPush />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/partnerships" element={<Partnerships />} />
          {/* Legacy route — /partner was merged into /partnerships */}
          <Route path="/partner" element={<Navigate to="/partnerships" replace />} />
          {/* Temporarily hidden per Ava's request — falls through to the 404 route below. */}
          {/* <Route path="/advisory-board" element={<AdvisoryBoard />} /> */}
          <Route path="/speaker" element={<Speaker />} />
          <Route path="/consultancy" element={<Consultancy />} />
          <Route path="/takeaction" element={<TakeAction />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
