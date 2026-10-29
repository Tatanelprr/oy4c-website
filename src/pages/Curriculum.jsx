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
  FileText,
  Languages,
  ListChecks,
} from 'lucide-react'
import CurriculumMap from '../components/CurriculumMap'
import {
  TIER_1_NAME,
  TIER_2_NAME,
  TIER1_ACCESS_URL,
  COUNTER,
  COUNTER_COMMUNITIES_LABEL,
  FAQ_TOPIC_DURATION_ANSWER,
  FAQ_FLEXIBILITY,
  FAQ_SASHA,
  TIER_FEEDBACK_WHY,
  TIERS,
  TIERS_NOTE,
} from '../data/curriculumConfig'
import styles from './Curriculum.module.css'
import usePageMeta from '../lib/usePageMeta'
import { PAGE_META } from '../data/pageMeta'

// All visible copy below is Ava's text (Round 2), verbatim, typos included
// (Sasha's text lives in curriculumConfig.js).
// Do not edit it without her sign-off. `**...**` marks her bold passages.

// The form opens in a new tab; provisional mailto while TIER1_ACCESS_URL is empty.
const ACCESS_LINK = TIER1_ACCESS_URL
  ? { href: TIER1_ACCESS_URL, target: '_blank', rel: 'noopener noreferrer' }
  : { href: 'mailto:curriculum@oy4c.org' }

// Same link as the header's Donate button.
const DONATE_HREF = 'https://validaid.org/fundraiser/174'

const CONTACT_EMAIL = 'curriculum@oy4c.org'
// Turns the contact address inside a text into a mailto link.
function withMailto(text) {
  return text.split(CONTACT_EMAIL).flatMap((part, i) =>
    i ? [<a key={i} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, part] : [part],
  )
}

const FOOD_PDF_HREF = '/curriculum/food-management.pdf'
// Computed at build time (vite.config.js); 0 hides the size.
const FOOD_PDF_BYTES = Number(import.meta.env.FOOD_PDF_BYTES) || 0

// Renders Ava's **bold** markup.
function rich(text) {
  return text.split('**').map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))
}

// group: 'tier1' | 'gate' | 'tier2'; groupLabel shown on the first step of each group
const STEPS = [
  {
    icon: ClipboardList,
    short: 'Fill in the form',
    title: 'Fill in the access form',
    body: "Tell us a little about you and where you'll be teaching.",
    group: 'tier1',
    groupLabel: TIER_1_NAME,
  },
  {
    icon: Mail,
    short: 'Check your email',
    title: 'Check your email',
    body: `You’ll get a link to all ${TIER_1_NAME} resources. Keep this email, as it also has your personal link to unlock ${TIER_2_NAME}`,
    group: 'tier1',
  },
  {
    icon: Presentation,
    short: 'Teach',
    title: `Teach ${TIER_1_NAME}`,
    body: 'Run the lessons with your learners and notice what works for them.',
    group: 'tier1',
  },
  {
    icon: MessageCircle,
    short: 'Share feedback',
    title: 'Tell us how it went',
    body: `Use the feedback link from your ${TIER_1_NAME} email. Your answers help us improve the curriculum.`,
    why: TIER_FEEDBACK_WHY,
    group: 'gate',
    groupLabel: 'Progress gate',
  },
  {
    icon: LockOpen,
    short: 'Unlock more topics',
    title: `Unlock ${TIER_2_NAME}`,
    body: `Once you've sent your feedback, ${TIER_2_NAME} resources arrive in your inbox automatically.`,
    group: 'tier2',
    groupLabel: TIER_2_NAME,
  },
]

const JOURNEY_GROUPS = ['tier1', 'gate', 'tier2'].map((g) => ({
  group: g,
  label: STEPS.find((s) => s.group === g).groupLabel,
  start: STEPS.findIndex((s) => s.group === g) + 1,
  steps: STEPS.filter((s) => s.group === g),
}))

