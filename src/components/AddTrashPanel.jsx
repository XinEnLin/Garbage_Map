import { useState } from 'react'
import { typeLabel } from './markers'

export default function AddTrashPanel({ draft, onConfirm, onCancel }) {
  const [type, setType] = useState('general')
  const [name, setName] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function removePhoto() {
    setPhotoFile(null)
    setPreviewUrl(null)
  }

  if (!draft) return null

  return (
    <div className="tm-panel" role="dialog" aria-label="新增垃圾桶">
      <div className="tm-panel__handle" />
      <h2 className="tm-panel__title">新增垃圾桶</h2>
      <p className="tm-panel__hint">
        拖曳地圖上的圖釘可以微調位置。確認後就會出現在地圖上。
      </p>

      <div className="tm-field">
        <span className="tm-field__label">類型</span>
        <div className="tm-segmented">
          {['general', 'recycle'].map((t) => (
            <button
              key={t}
              type="button"
              className={`tm-segmented__btn ${type === t ? 'is-active' : ''}`}
              onClick={() => setType(t)}
            >
              {typeLabel[t]}
            </button>
          ))}
        </div>
      </div>

      <div className="tm-field">
        <label className="tm-field__label" htmlFor="tm-name">
          名稱或地標（選填）
        </label>
        <input
          id="tm-name"
          className="tm-input"
          type="text"
          placeholder="例如：捷運站 2 號出口"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
        />
      </div>

      <div className="tm-field">
        <span className="tm-field__label">照片（選填）</span>
        <label className="tm-photo-upload" htmlFor="tm-photo">
          {previewUrl
            ? <img src={previewUrl} alt="預覽" className="tm-photo-preview" />
            : <span className="tm-photo-placeholder">📷 點擊選擇或拍攝照片</span>
          }
          <input
            id="tm-photo"
            type="file"
            accept="image/*"
            capture="environment"
            className="tm-visually-hidden"
            onChange={handlePhotoChange}
          />
        </label>
        {photoFile && (
          <button type="button" className="tm-photo-clear" onClick={removePhoto}>
            移除照片
          </button>
        )}
      </div>

      <div className="tm-panel__coords">
        {draft.lat.toFixed(5)}, {draft.lng.toFixed(5)}
      </div>

      <div className="tm-panel__actions">
        <button type="button" className="tm-btn tm-btn--ghost" onClick={onCancel}>
          取消
        </button>
        <button
          type="button"
          className="tm-btn tm-btn--primary"
          onClick={() => onConfirm({ type, name: name.trim(), photoFile })}
        >
          確認新增
        </button>
      </div>
    </div>
  )
}
