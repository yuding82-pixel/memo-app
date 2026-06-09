import prisma from '../server/db.js'

const users = await prisma.user.findMany({
  select: { id: true, username: true, createdAt: true },
})
const memos = await prisma.memo.findMany({
  select: { id: true, title: true, content: true, updatedAt: true, userId: true },
  orderBy: { updatedAt: 'desc' },
})

console.log(`사용자: ${users.length}명`)
users.forEach((u) => console.log(`  - ${u.username} (id: ${u.id})`))

console.log(`메모: ${memos.length}개`)
memos.forEach((m) => {
  const preview = (m.title || m.content || '(빈 메모)').slice(0, 40)
  console.log(`  - [user ${m.userId}] ${preview}`)
})

await prisma.$disconnect()