const TOPICS = [
  'Climate Education',
  'Indigenous Peoples and Climate Change',
  'Environment Policy & Politics',
  'Eco-Anxiety',
  'Climate Justice',
  'Emissions',
  'Pollution',
  'Mitigation Strategies',
  'Plastic Waste',
  'Food Management',
  'Fashion Industry',
  'Nature Conservation',
  'The Ocean',
]

const TOPIC_CONTENTS = [
  'Complete Presentation (includes aims, youth climate activist examples, skills learned, job ideas in the field, resources)',
  'Fully-Written Topic Document (you don’t need any previous knowledge to teach)',
  'An Activity (to empower young people to turn knowledge into action)',
  'A Quiz and Answer Key',
]

const LANGUAGES = [
  'Currently only in English',
  'We aim to change this in the coming 12 months if funding provides',
]

const BUBBLES = [
  { icon: <Users size={28} aria-hidden="true" />, label: 'By Youth, For Youth' },
  { icon: <Gift size={28} aria-hidden="true" />, label: 'Free' },
  { icon: <CheckCircle2 size={28} aria-hidden="true" />, label: 'Ready-to-Use' },
  { icon: <BookOpen size={28} aria-hidden="true" />, label: '13 interdisciplinary topics' },
]

// Double spaces are Ava's; HTML collapses them on screen.
const STORY_INTRO = [
  'In 2021, our then 17-year-old Founder, Ava Langridge, noticed that climate change was  spoken about everywhere, except the place that should have been equipping us to  address the world we are inheriting',
  'In August of that year, after having conversations with young people, ages 14-18 across the world, and learning about the shared climate change education gap across the globe, systems, and scales (enabled through social media), Ava started teaching herself about anything she could, and would invite anyone to join',
  '5 students, quickly became 20, and by October 2021, UNESCO validated our ‘lived experience’ findings',
]
const STORY_STAT =
  'UNESCO: Almost half (47%) of national curricula worldwide don’t mention climate change. This doesn’t even account for the quality of what does exist'
const STORY_REST = [
  'With this new information, there was substantial increase in interest in changing this',
  'So our weekly classes became something more structured, and from May 2022 to February, 150 young people,  contributed to the development of our OY4CCurriculum',
  '150 young people: have contributed to creating the OY4CCurriculum through researching, writing, and reviewing. OY4CCurriculum contributors, aged 12-24, are located in Costa Rica, Australia, Trinidad, South Africa, United Kingdom, Brazil, Uganda, United States…etc. Our community has also contributed, through polls and conversations, by reinforcing our understanding of what education is lacking.',
]

const REFORM_NOTE =
  'Note: We understand the importance of global and national curriculum reform, and support it fully. However, given curriculum takes an extensive time to rebuild, we are the immediate response, to avoid losing whole generations.'

const WHAT_CARDS = [
  { title: 'Foundational climate change knowledge' },
  { title: 'Often neglected social dimensions' },
  { title: 'Action oriented', sub: 'teaches how to move knowledge into action, to mitigate eco-anxiety' },
  { title: 'Empowerment', sub: 'youth examples, to show people already taking action' },
  { title: 'No existing knowledge is needed' },
]

const WHO = [
  'Young people are inheriting the climate crisis. Almost none of us have been equipped to respond to it.',
  'Being equipped means two things: understanding the crisis and its complexities, and having a toolkit to actually do something about it. Most of us get neither. We learn more about the climate crisis from social media and from living through it than we ever do in a classroom. And where climate education does exist, it’s often overwhelming — it leaves students feeling burdened, not capable.',
  'That matters beyond the classroom. The people who’ll be running the 2050 climate targets are in school right now. Whether they arrive at that job equipped or barely informed is being decided today, by what we are and aren’t taught.',
  '**The OY4CCurriculum is built for:**',
  '**Students, 14–18.** The generation that will lead the response, taught the complexity and given the tools. The crisis should feel like something to act on, not something to carry.',
  '**Educators and schools.** Anyone who wants to teach climate change meaningfully but has no time, budget or specialist to build it from scratch. We’ve done that part. It’s free, and it’s ready.',
  '**Every classroom, not just the well-resourced ones.** This is a systemic crisis, so the response has to be systemic. That means every student, in every country, regardless of background, not only the schools that can afford to care.',
  'Our team is aged 12 to 24. We sat through the gap we’re describing. We built the curriculum we wish we’d had. Your students will be grateful they do.',
]

