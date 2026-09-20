import styles from './Legal.module.css'

// Legal notice / "impressum" required in the UK by the Electronic Commerce
// (EC Directive) Regulations 2002 and the Companies Act 2006: the service
// provider must give its name, geographic address, contact details and
// registration details in a form that is easily, directly and permanently
// accessible. Fields the editor still has to confirm are marked [TO COMPLETE].
const TODO = ({ children }) => <span className={styles.todo}>[{children}]</span>

export default function Legal() {
  return (
    <>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Legal information</span>
          <h1>Legal Notice</h1>
          <p className={styles.updated}>Last updated: 20 September 2026</p>
        </div>
      </header>

      <main className={styles.doc}>
        <p>
          This website, <strong>oy4c.org</strong>, is published by the organisation
          responsible for the project <strong>Our Youth 4 The Climate (OY4C)</strong>.
          The information below is provided in accordance with the UK Electronic
          Commerce (EC Directive) Regulations 2002 and the Companies Act 2006.
        </p>

        <h2>Publisher</h2>
        <ul>
          <li><strong>Project:</strong> Our Youth 4 The Climate (OY4C)</li>
          <li>
            <strong>Publishing entity:</strong>{' '}
            <TODO>TO COMPLETE — exact legal name of the fiscal host, e.g. “Host”
            (formerly Climate 2025)</TODO>
          </li>
          <li>
            <strong>Legal form &amp; registration:</strong> a company registered in
            England and Wales, company registration number{' '}
            <TODO>TO COMPLETE — 8-digit Companies House number</TODO>
          </li>
          <li>
            <strong>Registered office:</strong>{' '}
            <TODO>TO COMPLETE — full registered address</TODO>
          </li>
          <li>
            <strong>VAT number:</strong> GB454839164{' '}
            <TODO>TO CONFIRM — this number is in VAT format; the value shown in the
            site footer should be the VAT number, not the company registration
            number</TODO>
          </li>
          <li>
            <strong>Contact email:</strong>{' '}
            <a href="mailto:hello@oy4c.org">hello@oy4c.org</a>
          </li>
          <li>
            <strong>Person responsible for publication:</strong>{' '}
            <TODO>TO COMPLETE — name and role, e.g. Ava Langridge, Founder &amp;
            Executive Director</TODO>
          </li>
        </ul>

        <h2>Hosting provider</h2>
        <p>The website is hosted by:</p>
        <ul>
          <li><strong>Vercel Inc.</strong></li>
          <li>340 S Lemon Ave #4133, Walnut, CA 91789, United States</li>
          <li>Website: <a href="https://vercel.com" target="_blank" rel="noreferrer">vercel.com</a></li>
        </ul>
        <p>
          Editorial content (blog, team and partner listings) is managed through
          Notion (Notion Labs, Inc.) and retrieved server-side; no visitor data is
          sent to Notion.
        </p>

        <h2>Intellectual property</h2>
        <p>
          Unless otherwise stated, the content of this website (text, graphics,
          logos and the OY4C name and marks) belongs to Our Youth 4 The Climate or
          is used with permission. Third-party names and logos shown on the site
          (for example under “As Seen In” or “Our partners”) remain the property of
          their respective owners and are used for identification purposes only.
        </p>

        <h2>Contact</h2>
        <p>
          For any question about this notice, email{' '}
          <a href="mailto:hello@oy4c.org">hello@oy4c.org</a>. See also our{' '}
          <a href="/privacy">Privacy Policy</a> and <a href="/cookies">Cookies Policy</a>.
        </p>
      </main>
    </>
  )
}
