import { useState } from 'react'
import { Clock, GraduationCap, DollarSign, Users, Shirt } from 'lucide-react'
import CCiCLocationsMap from '../components/CCiCLocationsMap'
import styles from './CCiC.module.css'
import usePageMeta from '../lib/usePageMeta'
import { PAGE_META } from '../data/pageMeta'

// Removed from the Impact section; Ava wants to add them to the home page later:
// 'SDG 4 - Quality Education', 'SDG 10 - Reduced Inequalities', 'SDG 13 - Climate Action'

// TODO: Pack request form URL, to come from Ethan. While empty, the button
// opens mailto:hello@oy4c.org.
const PACK_FORM_URL = ''
const PACK_LINK = PACK_FORM_URL
  ? { href: PACK_FORM_URL, target: '_blank', rel: 'noopener noreferrer' }
  : { href: 'mailto:hello@oy4c.org' }

export default function CCiC() {
  usePageMeta(PAGE_META['/ccic'])
  // Light client-side gates — no data is persisted or sent yet.
  // TODO: wire these forms to a real collection endpoint (CRM / Google Sheet / API).
  const [reportUnlocked, setReportUnlocked] = useState(false)

  const handleReportSubmit = (e) => {
    e.preventDefault()
    setReportUnlocked(true)
    // Preserve the previous direct-download behaviour: open the PDF on submit.
    window.open('/ccic-report-2025.pdf', '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Climate Curriculum into Classrooms</span>
          <h1>
            670 students. 5 continents. 3 months.<br />
            <em>Now it's yours.</em>
          </h1>
          <p className={styles.heroSub}>
            We ran free climate workshops in person for 670 students across 6 countries. It is now an open resource for you to use and run!
          </p>
          <p className={styles.heroDateline}>
            We ran our pilot from <strong>February to April 2026</strong>
          </p>
          <div className={styles.heroStats}>
            {[
              '670 students taught live',
              '70 teachers in the room',
              '10 schools',
              '6 countries',
              '5 continents',
              '4.63 / 5 average rating',
            ].map((s) => (
              <span key={s} className={styles.heroStat}>{s}</span>
            ))}
          </div>
          <div className={styles.heroBtns}>
            <a href="mailto:hello@oy4c.org" className={styles.btnPrimary}>Bring CCiC to Your School →</a>
          </div>
        </div>
      </section>

      {/* WHAT IS CCiC */}
      <section className={styles.what}>
        <div className={styles.whatInner}>
          <div className={styles.whatTop}>
            <div>
              <span className="section-eyebrow">What is CCiC?</span>
              <h2 className={`section-title ${styles.whatTitle}`}>Climate Curriculum into Classrooms (CCiC)</h2>

              <p className={styles.whatDefinition}>
                CCiC is a free, 1h30 in-person climate workshop, designed by young people, for students aged 12-18. We developed the resource and ran the pilot. Now, YOU can run it.
              </p>

              <div className={styles.whatText}>
                <p>
                  OY4C has spent 5.5 years building a global, youth-led climate change education movement online. We've reached over 100,000 people monthly, built a team of 133 volunteers across 43 countries, and brought our curriculum into classrooms in over 20 countries.
                </p>
                <p>
                  But we needed to go further. We needed to show up in person, to have real conversations, and prove that youth-to-youth climate change education works on the ground.
                </p>
              </div>
            </div>

            {/* Map, small, to the right of the text (Ava's feedback) */}
            <div className={styles.whatMap}>
              <span className="section-eyebrow">Where we've been</span>
              <h3 className={styles.whatMapTitle}>CCiC around the world</h3>
              <CCiCLocationsMap
                src="https://www.google.com/maps/d/embed?mid=19lCUg7zsVuQmOAlSUS59yObBwLDHZiM"
                title="CCiC around the world"
              />
            </div>
          </div>

          <p className={styles.pullQuote}>Why CCiC</p>

          <div className={styles.tiles}>
            {[
              { icon: <DollarSign size={28} />, title: 'Zero Cost', desc: 'We bring all materials directly to your school' },
              { icon: <Clock size={28} />, title: '1h30 session', desc: '45 mins of learning + 45 mins of hands-on activity' },
              { icon: <GraduationCap size={28} />, title: 'Ages 12-18', desc: 'Flexible for one class, a year group, or a whole assembly' },
              { icon: <Users size={28} />, title: 'Youth-to-youth', desc: 'Students learn from their peers and walk away collectively empowered' },
              { icon: <Shirt size={28} />, title: 'New topic Approach', desc: 'To help students grasp climate change and sustainability, we intersect this workshop with the fashion industry, a topic everyone can relate to' },
            ].map((t) => (
              <div key={t.title} className={styles.tile}>
                <div className={styles.tileIcon}>{t.icon}</div>
                <div className={styles.tileTitle}>{t.title}</div>
                <div className={styles.tileDesc}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKSHOP */}
      <section className={styles.workshop}>
        <div className={styles.workshopInner}>
          <span className="section-eyebrow">The Workshop</span>
          <h2 className="section-title">What happens in a CCiC workshop?</h2>
          <p className={styles.workshopLede}>
            Clothes have stories worth telling. Do you know the story of yours?
          </p>

          <div className={styles.stageScroll}>
            <div className={styles.stageTrack}>
              {[
                { title: 'Our Map', duration: '5 min', desc: "Students trace a piece of clothing they're wearing — what it's made of, where it came from, how long they've had it." },
                { title: 'Life of a T-Shirt', duration: '15 min', desc: 'We follow a single T-shirt from raw material to disposal, and ask a simple question: does it have to end here?', journey: true },
                { title: 'Impacts', duration: '10 min', desc: 'We explore how the fashion industry touches five interconnected systems: environmental, social, economic, institutional, and cultural.' },
                { title: 'Sustainable Actions', duration: '15 min', desc: 'Students compare the linear economy with a circular one and meet real-world models making it work, from Kantamanto Market in Accra to the global Repair Café Network.' },
                { title: 'Activity: Design It Better!', duration: '45 min', desc: 'In teams of 4-5, students choose a real fast fashion problem in their community and design a response — a poster, a campaign, a roleplay, a mock ad. Then they present.', closing: "The goal isn't a perfect answer. It's realising they already have what it takes to imagine one." },
              ].map((s, i) => (
                <div key={s.title} className={styles.stage}>
                  <div className={`${styles.stageNum} ${i % 2 === 0 ? styles.stageNumTeal : styles.stageNumGreen}`}>{i + 1}</div>
                  <div className={styles.stageDuration}>{s.duration}</div>
                  <div className={styles.stageTitle}>{s.title}</div>
                  <p className={styles.stageDesc}>{s.desc}</p>
                  {s.journey && (
                    <div className={styles.tshirtJourney}>
                      {['Raw material', 'Manufacture', 'Shipping', 'Wear', 'Disposal'].map((step) => (
                        <span key={step} className={styles.tjStep}>{step}</span>
                      ))}
                      <span className={styles.tjQuestion}>Does it have to end here?</span>
                    </div>
                  )}
                  {s.closing && <p className={styles.stageClosing}>{s.closing}</p>}
                </div>
              ))}
            </div>
          </div>
          <p className={styles.scrollHint}>← scroll to explore all 5 stages →</p>
        </div>
      </section>

      {/* JOURNEY */}
      <section className={styles.journey}>
        <div className={styles.journeyInner}>
          <span className="section-eyebrow">Our Pilot from February to April 2026</span>
          <h2 className={`section-title ${styles.journeyTitle}`}>3 months. 6 countries. 5 continents. Not one person.</h2>
          <p className={styles.journeyIntro}>
            OY4C has been online since its founding during the pandemic. Social media and youth drive scaled us globally. But at some point, you have to show up. So Ava, OY4C's Founder and Executive Director, set off.
          </p>
          {/* photo: optional school photo, e.g. '/ccic/schools/fiji.webp', hidden
              while empty. These are students under 18: only add one once
              consent to show it is confirmed. */}
          <div className={styles.stopGrid}>
            {[
              { place: 'Canada (Online)', photo: '', body: 'Where it started, online. Ava in London, students in Ontario, Canada. The first CCiC session, before going in person.' },
              { place: 'Fiji', photo: '', body: "The first classroom. First real students, first real conversation. The moment OY4C's impact became tangible." },
              { place: 'Auckland, New Zealand', photo: '', body: "A community event at New Lynn Memorial Square — participants embroidering cloth while discussing fashion's impact on people, planet and economy. No formal structure, just community." },
              { place: 'Rotorua, New Zealand', photo: '', body: "60 students. Everyone there for the same reason: young people coming together, empowering each other, realising they're not alone. By youth. For youth." },
              { place: 'Bali, Indonesia', photo: '', body: "72 students at SD Bali Public School. Green School Bali students, who'd already had climate education, were notably less reactive — not because they didn't care, but because the knowledge was already part of how they moved through the world." },
              { place: 'Cebu, Philippines', photo: '', body: 'Earth Day, 14 students. Already skilled at repairing and extending the life of their clothes — not from classroom sustainability lessons, but from necessity and community. We brought the framework. They brought the practice.' },
              { place: 'Maiduguri, Nigeria', photo: '', tag: 'Team-run', body: 'Run by Muhammad, Story Creator. He went on to integrate the full OY4C Curriculum into his school.' },
              { place: 'Pontianak, Indonesia', photo: '', tag: 'Team-run', body: 'Run by Deanna, Director of Community. 140 students, eager and ready. Similar sessions were run independently by Alexandra (Bratislava, Slovakia).' },
            ].map((s, i) => (
              <div key={s.place} className={styles.stop}>
                {s.photo && <img src={s.photo} alt="" className={styles.stopPhoto} loading="lazy" />}
                <div className={styles.stopNum}>{String(i + 1).padStart(2, '0')}</div>
                <div className={styles.stopHead}>
                  <span className={styles.stopPlace}>{s.place}</span>
                  {s.tag && <span className={styles.stopTag}>{s.tag}</span>}
                </div>
                <p className={styles.stopBody}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF IT SCALES */}
      <section className={styles.proof}>
        <div className={styles.proofInner}>
          <span className="section-eyebrow">Proof it scales</span>
          <h2 className="section-title">The model doesn't depend on one founder</h2>
          <p className={styles.proofLede}>
            While Ava was in transit, three team members ran full CCiC sessions on their own, on the other side of the world.
          </p>
          <div className={styles.proofGrid}>
            {[
              { name: 'Muhammad', role: 'Story Creator', place: 'Maiduguri, Nigeria', photo: '/team/muhammad-goni.webp', note: 'Integrated the full OY4C Curriculum into his school.' },
              { name: 'Deanna', role: 'Director of Community', place: 'Pontianak, Indonesia', photo: '/team/deanna-gracia.webp', note: 'Led a session for 140 students, eager and ready.' },
              { name: 'Alexandra', role: 'Director of Curriculum', place: 'Bratislava, Slovakia', photo: '/team/sasha-kristofovicova.webp', note: 'Brought CCiC back to her own former school.' },
            ].map((m) => (
              <div key={m.name} className={styles.proofCard}>
                <div className={styles.proofAvatar} aria-hidden="true">
                  <span className={styles.proofInitials}>{m.name[0]}</span>
                  <img
                    src={m.photo}
                    alt=""
                    className={styles.proofAvatarImg}
                    width="160"
                    height="160"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
                <div className={styles.proofName}>{m.name}</div>
                <div className={styles.proofRole}>{m.role}</div>
                <div className={styles.proofPlace}>{m.place}</div>
                <p className={styles.proofNote}>{m.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGEN26 FEATURE */}
      <section className={styles.regen}>
        <div className={styles.regenBg} />
        <div className={styles.regenContent}>
          <span className="section-eyebrow" style={{ color: 'var(--teal)' }}>ReGen26</span>
          <h2 className="section-title" style={{ color: 'var(--white)' }}>250 students. One day. Green School Bali.</h2>
          {/* CCiC report (public/ccic-report-2025.pdf), page 6, verbatim */}
          <p className={styles.regenText}>
            ReGen26 was the first event of its kind: young people from schools around the world, convened at Green School Bali for a two-day collaborative conference. OY4C ran two full CCiC workshops on-site, to students who had come from across continents.
          </p>
          <p className={styles.regenText}>
            The most striking moment came from the contrast in the room. Students from Green School Bali, who'd had years of embedded climate change education, engaged differently to those who hadn't. Not less committed, but less shocked. Because this was already normal to them. That's the goal. We need climate change education so embedded it stops being a revelation and starts being a baseline.
          </p>
          <blockquote className={styles.regenQuote}>
            "Green School students were less shocked, not less committed."
          </blockquote>
        </div>
      </section>

      {/* INSIGHTS */}
      <section className={styles.insights}>
        <div className={styles.insightsInner}>
          <span className="section-eyebrow">What we learned</span>
          <h2 className="section-title">What 3 months on the road taught us</h2>
          <div className={styles.insightsGrid}>
            {[
              { num: '01', title: 'Access to climate change education shapes everything', body: 'The difference between students who\'d had deep climate education and those who hadn\'t was impossible to miss. Engagement, agency, and the ability to imagine solutions all seemed to move with it.' },
              { num: '02', title: 'Sustainability can be lived without being named', body: 'In the Philippines, students were already practising circularity. The most powerful moments weren\'t when we taught something new, they were when we helped students recognise what they already knew.' },
              { num: '03', title: 'Peer-to-peer learning is categorically different', body: 'Students listen differently when the person at the front is their age. There\'s less distance. More permission to speak, question, push back. Youth-to-youth education isn\'t just a nice idea. It works.' },
              { num: '04', title: 'The model runs without the founder in the room', body: 'Muhammad, Deanna, and Alexandra ran sessions on the other side of the world while Ava was in transit, and the workshops held. That\'s what tells us this can scale: it lives in the model and the team, not in any one person.' },
              { num: '05', title: 'Community is the infrastructure', body: 'In a world pulling people apart, in-person connection does something online cannot replicate. Students don\'t just learn in CCiC workshops. They meet each other. They find their people.' },
              { num: '06', title: 'It goes both ways', body: 'In Cebu, they already knew how to repair and extend the life of their clothes. We brought the framework. They brought the practice. The best workshops were an exchange, not a lecture.' },
            ].map((i) => (
              <div key={i.num} className={styles.insightCard}>
                <div className={styles.insightNum}>{i.num}</div>
                <div className={styles.insightTitle}>{i.title}</div>
                <div className={styles.insightBody}>{i.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className={styles.impact}>
        <div className={styles.impactInner}>
          <span className={`section-eyebrow ${styles.impactEyebrow}`}>Impact</span>
          <h2 className="section-title">The numbers (so far)</h2>
          <div className={styles.impactDateline}>February–April 2026</div>
          <div className={styles.impactGrid}>
            {[
              { num: '670', label: 'Students taught live' },
              { num: '70', label: 'Teachers in the room' },
              { num: '10', label: 'Schools' },
              { num: '6', label: 'Countries in the pilot' },
              { num: '5', label: 'Continents' },
              { num: '4.63/5', label: 'Average workshop rating from students and teachers' },
            ].map((s) => (
              <div key={s.label} className={styles.impactStat}>
                <div className={styles.impactStatNum}>{s.num}</div>
                <div className={styles.impactStatLbl}>{s.label}</div>
              </div>
            ))}
          </div>
          <figure className={styles.impactQuote}>
            <blockquote>&ldquo;Liberated and inspired. Showed me some insight to what I can do better to help the climate crisis.&rdquo;</blockquote>
            <figcaption>— Student, 16, Rotorua, New Zealand</figcaption>
          </figure>
        </div>
      </section>

      {/* CCiC REPORT */}
      <section className={styles.report}>
        <div className={styles.reportInner}>
          <span className="section-eyebrow">The Report</span>
          <h2 className="section-title">The CCiC Report</h2>

          <div className={styles.reportPreview}>
            {/* TODO: replace this placeholder cover with the real report cover image */}
            <div className={styles.reportThumb}>
              <img src="/ccic-logo.webp" alt="" className={styles.reportThumbImg} width="520" height="347" loading="lazy" />
            </div>
            <div className={styles.reportDetails}>
              <p className={styles.reportText}>
                Read the full report on our first CCiC pilot — everything we did, what we learned, and where we're going next.
              </p>
              <div className={styles.reportPages}>24 pages</div>
              <ul className={styles.reportBullets}>
                <li>The full 3-month journey, country by country</li>
                <li>What we learned, with data and quotes from students and teachers</li>
                <li>The case for scaling CCiC as an open resource</li>
              </ul>
            </div>
          </div>

          {reportUnlocked ? (
            <a href="/ccic-report-2025.pdf" target="_blank" rel="noopener noreferrer" className={styles.reportBtn}>
              Download the Report (PDF) →
            </a>
          ) : (
            <form className={styles.gateForm} onSubmit={handleReportSubmit}>
              <p className={styles.gateFormLabel}>Tell us where to send it and get instant access to the PDF.</p>
              <div className={styles.gateFormGrid}>
                <input type="text" name="name" placeholder="Name" required className={styles.gateInput} />
                <input type="email" name="email" placeholder="Email" required className={styles.gateInput} />
                <input type="text" name="role" placeholder="Role" required className={styles.gateInput} />
                <input type="text" name="organisation" placeholder="Organisation" required className={styles.gateInput} />
              </div>
              <button type="submit" className={styles.reportBtn}>Get the Report →</button>
            </form>
          )}
        </div>
      </section>

      {/* OPEN RESOURCE */}
      <section className={styles.openResource}>
        <div className={styles.openResourceInner}>
          <span className="section-eyebrow">What's next</span>
          <h2 className="section-title">CCiC is yours now.</h2>
          <p>
            CCiC doesn't end with one founder and one journey. Everything we used is becoming an open resource.
          </p>
          <p>
            We are making CCiC freely available to any young person, educator, or community group who wants to bring quality, youth-led climate change education to their school or community.
          </p>

          <ul className={styles.kitList}>
            {['Slide deck', 'Facilitator guide', 'Activity materials', 'Timing sheet', 'Feedback forms template'].map((item) => (
              <li key={item} className={styles.kitItem}>{item}</li>
            ))}
          </ul>

          <div className={styles.gateForm}>
            <p className={styles.gateFormLabel}>Open resource kit launching Q1 2027. Join the waitlist and we&rsquo;ll send it the day it&rsquo;s live.</p>
            <a {...PACK_LINK} className={styles.reportBtn}>Request your Pack today for Free</a>
          </div>
        </div>
      </section>

      {/* OPEN RESOURCE KIT */}
      <section className={styles.resourceKit}>
        <div className={styles.resourceKitInner}>
          <span className="section-eyebrow">Open Resource</span>
          <h2 className="section-title">Run CCiC in Your Community</h2>
          <p className={styles.resourceKitText}>
            Everything you need to bring climate change conversations into your classroom or community — for free. Fill in the form and we'll send you the full open resource kit.
          </p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSctj_EUvSibc60u7Jmho1httPdZDaPleKCEuh0iiWXItqY6uQ/viewform"
            target="_blank"
            className={styles.resourceKitBtn}
          >
            Get the Open Resource →
          </a>
        </div>
      </section>

      {/* FOUNDER QUOTE */}
      <section className={styles.founderQuote}>
        <div className={styles.founderQuoteInner}>
          <span className={`section-eyebrow ${styles.quoteEyebrow}`}>From Ava, OY4C Founder</span>
          <p className={styles.quoteText}>
            "The best 3 months a Founder could have asked for — connecting, really connecting, with people across the world, across backgrounds, across generations. We were just planting seeds. But I've seen what they grow into."
          </p>
          <div className={styles.quoteAuthorRow}>
            <div className={styles.quoteAvatar} aria-hidden="true">
              <span className={styles.quoteInitials}>AL</span>
              <img
                src="/team/ava-langridge.webp"
                alt=""
                className={styles.quoteAvatarImg}
                width="640"
                height="817"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
            <div className={styles.quoteAuthor}>Ava Langridge, Founder &amp; Executive Director, OY4C</div>
          </div>
        </div>
      </section>

    </>
  )
}