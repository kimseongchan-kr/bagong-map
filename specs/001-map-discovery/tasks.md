# 지도 구현 작업 목록

기준: 승인된 spec.md·plan.md 및 후속 지도 표시 우선 결정. 순차 실행.
각 Red → 사용자 리뷰 → Green → 사용자 리뷰 → Refactor → 사용자 리뷰.
체크는 작업 수행만 뜻하며 사용자 리뷰와 전체 기능 완료를 대신하지 않는다.

## 1. 실행 기반

- [x] T001 package.json·package-lock.json·tsconfig.json·vitest.config.ts에 테스트 실행 환경 준비
- [x] T002 .gitignore·.env.example에 생성물·로컬 키 제외와 설정 이름 기록

## 2. 공통 기반

- [x] T003 src/features/map/naver-sdk.ts에 SDK 로더 계약·미구현 진입점 추가

## 3. US1 — 비로그인 지도 탐색 (P1, 첫 화면)

독립 검증: 실제 네이버 지도가 연남동에서 뜨고 이동·확대/축소 가능.

- [x] T004 [US1] tests/unit/naver-sdk.test.ts에 SDK 성공·키 누락·실패·재시도·중복 로드 Red 확인 [MC-04]
- [x] T005 [US1] src/features/map/naver-sdk.ts 최소 구현·T004 통과 결과 제시 [MC-04] (사용자 Green 리뷰 완료)
- [x] T006 [US1] src/features/map/naver-sdk.ts 리팩터링 필요성 검토·재검증 결과 제시 [MC-04] (구조 변경 불필요, 사용자 리뷰 완료)
- [x] T007 [US1] tests/unit/naver-map.test.tsx에 로딩·실패·재시도·해제 Red 확인 [MC-04]
- [ ] T008 [US1] src/app/{layout.tsx,page.tsx,globals.css}·src/features/map/naver-map.tsx에 Figma 화면 틀과 실제 지도 연결, Green·Refactor 별도 리뷰 [MC-04]
- [ ] T009 [US1] specs/001-map-discovery/quickstart.md에 실제 네이버 지도·PC/모바일 검증 결과 기록 [MC-04]
- [ ] T010 [US1] tests/unit/recruitment-modal.test.tsx에 공개 상세·준비 중 참여 버튼·닫기 Red 후 src/features/map/recruitment-modal.tsx Green·Refactor 리뷰 [MC-01,05]

## 4. US2 — 공개 위치 (P1)

독립 검증: 시험 공개 좌표와 허용 필드만 응답·화면에 존재.

- [ ] T011 [US2] tests/integration/public-recruitments.test.ts에 허용 필드·선택한 마감 조회 Red [MC-01]
- [ ] T012 [US2] src/server/recruitments.ts·src/app/api/map/recruitments/route.ts에 시험 저장소·공개 조회 Green·Refactor 리뷰; id는 고유 문자열, receivingMode는 pickup/together, paymentMode는 individual/equal, status는 open/closed, closedAt은 미마감 null, 좌표는 유한 수이고 위도 -90~90·경도 -180~180 [MC-01]

## 5. US3 — 실시간 마감 (P1)

독립 검증: 두 세션에서 일반 마커 제거·열린 모달 유지·닫기·연결 복구.

- [ ] T013 [US3] tests/unit/map-visibility.test.ts Red 후 src/features/map/map-visibility.ts Green·Refactor 리뷰 [MC-02]
- [ ] T014 [US3] tests/integration/map-events.test.ts에 실제 SSE·멱등 마감·취소 정리 Red [MC-02,05]
- [ ] T015 [US3] src/app/api/map/events/route.ts·src/app/api/dev/·src/server/map-events.ts Green·Refactor 리뷰; epoch는 초기화 UUID, revision은 0부터 단조 증가, open→closed만 지원 [MC-02,05]
- [ ] T016 [US3] tests/unit/map-sync.test.ts에 응답 역순·조회 중 변경·재연결·서버 세대 변경 Red [MC-03]
- [ ] T017 [US3] src/features/map/map-sync.ts에 재조회·취소·오류/복구 Green·Refactor 리뷰 [MC-03]
- [ ] T018 [US3] src/features/map/naver-map.tsx에 마커·모달·연결 안내 통합, tests/e2e/map.spec.ts로 검증 [MC-02~04]

## 6. 전체 검증

- [ ] T019 tests/e2e/map.spec.ts 및 specs/001-map-discovery/quickstart.md에서 MC-01~05·실지도 2초 측정 각 5회·lint/typecheck/build 결과 기록
- [ ] T020 AI_LOG.md에 사용자 화면 검증·코드 설명 상태 기록; 커밋·푸시는 별도 지시 필요

## 의존성·실행 전략

T001~003 → US1 첫 지도(T004~009) → US2 → US1 상세(T010) → US3 → 전체 검증.
US1 상세는 시험 공개 조회에 의존하며 첫 지도는 독립 검증 가능하다.
US1 레이아웃·SDK, US2 데이터·응답 테스트, US3 규칙·SSE 테스트는 경계가 분리되지만
학습과 단계별 리뷰를 위해 이번 실행에서는 병렬 처리하지 않는다.
최소 시연 목표는 T009이며 전체 지도 완료와 구분한다. 회원가입·참여 기능은 제외한다.

## 첫 실행 결과

T004: 5개 테스트 실행·5개 의도한 실패. 키 누락 안내 미구현 1건, SDK script 미생성 4건.
타입 검사 통과. 사용자 Red 리뷰 대기이며 T005 최소 구현은 시작하지 않았다.
테스트 파일 생성만으로 각 후속 실패/재시도 경로의 회귀 검증이 끝난 것은 아니다.

T005: 기존 테스트 수정 없이 5개 통과. 타입·문서 형식 검사 통과.
SDK 로딩 이벤트를 대역으로 검증했으며 실제 네이버 인증·지도 렌더링은 미검증이다.
Green 사용자 리뷰 전이므로 T006 리팩터링과 다음 화면 단위는 시작하지 않았다.

T006: Green 진행·리뷰 대화 이후 구조 검토. 현재 단일 책임의 짧은 로더를 유지하고 코드 변경 없이 테스트 5개·타입 검사 재통과. 실제 키 설정 존재와 Git 제외만 확인했으며 인증은 미검증.

T007: 지도 화면 테스트 6개 실행·6개 기대 동작 미구현 실패. 기존 SDK 테스트 5개 유지 통과. 타입·형식 검사 통과. 새 컴포넌트는 null 진입점만 존재하며 화면 Green 구현은 사용자 리뷰 대기.

T008 Green: 실제 페이지와 지도 연결·기존 11개 테스트 통과·lint/typecheck 통과. localhost에서 PC/모바일 크기 실제 지도 표시 확인. Green 사용자 리뷰 및 리팩터링 리뷰가 남아 T008 체크는 유지한다. T009 검증 결과는 quickstart.md에 기록했다.
