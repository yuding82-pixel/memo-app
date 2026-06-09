import { useCallback, useEffect, useState } from 'react'
import { api } from './api/client'
import { useAuth } from './context/AuthContext'
import AuthForm from './components/AuthForm'
import MemoItem from './components/MemoItem'
import './App.css'

function App() {
  const { user, loading, register, login, logout } = useAuth()
  const [memos, setMemos] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [memosLoading, setMemosLoading] = useState(false)
  const [error, setError] = useState('')

  const loadMemos = useCallback(async () => {
    setMemosLoading(true)
    setError('')
    try {
      const data = await api.getMemos()
      setMemos(data.memos.map((memo) => ({ ...memo, isEditing: false })))
    } catch (err) {
      setError(err.message)
    } finally {
      setMemosLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      loadMemos()
    } else {
      setMemos([])
      setSearchQuery('')
    }
  }, [user, loadMemos])

  const createMemo = async () => {
    setError('')
    try {
      const data = await api.createMemo()
      setSearchQuery('')
      setMemos((prev) => [{ ...data.memo, isEditing: true }, ...prev])
    } catch (err) {
      setError(err.message)
    }
  }

  const editMemo = (id) => {
    setMemos((prev) =>
      prev.map((memo) => (memo.id === id ? { ...memo, isEditing: true } : memo))
    )
  }

  const saveMemo = async (id) => {
    const memo = memos.find((item) => item.id === id)
    if (!memo) return

    setError('')
    try {
      const data = await api.updateMemo(id, memo.title, memo.content)
      setMemos((prev) =>
        prev.map((item) =>
          item.id === id ? { ...data.memo, isEditing: false } : item
        )
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteMemo = async (id) => {
    setError('')
    try {
      await api.deleteMemo(id)
      setMemos((prev) => prev.filter((memo) => memo.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const updateMemo = (id, field, value) => {
    setMemos((prev) =>
      prev.map((memo) => (memo.id === id ? { ...memo, [field]: value } : memo))
    )
  }

  if (loading) {
    return <p className="loading-message">불러오는 중...</p>
  }

  if (!user) {
    return <AuthForm onLogin={login} onRegister={register} />
  }

  const query = searchQuery.trim().toLowerCase()
  const filteredMemos = memos.filter((memo) => {
    if (memo.isEditing) return true
    if (!query) return true
    return (
      memo.title.toLowerCase().includes(query) ||
      memo.content.toLowerCase().includes(query)
    )
  })

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-row">
          <div>
            <h1>메모 앱</h1>
            <p className="app-subtitle">{user.username}님의 메모</p>
          </div>
          <button type="button" className="btn btn-secondary" onClick={logout}>
            로그아웃
          </button>
        </div>
      </header>

      {error && <p className="app-error">{error}</p>}

      <div className="toolbar">
        <button type="button" className="btn btn-primary" onClick={createMemo}>
          새 메모
        </button>
        <div className="search-box">
          <input
            type="search"
            className="search-input"
            placeholder="메모 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <main className="memo-list">
        {memosLoading ? (
          <p className="empty-message">메모를 불러오는 중...</p>
        ) : filteredMemos.length === 0 ? (
          <p className="empty-message">
            {query ? '검색 결과가 없습니다.' : '메모가 없습니다. "새 메모"를 눌러 시작하세요.'}
          </p>
        ) : (
          filteredMemos.map((memo) => (
            <MemoItem
              key={memo.id}
              memo={memo}
              onEdit={editMemo}
              onSave={saveMemo}
              onDelete={deleteMemo}
              onChange={updateMemo}
            />
          ))
        )}
      </main>
    </div>
  )
}

export default App
