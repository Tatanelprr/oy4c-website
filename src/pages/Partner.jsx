import { Globe, Heart, Users, Handshake } from 'lucide-react'
import styles from './Partnerships.module.css'

const PARTNERS = [
  {
    name: 'Feel Good Action',
    logo: '/partners/feel-good-action.webp',
    desc: 'An advocacy organization dedicated to using social networks and digital media to create collective action that protects communities and the planet. OY4C has partnered with FGA on youth voter registration campaigns and raising awareness about the intersection between voting and climate action.',
  },
  {
    name: 'Climate Cardinals',
    logo: '/partners/climate-cardinals.png',
    desc: 'Breaking language barriers in the climate movement so every community can take action. With over 19k volunteers across 145 countries, OY4C partners with Climate Cardinals to connect the OY4CCurriculum to their vast chapter network, 89% of which are in the Global South.',
  },
  {
    name: 'Force of Nature',
    logo: '/partners/force-of-nature.webp',
    desc: 'Helping young people translate climate anxiety into action, and enabling educators to support them in their journey.',
  },
  {
    name: 'Climate Majority Project',
    logo: '/partners/climate-majority-project.webp',
    desc: 'Based in the UK, the Climate Majority Project aims to catalyze the silent majority to take action in their communities, schools, and businesses. OY4C is proud to be an organizational partner for their Climate Courage Schools Campaign.',
  },
  {
    name: 'Climate Quilt',
    logo: '/partners/climate-quilt.png',
    desc: 'A global youth climate and art initiative empowering young people to make art around climate themes. OY4C partners with Climate Quilt to join a network of youth climate organizations and embed art into our climate action.',
  },
  {
    name: 'Energy for Refugees Amsterdam',
    logo: '/partners/energy-for-refugees.jpg',
    desc: 'A student-driven Dutch NGO committed to addressing energy poverty in refugee camps and communities worldwide. OY4C recently partnered with EfR to host a pub quiz fundraiser.',
  },
]

export default function Partner() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Work with us</span>
          <h1>
            Building a global<br />
            <em>coalition for change.</em>
          </h1>
          <p className={styles.heroSub}>
            OY4C partners with organisations that share our commitment to youth empowerment, climate change education, and systemic change. Together, we go further.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className={styles.intro}>
        <div className={styles.introInner}>
          <div className={styles.introText}>
            <span className="section-eyebrow">Why partner with OY4C?</span>
            <h2 className="section-title">Stronger together</h2>
            <p>
              Partnerships are at the heart of how OY4C scales its mission. We believe that closing the global climate change education gap requires collective action - and that means building bridges between youth organisations, schools, NGOs, and businesses that share our values.
            </p>
            <p>
              Whether you're looking to co-create educational content, reach a global youth audience, or amplify your climate initiatives, we'd love to explore how we can work together.
            </p>
            <a href="mailto:partnerships@oy4c.org" className="btn-pill btn-pill-primary" style={{ marginTop: 8 }}>
              Get in touch →
            </a>
          </div>
          <div className={styles.introValues}>
            {[
              { icon: <Globe size={20} />, text: 'Global reach across 43 countries' },
              { icon: <Users size={20} />, text: '133 passionate youth volunteers' },
              { icon: <Heart size={20} />, text: 'Mission-aligned, values-driven collaboration' },
              { icon: <Handshake size={20} />, text: 'Flexible partnership models' },
            ].map((v) => (
              <div key={v.text} className={styles.introValue}>
                <div className={styles.introValueIcon}>{v.icon}</div>
                <div className={styles.introValueText}>{v.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className={styles.partners}>
        <div className={styles.partnersInner}>
          <span className="section-eyebrow">Our partners</span>
          <h2 className="section-title">Organisations we work with</h2>
          <div className={styles.partnersGrid}>
            {PARTNERS.map((p) => (
              <div key={p.name} className={styles.partnerCard}>
                <div className={styles.partnerLogo}>
                  {p.logo ? (
                    <img src={p.logo} alt={p.name} />
                  ) : (
                    <div className={styles.partnerLogoPlaceholder}>{p.name}</div>
                  )}
                </div>
                <div className={styles.partnerName}>{p.name}</div>
                <div className={styles.partnerDesc}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Interested in partnering with OY4C?</h2>
        <p>
          We're always open to new collaborations. If your organisation shares our values, let's talk.
        </p>
        <div className={styles.ctaBtns}>
          <a href="mailto:partnerships@oy4c.org" className={styles.ctaBtn}>
            Get in touch →
          </a>
        </div>
      </section>
    </>
  )
}
