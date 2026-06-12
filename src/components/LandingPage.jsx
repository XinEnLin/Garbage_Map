import { useState } from 'react'

const TIPS = [
  { label: '三類分類', text: <>丟棄前先分「一般垃圾、資源回收、廚餘」，分對才能有效循環再利用。</> },
  { label: '廚餘新制', text: <>自2026/1/1起為防堵非洲豬瘟，家戶廚餘<u>免分生熟</u>，但務必先「瀝乾水分」再投入廚餘桶。</> },
  { label: '廚餘禁丟', text: <>硬骨、海鮮殼、玉米芯、筍殼、塑膠袋、免洗筷皆不可回收，混丟最高可罰 6,000 元。</> },
  { label: '電池安全', text: <>行動電源、鋰電池<u>嚴禁丟入垃圾車壓縮</u>，請送超商或回收點，以免爆炸起火。</> },
  { label: '細分回收', text: <>紙、鐵、鋁、玻璃、塑膠（1–7號）分類越細，再生利用率越高。</> },
  { label: '大型廢棄物', text: <>沙發、床墊等須事先向清潔隊「預約」清運，勿隨意棄置路邊。</> },
]

export default function LandingPage({ onStart }) {
  const [showTips, setShowTips] = useState(false)

  return (
    <div className="tm-landing">
      <div className="tm-landing__content">
        <div className="tm-landing__logo">♺</div>
        <h1 className="tm-landing__title">垃圾桶地圖</h1>
        <p className="tm-landing__desc">
          找到附近的垃圾桶<br />也可以幫大家標出新的垃圾桶位置
        </p>
        <button className="tm-btn tm-btn--primary tm-landing__start" onClick={onStart}>
          開始探索
        </button>
        <button className="tm-btn tm-btn--ghost tm-landing__tips-btn" onClick={() => setShowTips(true)}>
          🗑️ 垃圾小知識
        </button>
      </div>

      {showTips && (
        <div className="tm-tips-overlay" onClick={() => setShowTips(false)}>
          <div className="tm-tips-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tm-tips-modal__header">
              <h2 className="tm-tips-modal__title">🗑️ 垃圾丟棄小知識<span className="tm-tips-modal__badge">2026 最新</span></h2>
              <button className="tm-detail-close" onClick={() => setShowTips(false)} aria-label="關閉">✕</button>
            </div>
            <ul className="tm-tips-list">
              {TIPS.map(({ label, text }) => (
                <li key={label} className="tm-tips-item">
                  <span className="tm-tips-item__label">{label}</span>
                  <span className="tm-tips-item__text">{text}</span>
                </li>
              ))}
            </ul>
            <p className="tm-tips-modal__note">各地規範以當地環保局公告為準</p>
          </div>
        </div>
      )}
    </div>
  )
}
