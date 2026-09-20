import { useState } from 'react'
import PropTypes from 'prop-types'
import { MapPin } from 'lucide-react'
import styles from './MapEmbed.module.css'

/**
 * Consent-gated Google Maps embed (RGPD / PECR).
 *
 * The Google Maps iframe sets cookies and sends the visitor's IP to Google
 * (a US transfer) the moment it loads. Because that is a non-essential tracker,
 * it must not load before the user agrees. This "click to load" facade shows a
 * static placeholder and only injects the iframe once the visitor explicitly
 * clicks — so no data reaches Google until then, and no cookie banner is needed.
 */
export default function MapEmbed({ src, title }) {
  const [loaded, setLoaded] = useState(false)

  if (loaded) {
    return <iframe src={src} title={title} allowFullScreen loading="lazy" />
  }

  return (
    <button type="button" className={styles.placeholder} onClick={() => setLoaded(true)}>
      <MapPin size={32} aria-hidden="true" />
      <span className={styles.title}>{title}</span>
      <span className={styles.action}>Click to load the interactive Google map</span>
      <span className={styles.notice}>
        Loading the map will connect you to Google and may set cookies. See our{' '}
        <a href="/privacy" onClick={(e) => e.stopPropagation()}>Privacy Policy</a>.
      </span>
    </button>
  )
}

MapEmbed.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}
