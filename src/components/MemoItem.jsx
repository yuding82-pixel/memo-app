function MemoItem({ memo, onEdit, onSave, onDelete, onChange }) {
  const formattedDate = new Date(memo.updatedAt).toLocaleString('ko-KR')

  if (memo.isEditing) {
    return (
      <article className="memo-card memo-card--editing">
        <input
          type="text"
          className="memo-title-input"
          placeholder="제목을 입력하세요"
          value={memo.title}
          onChange={(e) => onChange(memo.id, 'title', e.target.value)}
          autoFocus={memo.title === '' && memo.content === ''}
        />
        <textarea
          className="memo-content-input"
          placeholder="내용을 입력하세요"
          value={memo.content}
          onChange={(e) => onChange(memo.id, 'content', e.target.value)}
          rows={6}
        />
        <div className="memo-actions">
          <button type="button" className="btn btn-save" onClick={() => onSave(memo.id)}>
            저장
          </button>
          <button type="button" className="btn btn-delete" onClick={() => onDelete(memo.id)}>
            삭제
          </button>
        </div>
      </article>
    )
  }

  return (
    <article className="memo-card">
      <h2 className="memo-title">{memo.title || '(제목 없음)'}</h2>
      <p className="memo-content">{memo.content || '(내용 없음)'}</p>
      <time className="memo-date">{formattedDate}</time>
      <div className="memo-actions">
        <button type="button" className="btn btn-edit" onClick={() => onEdit(memo.id)}>
          수정
        </button>
        <button type="button" className="btn btn-delete" onClick={() => onDelete(memo.id)}>
          삭제
        </button>
      </div>
    </article>
  )
}

export default MemoItem
