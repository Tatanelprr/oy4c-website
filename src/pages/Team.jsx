import { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'
import styles from './Team.module.css'

function LinkedinIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

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
          src={member.photo}
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
      <div className={styles.memberName}>{member.name}</div>
      <div className={styles.memberRole}>{member.role}</div>
      {(member.pronouns || member.linkedin) && (
        <div className={styles.memberPronouns}>
          {member.pronouns}
          {member.pronouns && member.linkedin && <span> · </span>}
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noreferrer" className={styles.linkedinIcon}>
              <LinkedinIcon size={12} />
            </a>
          )}
        </div>
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
      <div className={styles.memberName}>{member.name}</div>
      <div className={styles.memberRole}>{member.role}</div>
      {(member.pronouns || member.linkedin) && (
        <div className={styles.memberPronouns}>
          {member.pronouns}
          {member.pronouns && member.linkedin && <span> · </span>}
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noreferrer" className={styles.linkedinIcon}>
              <LinkedinIcon size={12} />
            </a>
          )}
        </div>
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
            OY4C is powered by a global community of passionate young people: educators, researchers, designers, and advocates, united by a common mission.
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