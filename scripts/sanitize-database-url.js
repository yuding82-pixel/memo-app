export function sanitizeDatabaseUrl(raw) {
  if (!raw) return ''

  let url = raw.trim()

  if (url.startsWith('DATABASE_URL=')) {
    url = url.slice('DATABASE_URL='.length).trim()
  }

  if (
    (url.startsWith('"') && url.endsWith('"')) ||
    (url.startsWith("'") && url.endsWith("'"))
  ) {
    url = url.slice(1, -1).trim()
  }

  return url
}

export function applyDatabaseUrl() {
  const url = sanitizeDatabaseUrl(process.env.DATABASE_URL)

  if (!url) {
    console.error(`
❌ DATABASE_URL이 비어 있습니다.

Render → Environment 에서 추가:
Key  : DATABASE_URL
Value: postgresql://postgres.brzvlbqytwgjzpylazkp:비밀번호@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres
`)
    process.exit(1)
  }

  if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) {
    console.error(`
❌ DATABASE_URL 형식이 잘못되었습니다.

지금 값의 앞부분: ${JSON.stringify(url.slice(0, 40))}

아래처럼 postgresql:// 로 시작해야 합니다:
postgresql://postgres.brzvlbqytwgjzpylazkp:비밀번호@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres

흔한 실수:
- DATABASE_URL= 접두어까지 붙여넣음
- 따옴표(")까지 붙여넣음
- 값이 중간에 잘림
`)
    process.exit(1)
  }

  process.env.DATABASE_URL = url
  return url
}
