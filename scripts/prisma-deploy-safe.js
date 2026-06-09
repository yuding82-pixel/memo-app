import { execSync } from 'child_process'
import { applyDatabaseUrl } from './sanitize-database-url.js'

const INIT_MIGRATION = '20260609120000_init_postgres'

applyDatabaseUrl()

function run(command) {
  execSync(command, { stdio: 'inherit', env: process.env, shell: true })
}

function runCapture(command) {
  try {
    execSync(command, { stdio: 'pipe', env: process.env, shell: true })
    return { ok: true, output: '' }
  } catch (error) {
    const output = `${error.stdout || ''}${error.stderr || ''}${error.message}`
    return { ok: false, output }
  }
}

const result = runCapture('npx prisma migrate deploy')

if (result.ok) {
  process.exit(0)
}

if (!result.output.includes('P3005')) {
  console.error(result.output)
  process.exit(1)
}

console.log('기존 Supabase DB 감지 — migration baseline 적용 중...')

try {
  run(`npx prisma migrate resolve --applied ${INIT_MIGRATION}`)
} catch {
  console.log('baseline이 이미 적용되었습니다.')
}

run('npx prisma migrate deploy')
