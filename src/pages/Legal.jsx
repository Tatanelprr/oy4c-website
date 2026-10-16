import styles from './Legal.module.css'

// Legal notice / "impressum" required in the UK by the Electronic Commerce
// (EC Directive) Regulations 2002 and the Companies Act 2006: the service
// provider must give its name, geographic address, contact details and
// registration details in a form that is easily, directly and permanently
// accessible. Details verified on Companies House (company no. 12309941).

export default function Legal() {
  return (
    <>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Legal information</span>
          <h1>Legal Notice</h1>
          <p className={styles.updated}>Last updated: 16 October 2026</p>
        </div>
      </header>

      <main className={styles.doc}>
        <p>
          This website, <strong>oy4c.org</strong>, is published by{' '}
          <strong>Climate 2025 Limited, trading as Host</strong>, the fiscal host of
          the project <strong>Our Youth 4 The Climate (OY4C)</strong>.
          The information below is provided in accordance with the UK Electronic
          Commerce (EC Directive) Regulations 2002 and the Companies Act 2006.
        </p>

        <h2>Publisher</h2>
        <ul>
          <li><strong>Project:</strong> Our Youth 4 The Climate (OY4C)</li>
          <li>
            <strong>Publishing entity:</strong> Climate 2025 Limited, trading as Host
            (the fiscal host of Our Youth 4 The Climate)
          </li>
          <li>
            <strong>Legal form &amp; registration:</strong> a private company limited
            by guarantee without share capital, registered in England and Wales,
            company registration number 12309941
          </li>
          <li>
            <strong>Registered office:</strong> Electric Works, 3 Concourse Way,
            Sheffield, England, S1 2BJ
          </li>
          {/* TODO: add back a VAT number line if Host confirms GB454839164 belongs to Climate 2025 Limited. */}
          <li>
            <strong>Contact email:</strong>{' '}
            <a href="mailto:hello@oy4c.org">hello@oy4c.org</a>
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
