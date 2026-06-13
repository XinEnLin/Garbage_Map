import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { typeLabel } from './markers'

function formatTime(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function DetailPanel({ can, onClose, onDelete }) {
  const [likeCount, setLikeCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)
  const [comments, setComments] = useState([])
  const [authorName, setAuthorName] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    if (!can) return
    setLikeCount(0)
    setComments([])
    setConfirming(false)
    setLiked(localStorage.getItem(`liked_${can.id}`) === '1')

    supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('trash_can_id', can.id)
      .then(({ count }) => setLikeCount(count ?? 0))

    supabase
      .from('comments')
      .select('*')
      .eq('trash_can_id', can.id)
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => setComments(data ?? []))
  }, [can])

  async function handleLike() {
    if (liked || liking) return
    setLiking(true)
    const { error } = await supabase.from('likes').insert({ trash_can_id: can.id })
    if (!error) {
      localStorage.setItem(`liked_${can.id}`, '1')
      setLiked(true)
      setLikeCount((n) => n + 1)
    }
    setLiking(false)
  }

  async function handleDelete() {
    setIsRemoving(true)
    await onDelete(can.id)
    setIsRemoving(false)
  }

  async function handleComment(e) {
    e.preventDefault()
    if (!body.trim() || submitting) return
    setSubmitting(true)
    const { data, error } = await supabase
      .from('comments')
      .insert({ trash_can_id: can.id, author_name: authorName.trim() || '匿名', body: body.trim() })
      .select()
      .single()
    if (!error) {
      setComments((prev) => [data, ...prev])
      setBody('')
      setAuthorName('')
    }
    setSubmitting(false)
  }

  if (!can) return null

  return (
    <div className="tm-panel tm-panel--detail" role="dialog" aria-label="垃圾桶詳情">
      <div className="tm-panel__handle" />

      <div className="tm-detail-header">
        <div className="tm-detail-header__info">
          <strong className="tm-popup__name">{can.name || '未命名垃圾桶'}</strong>
          <span className={`tm-tag tm-tag--${can.type}`}>{typeLabel[can.type]}</span>
          <span className="tm-popup__meta">{can.source === 'user' ? '使用者新增' : '政府開放資料'}</span>
        </div>
        <button type="button" className="tm-detail-close" onClick={onClose} aria-label="關閉">✕</button>
      </div>

      {can.photo_url && (
        <img src={can.photo_url} alt="垃圾桶照片" className="tm-detail-photo" />
      )}

      <div className="tm-like-row">
        <button
          type="button"
          className={`tm-like-btn ${liked ? 'is-liked' : ''}`}
          onClick={handleLike}
          disabled={liked || liking}
          aria-label="按愛心"
        >
          {liked ? '♥' : '♡'}
        </button>
        <span className="tm-like-count">{likeCount}</span>
      </div>

      <div className="tm-comments">
        <h3 className="tm-comments__title">留言 ({comments.length})</h3>

        <form className="tm-comment-form" onSubmit={handleComment}>
          <input
            className="tm-input tm-input--sm"
            type="text"
            placeholder="暱稱（選填）"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            maxLength={30}
          />
          <textarea
            className="tm-textarea"
            placeholder="留下你的評論…（最多 200 字）"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={200}
            rows={3}
            required
          />
          <button
            type="submit"
            className="tm-btn tm-btn--primary tm-btn--sm"
            disabled={!body.trim() || submitting}
          >
            {submitting ? '送出中…' : '送出留言'}
          </button>
        </form>

        {comments.length === 0 ? (
          <p className="tm-comments__empty">還沒有留言，來搶頭香！</p>
        ) : (
          <ul className="tm-comment-list">
            {comments.map((c) => (
              <li key={c.id} className="tm-comment">
                <div className="tm-comment__meta">
                  <span className="tm-comment__author">{c.author_name}</span>
                  <span className="tm-comment__time">{formatTime(c.created_at)}</span>
                </div>
                <p className="tm-comment__body">{c.body}</p>
              </li>
            ))}
          </ul>
        )}

        <div className="tm-detail-header__actions">
            {can.source === 'user' && (
              confirming ? (
                <span className="tm-confirm-row">
                  <button
                    type="button"
                    className="tm-btn tm-btn--danger tm-btn--sm"
                    onClick={handleDelete}
                    disabled={isRemoving}
                  >
                    {isRemoving ? '刪除中…' : '確定刪除'}
                  </button>
                  <button
                    type="button"
                    className="tm-btn tm-btn--sm"
                    onClick={() => setConfirming(false)}
                    disabled={isRemoving}
                  >
                    取消
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  className="tm-btn tm-btn--danger tm-btn--sm"
                  
                  onClick={() => setConfirming(true)}
                  aria-label="刪除垃圾桶"
                >
                  🗑 刪除
                </button>
              )
            )}

          </div>
      </div>
    </div>
  )
}
