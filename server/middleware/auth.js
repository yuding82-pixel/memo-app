import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'memo-app-dev-secret'

export function signToken(user) {
  return jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '7d',
  })
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: '로그인이 필요합니다.' })
  }

  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = { id: payload.userId, username: payload.username }
    next()
  } catch {
    return res.status(401).json({ error: '유효하지 않거나 만료된 토큰입니다.' })
  }
}
