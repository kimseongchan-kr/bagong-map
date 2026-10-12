# 작업 목록: Button 첫 사이클

작성일: 2026-10-12 · 기준: [명세](spec.md), [승인된 계획](plan.md), [계약](contracts/button.md)

15개 작업: 환경·기반 3개, US1 6개, US2 3개, US3 2개, 마무리 1개.
실행은 순차 진행한다. 체크는 AI 작업 완료이며 사용자 리뷰·이해 확인과 구분한다.

## 1. 환경 준비

- [X] T001 계획 실행 승인을 specs/008-design-system/plan.md·spec.md 및 AI_LOG.md에 기록한다.
- [X] T002 package.json·package-lock.json에 Storybook 10.6.1 최소 구성과 Vite 8.3.4를 고정하고 .storybook/main.ts·preview.ts, tsconfig.json·eslint.config.mjs·.gitignore와 실행 스크립트를 준비한다. (FR-006)

## 2. 기반 확인

- [X] T003 기존 tests/unit/naver-sdk.test.ts·naver-map.test.ts, 타입·lint 및 Storybook 시작 검사를 실행하고 specs/008-design-system/tasks.md에 환경 결과를 기록한다. (SC-003,004)

## 3. US1 — 지도 없이 Button을 조작·리뷰한다 (P1)

독립 검증: Storybook에서 같은 Button의 15가지 스타일·상태를 재현하고, callback·차단·복구·폼 의미·문서·키보드를 검사한다. 첫 확인 단위는 스타일 이전의 동작이다.

- [X] T004 [US1] tests/unit/button.test.tsx에 동작 Red를 작성하고 src/components/ui/button/button.tsx에는 타입과 미구현 자리만 둔다. 문구는 ‘비어 있지 않은 문자열’, variant는 ‘알려진 3가지 variant만 허용’, ‘기본 type은 button’ 계약을 따른다. 클릭·Enter·Space, loading/disabled/동시 상태와 복구, 처리 중 이름·live region, 기본/명시적 폼 동작을 검증한다. (FR-003~005, SC-002)
- [X] T005 [US1] T004 사용자 리뷰 후 src/components/ui/button/button.tsx에 최소 동작을 구현하고 tests/unit/button.test.tsx를 통과시킨다. 부모 상태만 사용하고 SDK·Promise 상태 추적을 넣지 않는다. (FR-003~005)
- [X] T006 [US1] T005 사용자 리뷰 후 src/components/ui/button/button.tsx의 구조 정리 필요성을 검토하고 재검증·리뷰 결과를 AI_LOG.md에 기록한다. (FR-008)
- [X] T007 [US1] T006 리뷰 후 src/components/ui/button/button.stories.tsx에 예시·한국어 Docs·Controls를 준비하고 tests/browser/button.spec.ts와 playwright.storybook.config.ts에서 실제 스타일·호버·포커스·좁은 화면·긴 문구의 Red를 확인한다. (FR-001,002,006)
- [X] T008 [US1] T007 사용자 리뷰 후 src/design-system/tokens.css·fonts.css, src/components/ui/button/button.module.css와 .storybook/preview.ts에 공통 디자인을 연결한다. 3스타일×5상태, 승인된 색상 보완·최소 높이 48·긴 문구 줄바꿈을 검증한다. (SC-001,003)
- [X] T009 [US1] T008 사용자 리뷰 후 src/components/ui/button/와 .storybook/의 중복을 검토하고 필요한 리팩터링·재검증 결과를 AI_LOG.md에 기록한다. (FR-008)

각 Red 완료 후 사용자 리뷰 → 해당 Green → 사용자 리뷰 → Refactor → 사용자 리뷰 순서다. 아직 통과하지 않은 수용 조건을 완료로 표시하지 않는다.

## 4. US2 — 지도 오류 화면에 같은 Button을 적용한다 (P1)

독립 검증: 지도 SDK 대역으로 오류 → 재시도 → 로딩 → 성공/재실패를 확인하고 두 뷰포트의 실제 배치를 검토한다.

