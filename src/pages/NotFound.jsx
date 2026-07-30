import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.sub}>
          The page you're looking for doesn't exist or may have moved. Let's get you back on track.
        </p>
        <Link to="/" className={styles.ctaBtn}>Back to home →</Link>
      </div>
    </div>
  )
}
