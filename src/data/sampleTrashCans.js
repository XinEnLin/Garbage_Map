// 範例垃圾桶資料（座標為概略位置，僅供開發測試）。
// 之後把這份資料換成從 Firebase / Supabase 讀取即可，欄位保持一致就不用改畫面。
//
// 欄位說明：
//   id      唯一識別碼
//   lat/lng 緯度 / 經度
//   type    'general' = 一般垃圾，'recycle' = 資源回收
//   name    名稱或地標
//   source  'official' = 政府開放資料，'user' = 使用者新增

export const sampleTrashCans = [
  // 台北
  { id: 'seed-01', lat: 25.0478, lng: 121.5170, type: 'general', name: '台北車站前站', source: 'official' },
  { id: 'seed-02', lat: 25.0297, lng: 121.5360, type: 'recycle', name: '大安森林公園', source: 'official' },
  { id: 'seed-03', lat: 25.0421, lng: 121.5076, type: 'general', name: '西門町徒步區', source: 'official' },
  { id: 'seed-04', lat: 25.0359, lng: 121.5681, type: 'recycle', name: '信義商圈', source: 'official' },
  { id: 'seed-05', lat: 25.0880, lng: 121.5240, type: 'general', name: '士林夜市', source: 'official' },
  // 台中
  { id: 'seed-06', lat: 24.1786, lng: 120.6469, type: 'general', name: '逢甲夜市', source: 'official' },
  { id: 'seed-07', lat: 24.1626, lng: 120.6406, type: 'recycle', name: '台中國家歌劇院', source: 'official' },
  // 台南
  { id: 'seed-08', lat: 22.9977, lng: 120.2026, type: 'general', name: '赤崁樓', source: 'official' },
  { id: 'seed-09', lat: 23.0118, lng: 120.1986, type: 'recycle', name: '花園夜市', source: 'official' },
  // 高雄
  { id: 'seed-10', lat: 22.6320, lng: 120.3020, type: 'general', name: '六合夜市', source: 'official' },
  { id: 'seed-11', lat: 22.6201, lng: 120.2820, type: 'recycle', name: '駁二藝術特區', source: 'official' },
  { id: 'seed-12', lat: 22.6312, lng: 120.3010, type: 'general', name: '美麗島站', source: 'official' },
]
