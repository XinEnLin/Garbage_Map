# 台灣垃圾桶地圖 🗑️♻️

用 **Vite + React + react-leaflet** 做的垃圾桶地圖起手式。
可以瀏覽地圖上的垃圾桶、依類型用不同顏色顯示、密集處自動聚合（cluster），
並可「點地圖新增垃圾桶」。目前資料來自 `src/data/sampleTrashCans.js`，
下一步把它換成 Firebase / Supabase 即可。

## 快速開始

```bash
npm install
npm run dev
```

打開終端機顯示的網址（預設 http://localhost:5173 ）就能看到地圖。

其他指令：

```bash
npm run build     # 打包成靜態檔到 dist/
npm run preview   # 本機預覽打包後的結果
```

## 操作方式

- 直接拖曳、縮放地圖瀏覽垃圾桶。
- 點右上角「＋ 新增垃圾桶」，再點地圖上的位置 → 拖曳圖釘可微調 →
  選類型、填地標 → 「確認新增」。新點會立刻出現在地圖上。
- 右下角 ◎ 按鈕會定位你目前的位置（需允許瀏覽器定位權限）。

## 專案結構

```
src/
├── main.jsx                  進入點，載入 Leaflet 樣式
├── App.jsx                   狀態管理：資料、新增流程、定位
├── index.css                 全站樣式與配色 token
├── data/
│   └── sampleTrashCans.js    範例資料（之後換成後端）
└── components/
    ├── TrashMap.jsx          地圖、聚合標記、點擊新增
    ├── AddTrashPanel.jsx     新增垃圾桶的表單面板
    └── markers.js            各類型的自訂圖釘
```

## 下一步：接後端

垃圾桶的「讀」與「寫」目前都在 `App.jsx`。把這兩處換成後端呼叫即可，
畫面完全不用改（只要回傳的物件欄位一致：`id / lat / lng / type / name / source`）。

以 Supabase 為例：

```js
// 讀取（取代 useState 的初始值）
useEffect(() => {
  supabase.from('trash_cans').select('*')
    .then(({ data }) => setCans(data ?? []))
}, [])

// 寫入（在 confirmAdd 裡，取代 setCans）
await supabase.from('trash_cans').insert({
  lat: draft.lat, lng: draft.lng, type, name, source: 'user',
})
```

建議的資料表欄位：`id, lat, lng, type, name, source, created_at`。
資料量變大後，用 PostGIS 做「找附近 N 公尺內的垃圾桶」查詢會很順。

## 部署

前端是純靜態網站，`npm run build` 後把 `dist/` 丟到
Vercel、Netlify 或 GitHub Pages 都能免費上線。

## 用到的套件

- [Leaflet](https://leafletjs.com/) + OpenStreetMap 圖磚（免 API key）
- [react-leaflet](https://react-leaflet.js.org/) — React 版地圖元件
- [react-leaflet-cluster](https://github.com/akursat/react-leaflet-cluster) — 標記聚合
