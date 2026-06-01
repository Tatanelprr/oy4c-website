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

const ComingSoon = ({ page }) => (
  <div style={{ padding: '120px 5vw', textAlign: 'center' }}>
    <h1 style={{ fontWeight: 700, marginBottom: 16 }}>{page}</h1>
    <p style={{ color: 'var(--mid)' }}>Page en construction</p>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/curriculum" element={<ComingSoon page="OY4C Curriculum" />} />
          <Route path="/ccic" element={<CCiC />} />
          <Route path="/ambassador" element={<Ambassador />} />
          <Route path="/last-push" element={<ComingSoon page="The Last Push" />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/blog" element={<ComingSoon page="Blog" />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/partnerships" element={<ComingSoon page="Partnerships" />} />
          <Route path="*" element={<ComingSoon page="404 — Page introuvable" />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}