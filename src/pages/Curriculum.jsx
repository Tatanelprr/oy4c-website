import { BookOpen, GraduationCap, Gift, CheckCircle2 } from 'lucide-react'
import styles from './Curriculum.module.css'

// TODO: replace the provisional mailto below with the real curriculum-access link
// or application form once it exists.
const BRING_TO_SCHOOL_HREF = 'mailto:curriculum@oy4c.org'

const FACTS = [
  { icon: <BookOpen size={28} />, label: '13 topics' },
  { icon: <GraduationCap size={28} />, label: 'Ages 14-18' },
  { icon: <Gift size={28} />, label: 'Free' },
  { icon: <CheckCircle2 size={28} />, label: 'Ready to use' },
]

export default function Curriculum() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Programme</span>
          <h1>OY4CCurriculum</h1>
          <p className={styles.heroSub}>
            Climate change education built by young people, for young people
          </p>
          <div className={styles.heroBtns}>
            <a href={BRING_TO_SCHOOL_HREF} className={styles.btnPrimary}>
              Bring it to your school →
            </a>
            <a href="#intro" className={styles.btnOutline}>
              Learn more
            </a>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className={styles.intro} id="intro">
        <div className={styles.introInner}>
          <div className={styles.introText}>
            <p>
              The climate crisis is not a future threat. It is happening now. Young people have
              done the least to cause it, but they've inherited it, and they will lead many of the
              solutions our world urgently needs. To do that, they need knowledge, tools and the
              confidence to act.
            </p>
            <p>
              That's why we created the OY4CCurriculum, the first climate-focused curriculum built
              by young people for young people.
            </p>
          </div>
          <div className={styles.introBadge}>
            <img
              src="/curriculum-logo.png"
              alt="OY4CCurriculum logo: built by young people, for young people"
              className={styles.introLogo}
            />
          </div>
        </div>
      </section>

      {/* KEY FACTS */}
      <section className={styles.facts}>
        <div className={styles.factsInner}>
          {FACTS.map((f) => (
            <div key={f.label} className={styles.fact}>
              <div className={styles.factIcon}>{f.icon}</div>
              <div className={styles.factLabel}>{f.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT IT IS */}
      <section className={styles.what}>
        <div className={styles.whatInner}>
          <span className="section-eyebrow">The programme</span>
          <h2 className="section-title">What it is</h2>

          <p className={styles.lede}>
            The OY4CCurriculum is a free, ready-to-use climate change education programme that
            schools worldwide can bring straight into their classrooms. Across 13 topics, it covers
            two things:
          </p>

          <div className={styles.cards}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Foundational climate knowledge</h3>
              <p className={styles.cardBody}>
                the science of how our climate works, what is changing, and why.
              </p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>The social dimensions often left out</h3>
              <p className={styles.cardBody}>
                how the climate crisis connects to justice, equity, health, and communities, taught
                through a global, intersectional lens.
              </p>
            </div>
          </div>

          <p className={styles.connector}>
            Above all, the curriculum is action-oriented. Every topic comes with fully built-out
            resources, so teachers don't have to start from scratch, including:
          </p>

          <div className={styles.cards}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Activities to take action</h3>
              <p className={styles.cardBody}>
                practical steps that help students turn what they've learned into real impact.
              </p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Real-world inspiration</h3>
              <p className={styles.cardBody}>
                examples of youth leaders and initiatives already taking action around the world,
                showing students what's possible and that people their age are leading the way.
              </p>
            </div>
          </div>

          <p className={styles.closing}>
            Students don't just learn about the crisis. They build the habit of turning information
            into meaningful action, so learning empowers them rather than leading to eco-anxiety.
          </p>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className={styles.who}>
        <div className={styles.whoInner}>
          <span className="section-eyebrow">The audience</span>
          <h2 className="section-title">Who it's for</h2>
          <p>
            The curriculum is designed for students ages 14-18, the next generation of leaders, and
            for teachers and schools that want to provide meaningful climate change education but
            may not have the resources or time to build it from scratch.
          </p>
          <p>
            Whether a student goes on to an environmental career or brings sustainability into
            medicine, business, engineering, the arts or any other field, the OY4CCurriculum gives
            them a foundation to build on.
          </p>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className={styles.why}>
        <div className={styles.whyInner}>
          <span className="section-eyebrow">The case for it</span>
          <h2 className="section-title">Why it matters</h2>

          <p className={styles.whyLead}>
            Education is the first step towards change, but the system has been slow to keep up.
          </p>

          <div className={styles.statBlock}>
            <div className={styles.statNum}>53%</div>
            <p className={styles.statCaption}>
              According to UNESCO, only 53% of the world's national education curricula make any
              reference to climate change.<sup>1</sup>
            </p>
          </div>

          <p>
            Meanwhile, many young people learn more about the crisis from social media and real-life
            experience than in the classroom. Even where climate change education exists, it is
            often overwhelming and demotivating. It leaves students feeling burdened, not capable.
            Our team of young people, aged 14 to 24, has experienced this firsthand. We built the
            curriculum we wish we'd had.
          </p>
          <p>
            Our vision is to change the system from within: inspire young people to pursue
            environmental careers, bring environmentalism into whatever field they choose, and see
            themselves as agents of change who work with, not against, the natural world.
          </p>

          <p className={styles.sourceNote}>
            <sup>1</sup> UNESCO (2021),{' '}
            <a
              href="https://www.unesco.org/en/articles/only-half-national-curricula-world-have-reference-climate-change-unesco-warns"
              target="_blank"
              rel="noopener noreferrer"
            >
              Only half of the national curricula in the world have a reference to climate change,
              UNESCO warns
            </a>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <span className="section-eyebrow">Get involved</span>
        <h2 className="section-title">Bring the OY4CCurriculum to your school</h2>
        <div className={styles.ctaBtns}>
          {/* TODO: same provisional mailto — swap for the real access link/form when ready. */}
          <a href={BRING_TO_SCHOOL_HREF} className={styles.ctaBtn}>
            Bring it to your school →
          </a>
        </div>
        <p className={styles.ctaContact}>
          Questions? <a href="mailto:curriculum@oy4c.org">curriculum@oy4c.org</a>
        </p>
      </section>
    </>
  )
}
