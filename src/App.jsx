import { useRef, useState } from 'react'
import TrashMap from './components/TrashMap'
import AddTrashPanel from './components/AddTrashPanel'
import { sampleTrashCans } from './data/sampleTrashCans'

export default function App() {
  const [cans, setCans] = useState(sampleTrashCans)
  const [addMode, setAddMode] = useState(false)
  const [draft, setDraft] = useState(null) // { lat, lng } 待確認的新垃圾桶
  const mapRef = useRef(null)

  function startAdding() {
    setAddMode(true)
    setDraft(null)
  }

  function cancelAdding() {
    setAddMode(false)
    setDraft(null)
  }

  function confirmAdd({ type, name }) {
    setCans((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        lat: draft.lat,
        lng: draft.lng,
        type,
        name,
        source: 'user',
      },
    ])
    setAddMode(false)
    setDraft(null)
    // TODO：在這裡呼叫後端，把新垃圾桶寫進 Firebase / Supabase
  }

  function locateMe() {
    if (!navigator.geolocation) {
      alert('這個瀏覽器不支援定位功能')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current?.flyTo([pos.coords.latitude, pos.coords.longitude], 16)
      },
      () => alert('無法取得你的位置，請確認已允許定位權限'),
    )
  }

  return (
    <div className="tm-app">
      <header className="tm-header">
        <div className="tm-brand">
          <span className="tm-brand__mark">♺</span>
          <span className="tm-brand__text">
            台灣垃圾桶地圖
            <small>找垃圾桶 · 也幫忙標垃圾桶</small>
          </span>
        </div>
        <button
          type="button"
          className={`tm-btn tm-btn--primary tm-header__add ${addMode ? 'is-on' : ''}`}
          onClick={addMode ? cancelAdding : startAdding}
        >
          {addMode ? '取消新增' : '＋ 新增垃圾桶'}
        </button>
      </header>

      {addMode && !draft && (
        <div className="tm-banner">點地圖上的位置，標出垃圾桶在哪裡</div>
      )}

      <main className="tm-stage">
        <TrashMap
          cans={cans}
          addMode={addMode}
          draft={draft}
          onPickLocation={setDraft}
          onMoveDraft={setDraft}
          mapRef={mapRef}
        />

        <div className="tm-legend">
          <span><i className="tm-dot tm-dot--general" /> 一般垃圾</span>
          <span><i className="tm-dot tm-dot--recycle" /> 資源回收</span>
        </div>

        <button type="button" className="tm-fab" onClick={locateMe} aria-label="定位我的位置">
          ◎
        </button>
      </main>

      <AddTrashPanel draft={draft} onConfirm={confirmAdd} onCancel={cancelAdding} />
    </div>
  )
}
