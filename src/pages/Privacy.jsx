import styles from './Legal.module.css'

// Privacy notice built from what the site actually does, under the UK GDPR and
// the Data Protection Act 2018 (regulator: the ICO). The site sets no cookies of
// its own and runs no analytics; the processing described below is limited to
// hosting logs, opt-in third-party embeds and off-site tools the visitor chooses
// to use. Fields the editor must confirm are marked [TO COMPLETE].
const TODO = ({ children }) => <span className={styles.todo}>[{children}]</span>

export default function Privacy() {
  return (
    <>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Your data</span>
          <h1>Privacy Policy</h1>
          <p className={styles.updated}>Last updated: 20 September 2026</p>
        </div>
      </header>

      <main className={styles.doc}>
        <p>
          This policy explains how Our Youth 4 The Climate (“OY4C”, “we”) handles
          personal data in connection with the website <strong>oy4c.org</strong>. We
          are committed to processing data lawfully and transparently under the{' '}
          <strong>UK GDPR</strong> and the <strong>Data Protection Act 2018</strong>.
        </p>

        <div className={styles.callout}>
          <strong>In short:</strong> this website does not set any cookies of its
          own, does not use analytics, advertising or tracking, and has no contact
          form or user accounts. The only personal data involved is your server log
          data, plus data you actively choose to share (by emailing us, or by using
          the external Google Form / donation links).
        </div>

        <h2>1. Who is responsible for your data</h2>
        <p>
          The data controller is the publishing entity behind OY4C:{' '}
          <TODO>TO COMPLETE — exact legal name and registered address, see the{' '}
          Legal Notice</TODO>. For any privacy request, contact{' '}
          <TODO>TO COMPLETE — dedicated privacy/data email, e.g.
          privacy@oy4c.org</TODO> or, failing that,{' '}
          <a href="mailto:hello@oy4c.org">hello@oy4c.org</a>.
        </p>

        <h2>2. What we process, why, and on what basis</h2>

        <h3>a. Hosting &amp; server logs</h3>
        <p>
          Our host, <strong>Vercel Inc.</strong> (United States), automatically
          records technical data needed to serve and secure the site: IP address,
          browser/user-agent, requested pages, timestamps and referrer.
        </p>
        <ul>
          <li><strong>Purpose:</strong> deliver the site, ensure security and diagnose faults.</li>
          <li><strong>Legal basis:</strong> legitimate interests (running a secure website).</li>
          <li><strong>Retention:</strong> short-term, per Vercel’s logging defaults <TODO>TO CONFIRM retention period with Vercel</TODO>.</li>
          <li><strong>Recipient / transfer:</strong> Vercel Inc. in the United States (see section 4).</li>
        </ul>

        <h3>b. Interactive map (Google Maps — only if you click to load it)</h3>
        <p>
          On the CCiC page, a “CCiC around the world” map from Google Maps is{' '}
          <strong>not loaded by default</strong>. It only loads if you explicitly
          click “Click to load the map”. When you do, Google receives your IP
          address and may set cookies.
        </p>
        <ul>
          <li><strong>Purpose:</strong> show where CCiC workshops have taken place.</li>
          <li><strong>Legal basis:</strong> your consent (your click).</li>
          <li><strong>Recipient / transfer:</strong> Google (United States). See Google’s privacy policy.</li>
        </ul>

        <h3>c. Fonts and map background (self-hosted)</h3>
        <p>
          Web fonts and the world-map background are served from our own domain. No
          request is made to Google Fonts or to any external CDN, so no data is sent
          to those third parties.
        </p>

        <h3>d. If you email us</h3>
        <p>
          The site offers <code>mailto:</code> links (e.g. hello@oy4c.org). If you
          write to us, we process your email address and the content of your message.
        </p>
        <ul>
          <li><strong>Purpose:</strong> reply to and manage your enquiry.</li>
          <li><strong>Legal basis:</strong> legitimate interests / steps at your request.</li>
          <li><strong>Recipient:</strong> our email provider <TODO>TO COMPLETE — name your email provider, e.g. Google Workspace</TODO>.</li>
        </ul>

        <h3>e. CCiC “Open Resource” form (external — Google Forms)</h3>
        <p>
          The “Get the Open Resource” button opens an external{' '}
          <strong>Google Form</strong> in a new tab. Any data you enter there is
          collected through Google Forms; we act as controller of the responses, and
          Google acts as our processor.
        </p>
        <ul>
          <li><strong>Purpose:</strong> send you the CCiC open resource kit.</li>
          <li><strong>Legal basis:</strong> your consent (you choose to submit the form).</li>
          <li><strong>Recipient / transfer:</strong> Google (United States).</li>
          <li><strong>Note:</strong> <TODO>TO REVIEW — check the fields requested in the Google Form are limited to what is necessary, and add a privacy note inside the form</TODO>.</li>
        </ul>

        <h3>f. Donations (external — ValidAid)</h3>
        <p>
          “Donate” links point to an external platform,{' '}
          <a href="https://validaid.org/fundraiser/174" target="_blank" rel="noreferrer">ValidAid</a>.
          Donations and payment data are handled entirely by ValidAid under its own
          privacy policy; we do not process card data on this site.
        </p>

        <h2>3. Cookies and tracking</h2>
        <p>
          This website sets <strong>no cookies of its own</strong> and uses no
          analytics or advertising technologies. The only third party that can set a
          cookie is Google Maps, and only after you choose to load the map. For
          details, see our <a href="/cookies">Cookies Policy</a>.
        </p>

        <h2>4. International transfers</h2>
        <p>
          Some providers are located in the United States (Vercel; Google, if you
          load the map or use the external form). Where personal data is transferred
          outside the UK, it is protected by appropriate safeguards, such as the UK
          International Data Transfer Agreement / Addendum to the EU Standard
          Contractual Clauses, and the UK Extension to the EU–US Data Privacy
          Framework where applicable.
        </p>

        <h2>5. Your rights</h2>
        <p>Under the UK GDPR you have the right to:</p>
        <ul>
          <li>access your personal data;</li>
          <li>have inaccurate data corrected (rectification);</li>
          <li>have your data erased;</li>
          <li>restrict or object to processing;</li>
          <li>data portability;</li>
          <li>withdraw consent at any time (this does not affect prior processing).</li>
        </ul>
        <p>
          To exercise any of these, contact us using the details in section 1. You
          also have the right to lodge a complaint with the UK regulator, the{' '}
          <strong>Information Commissioner’s Office (ICO)</strong> —{' '}
          <a href="https://ico.org.uk" target="_blank" rel="noreferrer">ico.org.uk</a>.
        </p>

        <h2>6. Children</h2>
        <p>
          OY4C works with young people and schools, but this website does not
          knowingly collect personal data from children through the site itself.
          Any data collected in the course of educational activities is handled
          separately.{' '}
          <TODO>TO COMPLETE — if the external Google Form or school activities can
          collect data from under-18s, describe the safeguards and consent process
          used, and have this reviewed</TODO>.
        </p>

        <h2>7. Changes</h2>
        <p>
          We may update this policy; the “last updated” date above reflects the
          latest version.
        </p>
      </main>
    </>
  )
}
