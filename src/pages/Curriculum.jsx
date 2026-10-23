import {
  Users,
  Gift,
  CheckCircle2,
  BookOpen,
  ChevronDown,
  ClipboardList,
  Mail,
  Presentation,
  MessageCircle,
  LockOpen,
  Lock,
} from 'lucide-react'
import styles from './Curriculum.module.css'

// TODO: replace the provisional mailto below with the real curriculum-access link
// or application form once it exists.
const BRING_TO_SCHOOL_HREF = 'mailto:curriculum@oy4c.org'

// group: 'tier1' | 'gate' | 'tier2'; groupLabel shown on the first step of each group
const STEPS = [
  {
    icon: ClipboardList,
    short: 'Fill in the form',
    title: 'Fill in the access form',
    body: "Tell us a little about you and where you'll be teaching.",
    group: 'tier1',
    groupLabel: 'Tier 1',
  },
  {
    icon: Mail,
    short: 'Check your email',
    title: 'Check your email',
    body: "You'll get a link to all Tier 1 resources on Google Drive. Keep this email: it also has your private link to unlock Tier 2.",
    group: 'tier1',
  },
  {
    icon: Presentation,
    short: 'Teach',
    title: 'Teach Tier 1',
    body: 'Run the lessons with your learners and notice what works for them.',
    group: 'tier1',
  },
  {
    icon: MessageCircle,
    short: 'Share feedback',
    title: 'Tell us how it went',
    body: 'Use the feedback link from your Tier 1 email. Your answers help us improve the curriculum.',
    group: 'gate',
    groupLabel: 'Progress gate',
  },
  {
    icon: LockOpen,
    short: 'Unlock more topics',
    title: 'Unlock Tier 2',
    body: "Once you've sent your feedback, Tier 2 resources arrive in your inbox automatically.",
    group: 'tier2',
    groupLabel: 'Tier 2',
  },
]

const JOURNEY_GROUPS = ['tier1', 'gate', 'tier2'].map((g) => ({
  group: g,
  label: STEPS.find((s) => s.group === g).groupLabel,
  start: STEPS.findIndex((s) => s.group === g) + 1,
  steps: STEPS.filter((s) => s.group === g),
}))

const BUBBLES = [
  { icon: <Users size={28} aria-hidden="true" />, label: 'By youth, for youth' },
  { icon: <Gift size={28} aria-hidden="true" />, label: 'Free' },
  { icon: <CheckCircle2 size={28} aria-hidden="true" />, label: 'Ready to use, open-resource' },
  { icon: <BookOpen size={28} aria-hidden="true" />, label: '13 interdisciplinary topics' },
]

const WHAT_CARDS = [
  {
    title: 'Foundational climate change knowledge',
    body: 'The science of how our climate works, what is changing, and why.',
  },
  {
    title: 'Often neglected social dimensions',
    body: 'How the climate crisis connects to justice, equity, health, and communities, taught through a global, intersectional lens.',
  },
  {
    title: 'Action oriented',
    body: 'Teaches how to move knowledge into action, to mitigate eco-anxiety.',
  },
  {
    title: 'Empowerment',
    body: 'Youth examples, to show people already taking action.',
  },
  {
    title: 'No prior knowledge needed',
    body: 'No existing knowledge is needed, by teacher or student.',
  },
]

const FUTURE = [
  'Translate our resources',
  'Collect longer-term data on the impact of the OY4CCurriculum, on a student and their actions, and on systemic, larger-scale change',
  "Improve the interface we deliver our resources on. We're looking for technology and LMS co-development partners",
  'Given we are the intermediary resource, start partnering with institutions driving curriculum reform, to ensure youth-built and youth-led curriculum reform is integrated into the longer-term agenda',
]

const FAQ = [
  { q: 'Is it really free?', a: 'Yes, permanently. There is nothing to pay at any stage.' },
  {
    q: 'What are Tier 1 and Tier 2?',
    a: 'Tier 1 is available as soon as you sign up. Tier 2 resources are unlocked after you share your feedback on Tier 1.',
  },
  { q: 'What ages is it for?', a: 'Built for 14-18, used successfully with students from 12.' },
  {
    q: 'Do we need a specialist teacher?',
    a: 'No. No prior climate knowledge is needed, by teacher or student.',
  },
  {
    q: 'Does it align with our national curriculum?',
    a: "It's designed to sit alongside any curriculum, and maps to ESD for 2030. Teach one topic or all thirteen.",
  },
  { q: 'What if we only want one lesson?', a: "Fine. Take what's useful." },
  {
    q: 'Do you need to come into our school?',
    a: 'No. The OY4CCurriculum is entirely self-serve. CCiC workshops are separate and optional.',
  },
  { q: 'What data do you collect from students?', a: 'None.' },
  // TODO: remaining questions (time per topic, ownership and adaptation, translation,
  // use of the name and logo, support, feedback link) once Ava confirms the answers.
]

