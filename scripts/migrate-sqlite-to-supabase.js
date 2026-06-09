import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const prisma = new PrismaClient()

const sources = [
  path.join(__dirname, '../server/memoapp.db'),
  path.join(__dirname, '../prisma/dev.db'),
]

function openSqlite() {
  for (const dbPath of sources) {
    try {
      const sqlite = new Database(dbPath, { readonly: true })
      const users = sqlite.prepare('SELECT COUNT(*) AS c FROM users').get().c
      if (users > 0) {
        console.log(`데이터 소스: ${dbPath}`)
        return sqlite
      }
      sqlite.close()
    } catch {
      // try next source
    }
  }
  return null
}

async function main() {
  const sqlite = openSqlite()
  if (!sqlite) {
    console.log('이전할 로컬 데이터가 없습니다.')
    return
  }

  const users = sqlite.prepare('SELECT id, username, password_hash, created_at FROM users').all()
  const memos = sqlite
    .prepare('SELECT id, user_id, title, content, updated_at FROM memos')
    .all()

  console.log(`로컬 데이터: 사용자 ${users.length}명, 메모 ${memos.length}개`)

  const existingUsers = await prisma.user.count()
  if (existingUsers > 0) {
    console.log('Supabase에 이미 데이터가 있어 이전을 건너뜁니다.')
    return
  }

  const userIdMap = new Map()

  for (const user of users) {
    const created = await prisma.user.create({
      data: {
        username: user.username,
        passwordHash: user.password_hash,
        createdAt: BigInt(user.created_at),
      },
    })
    userIdMap.set(user.id, created.id)
  }

  for (const memo of memos) {
    const newUserId = userIdMap.get(memo.user_id)
    if (!newUserId) continue

    await prisma.memo.create({
      data: {
        id: memo.id,
        userId: newUserId,
        title: memo.title,
        content: memo.content,
        updatedAt: BigInt(memo.updated_at),
      },
    })
  }

  console.log('Supabase로 데이터 이전 완료!')
}

main()
  .catch((error) => {
    console.error('이전 실패:', error.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
