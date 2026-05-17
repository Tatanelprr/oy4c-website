import ambassadors from '../data/ambassadors.json'
import styles from './Ambassador.module.css'

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
          src={`/ambassadors/${ambassador.photo}`}
          alt={ambassador.name}
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
        <div className={styles.ambassadorName}>{ambassador.name}</div>
        <div className={styles.ambassadorCountry}>{ambassador.country}</div>
        <div className={styles.ambassadorBio}>{ambassador.bio}</div>
      </div>
    </div>
  )
}

export default function Ambassador() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Leadership & advocacy</span>
          <h1>
            Ambassador<br />
            <em>Programme</em>
          </h1>
          <p className={styles.heroSub}>
            A 6-month leadership initiative bringing together young leaders committed to advancing climate literacy and advocacy within their communities.
          </p>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className={styles.overview}>
        <div className={styles.overviewInner}>
          <div className={styles.overviewText}>
            <span className="section-eyebrow">About the programme</span>
            <h2 className="section-title">More than a volunteer opportunity</h2>
            <p>
              In 2026, OY4C launched its first-ever Ambassador Program, bringing together young leaders committed to advancing climate literacy and advocacy within their communities.
            </p>
            <p>
              Designed as a 6-month leadership initiative, the program equips a global network of young leaders to advance climate education through advocacy, communication, and community action — while supporting OY4C's mission to make climate education more accessible worldwide.
            </p>
            <p>
              Throughout the program, ambassadors lead local and digital initiatives, participate in global advocacy campaigns, and develop independent social impact projects aligned with climate action.
            </p>
          </div>
          <div>
            <span className="section-eyebrow">What you'll do</span>
            <h2 className="section-title">Lead. Advocate. Impact.</h2>
            <p className="section-body">
              As an OY4C Ambassador, you'll lead local and digital climate initiatives, join global advocacy campaigns, and develop your own social impact project — all while connecting with a worldwide network of youth climate leaders.
            </p>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className={styles.metrics}>
        <p className={styles.metricsLabel}>2026 Cohort — by the numbers</p>
        <div className={styles.metricsGrid}>
          {[
            { num: '321', label: 'Applications received' },
            { num: '12', label: 'Ambassadors selected' },
            { num: '8', label: 'Countries represented' },
            { num: '4', label: 'Continents represented' },
          ].map((m) => (
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
            The Ambassador Program is designed for university-level youth who are passionate about climate education, community impact, and youth advocacy.
          </p>
          <p>
            OY4C Ambassadors come from diverse academic, cultural, and regional backgrounds, but share a common commitment to making climate knowledge more accessible and actionable within their communities.
          </p>
          <p>
            The program also contributes to OY4C's wider global network of youth-led climate education initiatives, creating opportunities for collaboration, advocacy, and community engagement across regions.
          </p>
        </div>
      </section>

      {/* AMBASSADORS */}
      <section className={styles.ambassadors}>
        <div className={styles.ambassadorsHead}>
          <span className="section-eyebrow">2026 Cohort</span>
          <h2 className="section-title">Meet our Ambassadors</h2>
        </div>
        <div className={styles.ambassadorsGrid}>
          {ambassadors.map((a) => (
            <AmbassadorCard key={a.name} ambassador={a} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Join the next cohort</h2>
        <p>
          Applications for the next OY4C Ambassador cohort will open soon. Follow our socials to be the first to know.
        </p>
        <a
          href="https://www.instagram.com/ouryouth4theclimate/"
          target="_blank"
          rel="noreferrer"
          className={styles.ctaBtn}
        >
          Follow us for updates →
        </a>
      </section>
    </>
  )
}