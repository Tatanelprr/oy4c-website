// Points Git at the versioned hooks in .githooks/. Run by `npm install`
// (prepare). Does nothing on Vercel/CI or outside a Git checkout, so it
// can never break a build.
import { execSync } from 'node:child_process'

if (process.env.VERCEL || process.env.CI) process.exit(0)

try {
  execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' })
  execSync('git config core.hooksPath .githooks', { stdio: 'ignore' })
} catch {
  // no Git or no repository: nothing to set up
}
