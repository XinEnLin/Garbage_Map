import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { icons, typeLabel } from './markers'


// 台灣中心點，初始縮放看得到整座島
const TAIWAN_CENTER = [23.8, 120.95]
const INITIAL_ZOOM = 8

// 監聽地圖點擊：只有在「新增模式」時才把點到的座標回傳
function ClickToAdd({ enabled, onPick }) {
  useMapEvents({
    click(e) {
      if (enabled) onPick({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

export default function TrashMap({
  cans,
  addMode,
  draft,
  onPickLocation,
  onMoveDraft,
  mapRef,
  userLocation,
}) {
  return (
    <MapContainer
      center={TAIWAN_CENTER}
      zoom={INITIAL_ZOOM}
      className="tm-map"
      zoomControl={false}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> 貢獻者'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickToAdd enabled={addMode} onPick={onPickLocation} />

      <MarkerClusterGroup chunkedLoading>
        {cans.map((c) => (
          <Marker key={c.id} position={[c.lat, c.lng]} icon={icons[c.type]}>
            <Popup>
              <div className="tm-popup">
                <strong className="tm-popup__name">{c.name || '未命名垃圾桶'}</strong>
                <span className={`tm-tag tm-tag--${c.type}`}>{typeLabel[c.type]}</span>
                <span className="tm-popup__meta">
                  {c.source === 'user' ? '使用者新增' : '政府開放資料'}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>

      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={icons.userLocation}
        >
          <Popup>你在這裡</Popup>
        </Marker>
      )}

      {/* 尚未確認的新垃圾桶：可拖曳微調位置 */}
      {draft && (
        <Marker
          position={[draft.lat, draft.lng]}
          icon={icons.draft}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const { lat, lng } = e.target.getLatLng()
              onMoveDraft({ lat, lng })
            },
          }}
        />
      )}
    </MapContainer>
  )
}
