import { useEffect } from 'react'
import { Mic, BookOpen, Megaphone } from 'lucide-react'
import styles from './Services.module.css'

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

// Page title and meta description, built from Ava's eyebrow and headline.
// Restored on unmount so other pages keep the defaults from index.html.
function usePageMeta(title, description) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]')
    const prevTitle = document.title
    const prevDescription = meta?.getAttribute('content')
    document.title = title
    meta?.setAttribute('content', description)
    return () => {
      document.title = prevTitle
      if (prevDescription != null) meta.setAttribute('content', prevDescription)
    }
  }, [title, description])
}

export default function Services() {
  usePageMeta(
    'Our services — Our Youth 4 The Climate',
    'Climate education, built by young people. Built with you.',
  )

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Our services</span>
          <h1>Climate education, built by young people. Built with you.</h1>
          <p className={styles.heroSub}>
            Our Youth 4 Climate is a youth-led organisation transforming climate change education across the world. We partner with organisations to build resources, share opportunities and lead conversations that reach the next generation. Every partnership equips young people for the crisis they’re inheriting.
          </p>
        </div>
      </section>

      {/* WORK WITH US */}
      <section className={styles.work}>
        <div className={styles.workInner}>
          <h2 className="section-title">Work with Us</h2>
          <ul className={styles.cards}>
            {SERVICES.map(({ icon: Icon, title, body }) => (
              <li key={title} className={styles.card}>
                <span className={styles.cardIcon}>
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardBody}>{body}</p>
                <a
                  href={CONTACT_HREF}
                  className={styles.cardLink}
                  aria-label={`Get in touch about ${title}`}
                >
                  Get in touch →
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* REACH OUT */}
      <section className={styles.reach}>
        <h2 className="section-title">Have something in mind?</h2>
        <p className={styles.reachText}>Tell us what you’re working on. We’ll shape it with you.</p>
        <a href={CONTACT_HREF} className="btn-pill btn-pill-primary">
          Reach out
        </a>
      </section>
    </>
  )
}
