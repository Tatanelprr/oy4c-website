import { useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// ISO 3166-1 numeric → display name for the 43 OY4C countries
const VOLUNTEER_COUNTRIES = new Map([
  ['826', 'United Kingdom'],
  ['840', 'United States'],
  ['124', 'Canada'],
  ['36',  'Australia'],
  ['554', 'New Zealand'],
  ['250', 'France'],
  ['276', 'Germany'],
  ['380', 'Italy'],
  ['724', 'Spain'],
  ['528', 'Netherlands'],
  ['56',  'Belgium'],
  ['756', 'Switzerland'],
  ['752', 'Sweden'],
  ['578', 'Norway'],
  ['208', 'Denmark'],
  ['616', 'Poland'],
  ['620', 'Portugal'],
  ['300', 'Greece'],
  ['40',  'Austria'],
  ['372', 'Ireland'],
  ['710', 'South Africa'],
  ['566', 'Nigeria'],
  ['288', 'Ghana'],
  ['404', 'Kenya'],
  ['800', 'Uganda'],
  ['231', 'Ethiopia'],
  ['120', 'Cameroon'],
  ['834', 'Tanzania'],
  ['356', 'India'],
  ['586', 'Pakistan'],
  ['50',  'Bangladesh'],
  ['608', 'Philippines'],
  ['360', 'Indonesia'],
  ['702', 'Singapore'],
  ['392', 'Japan'],
  ['410', 'South Korea'],
  ['76',  'Brazil'],
  ['32',  'Argentina'],
  ['170', 'Colombia'],
  ['484', 'Mexico'],
  ['604', 'Peru'],
  ['504', 'Morocco'],
  ['818', 'Egypt'],
])

export default function VolunteerMap() {
  const [tooltip, setTooltip] = useState(null)

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

      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 145, center: [10, 5] }}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const id       = String(geo.id)
              const name     = VOLUNTEER_COUNTRIES.get(id)
              const isActive = Boolean(name)

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isActive ? '#4db748' : '#d6e8d5'}
                  stroke="#ffffff"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: 'none' },
                    hover:   {
                      fill:    isActive ? '#3a9e38' : '#c8dcc7',
                      outline: 'none',
                      cursor:  isActive ? 'pointer' : 'default',
                    },
                    pressed: { outline: 'none' },
                  }}
                  onMouseEnter={(evt) => {
                    if (!isActive) return
                    setTooltip({ name, x: evt.clientX, y: evt.clientY })
                  }}
                  onMouseMove={(evt) => {
                    if (!isActive) return
                    setTooltip((prev) => prev ? { ...prev, x: evt.clientX, y: evt.clientY } : null)
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  )
}
