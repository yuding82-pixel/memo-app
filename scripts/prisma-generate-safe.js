import { execSync } from 'child_process'

if (!process.env.DATABASE_URL) {
  console.log('[postinstall] DATABASE_URL 없음 — prisma generate 건너뜀')
  process.exit(0)
}

execSync('npx prisma generate', { stdio: 'inherit' })
