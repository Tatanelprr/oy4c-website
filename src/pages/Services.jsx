import { Mic, BookOpen, Megaphone } from 'lucide-react'
import styles from './Services.module.css'
import usePageMeta from '../lib/usePageMeta'
import { PAGE_META } from '../data/pageMeta'

// All visible copy below is Ava's final text, verbatim. Do not edit it here
// without her sign-off.

const CONTACT_HREF = 'mailto:hello@oy4c.org'

const SERVICES = [
  {
    icon: Mic,
    title: 'Speaking & Workshops',
    body: 'Keynotes, panels and workshops on youth-led climate education and action. For conferences, companies and teams who want to hear directly from the generation inheriting the crisis.',
  },
  {
    icon: BookOpen,
    title: 'Climate Change Education Resources',
    body: 'We co-develop climate education resources with your team, written and reviewed by young people. Or license our existing curriculum for your programme, platform or training.',
  },
  {
    icon: Megaphone,
    title: 'Sharing Opportunities',
    body: 'Reach young people who care about climate. We share your programmes, jobs, events and calls for applications with our global youth network of over 80k, across our channels.',
  },
]

export default function Services() {
  usePageMeta(PAGE_META['/services'])

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Our services</span>
          <h1>
            Climate education, built by young people.{' '}
            <span className={styles.heroAccent}>Built with you.</span>
          </h1>
        </div>
      </section>

      {/* INTRO */}
      <section className={styles.intro}>
        <p>
          Our Youth 4 The Climate is a youth-led organisation transforming climate change education across the world. We partner with organisations to build resources, share opportunities and lead conversations that reach the next generation. Every partnership equips young people for the crisis they’re inheriting.
        </p>
      </section>

      {/* WORK WITH US */}
      <section className={styles.work}>
        <div className={styles.workInner}>
          <h2 className="section-title">Work with Us - Our Services</h2>
          <ul className={styles.cards}>
            {SERVICES.map(({ icon: Icon, title, body }) => (
              <li key={title} className={styles.card}>
                <h3 className={styles.cardTitle}>
                  <span className={styles.cardIcon}>
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  {title}
                </h3>
                <p className={styles.cardBody}>{body}</p>
              </li>
            ))}
          </ul>
          <div className={styles.workCta}>
            <a href={CONTACT_HREF} className={styles.bigBtn}>
              Get in touch
            </a>
          </div>
        </div>
      </section>

      {/* REACH OUT */}
      <section className={styles.reach}>
        <h2 className="section-title">Have something in mind?</h2>
        <p className={styles.reachText}>Tell us what you’re working on. We’ll shape it with you.</p>
        <a href={CONTACT_HREF} className={styles.reachBtn}>
          Reach out
        </a>
      </section>
    </>
  )
}
