import { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Users, Globe, BookOpen, Play } from 'lucide-react'
import styles from './About.module.css'
import usePageMeta from '../lib/usePageMeta'
import { PAGE_META } from '../data/pageMeta'

// Ava's copy, verbatim (Who Are We, Round 2). Do not edit wording.
const STORY = [
  'At 17, Ava Langridge heard about climate change everywhere. In the headlines. At the dinner table. Everywhere except the one place meant to prepare her for the future: her classroom. In August 2021, she started asking young people around the world about it. Different countries, different schools, same answer: no one was teaching us. That same year, in November 2021, UNESCO confirmed it. Almost half of national curricula didn’t mention climate change at all.',
  'The generation that caused this crisis was handing it over, without equipping the generation inheriting it.',
  'So Ava stopped waiting. She started teaching herself, and any young person willing to join the call. Within three months, 50 volunteers from around the world had joined. Not because they had a plan. Because they were desperate to do something. No one was going to build the education they needed, so they built it themselves. Researching, writing, testing, rewriting. In February 2024, they launched the OY4CCurriculum. This was climate change education built by young people, for young people. Free, for anyone, because we didn’t want other young people to be in the same position as us.',
  'Today, OY4C is 133 young people across 43 countries, running workshops from Oceania to Southeast Asia. All of it built without a single salary (yet).',
  'Most climate education asks young people for feedback. OY4C hands them the pen. The people living the gap know exactly what’s missing, and how to teach it to each other. OY4C has one goal. Climate change education for an entire generation, written by the generation inheriting it.',
]

const VALUES = [
  {
    title: 'YOUNG PEOPLE BUILD.',
    desc: 'All of OY4C, including our systems and resources, are written and tested by young people, and checked by scientists and teachers before it reaches a classroom. Climate change education built by the generation living through the crisis is more honest, more relevant, and harder to ignore.',
  },
  {
    title: 'PARTNER TO SCALE.',
    desc: 'We don’t work in silos. The climate crisis moves too fast for organisations with the same mission to compete, so we partner where it multiplies impact: reaching classrooms we couldn’t alone, while keeping young people’s authorship visible.',
  },
  {
    title: 'FREE FOR EVERY CLASSROOM.',
    desc: 'Our OY4CCurriculum is free for any school, educator or student, anywhere, forever, and we’re building diverse, sustainable funding to keep it that way. A student’s climate education shouldn’t depend on where they live or what their school can afford.',
  },
  {
    title: 'MOVE AT THE PACE OF THE CRISIS.',
    desc: 'We didn’t wait for national curricula to include high quality climate change education. We built a globally informed resource and tools to fill the gap now, and we update it as new science, classroom feedback and research emerge.',
  },
]

// TODO: set to the embed URL once Ava receives the video from Abiola. While
// empty, the video section is not rendered at all. Before setting it, add the
// video host to /privacy and /cookies (same treatment as Google Maps): the
// iframe only loads after a click, so nothing reaches the host before consent.
// For YouTube, use the youtube-nocookie.com embed domain.
const VIDEO_URL = ''

// Click-to-load facade, same approach as MapEmbed: no third-party request or
// cookie until the visitor chooses to play the video.
function VideoEmbed({ src, title }) {
  const [loaded, setLoaded] = useState(false)

  if (loaded) {
    return <iframe src={src} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
  }

  return (
    <button type="button" className={styles.videoPlaceholder} onClick={() => setLoaded(true)}>
      <Play size={40} aria-hidden="true" />
      <span className={styles.videoAction}>Click to load the video</span>
      <span className={styles.videoNotice}>
        Loading the video will connect you to the video host and may set cookies. See our{' '}
        <a href="/privacy" onClick={(e) => e.stopPropagation()}>Privacy Policy</a>.
      </span>
    </button>
  )
}

