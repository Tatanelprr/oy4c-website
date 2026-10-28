import { useState, useEffect } from 'react'
import { Link2, Loader, BookOpen, Users, Lightbulb, Megaphone, ChevronDown } from 'lucide-react'
import { InstagramIcon, LinkedinIcon, TiktokIcon } from '../components/SocialIcons'
import styles from './Ambassador.module.css'
import usePageMeta from '../lib/usePageMeta'
import { PAGE_META } from '../data/pageMeta'

// Texts below are the programme lead's wording, verbatim: do not edit.
const PILLARS = [
  { icon: BookOpen,  title: 'Learn',   text: 'Build climate knowledge and leadership skills' },
  { icon: Users,     title: 'Connect', text: 'Collaborate with a global network of young leaders’' },
  { icon: Lightbulb, title: 'Create',  text: 'Develop an independent social impact project' },
  { icon: Megaphone, title: 'Amplify', text: 'Share ideas, advocacy, and community impact' },
]

const NUMBERS = [
  { num: '600+', label: 'people reached across cohort projects' },
  { num: '7',    label: 'ambassadors selected' },
  { num: '6',    label: 'countries represented' },
  { num: '3',    label: 'continents reached' },
]

const CASES = [
  {
    num: '01',
    place: 'Gombe State, Nigeria',
    text: '15 young people, 100+ community members reached. Musa Muhammad Musa brought climate education into the community through clean-ups, plastic pollution awareness, and grassroots organising. His English and Hausa awareness campaigns reached 1,000+ people online.',
  },
  {
    num: '02',
    place: 'New York, USA',
    text: 'Renee Zhao organised an interactive policy simulation at an official UN High-Level Political Forum 2026 side event. Participants explored five Sustainable Development Goals, represented diverse stakeholder perspectives, and collaborated on practical policy solutions.',
  },
]

// Same links as the footer
const SOCIALS = [
  { href: 'https://www.instagram.com/ouryouth4theclimate/', label: 'Instagram', Icon: InstagramIcon },
  { href: 'https://www.linkedin.com/company/our-youth-4-the-climate/', label: 'LinkedIn', Icon: LinkedinIcon },
  { href: 'https://www.tiktok.com/@ouryouth4theclimate', label: 'TikTok', Icon: TiktokIcon },
]

const FAQ = [
  {
    q: 'Who can apply to the Ambassador Programme?',
    a: 'The programme is open to students aged 18-25 who are passionate about climate education, ready to commit consistently, and open to feedback.',
  },
  {
    q: 'What do ambassadors gain from participating?',
    a: 'Ambassadors develop practical skills in climate communication, digital campaigning, project management, and community engagement. They also gain hands-on experience leading a social impact project with structured feedback and opportunities to connect with youth leaders across regions',
  },
  {
    q: 'How much time do ambassadors need to commit?',
    a: 'The six-month programme requires an estimated 5-7 hours per week. Ambassadors participate in three core training sessions, monthly check-ins, bi-weekly feedback cycles, and outreach activities. The programme is remote-friendly, with possible on-ground engagement during active campaigns.',
  },
  {
    q: 'What support do ambassadors receive from OY4C?',
    a: 'Ambassadors received structured training in climate education, communication, and outreach. Alongside that, feedback cycles for project guidance and mentorship from experts are also available.',
  },
  {
    q: 'What happens after the programme ends?',
    a: 'Ambassadors complete an offboarding process and document their social impact project. Depending on their engagement and performance, ambassadors may also be considered for further involvement in OY4C.',
  },
]

function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function AmbassadorCard({ ambassador }) {
  return (
    <div className={styles.ambassadorCard}>
      {ambassador.photo ? (
        <img
          src={ambassador.photo}
          alt=""
          loading="lazy"
          className={styles.ambassadorPhoto}
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
      ) : null}
      <div
        className={styles.ambassadorPhotoPlaceholder}
        style={{ display: ambassador.photo ? 'none' : 'flex' }}
      >
        {getInitials(ambassador.name)}
      </div>
      <div className={styles.ambassadorBody}>
        <div className={styles.ambassadorHeader}>
          <div>
            <div className={styles.ambassadorName}>{ambassador.name}</div>
            <div className={styles.ambassadorCountry}>{ambassador.country}</div>
          </div>
          {ambassador.linkedin && (
            <a
              href={ambassador.linkedin}
              target="_blank"
              rel="noreferrer"
              className={styles.ambassadorLinkedin}
              aria-label={`${ambassador.name} on LinkedIn`}
            >
              <Link2 size={16} />
            </a>
          )}
        </div>
        <div className={styles.ambassadorBio}>{ambassador.bio}</div>
      </div>
    </div>
  )
}

