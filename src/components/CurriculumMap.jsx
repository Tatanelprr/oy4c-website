import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { CURRICULUM_LOCATIONS } from '../data/curriculumLocations'
import styles from './CurriculumMap.module.css'

// Self-hosted (UK GDPR/PECR): the base map is served from our own domain, so no
// visitor IP is sent to any third party. Same file as VolunteerMap.
const GEO_URL = '/world-atlas-countries-110m.json'

const MAP_W = 800
const MAP_H = 420
// Pin size in screen pixels, kept constant whatever the map width.
const PIN_R = 5
// Pointer reach in screen pixels: mouse picks the nearest pin, a tap (finger)
// shows every pin in reach, so pins that overlap on small screens stay usable.
const MOUSE_REACH = 14
const TOUCH_REACH = 22

const CASE_STUDY_FIELDS = ['venue', 'date', 'taughtBy', 'topic', 'activity']

const LOCATIONS = CURRICULUM_LOCATIONS.filter((l) => !l.hidden)
const byId = Object.fromEntries(LOCATIONS.map((l) => [l.id, l]))

/**
 * World map of the places where the OY4CCurriculum has been taught.
 * Hover (desktop), tap (mobile) or keyboard focus on a pin opens its card:
 * the case study when there is one, otherwise only the place name.
 */
export default function CurriculumMap() {
  const wrapRef = useRef(null)
  const frameRef = useRef(null)
  const [unit, setUnit] = useState(1) // SVG units per screen pixel
  const [hover, setHover] = useState(null)
  const [tap, setTap] = useState(null)
  const [focus, setFocus] = useState(null)
  const active = hover ?? tap ?? focus

  useEffect(() => {
    const frame = frameRef.current
    const observer = new ResizeObserver(([entry]) => {
      setUnit(MAP_W / entry.contentRect.width)
      // positions are stale after a resize
      setHover(null)
      setTap(null)
    })
    observer.observe(frame)
    // a tap anywhere outside the map closes the tapped card
    const onDown = (evt) => {
      if (!frame.contains(evt.target)) setTap(null)
    }
    document.addEventListener('pointerdown', onDown)
    return () => {
      observer.disconnect()
      document.removeEventListener('pointerdown', onDown)
    }
  }, [])

  // Pin centres relative to the wrapper, in pixels.
  const pinPositions = () => {
    const wrap = wrapRef.current.getBoundingClientRect()
    return [...frameRef.current.querySelectorAll('[data-pin]')].map((el) => {
      const r = el.getBoundingClientRect()
      return {
        id: el.dataset.pin,
        x: r.left + r.width / 2 - wrap.left,
        y: r.top + r.height / 2 - wrap.top,
      }
    })
  }

  // Pins within `reach` px of the pointer, nearest first.
  const pinsNear = (evt, reach) => {
    const wrap = wrapRef.current.getBoundingClientRect()
    const px = evt.clientX - wrap.left
    const py = evt.clientY - wrap.top
    return pinPositions()
      .map((p) => ({ ...p, d: Math.hypot(p.x - px, p.y - py) }))
      .filter((p) => p.d <= reach)
      .sort((a, b) => a.d - b.d)
  }

  const open = (pins) => {
    if (!pins.length) return null
    return {
      ids: pins.map((p) => p.id),
      x: pins[0].x,
      y: pins[0].y,
      wrapW: wrapRef.current.getBoundingClientRect().width,
    }
  }

  const onPointerMove = (evt) => {
    if (evt.pointerType !== 'mouse') return
    setHover(open(pinsNear(evt, MOUSE_REACH).slice(0, 1)))
  }

  const onPointerUp = (evt) => {
    if (evt.pointerType === 'mouse') return
    setTap(open(pinsNear(evt, TOUCH_REACH)))
  }

  const onFocusPin = (id) => {
    const pin = pinPositions().find((p) => p.id === id)
    setFocus(open([pin]))
  }

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div
        className={styles.frame}
        ref={frameRef}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setHover(null)}
        onPointerUp={onPointerUp}
      >
        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{ scale: 158, center: [12, 6] }}
          width={MAP_W}
          height={MAP_H}
          style={{ width: '100%', height: 'auto', display: 'block' }}
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
                  tabIndex={-1}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#d6e8d5', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {LOCATIONS.map((loc) => {
            const isActive = active?.ids.includes(loc.id)
            return (
              <Marker
                key={loc.id}
                coordinates={[loc.lng, loc.lat]}
                className={styles.pin}
                tabIndex={0}
                role="button"
                aria-label={loc.label ?? loc.name}
                aria-expanded={!!isActive}
                aria-controls="curriculum-map-card"
                onFocus={() => onFocusPin(loc.id)}
                onBlur={() => setFocus(null)}
                onKeyDown={(evt) => {
                  if (evt.key === 'Escape') {
                    setFocus(null)
                    setTap(null)
                    evt.currentTarget.blur()
                  }
                }}
              >
                <circle
                  data-pin={loc.id}
                  r={(isActive ? PIN_R + 2 : PIN_R) * unit}
                  className={loc.caseStudy ? styles.dotCase : styles.dot}
                  strokeWidth={1.5 * unit}
                />
              </Marker>
            )
          })}
        </ComposableMap>
      </div>

      <div id="curriculum-map-card" aria-live="polite">
        {active && <MapCard {...active} />}
      </div>
    </div>
  )
}

function MapCard({ ids, x, y, wrapW }) {
  const below = y < 170
  return (
    <div
      className={`${styles.card} ${below ? styles.cardBelow : ''}`}
      style={{
        '--x': `${Math.min(Math.max(x, 140), wrapW - 140)}px`,
        '--y': `${below ? y + 16 : y - 16}px`,
      }}
    >
      {ids.map((id) => {
        const loc = byId[id]
        const { caseStudy } = loc
        return (
          <div key={id} className={styles.cardItem}>
            {caseStudy ? (
              <>
                <p className={styles.cardPlace}>{caseStudy.place}</p>
                {CASE_STUDY_FIELDS.filter((f) => caseStudy[f]).map((f) => (
                  <p key={f} className={styles.cardLine}>
                    {caseStudy[f]}
                  </p>
                ))}
                {caseStudy.quote && <p className={styles.cardQuote}>{caseStudy.quote}</p>}
              </>
            ) : (
              <p className={styles.cardPlace}>{loc.label ?? loc.name}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

MapCard.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.string).isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  wrapW: PropTypes.number.isRequired,
}
