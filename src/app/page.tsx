import Image from "next/image";
import Link from "next/link";
import { NaverMap } from "../features/map/naver-map";

export default function Home() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="배공맵 홈"><span className="brand-mark">배</span><span>배공맵</span></Link>
        <nav aria-label="주 메뉴"><span className="active-nav" aria-current="page">주변 모집</span><button disabled title="준비 중">이용 안내</button></nav>
        <div className="account-actions"><button disabled>로그인 <small>준비 중</small></button><button className="primary" disabled>＋ 모집 만들기 <small>준비 중</small></button></div>
      </header>
      <section className="search-bar" aria-label="검색 및 필터 준비 중">
        <div className="location-field"><Image src="/design/map-pin.png" alt="" width={20} height={20} /><span>서울 마포구 연남동</span><small>검색 준비 중</small></div>
        <input className="food-search" aria-label="음식이나 가게 검색 준비 중" placeholder="음식이나 가게 검색 · 준비 중" disabled />
        <button disabled>전체 음식 ⌄</button><button disabled>모임 방식 ⌄</button>
        <span className="tagline">가까운 이웃과, 가벼운 한 끼</span>
      </section>
      <main className="explore-layout">
        <aside className="recruitment-panel" aria-labelledby="recruitment-heading">
          <div className="list-heading"><h1 id="recruitment-heading">연남동 주변 모집</h1><p>먹고 싶은 메뉴, 이웃과 함께 주문해요.</p>
            <div className="method-filters"><button className="selected" disabled>전체</button><button disabled>각자 가져가기</button><button disabled>함께 먹기</button></div>
          </div>
          <div className="list-sort"><span>모집 중인 모임만</span><span>목록 준비 중</span></div>
          <div className="list-placeholder"><span className="coming-soon">준비 중</span><h2>곧 이웃의 모집을 만나요</h2><p>모집 목록과 상세 보기는 준비 중이에요.<br />먼저 지도를 움직이며 주변을 둘러보세요.</p></div>
        </aside>
        <NaverMap clientId={process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ?? ""} />
      </main>
    </div>
  );
}
