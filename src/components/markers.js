import L from 'leaflet'

// 用 CSS 畫的水滴形圖釘，避免 Leaflet 預設圖示在打包後抓不到圖片的問題。
function makePin(variant, glyph) {
  return L.divIcon({
    className: 'tm-marker',
    html: `<span class="tm-pin tm-pin--${variant}"><span class="tm-pin__glyph">${glyph}</span></span>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -36],
  })
}

export const icons = {
  general: makePin('general', '🗑'),
  recycle: makePin('recycle', '♻'),
  draft: makePin('draft', '＋'),
}

export const typeLabel = {
  general: '一般垃圾',
  recycle: '資源回收',
}
