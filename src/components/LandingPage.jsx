export default function LandingPage({ onStart }) {
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
      </div>
    </div>
  )
}
