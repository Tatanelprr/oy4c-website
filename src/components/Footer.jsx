import { Link } from 'react-router-dom'
import { Camera, Link2, Music2 } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>Our Youth 4 The Climate</Link>
          <p>A global youth-led organisation bringing climate education to classrooms worldwide.</p>
          <div className={styles.socials}>
            <a href="https://www.instagram.com/ouryouth4theclimate/" target="_blank" rel="noreferrer">
              <Camera size={14} /> Instagram
            </a>
            <a href="https://www.linkedin.com/company/our-youth-4-the-climate/" target="_blank" rel="noreferrer">
              <Link2 size={14} /> LinkedIn
            </a>
            <a href="https://www.tiktok.com/@ouryouth4theclimate" target="_blank" rel="noreferrer">
              <Music2 size={14} /> TikTok
            </a>
          </div>
        </div>

        <div className={styles.col}>
          <h4>About</h4>
          <ul>
            <li><Link to="/about">Who Are We?</Link></li>
            <li><Link to="/team">Meet the Team</Link></li>
            <li><Link to="/advisory-board">Advisory Board</Link></li>
            <li><Link to="/partnerships">Partnerships</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4>Programmes</h4>
          <ul>
            <li><Link to="/curriculum">OY4C Curriculum</Link></li>
            <li><Link to="/ccic">CCiC</Link></li>
            <li><Link to="/ambassador">Ambassador Programme</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:hello@oy4c.org">hello@oy4c.org</a></li>
            <li><Link to="/contact">Contact Us →</Link></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© 2025 Our Youth 4 The Climate. All rights reserved.</span>
        <span>oy4c.org</span>
      </div>
    </footer>
  )
}