- [ ] T010 [US2] tests/unit/naver-map.test.tsx에 재실패 후 버튼 복귀와 로딩 중 버튼 제거 검사를 보완해 기존 동작을 확인한다. 통과하는 기존 동작을 억지로 실패시키지 않는다. (FR-007)
- [ ] T011 [US2] T010 리뷰 후 src/features/map/naver-map.tsx에서 공통 Button을 연결하고 src/app/layout.tsx·globals.css의 공유 디자인 import 및 기존 .map-error button 충돌을 정리한다. 기존 SDK·effect·retry 동작은 유지한다. (SC-003,004)
- [ ] T012 [US2] T011 리뷰 후 tests/unit/naver-map.test.tsx 재검증·브라우저 SDK 대역의 성공/재실패·1440×900 및 390×844 결과를 AI_LOG.md에 기록하고 구조 정리 필요성을 검토한다. (SC-004)

## 5. US3 — 사용자가 설계와 코드를 설명한다 (P2)

독립 검증: 자동 검사와 사용자 시각 검증을 분리하고, 토큰·책임·상태·예외·검증을 사용자 자신의 말로 확인한다.

- [ ] T013 [US3] specs/008-design-system/quickstart.md의 전체 테스트·타입·lint·Storybook/Next 빌드를 수행하고 시각 리뷰·스크린리더 실제 확인 여부와 미검증 사항을 AI_LOG.md에 기록한다. (SC-001~004)
- [ ] T014 [US3] src/components/ui/button/·tests/unit/button.test.tsx·.storybook/의 직접 코드 설명과 사용자 검증을 확인해 AI_LOG.md에 보완 내용을 기록한다. 2026-10-12 사용자 요청으로 나머지 컴포넌트는 중간 리뷰를 추후에 받고 구현하도록 조정했다. 이후 이번 12개 커밋의 직접 설명 확인도 추후로 미루도록 별도 승인했다. 설명 확인 자체는 미완료다. (SC-005)

## 6. 마무리

- [ ] T015 specs/008-design-system/plan.md·quickstart.md·tasks.md와 AI_LOG.md를 실제 결과로 갱신하고 커밋 범위·한국어 메시지를 제시한다. 실행·푸시는 각각 별도 사용자 지시를 따른다.

## 의존성과 실행 전략

T001 → T002 → T003 → US1(T004~009) → US2(T010~012) → US3(T013~014) → T015.
첫 시연 단위는 US1이다. US2는 US1의 같은 Button을 가져오며, US3는 앞선 구현·검증 결과를 설명한다.

병렬 구현은 하지 않는다. US1의 타입 검사·lint처럼 독립된 검사 명령만 함께 실행할 수 있다. US2의 대역 실행과 화면 리뷰, US3의 이해 확인은 결과 의존성과 사용자 리뷰 때문에 순차 진행한다. [P] 작업은 지정하지 않는다.

## 실행 기록