const WAY_FORWARD = [
  'Translate our resources to 5+ languages',
  'Collect longer-term data on the impact of the OY4CCurriculum, both on a student and their actions, and on systemic, larger-scale change',
  "Improve the interface we deliver our resources on. **We're looking for technology and LMS co-development partners**",
  'Given we are the intermediary resource, start partnering with institutions driving curriculum reform, to ensure youth-built and youth-led curriculum reform',
]

// Topic duration, flexibility and FAQ_SASHA entries: Sasha's text, see
// curriculumConfig.js. Conditional entries are dropped while empty.
const FAQ = [
  {
    q: 'Is it really free?',
    // Donation sentence added at the site team's request (not Ava's text).
    a: (
      <>
        Yes. There is nothing to pay at any stage. If you would like to support us, donations help
        us keep developing the OY4CCurriculum:{' '}
        <a href={DONATE_HREF} target="_blank" rel="noreferrer">
          Donate
        </a>
        .
      </>
    ),
  },
  { q: 'What ages is it for?', a: 'Built for 14–18, used successfully with students from 12 to 20.' },
  { q: 'Do we need a specialist educator?', a: 'No. No prior climate knowledge is needed, by educator or student.' },
  FAQ_FLEXIBILITY.question && FAQ_FLEXIBILITY.answer
    ? { q: FAQ_FLEXIBILITY.question, a: FAQ_FLEXIBILITY.answer }
    : null,
  FAQ_TOPIC_DURATION_ANSWER
    ? { q: 'How long does each topic take?', a: FAQ_TOPIC_DURATION_ANSWER }
    : null,
  ...FAQ_SASHA,
  {
    q: 'Do you need to come into our school?',
    a: 'No. The OY4CCurriculum is entirely self-serve. CCiC workshops are separate and optional.',
  },
  { q: 'What data do you collect from students?', a: 'None.' },
  {
    q: 'Can we use your name and logo?',
    a: 'Please email us at curriculum@oy4c.org requesting use of our logo and name, and to clarify usage rights.',
  },
  {
    q: 'How do we give feedback?',
    a: `You will receive a personalised link to submit feedback after requesting access to ${TIER_1_NAME}`,
  },
].filter(Boolean)

const COUNTER_READY = Object.values(COUNTER).every((v) => v != null)

