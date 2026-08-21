import { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'
import styles from './Team.module.css'

function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function Avatar({ member, size = 'lg' }) {
  const cls = size === 'lg' ? styles.avatar : styles.avatarSm

  if (member.photo) {
    return (
      <div className={cls}>
        <img
          src={`/team/${member.photo}`}
          alt={member.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </div>
    )
  }

  return <div className={cls}>{getInitials(member.name)}</div>
}

function SeniorCard({ member }) {
  const [quoteOpen, setQuoteOpen] = useState(false)

  return (
    <div className={styles.seniorCard}>
      <Avatar member={member} size="lg" />
      {member.linkedin ? (
        <a href={member.linkedin} target="_blank" rel="noreferrer" className={styles.memberNameLink}>
          {member.name}
        </a>
      ) : (
        <div className={styles.memberName}>{member.name}</div>
      )}
      <div className={styles.memberRole}>{member.role}</div>
      {member.pronouns && (
        <div className={styles.memberPronouns}>{member.pronouns}</div>
      )}
      {member.quote && (
        <>
          <button className={styles.quoteToggle} onClick={() => setQuoteOpen(!quoteOpen)}>
            {quoteOpen ? 'Hide quote' : 'Read quote'}
          </button>
          {quoteOpen && <div className={styles.memberQuote}>"{member.quote}"</div>}
        </>
      )}
    </div>
  )
}

function MemberCard({ member }) {
  const [quoteOpen, setQuoteOpen] = useState(false)

  return (
    <div className={styles.memberCard}>
      <Avatar member={member} size="sm" />
      <span className={styles.teamBadge}>{member.team}</span>
      {member.linkedin ? (
        <a href={member.linkedin} target="_blank" rel="noreferrer" className={styles.memberNameLink}>
          {member.name}
        </a>
      ) : (
        <div className={styles.memberName}>{member.name}</div>
      )}
      <div className={styles.memberRole}>{member.role}</div>
      {member.pronouns && (
        <div className={styles.memberPronouns}>{member.pronouns}</div>
      )}
      {member.quote && (
        <>
          <button className={styles.quoteToggle} onClick={() => setQuoteOpen(!quoteOpen)}>
            {quoteOpen ? 'Hide quote' : 'Read quote'}
          </button>
          {quoteOpen && <div className={styles.memberQuote}>"{member.quote}"</div>}
        </>
      )}
    </div>
  )
}

function CollapsibleSection({ title, children }) {
  const [open, setOpen] = useState(false)

  return (
    <section className={styles.section}>
      <button
        className={styles.sectionToggle}
        onClick={() => setOpen(!open)}
      >
        <div className={styles.sectionHead}>
          <h2>{title}</h2>
        </div>
        <span className={styles.sectionToggleIcon}>
          {open ? '↑' : '↓'}
        </span>
      </button>
      {open && (
        <div className={styles.memberGrid}>
          {children}
        </div>
      )}
    </section>
  )
}

export default function Team() {
  const [teamData, setTeamData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`/api/team?t=${Date.now()}`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(setTeamData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>The people behind OY4C</span>
          <h1>Meet the Team</h1>
          <p className={styles.heroSub}>
            OY4C is powered by a global community of passionate young people — educators, researchers, designers, and advocates — united by a common mission.
          </p>
        </div>
      </section>

      {loading && (
        <div className={styles.loading}>
          <Loader size={28} className={styles.spinner} />
          <p>Loading team…</p>
        </div>
      )}

      {error && !loading && (
        <div className={styles.loadError}>
          <p>Could not load team data. Please try again later.</p>
        </div>
      )}

      {!loading && !error && teamData && (
        <>
          {/* SENIOR LEADERSHIP — pas de dropdown */}
          <section className={styles.sectionStatic}>
            <div className={styles.sectionStaticHead}>
              <h2>Senior Leadership</h2>
            </div>
            <div className={styles.seniorGrid}>
              {teamData.seniorLeadership.map((m) => (
                <SeniorCard key={m.name} member={m} />
              ))}
            </div>
          </section>

          {/* OPERATIONS — collapsible */}
          <CollapsibleSection title="Operations">
            {teamData.operations.map((m) => (
              <MemberCard key={m.name} member={m} />
            ))}
          </CollapsibleSection>

          {/* PEOPLE & CULTURE — collapsible */}
          <CollapsibleSection title="People & Culture">
            {teamData.peopleAndCulture.map((m) => (
              <MemberCard key={m.name} member={m} />
            ))}
          </CollapsibleSection>

          {/* EXECUTIVE TEAM — collapsible */}
          <CollapsibleSection title="Executive Team">
            {teamData.executiveTeam.map((m) => (
              <MemberCard key={m.name} member={m} />
            ))}
          </CollapsibleSection>

          {/* FUNCTIONS — collapsible */}
          <CollapsibleSection title="Function Members">
            {teamData.functions.map((m) => (
              <MemberCard key={m.name} member={m} />
            ))}
          </CollapsibleSection>
        </>
      )}

      {/* RECRUTEMENT */}
      <div className={styles.recruitNote}>
        <h3>Want to join the team?</h3>
        <p>
          Applications open periodically. Follow our socials or check back here to know when we're recruiting.
        </p>
        <a
          href="https://www.instagram.com/ouryouth4theclimate/"
          target="_blank"
          rel="noreferrer"
          className={styles.recruitBtn}
        >
          Follow us for updates →
        </a>
      </div>
    </>
  )
}