VideoEmbed.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default function About() {
  usePageMeta(PAGE_META['/about'])
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <h1>Who Are We</h1>
        </div>
      </section>

      {/* NUMBERS (same figures as the Home page metrics) */}
      <section className={styles.numbers} aria-label="OY4C in numbers">
        <div className={styles.numbersGrid}>
          {[
            { num: '133', label: 'Volunteers worldwide' },
            { num: '43', label: 'Countries represented' },
            { num: '10,000', label: 'Students reached' },
            { num: '80,000', label: 'Across social media' },
          ].map((n) => (
            <div key={n.label}>
              <div className={styles.numberNum}>{n.num}</div>
              <div className={styles.numberLbl}>{n.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className={styles.mission}>
        <div className={styles.missionInner}>
          <div className={styles.missionText}>
            <span className="section-eyebrow">Our mission</span>
            <h2 className="section-title">Education for Youth. By Youth. Together for the Climate.</h2>
            <p className={styles.missionName}>
              <strong>Our Youth 4 The Climate</strong>, also known as OY4C
            </p>
            <blockquote className={styles.missionStatement}>
              <p>
                To create widespread awareness and action towards a sustainable future, OY4C empowers the next generation with high-quality, accessible, youth-led climate change education.
              </p>
              <p>
                Through our OY4CCurriculum, programmes, and online community, we equip young people with the tools, knowledge and confidence to inherit and respond to the climate crisis.
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* VIDEO — hidden until VIDEO_URL is set */}
      {VIDEO_URL && (
        <section className={styles.video}>
          <div className={styles.videoInner}>
            <div className={styles.videoHead}>
              <span className="section-eyebrow">Watch our story</span>
              <h2 className="section-title">See OY4C in action</h2>
            </div>
            <div className={styles.videoWrapper}>
              <VideoEmbed src={VIDEO_URL} title="OY4C video" />
            </div>
          </div>
        </section>
      )}

      {/* STORY */}
      <section className={styles.story}>
        <div className={styles.storyInner}>
          <img
            src="/team/ava-langridge.webp"
            alt="Ava Langridge"
            className={styles.storyPhoto}
            width="640"
            height="817"
            loading="lazy"
          />
          <div className={styles.storyText}>
            <span className="section-eyebrow">Our story</span>
            <h2 className="section-title">How it All Started</h2>
            {STORY.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className={styles.values}>
        <div className={styles.valuesInner}>
          <h2 className={styles.valuesTitle}>Our Values</h2>
          <div className={styles.valuesGrid}>
            {VALUES.map((v) => (
              <div key={v.title} className={styles.valueCard}>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          {[
            { num: '500+', label: 'Volunteers worldwide' },
            { num: '43', label: 'Countries represented' },
            { num: '10k+', label: 'Students reached' },
            { num: '200+', label: 'Curricula integrated' },
          ].map((s) => (
            <div key={s.label} className={styles.stat}>
              <div className={styles.statNum}>{s.num}</div>
              <div className={styles.statLbl}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ONWARD NAV */}
      <section className={styles.onward}>
        <div className={styles.onwardHead}>
          <span className="section-eyebrow">Keep exploring</span>
          <h2 className="section-title">Learn more about OY4C</h2>
        </div>
        <div className={styles.onwardGrid}>
          {[
            { icon: <Users size={22} />, title: 'Meet Our People', desc: 'Meet the team closing the climate change education gap they inherited', to: '/team' },
            { icon: <BookOpen size={22} />, title: 'Our OY4CCurriculum', desc: 'Explore our climate change education modules for classrooms', to: '/curriculum' },
            { icon: <Globe size={22} />, title: 'Our Partners', desc: 'See the organisations we work with around the world', to: '/partnerships' },
          ].map((c) => (
            <Link key={c.title} to={c.to} className={styles.onwardCard}>
              <div className={styles.onwardIcon}>{c.icon}</div>
              <div className={styles.onwardTitle}>{c.title}</div>
              <div className={styles.onwardDesc}>{c.desc}</div>
              <span className={styles.onwardArrow}>Learn more →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}