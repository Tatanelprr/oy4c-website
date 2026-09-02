import { Clock, GraduationCap, DollarSign, Users } from 'lucide-react'
import styles from './CCiC.module.css'

export default function CCiC() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Climate Curriculum into Classrooms</span>
          <h1>
            We took climate change education<br />
            to the world.<br />
            <em>Now it's your turn.</em>
          </h1>
          <p className={styles.heroSub}>
            The CCiC Project brought free, youth-led climate workshops to students across 5 continents in 3.5 months. Now we're making everything open access, so anyone, anywhere can do the same.
          </p>
          <div className={styles.heroStats}>
            {[
              '670 students taught live',
              '10 schools',
              '6 countries',
              '5 continents',
              '4.63 / 5 rating',
            ].map((s) => (
              <span key={s} className={styles.heroStat}>{s}</span>
            ))}
          </div>
          <div className={styles.heroBtns}>
            <a href="mailto:hello@oy4c.org" className={styles.btnPrimary}>Run a Free, Open Resource Workshop in Your Community →</a>
          </div>
        </div>
      </section>

      {/* WHAT IS CCiC */}
      <section className={styles.what}>
        <div className={styles.whatInner}>
          <span className="section-eyebrow">What is CCiC?</span>
          <h2 className="section-title">Climate Curriculum into Classrooms</h2>
          <div className={styles.whatText}>
            <p>
              OY4C has spent 4.5 years building a global, youth-led climate change education movement online. We've reached over 100,000 people monthly, built a team of 133 volunteers across 43 countries, and brought our curriculum into classrooms in over 20 countries.
            </p>
            <p>
              But we needed to go further. We needed to show up in person, to plant seeds, have real conversations, and prove that youth-to-youth climate education works on the ground, not just behind a screen.
            </p>
            <p>
              That's what CCiC is: a free, in-person workshop designed and delivered by young people for students aged 14-18. We come to you. We bring everything. You just open the door.
            </p>
          </div>
          <div className={styles.tiles}>
            {[
              { icon: <Clock size={28} />, title: '1h30 session', desc: '45 mins of learning + 45 mins of hands-on activity' },
              { icon: <GraduationCap size={28} />, title: 'Ages 14-18', desc: 'Flexible for one class, a year group, or a whole assembly' },
              { icon: <DollarSign size={28} />, title: 'Zero cost. Zero prep.', desc: 'We bring all materials directly to your school' },
              { icon: <Users size={28} />, title: 'Youth-to-youth', desc: 'Students learn from their peers, not another adult at the front' },
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
          <p className={styles.workshopIntro}>
            The CCiC workshop uses the fashion industry as a lens into the bigger climate picture - because everyone in the room is wearing clothes, and every one of those clothes has a story worth following.
          </p>
          <div className={styles.workshopParts}>
            <div className={styles.workshopPart}>
              <div className={styles.workshopPartNum}>Part 1</div>
              <div className={styles.workshopPartTitle}>Learning - 45 mins</div>
              <p>
                Students start by tracing a piece of clothing they're wearing: what it's made of, where it came from, how long they've had it. From there, we explore how the fashion industry touches five interconnected systems: Environmental, Social, Economic, Institutional, and Cultural.
              </p>
              <p style={{ marginTop: 12 }}>
                We follow a single T-shirt from raw material to disposal and ask: does it have to end here? Students compare the linear economy with a circular one and meet real-world models making it work, from Kantamanto Market in Accra to the global Repair Café Network.
              </p>
            </div>
            <div className={styles.workshopPart}>
              <div className={styles.workshopPartNum}>Part 2</div>
              <div className={styles.workshopPartTitle}>Activity - 45 mins</div>
              <p>
                In teams of 4-5, students take on the Design It Better! Challenge - choosing a real fast fashion problem in their community and designing a response. A poster, a campaign, a roleplay, a mock ad. Then they present.
              </p>
              <p style={{ marginTop: 12 }}>
                The goal isn't a perfect answer. It's realising they already have what it takes to imagine one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className={styles.journey}>
        <div className={styles.journeyInner}>
          <span className="section-eyebrow">The Journey</span>
          <h2 className="section-title">3.5 months. One founder. 5 continents.</h2>
          <p className={styles.journeyIntro}>
            OY4C has been online since its founding during the pandemic. Social media and youth drive are powerful things. They scaled us globally. But at some point, you have to show up. So Ava, OY4C's Founder and Executive Director, set off.
          </p>
          <div className={styles.timeline}>
            {[
              { flag: '🌏 Canada', title: 'Where it started - Online', body: 'In good OY4C fashion, the first CCiC session was held online. Ava in London, students in Ontario, Canada. But it was time to go for real.' },
              { flag: '🌴 Fiji', title: 'The first classroom', body: 'First stop: Fiji. Walking into a classroom for the first time, with real students looking back and engaging with materials we had built together. It was the first moment the tangible impact of OY4C became real.' },
              { flag: '🪡 Auckland, New Zealand', title: 'Community, no script', body: 'At New Lynn Memorial Square, CCiC took a different shape: a community-based event, hands-on, with participants embroidering cloth and talking openly about the fashion industry\'s impact on people, planet, and economy.' },
              { flag: '🏫 Rotorua, New Zealand', title: '60 students', body: 'Everyone in that room was there for the same reason: the need for young people to come together, empower each other, and be reminded that they are not alone in this. By youth. For youth.' },
              { flag: '🌿 Bali, Indonesia', title: 'SD Bali Public School - 72 students', body: 'Students at Green School Bali, who had received climate change education, were notably less reactive to the material, not because they didn\'t care, but because this knowledge was already part of how they moved through the world. That\'s the goal.' },
              { flag: '🧵 Philippines, Cebu', title: 'Earth Day, April 22nd - 14 students', body: 'Students already skilled at repairing clothes and extending the life of what they owned, not because they\'d been taught sustainability, but because they\'d been shaped by necessity. This was a real exchange of knowledge: we brought the framework; they brought the practice.' },
              { flag: '🌍 Across the World', title: 'At the same time', body: 'Muhammad ran a workshop in Nigeria and integrated the full OY4CCurriculum into his school. Deanna stood in front of 140 students in Pontianak, Indonesia. Alexandra brought it back to the school she attended in Bratislava, Slovakia.' },
            ].map((item) => (
              <div key={item.title} className={styles.timelineItem}>
                <div className={styles.timelineDot}>
                  <div className={styles.timelineDotCircle} />
                  <div className={styles.timelineLine} />
                </div>
                <div>
                  <div className={styles.timelineFlag}>{item.flag}</div>
                  <div className={styles.timelineTitle}>{item.title}</div>
                  <div className={styles.timelineBody}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSIGHTS */}
      <section className={styles.insights}>
        <div className={styles.insightsInner}>
          <span className="section-eyebrow">What we learned</span>
          <h2 className="section-title">What 3.5 months on the road taught us</h2>
          <div className={styles.insightsGrid}>
            {[
              { num: '01', title: 'Access to climate change education shapes everything', body: 'The contrast between students who had received deep climate change education and those who hadn\'t was impossible to ignore. Engagement, agency, and the ability to imagine solutions all correlated directly with exposure.' },
              { num: '02', title: 'Sustainability can be lived without being named', body: 'In the Philippines, students were already practising circularity. The most powerful moments weren\'t when we taught something new, they were when we helped students recognise what they already knew.' },
              { num: '03', title: 'Peer-to-peer is different', body: 'Students listen differently when the person at the front is their age. There\'s less distance. More permission to speak, question, push back. Youth-to-youth education isn\'t just a nice idea. It works.' },
              { num: '04', title: 'This doesn\'t have to be founder-dependent', body: 'Muhammad, Deanna, and Alexandra ran sessions on the other side of the world while Ava was in transit. The model holds without the founder in the room. That means it can scale. And it will.' },
              { num: '05', title: 'Community is the infrastructure', body: 'In a world pulling people apart, in-person connection does something online cannot replicate. Students don\'t just learn in CCiC workshops. They meet each other. They find their people.' },
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
          <span className="section-eyebrow" style={{ color: 'rgba(255,255,255,0.75)' }}>Impact</span>
          <h2 className="section-title" style={{ color: 'var(--white)' }}>The numbers, so far</h2>
          <div className={styles.impactGrid}>
            {[
              { num: '670', label: 'Students taught live' },
              { num: '70', label: 'Teachers reached' },
              { num: '10', label: 'Schools' },
              { num: '6', label: 'Countries' },
              { num: '5', label: 'Continents' },
              { num: '4.63/5', label: 'Overall workshop rating' },
            ].map((s) => (
              <div key={s.label} className={styles.impactStat}>
                <div className={styles.impactStatNum}>{s.num}</div>
                <div className={styles.impactStatLbl}>{s.label}</div>
              </div>
            ))}
          </div>
          <div className={styles.sdgs}>
            {['SDG 4 - Quality Education', 'SDG 10 - Reduced Inequalities', 'SDG 13 - Climate Action'].map((s) => (
              <span key={s} className={styles.sdgBadge}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN RESOURCE */}
      <section className={styles.openResource}>
        <div className={styles.openResourceInner}>
          <span className="section-eyebrow">What's next</span>
          <h2 className="section-title">CCiC is yours now.</h2>
          <p>
            This project doesn't end with one founder and one journey. The seeds have been planted. Now it's time to scale.
          </p>
          <p>
            We are making CCiC an open resource, freely available to any young person, educator, or community group who wants to bring quality, youth-led climate change education to their school or community.
          </p>
          <span className={styles.comingSoon}>Coming Soon</span>
        </div>
      </section>

      {/* MAP */}
      <section className={styles.map}>
        <div className={styles.mapInner}>
          <span className="section-eyebrow">Where we've been</span>
          <h2 className="section-title">CCiC around the world</h2>
          <div className={styles.mapFrame}>
            <iframe
              src="https://www.google.com/maps/d/embed?mid=19lCUg7zsVuQmOAlSUS59yObBwLDHZiM"
              title="CCiC Map"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* FOUNDER QUOTE */}
      <section className={styles.founderQuote}>
        <div className={styles.founderQuoteInner}>
          <span className="section-eyebrow" style={{ color: 'var(--teal)' }}>From Ava, OY4C Founder</span>
          <p className={styles.quoteText}>
            "The most beautiful 3.5 months a Founder could have asked for. Connecting, really connecting, with people from across the world, across backgrounds, across generations. This is what community looks like, especially in a world that's so desperate for it. This is what equipping a generation looks like. This is what scaling climate change education looks like. We were just planting seeds across the world. But seeds, eventually, sprout."
          </p>
          <div className={styles.quoteAuthor}>- Ava Langridge, Founder & Executive Director, OY4C</div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <span className="section-eyebrow">Get involved</span>
        <h2 className="section-title">Ready to bring CCiC to your community?</h2>
        <p>Whether you're a teacher, a student, a youth advocate, or an organisation, there's a way for you to be part of this.</p>
        <div className={styles.ctaBtns}>
          <a href="mailto:hello@oy4c.org" className={styles.ctaBtn}>Bring CCiC to Your School →</a>
          <a href="mailto:hello@oy4c.org" className={styles.ctaBtn}>Run It Yourself →</a>
          <a href="mailto:hello@oy4c.org" className={styles.ctaBtnOutline}>Get in Touch</a>
        </div>
      </section>
    </>
  )
}