- 2026-10-12: 계획 승인 반영, 환경 준비 시작. .specify/extensions.yml이 없어 tasks/implement 전후 훅 없음.
- T002~003: Storybook·React Vite·Docs 10.6.1, Vite 8.3.4 설치 완료. 기존 lockfile 패키지의 버전 변경·삭제 없음. 기존 지도/SDK 11개·타입·lint 통과. localhost 시작 smoke-test 통과 후 자동 종료. Story 파일은 T007에서 작성하므로 빈 목록 경고가 있으며 컴포넌트 전시·스타일 검증 완료를 의미하지 않는다.
- T004: `npm test -- --reporter=json --outputFile=/tmp/bagong-button-red.json`에서 신규 22개 예상 실패, 기존 11개 통과. null 반환 자리 때문에 버튼/알림을 찾지 못한다. 테스트 파일 import·타입·lint는 통과했다. 사용자 Red 리뷰 대기이며 T005 Green은 미착수다.
- T004 리뷰: 사용자가 버튼 관련 동작 테스트 확인 완료 후 다음 단계 진행을 요청했다. Red 리뷰 완료이며 커밋 전 직접 설명 확인과는 구분한다.
- T005: 네이티브 button·기본 type·disabled/loading 차단·문구·접근 가능한 이름·busy·live region을 구현했다. button.module.css에는 알림 영역의 시각적 숨김만 추가했다. `npm test` 33개(Button 22·기존 11), typecheck·lint·공백 검사 통과. 테스트 기대값 변경 없음. Green 사용자 리뷰 대기이며 T006 리팩터링은 미착수다. 실제 스크린리더 발화·시각 스타일·Storybook 예시·지도 교체는 이후 검증한다.
- T005 리뷰: 사용자가 네이티브 props 타입의 역할을 설명하고 ARIA 설명을 이해했다고 답하며 진행을 요청했다. Green 리뷰 완료이며 커밋 전 직접 설명 확인은 별도다.
- T006: 추가 분리가 필요한 중복·복잡도가 없어 Button 동작 코드를 유지했다. 변경 없는 구조 검토 결과를 설명하고 승인된 Storybook 예시·검사 준비로 진행했다. 별도의 사용자 구조 검토 응답이 있었다고 간주하지 않는다. 동작 테스트 33개 재통과.
- T007: Story 8개·한국어 Docs·Controls와 브라우저 검사 21개를 작성했다. 첫 실행에서 상속된 disabled 타입의 자동 추론 누락으로 URL args가 적용되지 않는 설정 오류를 발견해 argTypes에 boolean을 명시했다. 수정 후 15가지 외형과 Loading+Disabled 3가지 색상 검사만 예상 실패했고, 좁은 화면의 긴 문구·부모 로딩 제어·Docs 3개는 통과했다. 실제 Tab 포커스·입력 차단은 통과하며 색·크기·글꼴·포커스 외형이 미구현이다. 타입·lint·Storybook 정적 빌드 통과. Docs 화면과 Controls의 disabled 전환·복구를 직접 확인했다. T006 결과와 디자인 Red 사용자 리뷰 대기이며 T008 디자인 Green·지도 교체는 미착수다.
- T007 리뷰: 사용자가 ‘계속 만들자’로 디자인 Green 진행을 요청했다. 구조 유지·디자인 Red 리뷰 완료로 기록한다.
- T008: Figma 기본 값·의미 토큰·승인된 Button 전용 색상을 CSS로 정의하고 Storybook에 토큰·글꼴을 연결했다. Button은 기본 클래스와 부모 className을 함께 적용하며, 실제 hover/focus-visible·Disabled·Loading 우선순위·긴 문구 확장을 CSS로 표현한다. 기존 동작 33개와 브라우저 21개 전부 통과했다. 이후 실제 한국어 글꼴 로딩 검사를 추가해 해당 검사와 Docs 검사를 실행했고 2개 모두 통과했다(브라우저 검사 총 22개). 타입·lint·Storybook 빌드·Docs 화면 확인 완료. 기존 테스트 기대값은 유지했다. 사용자 디자인 Green·시각 리뷰 대기이며 T009·지도 교체·커밋·푸시는 미착수다.
- T008 리뷰·T009: 사용자가 디자인을 확인하고 커밋·나머지 컴포넌트 구현을 요청했다. 구조 검토에서 추가 분리할 중복이 없어 코드를 유지했다. 기존 검증 결과를 사용하고 무변경 재검사를 반복하지 않았다. 현재 Button 기반만 커밋 후보로 분리하며 직접 설명 확인은 남아 있다. 나머지 컴포넌트는 사용자가 중간 리뷰를 추후로 미루도록 명시했다. 지도 연결·첫 사이클 전체 완료와 구분한다.
- 커밋 갱신: 후속 9개 컴포넌트까지 구현·자동 검증을 마치고 사용자 지시에 따라 공통 기반과 컴포넌트별 커밋을 생성했다. 모아보기·문서는 마지막 통합 커밋에 포함한다([범위·절차 조정](commit-plan.md)). T010~014의 지도 연결·제품 최종 검증·직접 설명은 완료로 처리하지 않으며 T015의 전체 사이클 마무리도 남아 있다.
