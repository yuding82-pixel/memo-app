export function toMemoDto(memo) {
  return {
    id: memo.id,
    title: memo.title,
    content: memo.content,
    updatedAt: Number(memo.updatedAt),
  }
}
