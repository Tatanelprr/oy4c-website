import { CASE_STUDY_2_QUOTE_TEXT } from './curriculumConfig'

// Places where the OY4CCurriculum has been taught (Ava, Round 2).
// `name` is Ava's text, unchanged. `label` is a shorter display name, only for
// the longest entries. Coordinates are city-level only; `approximate: true`
// marks places given as a region, a district or a village.
// TODO: coordinates to be validated.
//
// caseStudy fields, shown in this order and only when set:
// place, venue, date, taughtBy, topic, activity, quote.
// `hidden: true` keeps an entry in the file but off the map.
export const CURRICULUM_LOCATIONS = [
  { id: 'ma-usa', name: 'MA, United States', lat: 42.26, lng: -71.8, approximate: true },
  { id: 'lima', name: 'Lima, Peru', lat: -12.05, lng: -77.04 },
  { id: 'reading', name: 'Reading, UK', lat: 51.45, lng: -0.98 },
  { id: 'bratislava', name: 'Bratislava, Slovakia', lat: 48.15, lng: 17.11 },
  { id: 'mapou', name: 'Mapou, Mauritius', lat: -20.08, lng: 57.61 },
  { id: 'chicago', name: 'Chicago, IL, USA', lat: 41.88, lng: -87.63 },
  { id: 'michigan', name: 'Michigan area USA.', lat: 42.73, lng: -84.55, approximate: true },
  { id: 'paramaribo', name: 'Paramaribo, Suriname', lat: 5.85, lng: -55.2 },
  { id: 'berkeley', name: 'Berkeley, CA, USA', lat: 37.87, lng: -122.27 },
  {
    id: 'milano',
    name: 'Milano, Italy',
    lat: 45.46,
    lng: 9.19,
    // Hidden until Ava's shortened text is in curriculumConfig.js.
    caseStudy: CASE_STUDY_2_QUOTE_TEXT
      ? { place: 'Milan, Italy', venue: 'Istituto Leone XIII', quote: CASE_STUDY_2_QUOTE_TEXT }
      : null,
  },
  { id: 'durham', name: 'Durham, North Carolina, USA', lat: 35.99, lng: -78.9 },
  { id: 'madrid', name: 'Madrid. Spain', lat: 40.42, lng: -3.7 },
  { id: 'soledad', name: 'Soledad, California, USA', lat: 36.42, lng: -121.33 },
  { id: 'lewiston', name: 'Lewiston, Maine, USA', lat: 44.1, lng: -70.21 },
  {
    id: 'songo',
    name: 'Democratic Republic of the Congo, South-kivu Province, Uvira Territory, Songo district',
    label: 'Uvira, DR Congo',
    lat: -3.4,
    lng: 29.14,
    approximate: true,
  },
  // TODO: no country given by Ava; probably Colorado, USA, to be confirmed.
  { id: 'alamosa', name: 'Alamosa', lat: 37.47, lng: -105.87, approximate: true },
  { id: 'vienna', name: 'Vienna, Austria', lat: 48.21, lng: 16.37 },
  {
    id: 'maiduguri',
    name: '(Maiduguri) Borno State, Nigeria.',
    label: 'Maiduguri, Nigeria',
    lat: 11.85,
    lng: 13.16,
  },
  { id: 'elubo', name: 'Elubo, Western Region, Ghana', lat: 5.28, lng: -2.77 },
  { id: 'pain-court', name: 'Pain court, ontario, canada', lat: 42.4, lng: -82.3 },
  {
    id: 'olango',
    name: 'Barangay Tingo, Olango Island, Lapu-Lapu City, Cebu Province, Philippines',
    label: 'Olango Island, Philippines',
    lat: 10.26,
    lng: 124.05,
  },
  {
    id: 'thimphu',
    name: 'Thimphu, Bhutan',
    lat: 27.47,
    lng: 89.64,
    // Ava's case study 1, line by line. No date and no teacher given: not shown.
    caseStudy: {
      place: 'Bhutan',
      venue: 'At Changjiji Youth Centre',
      topic: 'Taught our Climate Education topic',
      activity: 'Celebrated Earth Hour for Youth for Environment',
      quote: '"We are the generation to change the world"',
    },
  },
  { id: 'saipan', name: 'Saipan, CNMI', lat: 15.18, lng: 145.75 },
  { id: 'queenstown', name: 'Queenstown, New Zealand', lat: -45.03, lng: 168.66 },
  {
    id: 'suraincha',
    name: 'Village and Post: Suraincha, Tehsil: Sidhauli, District: Sitapur, Uttar Pradesh - 261302 (INDIA)',
    label: 'Suraincha, India',
    lat: 27.28,
    lng: 80.83,
    approximate: true,
  },
  // Sasha: not sent the curriculum yet. Re-enable when the curriculum has been sent.
  { id: 'bronxville', name: 'Bronxville, New York, United States', lat: 40.94, lng: -73.83, hidden: true },
  { id: 'muscat', name: 'Muscat, Oman', lat: 23.59, lng: 58.38, hidden: true },
]
