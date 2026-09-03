import { useState, useEffect } from 'react'
import { feature } from 'topojson-client'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const W = 960
const H = 500

const COUNTRY_NAMES = new Map([
  [826, 'United Kingdom'],    [840, 'United States'],
  [124, 'Canada'],            [36,  'Australia'],
  [554, 'New Zealand'],       [250, 'France'],
  [276, 'Germany'],           [380, 'Italy'],
  [724, 'Spain'],             [528, 'Netherlands'],
  [56,  'Belgium'],           [756, 'Switzerland'],
  [752, 'Sweden'],            [578, 'Norway'],
  [208, 'Denmark'],           [616, 'Poland'],
  [620, 'Portugal'],          [300, 'Greece'],
  [40,  'Austria'],           [372, 'Ireland'],
  [710, 'South Africa'],      [566, 'Nigeria'],
  [288, 'Ghana'],             [404, 'Kenya'],
  [800, 'Uganda'],            [231, 'Ethiopia'],
  [120, 'Cameroon'],          [834, 'Tanzania'],
  [356, 'India'],             [586, 'Pakistan'],
  [50,  'Bangladesh'],        [608, 'Philippines'],
  [360, 'Indonesia'],         [702, 'Singapore'],
  [392, 'Japan'],             [410, 'South Korea'],
  [76,  'Brazil'],            [32,  'Argentina'],
  [170, 'Colombia'],          [484, 'Mexico'],
  [604, 'Peru'],              [504, 'Morocco'],
  [818, 'Egypt'],
])

function project([lon, lat]) {
  return [
    ((lon + 180) / 360) * W,
    ((90 - lat) / 180) * H,
  ]
}

function geometryToPath(geometry) {
  if (!geometry) return ''
  const polys = geometry.type === 'Polygon'
    ? geometry.coordinates
    : geometry.coordinates.flatMap((p) => p)
  return polys.map((ring) =>
    ring.map(([lon, lat], i) => {
      const [x, y] = project([lon, lat])
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    }).join('') + 'Z'
  ).join(' ')
}

export default function VolunteerMap() {
  const [countries, setCountries] = useState([])
  const [tooltip, setTooltip]     = useState(null)

  useEffect(() => {
    fetch(GEO_URL)
      .then((r) => r.json())
      .then((topo) => {
        const { features } = feature(topo, topo.objects.countries)
        setCountries(features)
      })
      .catch(() => {})
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {tooltip && (
        <div style={{
          position:      'fixed',
          top:           tooltip.y - 12,
          left:          tooltip.x,
          background:    'var(--dark)',
          color:         'var(--white)',
          padding:       '4px 10px',
          borderRadius:  '6px',
          fontSize:      '0.72rem',
          fontWeight:    600,
          pointerEvents: 'none',
          transform:     'translate(-50%, -100%)',
          whiteSpace:    'nowrap',
          zIndex:        1000,
          letterSpacing: '0.02em',
        }}>
          {tooltip.name}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {countries.map((geo) => {
          const id     = Number(geo.id)
          const name   = COUNTRY_NAMES.get(id)
          const active = Boolean(name)
          return (
            <path
              key={geo.id}
              d={geometryToPath(geo.geometry)}
              fill={active ? '#4db748' : '#d6e8d5'}
              stroke="#ffffff"
              strokeWidth={0.5}
              style={{ cursor: active ? 'pointer' : 'default' }}
              onMouseEnter={active ? (e) => setTooltip({ name, x: e.clientX, y: e.clientY }) : undefined}
              onMouseMove={active  ? (e) => setTooltip({ name, x: e.clientX, y: e.clientY }) : undefined}
              onMouseLeave={active ? () => setTooltip(null) : undefined}
            />
          )
        })}
      </svg>
    </div>
  )
}
