import { useEffect, useRef, useState } from 'react'
import TrashMap from './components/TrashMap'
import AddTrashPanel from './components/AddTrashPanel'
import DetailPanel from './components/DetailPanel'
import LandingPage from './components/LandingPage'
import logo from './assets/logo.png'
// import { sampleTrashCans } from './data/sampleTrashCans'
import { supabase } from './lib/supabase'

export default function App() {
  const [view, setView] = useState('landing') // 'landing' | 'map'
  const [cans, setCans] = useState([])
  const [addMode, setAddMode] = useState(false)
  const [draft, setDraft] = useState(null) // { lat, lng } 待確認的新垃圾桶
  const mapRef = useRef(null)
  const [userLocation, setUserLocation] = useState(null)
  const [selectedCan, setSelectedCan] = useState(null)

  // 一進頁面就讀取全部垃圾桶
  useEffect(() => {
    supabase.from('trash_cans').select('*').then(({ data, error }) => {
      if (error) { console.error('讀取失敗', error); return }
      setCans(data ?? [])
    })
  }, [])

  function startAdding() {
    setAddMode(true)
    setDraft(null)
  }

  function cancelAdding() {
    setAddMode(false)
    setDraft(null)
  }

  async function confirmAdd({ type, name }) {
    const { data, error } = await supabase
      .from('trash_cans')
      .insert({ lat: draft.lat, lng: draft.lng, type, name, source: 'user' })
      .select()
      .single()

    if (error) { alert('新增失敗：' + error.message); return }

    setCans((prev) => [...prev, data])
    setAddMode(false)
    setDraft(null)
  }
  
  function locateMe() {
    if (!navigator.geolocation) {
      alert('這個瀏覽器不支援定位功能')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current?.flyTo([pos.coords.latitude, pos.coords.longitude], 16)
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      () => alert('無法取得你的位置，請確認已允許定位權限'),
    )
  }

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('map')} />
  }

  return (
    <div className="tm-app">
      <header className="tm-header">
        <div className="tm-header__left">
          <div className="tm-brand">
            <button
              type="button"
              className="tm-brand__mark tm-brand__mark--btn"
              onClick={() => setView('landing')}
              aria-label="回到首頁"
            >
              <img src={logo} alt="回到首頁" className="tm-brand__mark-img" />
            </button>
            <span className="tm-brand__text">
              全民倒笨手
              <small>找到垃圾筒 · 標出垃圾桶</small>
            </span>
          </div>
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
          userLocation={userLocation}
          onSelectCan={setSelectedCan}
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
      <DetailPanel can={selectedCan} onClose={() => setSelectedCan(null)} />
    </div>
  )
}
