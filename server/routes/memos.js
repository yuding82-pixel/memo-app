import { Router } from 'express'
import { randomUUID } from 'crypto'
import prisma from '../db.js'
import { authMiddleware } from '../middleware/auth.js'
import { toMemoDto } from '../utils/memo.js'

const router = Router()

router.use(authMiddleware)

router.get('/', async (req, res) => {
  const memos = await prisma.memo.findMany({
    where: { userId: req.user.id },
    orderBy: { updatedAt: 'desc' },
  })

  return res.json({ memos: memos.map(toMemoDto) })
})

router.post('/', async (req, res) => {
  const id = randomUUID()
  const now = Date.now()

  const memo = await prisma.memo.create({
    data: {
      id,
      userId: req.user.id,
      title: '',
      content: '',
      updatedAt: now,
    },
  })

  return res.status(201).json({ memo: toMemoDto(memo) })
})

router.put('/:id', async (req, res) => {
  const { title = '', content = '' } = req.body
  const now = Date.now()

  const result = await prisma.memo.updateMany({
    where: { id: req.params.id, userId: req.user.id },
    data: { title, content, updatedAt: now },
  })

  if (result.count === 0) {
    return res.status(404).json({ error: '메모를 찾을 수 없습니다.' })
  }

  return res.json({
    memo: { id: req.params.id, title, content, updatedAt: Number(now) },
  })
})

router.delete('/:id', async (req, res) => {
  const result = await prisma.memo.deleteMany({
    where: { id: req.params.id, userId: req.user.id },
  })

  if (result.count === 0) {
    return res.status(404).json({ error: '메모를 찾을 수 없습니다.' })
  }

  return res.status(204).send()
})

export default router
