import styles from './Legal.module.css'

// Cookies policy under the UK Privacy and Electronic Communications Regulations
// (PECR). The site loads no non-essential trackers automatically, so no consent
// banner is required; the only third party that can set a cookie is Google Maps,
// and only after the visitor explicitly clicks to load it.
export default function Cookies() {
  return (
    <>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Cookies</span>
          <h1>Cookies Policy</h1>
          <p className={styles.updated}>Last updated: 20 September 2026</p>
        </div>
      </header>

      <main className={styles.doc}>
        <div className={styles.callout}>
          <strong>This website does not use cookies to track you.</strong> It sets
          no cookies of its own and runs no analytics, advertising or profiling.
          Because nothing non-essential loads without your action, there is no
          cookie banner — a banner here would be pointless.
        </div>

        <h2>What are cookies?</h2>
        <p>
          Cookies are small files a website (or a third party) can store in your
          browser. Under the UK Privacy and Electronic Communications Regulations
          (PECR), non-essential cookies and trackers may only be set with your
          consent.
        </p>

        <h2>Cookies set by this website</h2>
        <p>
          <strong>None.</strong> We do not set first-party cookies, and we do not
          use Google Analytics or any similar tool. Web fonts and the world-map
          background are served from our own domain, so no external font or CDN
          service receives your data.
        </p>

        <h2>Third-party cookies (only if you choose)</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Source</th>
              <th>When</th>
              <th>Purpose</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Google Maps</td>
              <td>Only after you click “Click to load the map” on the CCiC page</td>
              <td>Display an interactive map of where CCiC has taken place</td>
              <td>Third-party cookies set by Google; possible US transfer</td>
            </tr>
          </tbody>
        </table>
        <p>
          If you never click to load the map, Google sets nothing. Loading it is
          entirely your choice and counts as your consent for that single feature.
        </p>

        <h2>External links</h2>
        <p>
          Some buttons open external sites in a new tab (for example the CCiC Google
          Form and the ValidAid donation page). Those sites have their own cookies
          and privacy policies, which we do not control.
        </p>

        <h2>Managing cookies</h2>
        <p>
          You can view, block or delete cookies at any time through your browser
          settings. Because we do not rely on cookies, blocking them will not affect
          your use of this website (except that you may need to re-confirm loading
          the Google map).
        </p>

        <h2>More information</h2>
        <p>
          See our <a href="/privacy">Privacy Policy</a> for how we handle personal
          data, or contact <a href="mailto:hello@oy4c.org">hello@oy4c.org</a>.
        </p>
      </main>
    </>
  )
}
