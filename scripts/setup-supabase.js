import { execSync } from 'child_process'

console.log('1/3 Prisma Client 생성...')
execSync('npx prisma generate', { stdio: 'inherit' })

console.log('2/3 Supabase에 스키마 적용...')
execSync('npx prisma db push', { stdio: 'inherit' })

console.log('3/3 SQLite 데이터 이전...')
try {
  execSync('node scripts/migrate-sqlite-to-supabase.js', { stdio: 'inherit' })
} catch {
  console.log('데이터 이전 단계를 건너뜁니다. (로컬 DB 없음 또는 이미 이전됨)')
}

console.log('Supabase 설정 완료!')
