import { Router } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../db.js'
import { authMiddleware, signToken } from '../middleware/auth.js'

const router = Router()

router.post('/register', async (req, res) => {
  const { username, password } = req.body

  if (!username?.trim() || !password) {
    return res.status(400).json({ error: '아이디와 비밀번호를 입력해 주세요.' })
  }

  const trimmedUsername = username.trim()
  if (trimmedUsername.length < 3) {
    return res.status(400).json({ error: '아이디는 3자 이상이어야 합니다.' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: '비밀번호는 6자 이상이어야 합니다.' })
  }

  const passwordHash = bcrypt.hashSync(password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        username: trimmedUsername,
        passwordHash,
        createdAt: Date.now(),
      },
      select: { id: true, username: true },
    })

    const token = signToken(user)
    return res.status(201).json({ token, user })
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: '이미 사용 중인 아이디입니다.' })
    }
    return res.status(500).json({ error: '회원가입에 실패했습니다.' })
  }
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (!username?.trim() || !password) {
    return res.status(400).json({ error: '아이디와 비밀번호를 입력해 주세요.' })
  }

  const user = await prisma.user.findUnique({
    where: { username: username.trim() },
    select: { id: true, username: true, passwordHash: true },
  })

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' })
  }

  const token = signToken({ id: user.id, username: user.username })
  return res.json({ token, user: { id: user.id, username: user.username } })
})

router.get('/me', authMiddleware, (req, res) => {
  return res.json({ user: req.user })
})

export default router