export default function Curriculum() {
  usePageMeta(PAGE_META['/curriculum'])
  return (
    <>
      {/* 1. HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <h1>OY4CCurriculum</h1>
            <p className={styles.heroLead}>
              Ready-to-use climate change education open-resource, built by young people for young
              people
            </p>
            <div className={styles.heroBtns}>
              <a {...ACCESS_LINK} className={styles.btnPrimary}>
                Get the OY4CCurriculum
              </a>
              <a href="#what-you-get" className={styles.btnOutline}>
                See what's inside
              </a>
            </div>
          </div>
          <img
            src="/curriculum/modules-fan.webp"
            alt="Three slides from the OY4CCurriculum Topic 10: Food Management presentation"
            className={styles.heroFan}
            width="1340"
            height="920"
          />
        </div>
      </section>

      {/* 2. JOURNEY (simple overview) */}
      <section className={styles.journey}>
        <div className={styles.journeyInner}>
          <h2 className="section-title">Your OY4CCurriculum Journey</h2>
          <div className={styles.journeyGroups}>
            {JOURNEY_GROUPS.map((g) => (
              <div key={g.group} className={`${styles.journeyGroup} ${styles[g.group]}`}>
                <p className={styles.journeyGroupLabel}>{g.label}</p>
                <ol start={g.start} className={styles.journeySteps}>
                  {g.steps.map(({ icon: Icon, short }, i) => {
                    const content = (
                      <>
                        <span className={styles.journeyIcon}>
                          <Icon size={26} aria-hidden="true" />
                        </span>
                        {short}
                      </>
                    )
                    // the first step is the access button
                    return g.start + i === 1 ? (
                      <li key={short}>
                        <a {...ACCESS_LINK} className={`${styles.journeyStep} ${styles.journeyBtn}`}>
                          {content}
                        </a>
                      </li>
                    ) : (
                      <li key={short} className={styles.journeyStep}>
                        {content}
                      </li>
                    )
                  })}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHAT YOU GET */}
      <section className={styles.get} id="what-you-get">
        <div className={styles.getInner}>
          <h2 className="section-title">What You Get</h2>
          <div className={styles.getGrid}>
            <details className={styles.topics} open>
              <summary className={styles.topicsSummary}>
                <h3>All 13 topics</h3>
                <ChevronDown size={20} aria-hidden="true" className={styles.faqChevron} />
              </summary>
              <ol className={styles.topicsList}>
                {TOPICS.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ol>
            </details>

            <div className={styles.getSide}>
              <div className={styles.getBlock}>
                <h3 className={styles.getTitle}>
                  <FileText size={20} aria-hidden="true" />
                  One full topic viewable without registering
                </h3>
                <a
                  href={FOOD_PDF_HREF}
                  target="_blank"
                  rel="noopener"
                  className={styles.btnPrimary}
                >
                  View Topic 10: Food Management
                </a>
                {FOOD_PDF_BYTES > 0 && (
                  <p className={styles.fileSize}>
                    PDF, {(FOOD_PDF_BYTES / 1e6).toFixed(1)} MB
                  </p>
                )}
              </div>

              <div className={styles.getBlock}>
                <h3 className={styles.getTitle}>
                  <ListChecks size={20} aria-hidden="true" />
                  What's in each topic
                </h3>
                <ul className={styles.getList}>
                  {TOPIC_CONTENTS.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className={`${styles.getBlock} ${styles.langBlock}`}>
                <Languages size={20} aria-hidden="true" className={styles.langIcon} />
                <div>
                  {LANGUAGES.map((l) => (
                    <p key={l}>{l}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW TO GET IT (detailed) */}
      <section className={styles.how} id="how-to-get-it">
        <div className={styles.howInner}>
          <h2 className="section-title">How to get it</h2>
          <p className={styles.howLead}>From sign-up to {TIER_2_NAME} in five steps</p>
          <p className={styles.howSub}>
            Start teaching with {TIER_1_NAME} straight away. When you've tried it with your
            learners, share your feedback to unlock {TIER_2_NAME}.
          </p>
          <ol className={styles.howSteps}>
            {STEPS.map(({ icon: Icon, title, body, why, group, groupLabel }, i) => (
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
                  {why && <p className={styles.howBody}>{why}</p>}
                </div>
              </li>
            ))}
          </ol>
          <div className={styles.tiers}>
            {TIERS.map((t, i) => {
              const Icon = i ? Lock : LockOpen
              return (
                <div key={t.name} className={`${styles.tier} ${i ? styles.tier2 : styles.tier1}`}>
                  <h3 className={styles.tierHead}>
                    <Icon size={20} aria-hidden="true" />
                    {t.name} · {t.status}
                  </h3>
                  <ul className={styles.tierTopics}>
                    {t.topics.map((topic) => (
                      <li key={topic}>
                        <BookOpen size={16} aria-hidden="true" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
          <p className={styles.tiersNote}>{TIERS_NOTE}</p>
          <p className={styles.howNote}>
            <Lock size={18} aria-hidden="true" />
            The {TIER_2_NAME} link is only shared with teachers already using the curriculum.
          </p>
          <p className={styles.howContact}>
            Questions? {/* TODO: provisional address, confirm with Ava. */}
            <a href="mailto:curriculum@oy4c.org">curriculum@oy4c.org</a>
          </p>
          <div className={styles.howCta}>
            <a {...ACCESS_LINK} className={`${styles.btnPrimary} ${styles.btnLarge}`}>
              Get your OY4CCurriculum TODAY!
            </a>
          </div>
        </div>
      </section>

      {/* 5. BUBBLES */}
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

      {/* 6. OY4CCURRICULUM MAP */}
      <section className={styles.map}>
        <div className={styles.mapInner}>
          <h2 className="section-title">OY4CCurriculum Map</h2>
          {COUNTER_READY && (
            <p className={styles.counter}>
              {COUNTER.communities} {COUNTER_COMMUNITIES_LABEL} · {COUNTER.countries} countries · {COUNTER.students} students
            </p>
          )}
          <CurriculumMap />
        </div>
      </section>

      {/* 7. PROBLEM + STORY */}
      <section className={styles.story}>
        <div className={styles.storyInner}>
          <div className={styles.storyIntro}>
            <div className={styles.storyText}>
              {STORY_INTRO.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className={styles.storyBadge}>
              <img
                src="/curriculum-logo.png"
                alt="OY4CCurriculum logo: built by young people, for young people"
                className={styles.storyLogo}
                width="532"
                height="373"
                loading="lazy"
              />
            </div>
          </div>

          <p className={styles.statText}>
            <span>{STORY_STAT}</span>
            <sup>1</sup>
          </p>
          {/* Source note unchanged. TODO: Ava's text says "by October 2021", her
              answer says to keep November 2021 (UNESCO publication date). */}
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
            {STORY_REST.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CURRICULUM REFORM NOTE */}
      <section className={styles.reform}>
        <p className={styles.reformNote}>{REFORM_NOTE}</p>
      </section>

      {/* 9. WHAT IT IS */}
      <section className={styles.what} id="what-it-is">
        <div className={styles.whatInner}>
          <h2 className="section-title">What it is</h2>
          <div className={styles.cards}>
            {WHAT_CARDS.map((c) => (
              <div key={c.title} className={styles.card}>
                <h3 className={styles.cardTitle}>{c.title}</h3>
                {c.sub && <p className={styles.cardBody}>{c.sub}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. WHO'S IT FOR AND WHY IT MATTERS */}
      <section className={styles.who}>
        <div className={styles.whoInner}>
          <div className={styles.whoText}>
            <h2 className="section-title">Who’s it for and why it matters</h2>
            {WHO.map((p) => (
              <p key={p}>{rich(p)}</p>
            ))}
          </div>
          <div className={styles.whoPhotos}>
            <img
              src="/curriculum/who-1.webp"
              alt="Students standing in a large covered hall, in front of a screen showing a lesson activity"
              width="720"
              height="960"
              loading="lazy"
            />
            <img
              src="/curriculum/who-2.webp"
              alt="Students in a classroom, seen from behind, watching a lesson projected at the front"
              width="720"
              height="960"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 11. OUR WAY FORWARD */}
      <section className={styles.future}>
        <div className={styles.futureInner}>
          <h2 className="section-title">Our Way Forward</h2>
          <ul className={styles.futureList}>
            {WAY_FORWARD.map((item) => (
              <li key={item}>{rich(item)}</li>
            ))}
          </ul>
          <p className={styles.futureContact}>
            If you want to support us and get involved in these, contact us:{' '}
            <a href="mailto:curriculum@oy4c.org">curriculum@oy4c.org</a>
          </p>
        </div>
      </section>

      {/* 12. FAQs */}
      <section className={styles.faq}>
        <div className={styles.faqInner}>
          <h2 className="section-title">FAQs</h2>
          {FAQ.map((f) => (
            <details key={f.q} className={styles.faqItem}>
              <summary className={styles.faqQ}>
                <h3>{f.q}</h3>
                <ChevronDown size={20} aria-hidden="true" className={styles.faqChevron} />
              </summary>
              <p className={styles.faqA}>{typeof f.a === 'string' ? withMailto(f.a) : f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 13. CTA */}
      <section className={styles.cta}>
        <h2 className="section-title">{rich('Bring the OY4CCurriculum to your classroom **TODAY**!')}</h2>
        <div className={styles.ctaBtns}>
          <a {...ACCESS_LINK} className={styles.btnPrimary}>
            {rich('**Get the OY4CCurriculum**')}
          </a>
        </div>
        <p className={styles.ctaContact}>
          Questions? <a href="mailto:curriculum@oy4c.org">curriculum@oy4c.org</a>
        </p>
      </section>
    </>
  )
}
