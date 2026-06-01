import { Mail, BookOpen, Users, DollarSign, Newspaper, Camera, Link2, Music2 } from 'lucide-react'
import styles from './Contact.module.css'

export default function Contact() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Get in touch</span>
          <h1>Contact Us</h1>
          <p className={styles.heroSub}>
            Have a question, a partnership idea, or want to bring OY4C to your school? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* CONTACTS */}
      <section className={styles.contacts}>
        <div className={styles.contactsInner}>
          <span className="section-eyebrow">Reach out</span>
          <h2 className="section-title">Who should I contact?</h2>
          <div className={styles.contactsGrid}>
            {[
              {
                icon: <Mail size={24} />,
                category: 'General',
                title: 'General Enquiries',
                desc: 'For any general questions about OY4C, our mission, or our work.',
                email: 'hello@oy4c.org',
              },
              {
                icon: <BookOpen size={24} />,
                category: 'Curriculum',
                title: 'Curriculum Questions',
                desc: 'Interested in integrating the OY4C Curriculum into your school or programme?',
                email: 'curriculum@oy4c.org',
              },
              {
                icon: <Users size={24} />,
                category: 'Volunteer',
                title: 'Volunteer Applications',
                desc: 'Want to join the OY4C team and become a youth climate educator?',
                email: 'recruitment@oy4c.org',
              },
              {
                icon: <DollarSign size={24} />,
                category: 'Funding',
                title: 'Funder Questions',
                desc: 'Interested in supporting OY4C\'s mission? Get in touch with our founder directly.',
                email: 'avalangridge@oy4c.org',
              },
              {
                icon: <Newspaper size={24} />,
                category: 'Press',
                title: 'Media & Press',
                desc: 'Press enquiries, interview requests, and media partnerships.',
                email: 'media@oy4c.org',
              },
            ].map((c) => (
              <div key={c.title} className={styles.contactCard}>
                <div className={styles.contactIcon}>{c.icon}</div>
                <div className={styles.contactCategory}>{c.category}</div>
                <div className={styles.contactTitle}>{c.title}</div>
                <div className={styles.contactDesc}>{c.desc}</div>
                <a href={`mailto:${c.email}`} className={styles.contactEmail}>
                  <Mail size={14} />
                  {c.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL */}
      <section className={styles.social}>
        <div className={styles.socialInner}>
          <span className="section-eyebrow">Follow us</span>
          <h2 className="section-title">Stay connected</h2>
          <p>
            Follow OY4C on social media for daily climate education content, updates on our programmes, and stories from our global community.
          </p>
          <div className={styles.socialLinks}>
            <a href="https://www.instagram.com/ouryouth4theclimate/" target="_blank" rel="noreferrer" className={styles.socialLink}>
              <Camera size={16} /> Instagram
            </a>
            <a href="https://www.linkedin.com/company/our-youth-4-the-climate/" target="_blank" rel="noreferrer" className={styles.socialLink}>
              <Link2 size={16} /> LinkedIn
            </a>
            <a href="https://www.tiktok.com/@ouryouth4theclimate" target="_blank" rel="noreferrer" className={styles.socialLink}>
              <Music2 size={16} /> TikTok
            </a>
          </div>
        </div>
      </section>
    </>
  )
}