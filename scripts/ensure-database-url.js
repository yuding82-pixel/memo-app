if (!process.env.DATABASE_URL?.trim()) {
  console.error(`
❌ DATABASE_URL 환경 변수가 없습니다.

Render 설정 방법:
1. Render 대시보드 → memo-app-api 클릭
2. 왼쪽 Environment 메뉴
3. Add Environment Variable
   Key   : DATABASE_URL
   Value : Supabase Session pooler URI (postgresql:// 로 시작)
4. Save Changes 후 Manual Deploy

주의: Value에 따옴표(")를 넣지 마세요.
`)
  process.exit(1)
}
