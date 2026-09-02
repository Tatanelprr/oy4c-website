import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Camera, Link2, Music2 } from 'lucide-react'
import styles from './Header.module.css'

const NAV = [
  {
    label: 'About',
    children: [
      { label: 'Who Are We?', to: '/about' },
      { label: 'Meet the Team', to: '/team' },
      { label: 'Advisory Board', to: '/advisory-board' },
      { label: 'Partnerships', to: '/partnerships' },
    ],
  },
  {
    label: 'Programmes',
    children: [
      { label: 'OY4CCurriculum', to: '/curriculum' },
      { label: 'CCiC', to: '/ccic' },
      { label: 'Ambassador Programme', to: '/ambassador' },
    ],
  },
  { label: 'Partner with Us', to: '/partner' },
  { label: 'Impact', to: '/impact' },
  {
    label: 'Resources',
    children: [{ label: 'OY4C Blog', to: '/blog' }],
  },
  { label: 'Contact Us', to: '/contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className={styles.nav}>
	    <Link to="/" className={styles.logo}>
		  <img src="/logo.png" alt="Our Youth 4 The Climate" className={styles.logoImg} />
		  <span>Our Youth 4 The Climate</span>
		</Link>
        <ul className={styles.links}>
          {NAV.map((item) =>
            item.children ? (
              <li key={item.label} className={styles.dropdown}>
                <span className={styles.dropLabel}>{item.label}</span>
                <div className={styles.dropMenu}>
                  {item.children.map((c) => (
                    <Link key={c.to} to={c.to}>{c.label}</Link>
                  ))}
                </div>
              </li>
            ) : (
              <li key={item.label}>
                <NavLink to={item.to} className={({ isActive }) => isActive ? styles.active : ''}>
                  {item.label}
                </NavLink>
              </li>
            )
          )}
          <li>
            <a href="https://validaid.org/fundraiser/174" target="_blank" rel="noreferrer" className={styles.cta}>
              Donate →
            </a>
          </li>
        </ul>

        <button className={styles.burger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {NAV.map((item) =>
            item.children ? (
              <div key={item.label}>
                <p className={styles.mobileGroup}>{item.label}</p>
                {item.children.map((c) => (
                  <Link key={c.to} to={c.to} onClick={() => setMenuOpen(false)}>{c.label}</Link>
                ))}
              </div>
            ) : (
              <Link key={item.label} to={item.to} onClick={() => setMenuOpen(false)}>{item.label}</Link>
            )
          )}
          <div className={styles.mobileSocials}>
            <a href="https://www.instagram.com/ouryouth4theclimate/" target="_blank" rel="noreferrer"><Camera size={20} /></a>
            <a href="https://www.linkedin.com/company/our-youth-4-the-climate/" target="_blank" rel="noreferrer"><Link2 size={20} /></a>
            <a href="https://www.tiktok.com/@ouryouth4theclimate" target="_blank" rel="noreferrer"><Music2 size={20} /></a>
          </div>
        </div>
      )}
    </>
  )
}