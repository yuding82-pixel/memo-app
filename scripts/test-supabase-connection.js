import pg from 'pg'

const { Client } = pg

const projectRef = process.env.SUPABASE_PROJECT_REF
const password = process.env.SUPABASE_DB_PASSWORD

if (!projectRef || !password) {
  console.error('SUPABASE_PROJECT_REF, SUPABASE_DB_PASSWORD 환경 변수가 필요합니다.')
  process.exit(1)
}

const regions = [
  'ap-northeast-2',
  'ap-northeast-1',
  'ap-southeast-1',
  'us-east-1',
  'us-west-1',
  'eu-west-1',
]

const candidates = [
  ...regions.map(
    (region) =>
      `postgresql://postgres.${projectRef}:${password}@aws-0-${region}.pooler.supabase.com:5432/postgres`
  ),
  ...regions.map(
    (region) =>
      `postgresql://postgres.${projectRef}:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`
  ),
  `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`,
]

for (const connectionString of candidates) {
  const label = connectionString
    .replace(password, '***')
    .replace(`postgres.${projectRef}`, 'postgres.[ref]')

  const client = new Client({ connectionString, connectionTimeoutMillis: 8000 })

  try {
    await client.connect()
    await client.query('SELECT 1')
    console.log(`연결 성공: ${label}`)
    await client.end()
    process.exit(0)
  } catch (error) {
    console.log(`실패: ${label}`)
    console.log(`  → ${error.message}`)
    await client.end().catch(() => {})
  }
}

console.error('모든 연결 방식에서 실패했습니다.')
process.exit(1)
