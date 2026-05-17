import { Link } from 'react-router-dom'
import { Users, Globe, Lightbulb, BarChart, Heart, Sprout, BookOpen } from 'lucide-react'
import styles from './About.module.css'

export default function About() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Who we are</span>
          <h1>
            Youth-led.<br />
            <em>Climate-focused.</em><br />
            Globally connected.
          </h1>
          <p className={styles.heroSub}>
            OY4C is a global youth-led organisation on a mission to bring quality climate education to every classroom — designed by young people, for young people.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className={styles.mission}>
        <div className={styles.missionInner}>
          <div className={styles.missionText}>
            <span className="section-eyebrow">Our mission</span>
            <h2 className="section-title">Education for Youth. By Youth. Together for the Climate.</h2>
            <p>
			  To create widespread awareness and action towards a sustainable future, OY4C empowers the next generation with high-quality, accessible, youth-led climate change education.
			</p>
			<p>
			  Through our curriculum, programmes and global community, we equip young educators with the tools, knowledge and confidence to drive meaningful climate action in their schools and communities.
			</p>
          </div>
          <div className={styles.missionValues}>
            {[
              {
                icon: <Lightbulb size={20} />,
                title: 'Accessible Education',
                desc: 'Empowering younger generations with high-quality climate education regardless of background or location.',
              },
              {
                icon: <Heart size={20} />,
                title: 'Inclusive and Welcoming',
                desc: 'All backgrounds and experiences are valued — diversity is our strength.',
              },
              {
                icon: <Users size={20} />,
                title: 'Collaborative Community',
                desc: 'We believe in the power of collective action and building together.',
              },
              {
                icon: <Globe size={20} />,
                title: 'Systemic Change',
                desc: 'Creating transformational impact that goes beyond awareness to drive real change.',
              },
              {
                icon: <BarChart size={20} />,
                title: 'Data-Driven Solutions',
                desc: 'Our programmes are grounded in science and evidence for measurable outcomes.',
              },
              {
                icon: <Sprout size={20} />,
                title: 'Intersectional Environmentalism',
                desc: 'Recognizing and acting on the interconnectedness of climate justice and social justice.',
              },
            ].map((v) => (
              <div key={v.title} className={styles.valueCard}>
                <div className={styles.valueIcon}>{v.icon}</div>
                <div>
                  <div className={styles.valueTitle}>{v.title}</div>
                  <div className={styles.valueDesc}>{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section className={styles.video}>
        <div className={styles.videoInner}>
          <div className={styles.videoHead}>
            <span className="section-eyebrow">Watch our story</span>
            <h2 className="section-title">See OY4C in action</h2>
          </div>
          <div className={styles.videoWrapper}>
            <div className={styles.videoPlaceholder}>
              <p>Video to be updated — placeholder</p>
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className={styles.story}>
        <div className={styles.storyInner}>
          <span className="section-eyebrow">Our story</span>
          <h2 className="section-title">How it all started</h2>
          <p>
            OY4C was born from a simple but powerful question: why aren't young people leading the conversation on climate education? In 2021, a group of passionate young advocates came together to change that — and OY4C was founded.
          </p>
          <p>
            What started as a small initiative quickly grew into a global movement. Today, OY4C spans 40+ countries, with hundreds of volunteer educators bringing our curriculum to classrooms worldwide.
          </p>
          <p>
            We are proudly youth-led at every level — from our founder and executive director to our volunteers on the ground. This isn't just something we say. It's who we are.
          </p>
          <p style={{ color: 'var(--mid)', fontStyle: 'italic', borderLeft: '3px solid var(--green)', paddingLeft: '20px', marginTop: '32px' }}>
            "Climate education shouldn't be a privilege. Every young person deserves to understand the crisis they will inherit — and the power they have to shape its outcome."
            <br /><br />
            <strong style={{ color: 'var(--black)', fontStyle: 'normal' }}>— Ava Langridge, Founder & Executive Director</strong>
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          {[
            { num: '500+', label: 'Volunteers worldwide' },
            { num: '40+', label: 'Countries represented' },
            { num: '10k+', label: 'Students reached' },
            { num: '200+', label: 'Curricula integrated' },
          ].map((s) => (
            <div key={s.label} className={styles.stat}>
              <div className={styles.statNum}>{s.num}</div>
              <div className={styles.statLbl}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ONWARD NAV */}
      <section className={styles.onward}>
        <div className={styles.onwardHead}>
          <span className="section-eyebrow">Keep exploring</span>
          <h2 className="section-title">Learn more about OY4C</h2>
        </div>
        <div className={styles.onwardGrid}>
          {[
            { icon: <Users size={22} />, title: 'Meet the Team', desc: 'Discover the passionate young people behind OY4C.', to: '/team' },
            { icon: <BookOpen size={22} />, title: 'Our Curriculum', desc: 'Explore our climate education modules for classrooms.', to: '/curriculum' },
            { icon: <Globe size={22} />, title: 'Our Partners', desc: 'See the organisations we work with around the world.', to: '/partnerships' },
          ].map((c) => (
            <Link key={c.title} to={c.to} className={styles.onwardCard}>
              <div className={styles.onwardIcon}>{c.icon}</div>
              <div className={styles.onwardTitle}>{c.title}</div>
              <div className={styles.onwardDesc}>{c.desc}</div>
              <span className={styles.onwardArrow}>Learn more →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}