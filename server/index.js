import express from 'express'
import cors from 'cors'
import prisma from './db.js'
import authRoutes from './routes/auth.js'
import memoRoutes from './routes/memos.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRoutes)
app.use('/api/memos', memoRoutes)

const server = app.listen(PORT, () => {
  console.log(`API 서버 실행 중: http://localhost:${PORT}`)
})

async function shutdown() {
  server.close()
  await prisma.$disconnect()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
