const TOKEN_KEY = 'memo_app_token'
const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://memo-app-x08y.onrender.com' : '')

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers,
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || `요청에 실패했습니다. (${response.status})`)
  }

  return data
}

export const api = {
  register: (username, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  me: () => request('/auth/me'),

  getMemos: () => request('/memos'),

  createMemo: () =>
    request('/memos', {
      method: 'POST',
      body: JSON.stringify({}),
    }),

  updateMemo: (id, title, content) =>
    request(`/memos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content }),
    }),

  deleteMemo: (id) =>
    request(`/memos/${id}`, {
      method: 'DELETE',
    }),
}