export default function Ambassador() {
  usePageMeta(PAGE_META['/ambassador'])
  const [ambassadors, setAmbassadors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/ambassadors')
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(setAmbassadors)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <h1>OY4C Ambassadors</h1>
          <p className={styles.heroTagline}>Young People. Local Action. Global Impact</p>
          <p className={styles.heroSub}>
            A six-month leadership initiative supporting young people to turn climate knowledge into community action, advocacy, and lasting change
          </p>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className={styles.overview}>
        <div className={styles.overviewInner}>
          <div className={styles.overviewText}>
            <h2 className="section-title">What is the Ambassador Programme</h2>
            <p>
              OY4C’s Ambassador Programme brings together young leaders committed to making climate change education more accessible and actionable. The programme is built around a simple idea that climate action looks different everywhere.
            </p>
          </div>
          <div>
            <span className="section-eyebrow">What you'll do</span>
            <h2 className="section-title">Lead. Advocate. Impact.</h2>
            <p className="section-body">
              As an OY4C Ambassador, you'll lead local and digital climate initiatives, join global advocacy campaigns, and develop your own social impact project, all while connecting with a worldwide network of youth climate leaders.
            </p>
          </div>
        </div>
        <ul className={styles.pillars}>
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <li key={title} className={styles.pillar}>
              <span className={styles.pillarIcon}><Icon size={22} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* METRICS */}
      <section className={styles.metrics}>
        <h2 className={`section-title ${styles.metricsTitle}`}>OY4C Ambassadors By The Numbers</h2>
        <div className={styles.metricsGrid}>
          {NUMBERS.map((m) => (
            <div key={m.label} className={styles.metric}>
              <div className={styles.metricNum}>{m.num}</div>
              <div className={styles.metricLbl}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className={styles.whoFor}>
        <div className={styles.whoForInner}>
          <span className="section-eyebrow">Who it's for</span>
          <h2 className="section-title">Built for passionate young leaders</h2>
          <p>
            The Ambassador Program is designed for university-level youth who are passionate about climate change education, community impact, and youth advocacy.
          </p>
          <p>
            OY4C Ambassadors come from diverse academic, cultural, and regional backgrounds, but share a common commitment to making climate knowledge more accessible and actionable within their communities.
          </p>
          <p>
            The program also contributes to OY4C's wider global network of youth-led climate change education initiatives, creating opportunities for collaboration, advocacy, and community engagement across regions.
          </p>
        </div>
      </section>

      {/* AMBASSADORS */}
      <section className={styles.ambassadors}>
        <div className={styles.ambassadorsHead}>
          <span className="section-eyebrow">2026 Cohort</span>
          <h2 className="section-title">Meet the Ambassadors</h2>
        </div>

        {loading && (
          <div className={styles.loading}>
            <Loader size={28} className={styles.spinner} />
            <p>Loading ambassadors…</p>
          </div>
        )}

        {error && !loading && (
          <div className={styles.loadError}>
            <p>Could not load ambassador data. Please try again later.</p>
          </div>
        )}

        {!loading && !error && (
          <div className={styles.ambassadorsGrid}>
            {ambassadors.map((a) => (
              <AmbassadorCard key={a.name} ambassador={a} />
            ))}
          </div>
        )}
      </section>

      {/* IDEAS TO IMPACT */}
      <section className={styles.impact}>
        <div className={styles.impactInner}>
          <h2 className="section-title">From Ideas to Impact</h2>
          <p className={styles.impactIntro}>
            Every community faces different challenges. Our ambassadors respond in different ways, from grassroots environmental action to international policy dialogue.
          </p>
          <div className={styles.cases}>
            {CASES.map((c) => (
              <article key={c.num} className={styles.case}>
                <h3><span className={styles.caseNum}>{c.num}</span> | {c.place}</h3>
                <p>{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Your Community. Your Ideas. Your Impact</h2>
        <p>
          The next generation of OY4C Ambassadors will bring new perspectives, local knowledge, and ideas to make climate education more accessible
        </p>
        <p className={styles.ctaDate}>Applications for the next cohort opens June 2027</p>
        <p>Follow OY4C to hear about the next application cycle and opportunities to get involved</p>
        <ul className={styles.ctaSocials}>
          {SOCIALS.map(({ href, label, Icon }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noreferrer" aria-label={`OY4C on ${label}`}>
                <Icon size={20} />
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.ctaBtns}>
          <a
            href="https://www.linkedin.com/posts/our-youth-4-the-climate_meet-the-oy4c-ambassadors-our-first-activity-7460657900710092821-GOSV"
            target="_blank"
            rel="noreferrer"
            className={styles.ctaBtn}
          >
            Meet the cohort on LinkedIn →
          </a>
          <a
            href="mailto:community@oy4c.org"
            className={styles.ctaBtnOutline}
          >
            community@oy4c.org
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className={styles.faqInner}>
          <h2 className="section-title">FAQ</h2>
          {FAQ.map((f) => (
            <details key={f.q} className={styles.faqItem}>
              <summary className={styles.faqQ}>
                <h3>{f.q}</h3>
                <ChevronDown size={20} aria-hidden="true" className={styles.faqChevron} />
              </summary>
              <p className={styles.faqA}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
