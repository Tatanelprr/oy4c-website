import { useState } from 'react'
import PropTypes from 'prop-types'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import styles from './CCiCLocationsMap.module.css'

// Self-hosted (RGPD/PECR): the base map is served from our own domain, so no
// visitor IP is sent to any third party. Same file used by VolunteerMap.
const GEO_URL = '/world-atlas-countries-110m.json'

// The 9 CCiC locations — [longitude, latitude]
const LOCATIONS = [
  { name: 'Canada',                coords: [-106.35, 56.13] },
  { name: 'Fiji',                  coords: [178.10, -17.80] },
  { name: 'Auckland, New Zealand', coords: [174.76, -36.85] },
  { name: 'Rotorua, New Zealand',  coords: [176.24, -38.14] },
  { name: 'Bali, Indonesia',       coords: [115.19, -8.41] },
  { name: 'Cebu, Philippines',     coords: [123.89, 10.32] },
  { name: 'Maiduguri, Nigeria',    coords: [13.15, 11.83] },
  { name: 'Pontianak, Indonesia',  coords: [109.34, -0.02] },
  { name: 'Bratislava, Slovakia',  coords: [17.11, 48.15] },
]

/**
 * Static SVG world map showing the 9 CCiC locations. Visible immediately with
 * no third-party request. The interactive Google map stays optional and is only
 * loaded on explicit click (consent-gated — no data reaches Google before then).
 */
export default function CCiCLocationsMap({ src, title }) {
  const [loaded, setLoaded] = useState(false)
  const [tooltip, setTooltip] = useState(null)

  if (loaded) {
    return (
      <div className={styles.frame}>
        <iframe src={src} title={title} allowFullScreen loading="lazy" />
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      {tooltip && (
        <div
          className={styles.tooltip}
          style={{ top: tooltip.y - 12, left: tooltip.x }}
        >
          {tooltip.name}
        </div>
      )}

      <div className={styles.frame}>
        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{ scale: 150, center: [40, 0] }}
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#d6e8d5"
                  stroke="#ffffff"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: 'none' },
                    hover:   { fill: '#d6e8d5', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {LOCATIONS.map((loc) => (
            <Marker
              key={loc.name}
              coordinates={loc.coords}
              onMouseEnter={(evt) =>
                setTooltip({ name: loc.name, x: evt.clientX, y: evt.clientY })
              }
              onMouseMove={(evt) =>
                setTooltip((prev) =>
                  prev ? { ...prev, x: evt.clientX, y: evt.clientY } : null
                )
              }
              onMouseLeave={() => setTooltip(null)}
              style={{ default: { cursor: 'pointer' } }}
            >
              <circle r={7} fill="#4db748" fillOpacity={0.25} />
              <circle r={3.4} fill="#4db748" stroke="#ffffff" strokeWidth={1.2} />
            </Marker>
          ))}
        </ComposableMap>
      </div>

      <ul className={styles.legend} aria-label="CCiC locations">
        {LOCATIONS.map((loc) => (
          <li key={loc.name} className={styles.legendItem}>
            <span className={styles.legendDot} aria-hidden="true" />
            {loc.name}
          </li>
        ))}
      </ul>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.loadBtn}
          onClick={() => setLoaded(true)}
        >
          Load the interactive Google map
        </button>
        <p className={styles.notice}>
          Loading the interactive map will connect you to Google and may set
          cookies. See our <a href="/privacy">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}

CCiCLocationsMap.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}