export default function Curriculum() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <h1>
            Ready-to-use climate change education open-resource, built by young people for young
            people
          </h1>
          <p className={styles.heroSub}>
            Free. 13 interdisciplinary topics. No prior knowledge needed. Already in classrooms in
            over 20 countries.
          </p>
          <div className={styles.heroBtns}>
            <a href={BRING_TO_SCHOOL_HREF} className={styles.btnPrimary}>
              Get the OY4CCurriculum
            </a>
            <a href="#what-it-is" className={styles.btnOutline}>
              See what's inside
            </a>
          </div>
          <p className={styles.trustLine}>
            free · ready to use · adaptable to any curriculum · written by 150 young people
          </p>
          {/* TODO: photo of the real modules (pages fanned out or in a grid) once Ava provides it. */}
        </div>
      </section>

      {/* JOURNEY (simple overview) */}
      <section className={styles.journey}>
        <div className={styles.journeyInner}>
          <h2 className="section-title">Your OY4CCurriculum Journey</h2>
          <div className={styles.journeyGroups}>
            {JOURNEY_GROUPS.map((g) => (
              <div key={g.group} className={`${styles.journeyGroup} ${styles[g.group]}`}>
                <p className={styles.journeyGroupLabel}>{g.label}</p>
                <ol start={g.start} className={styles.journeySteps}>
                  {g.steps.map(({ icon: Icon, short }) => (
                    <li key={short} className={styles.journeyStep}>
                      <span className={styles.journeyIcon}>
                        <Icon size={26} aria-hidden="true" />
                      </span>
                      {short}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO GET IT (detailed) */}
      <section className={styles.how} id="how-to-get-it">
        <div className={styles.howInner}>
          <span className={`section-eyebrow ${styles.howEyebrow}`}>How it works</span>
          <h2 className="section-title">From sign-up to Tier 2 in five steps</h2>
          <p className={styles.howSub}>
            Start teaching with Tier 1 straight away. When you've tried it with your learners, share
            your feedback to unlock Tier 2.
          </p>
          <ol className={styles.howSteps}>
            {STEPS.map(({ icon: Icon, title, body, group, groupLabel }, i) => (
              <li key={title} className={`${styles.howStep} ${styles[group]}`}>
                {/* empty tag keeps cards aligned in the desktop row */}
                <p className={styles.howTag} aria-hidden={!groupLabel}>
                  {groupLabel ?? ' '}
                </p>
                <div className={styles.howCard}>
                  <div className={styles.howCardTop}>
                    <span className={styles.howNum}>{String(i + 1).padStart(2, '0')}</span>
                    <Icon size={24} aria-hidden="true" className={styles.howIcon} />
                  </div>
                  <h3 className={styles.howTitle}>{title}</h3>
                  <p className={styles.howBody}>{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className={styles.howNote}>
            <Lock size={18} aria-hidden="true" />
            The Tier 2 link is only shared with teachers already using the curriculum.
          </p>
          <p className={styles.howContact}>
            Questions? {/* TODO: provisional address, confirm with Ava. */}
            <a href="mailto:curriculum@oy4c.org">curriculum@oy4c.org</a>
          </p>
          {/* TODO: replace with the real access-form link as soon as it is provided. */}
          <a href={BRING_TO_SCHOOL_HREF} className={styles.btnPrimary}>
            Fill in the access form
          </a>
        </div>
      </section>

      {/* BUBBLES */}
      <section className={styles.bubbles}>
        <ul className={styles.bubblesInner}>
          {BUBBLES.map((b) => (
            <li key={b.label} className={styles.bubble}>
              <span className={styles.bubbleIcon}>{b.icon}</span>
              <span className={styles.bubbleLabel}>{b.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* TODO (phase B): "What you get" (grid of the 13 topics, one full topic to browse,
          languages, module screenshots). */}

      {/* PROBLEM + STORY */}
      <section className={styles.story}>
        <div className={styles.storyInner}>
          <div className={styles.storyIntro}>
            <div className={styles.storyText}>
              <p>
                In 2021, our then 17-year-old Founder, Ava Langridge, noticed that climate change
                was spoken about everywhere except the place meant to equip us for the world we're
                inheriting: our classrooms.
              </p>
              <p>
                So she started teaching herself, and invited anyone to join. 5 students became 20,
                and then 50. Conversations with young people aged 14-18 across the world showed the
                gap was everywhere, not just in her classroom.
              </p>
              <p className={styles.storyStrong}>In 2021, UNESCO confirmed it.</p>
            </div>
            <div className={styles.storyBadge}>
              <img
                src="/curriculum-logo.png"
                alt="OY4CCurriculum logo: built by young people, for young people"
                className={styles.storyLogo}
              />
            </div>
          </div>

          <div className={styles.statBlock}>
            <div className={styles.statNum}>47%</div>
            <p className={styles.statCaption}>
              Almost half (47%) of the world's national education curricula don't make any
              reference to climate change. That says nothing about the quality of what does
              exist.<sup>1</sup>
            </p>
          </div>
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

          <div className={styles.storyText}>
            <p>
              So we built what was missing. 150 young people aged 12-24, from Costa Rica to Uganda
              to Trinidad, researched, wrote and reviewed the OY4CCurriculum. We beta-tested it
              with 20 students across 11 countries, had it reviewed by experts, and launched on 6
              February 2024. It's been reviewed and updated twice since.
            </p>
            <p className={styles.storyStrong}>
              We didn't wait for the system to respond. The crisis wasn't waiting either.
            </p>
          </div>

          <blockquote className={styles.quote}>
            <p>
              We understand the importance of global and national curriculum reform, and support it
              fully. But curriculum takes an extensive time to rebuild. We are the immediate
              response, to avoid losing whole generations.
            </p>
          </blockquote>
          {/* TODO: photo of past classes once Ava provides it. */}
        </div>
      </section>

      {/* WHAT IT IS */}
      <section className={styles.what} id="what-it-is">
        <div className={styles.whatInner}>
          <h2 className="section-title">What it is</h2>
          <div className={styles.cards}>
            {WHAT_CARDS.map((c) => (
              <div key={c.title} className={styles.card}>
                <h3 className={styles.cardTitle}>{c.title}</h3>
                <p className={styles.cardBody}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR AND WHY IT MATTERS */}
      <section className={styles.who}>
        <div className={styles.whoInner}>
          <h2 className="section-title">Who it's for and why it matters</h2>
          <p>
            Who's inheriting the climate crisis? Young people. But do we know how to respond? No,
            because we haven't been equipped. Being equipped means understanding the crisis and its
            complexities, and having a toolkit to begin responding.
          </p>
          <p>
            In 2050, who's going to be running the 2050 climate targets? Current young people.
          </p>
          <p className={styles.whoStrong}>Built for 14-18 year olds, the next generation of leaders.</p>
          <p>
            And for teachers and schools that want to provide meaningful climate change education,
            but don't have the resources, time or experience to build it from scratch.
          </p>
          <p>
            It's for everyone, regardless of a student's background. This crisis is systemic, so
            everyone in the system needs to be part of the response.
          </p>
          <p>
            Meanwhile, many young people learn more about the crisis from social media and real-life
            experience than in the classroom. Even where climate change education exists, it is
            often overwhelming and demotivating. It leaves students feeling burdened, not capable.
            Our team of young people, aged 12 to 24, has experienced this firsthand. We built the
            curriculum we wish we'd had.
          </p>
        </div>
      </section>

      {/* FUTURE */}
      <section className={styles.future}>
        <div className={styles.futureInner}>
          <h2 className="section-title">The future</h2>
          <ul className={styles.futureList}>
            {FUTURE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className={styles.futureContact}>
            If you want to support us and get involved in these, contact us:{' '}
            {/* TODO: provisional address, confirm with Ava. */}
            <a href="mailto:curriculum@oy4c.org">curriculum@oy4c.org</a>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className={styles.faqInner}>
          <h2 className="section-title">Frequently asked questions</h2>
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

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className="section-title">Bring the OY4CCurriculum to your classroom</h2>
        <div className={styles.ctaBtns}>
          {/* TODO: same provisional mailto, swap for the real access link/form when ready. */}
          <a href={BRING_TO_SCHOOL_HREF} className={styles.btnPrimary}>
            Get the OY4CCurriculum
          </a>
        </div>
        <p className={styles.ctaContact}>
          Questions? <a href="mailto:curriculum@oy4c.org">curriculum@oy4c.org</a>
        </p>
      </section>
    </>
  )
}
