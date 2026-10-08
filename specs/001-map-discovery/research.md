# 지도 구현 기술 선택 기록

2026-10-08 · 사용자 설계 승인(2026-10-08).

| 선택 | 이유 | 대안·손해 |
|---|---|---|
| Next.js 화면+Route Handlers | 한 앱에서 HTTP와 SSE를 검증 | 별도 API 서버는 프로세스·설정 증가. 현재 방식은 단일 프로세스 시험 한정 |
| 메모리 시험 저장소 | 모집 생성·DB 없이 지도 사이클 완성 | SQLite/외부 DB는 영속성 제공. 현재는 재시작 시 초기화 |
| 변경 알림 후 재조회 | 최초 조회·재연결·변경의 데이터 경로를 통일 | 이벤트로 직접 수정하면 요청은 줄지만 복구 경로가 추가됨 |
| React+fetch+EventSource | 자원 하나의 흐름을 직접 이해 | TanStack Query는 캐시 관리에 유리. 현재 방식은 취소·순서·재시도를 직접 검증해야 함 |
| 네이버 SDK 직접 연동 | 사용자 선택 지도, 얇은 어댑터로 수명 관리 | 래퍼는 편리하지만 추가 호환성 의존 |
| Vitest+Playwright | 순수 규칙부터 실제 두 세션 통신까지 검증 | SDK 대역만 쓰면 실제 키·지도 로딩 검증 누락 |

공식 근거(2026-10-08 확인):
- [Next.js 설치](https://nextjs.org/docs/app/getting-started/installation): App Router·TypeScript 설치 기반.
- [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers): 앱 내부 HTTP 처리.
- [네이버 지도 시작](https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Getting-Started.html): ncpKeyId로 SDK 로딩.
- [MDN SSE](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events): EventSource 재연결·이벤트 형식·연결 종료.
- [Playwright Page](https://playwright.dev/docs/api/class-page): 페이지별 viewport와 브라우저 검증.

writing-plans 보조 스킬은 설치 목록에 없으므로 사용자 지침에 따라 설치하지 않고
speckit-plan 템플릿과 프로젝트 규칙으로 구현 계획을 직접 작성했다.
설치 버전은 구현 착수 시 호환 안정 패치를 확인·고정한다. 기술적 결정 미정 항목 없음.

speckit-plan의 연구 에이전트 지침에 따라 SSE 경쟁 조건을 읽기 전용으로 별도 검토했다.
ready 후 조회, 조회 중 targetRevision 보존, 연결 세대 검사, abort 정리 권고를 설계에 반영했다.
전체 마감 목록을 조회하는 대안 대신 open 목록+선택 항목만 반환하여 일반 마감 탐색을 제한한다.
