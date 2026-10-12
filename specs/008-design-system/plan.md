# 구현 계획: 배공맵 Button 첫 사이클

**작성일**: 2026-10-12 · **상태**: Button·후속 컴포넌트 구현·자동 검증 및 개별 커밋 완료, 지도 적용·상세 리뷰 후속
**명세**: [spec.md](spec.md) · **기능 포인터**: `008-design-system` · **Git 브랜치**: `main`
**기준 커밋**: `4d36713` · Button 동작·토큰·스타일·Storybook 예시·동작 및 브라우저 테스트 작성. 상세 진행은 [tasks.md](tasks.md)에 기록한다.

## 요약과 결정

화면은 실행 함수와 상태를 소유하고 Button은 표시와 기본 조작을 담당한다.
공통 CSS 토큰 → Button → Storybook/지도 화면의 방향으로 재사용한다.
SDK 로더와 지도 effect·retry 로직은 유지하며 오류 화면의 버튼만 교체한다.

- **구조**: 네이티브 `button` + React props + CSS Modules. 상태 관리·UI 프레임워크를 추가하지 않는다.
- **주요 입력**: 필수 문자열 `children`, `variant`(primary/secondary/ghost), `onClick`, `loading`, `disabled`. 기본 `type="button"`.
- **상태**: `disabled || loading`이면 HTML disabled로 입력을 차단한다. Loading 표시가 Disabled보다 우선한다. Promise를 읽어 내부 로딩을 만들지 않는다.
- **디자인**: Figma 토큰을 보존하고 승인된 대비 보완만 버튼 전용 색상으로 추가한다. Primary 기본 `#c94620`, 호버 `#b13b18`; 흰 글자 대비 약 4.79:1·5.99:1.
- **리뷰 환경**: 순수 React용 Storybook/Vite. 지도·Next 라우터·업무 서버를 불러오지 않는다.
- **검증**: 기존 Vitest/Testing Library로 동작, Playwright Chromium으로 실제 CSS·호버·키보드 포커스·배치를 확인한다. 사용자 시각 리뷰와 코드 설명은 별도로 남긴다.

선택 이유·대안은 [research.md](research.md), 상태는 [data-model.md](data-model.md), 정확한 입력·스타일 기준은 [Button 계약](contracts/button.md)에 둔다.

## 기술 환경과 제약

| 구분 | 현재 환경 / 계획 |
|---|---|
| 실행 환경 | Node 24.12.0, npm 11.6.2, TypeScript 5.9.3 |
| 제품 | Next.js 16.4.0, React/ReactDOM 19.3.0 |
| 동작 검사 | Vitest 5.0.3, Testing Library React 16.3.3, user-event 14.6.7, jsdom 29.1.1 유지 |
| 브라우저 검사 | 기존 @playwright/test 1.64.0 활용. Storybook용 설정·스크립트 추가 |
| Storybook | storybook·react-vite·addon-docs 10.6.1, Vite 8.3.4. 설치·실행 확인은 환경 준비 단계에서 수행 |
| 저장 데이터·서버 | 추가 없음 |
| 첫 지원 검증 | 데스크톱 Chromium, 1440×900 및 모바일 크기 390×844. 실제 모바일 기기·다른 엔진 검증과 구분 |
| 성능 경계 | Button 자체의 네트워크 요청·SDK import·타이머·Promise 상태 추적 없음 |
| 범위 | Button 하나, 로컬 문서, 지도 오류 버튼 한 곳. 배포·Figma 수정·다른 컴포넌트 확장은 별도 |

## 파일과 영향 범위

```text
src/design-system/tokens.css             # 기본 값 → 의미 토큰 → 버튼 전용 토큰
src/design-system/fonts.css              # 기존 Noto Sans KR 폰트 로딩을 공유
src/components/ui/button/
  button.tsx                            # 공통 Button
  button.module.css                     # 외형·실제 hover/focus-visible
  button.stories.tsx                    # 상태 예시·Controls·한국어 Autodocs
.storybook/main.ts                      # React Vite·Docs 설정
.storybook/preview.ts                    # 공통 토큰·폰트 로딩
tests/unit/button.test.tsx               # 조작·상태·폼 동작
tests/browser/button.spec.ts            # 실제 브라우저 상태·레이아웃
playwright.storybook.config.ts           # Storybook 전용 실행
```

기존 수정 대상: `src/features/map/naver-map.tsx`, `tests/unit/naver-map.test.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `package.json`·lockfile·TypeScript/ESLint 설정·Git 제외 설정.
테스트 산출물과 `storybook-static/`은 추적하지 않는다.

공통 토큰·폰트를 앱과 Storybook 진입점에서 각각 가져온다. 기존 폰트 URL을 공유 파일로 옮기되 폰트 공급 방식은 유지한다.
앱의 기존 브랜드 변수를 일괄 바꾸지 않는다. 버튼의 padding·색을 강제하는 `.map-error button` 규칙은 교체 시 제거한다.
Button CSS는 글자·box-sizing·테두리·배경을 명시하고, 기존 전역 `button:focus-visible`보다 구체적인 선택자로 자신의 포커스를 표현한다.
개발 화면뿐 아니라 Next 프로덕션 빌드에서도 CSS 적용을 확인한다.

## 순차 구현·리뷰 계획

계획 승인 후 작업 목록을 같은 폴더의 `tasks.md`로 정리한다. 아래 단위를 순서대로 실행하며 각 Red/Green/Refactor에서 사용자 리뷰를 받는다. 기능 구현을 병렬 위임하지 않는다.

| 단위 | 작업과 검증 | 연결 |
|---|---|---|
| 0. 환경 준비 | 최소 Storybook 의존성·설정·검사 스크립트 준비. 기본 예제·배포 연동은 생성하지 않는다. peer 충돌·시작 실패는 제품 동작 Red와 구분하여 해결한다. | FR-006 |
| 1. Button 동작 | 미구현 Button과 동작 테스트를 작성해 의도한 실패를 보여준다. 리뷰 후 네이티브 버튼·기본 type·로딩/비활성 차단·이름/상태 전달을 구현한다. 통과 리뷰 후 구조 정리 여부를 검토한다. | FR-003~005, SC-002 |
| 2. 디자인·Storybook | 3가지 스타일과 상태 예시, 한국어 설명·Controls를 준비한다. 실제 브라우저의 색·포커스·크기·긴 문구 검사 실패를 확인하고 리뷰 후 토큰·CSS를 적용한다. 통과 후 불필요한 중복만 정리한다. | FR-001,002,006, SC-001,003 |
| 3. 지도 적용 | 재실패 시 오류·버튼 복귀와 로딩 중 버튼 제거를 기존 지도 검사에 보완한다. 기존 동작을 보존하는 교체이므로 이미 통과하는 검사를 억지로 실패시키지 않는다. 공통 Button 연결 후 지도 검사·실제 화면을 확인한다. | FR-007, SC-003,004 |
| 4. 검증·이해 확인 | 전체 검사·제품/Storybook 빌드, 화면 2종 리뷰. 사용자가 역할 분리·상태·예외·검증을 설명하고 AI_LOG에 결과 기록. | FR-008, SC-005 |

새 동작에서 실패가 발견되면 기대 동작을 바꾸지 않고 원인을 확인한다. 리팩터링할 이유가 없으면 유지 이유를 설명하며 억지로 변경하지 않는다.
지도는 로딩 중 오류 화면 자체가 사라지므로 `loading` prop을 새로 연결하지 않는다. 로딩 버튼의 상태 전환은 Storybook의 부모 예제로 검증한다.

## 수용 조건별 검증

- **SC-001**: 3스타일 × Default/Hover/Focus/Disabled/Loading. 실제 hover·Tab으로 확인하고 화면과 Figma를 비교한다. 승인된 색상 차이를 문서에 표시한다.
- **SC-002**: 각 스타일에서 클릭·Enter·Space 한 번당 callback 한 번, 비활성·로딩·동시 상태 차단, 해제 후 복구. 기본 폼 제출 방지와 명시적 submit도 검증한다.
- **SC-003**: 지도 키 없이 Storybook 실행·Controls·한국어 문서 확인. 실제 Button import와 공통 토큰 사용을 코드 리뷰로 확인한다.
- **SC-004**: 기존 11개 검사와 보완한 지도 검사를 실행한다. 브라우저에서는 SDK 응답을 통제해 실패·재시도·성공/재실패를 확인하고, 두 화면 크기에서 넘침·포커스·문구를 확인한다. 대역 검증을 실제 네이버 인증 검증으로 표현하지 않는다.
- **SC-005**: 사용자 직접 검증·설명 확인. 자동 검사 통과로 대체하지 않는다.

실행 순서·기대 결과는 [quickstart.md](quickstart.md)에 있다. 디자인 Red 리뷰 후 공통 토큰·글꼴과 Button 스타일을 Storybook에 연결했다. 동작 테스트 33개·타입·lint·Storybook 빌드 통과. 기존 브라우저 21개 전부 통과했고 실제 한국어 글꼴 로딩 검사를 추가해 해당 검사와 Docs 검사도 통과했다(총 22개). 디자인 Green의 사용자 시각 리뷰 후 구조 검토로 진행한다. 앱의 공통 토큰 import·지도 교체·실제 스크린리더 음성·최종 Next 빌드는 이후 단계다.

## Constitution 확인

| 기준 | 설계 전 / 설계 후 |
|---|---|
| 명세·brainstorming | 범위 승인 확인 / Primary 대비 보완 선택을 명세에 반영 |
| 설계 승인 | 문서 작성만 허용 / 계획 제시 후 사용자의 ‘계속 진행하자’로 순차 실행 승인, 각 단계 리뷰는 유지 |
| TDD·리뷰 | 기존 규칙 유지 / 위 4개 실행 단위와 단계별 검토 명시 |
| 학습·기록·커밋 | LOG-030 시작 / 코드 직접 설명 후 별도 커밋 지시, 푸시도 별도 |
| 범위·복잡도 | Button 첫 사이클 / 데이터 저장·SDK·범용 UI 프레임워크 추가 없음 |

계획 승인 당시 기존 지도 커밋의 테스트 설명 유예는 이번 작업에 적용하지 않았다. 이후 사용자가 후속 구현의 중간 리뷰를 추후로 미뤘으며, 이번 12개 커밋도 직접 설명 확인을 추후로 미루도록 별도로 승인했다. 상세 범위와 실행 기록은 [commit-plan.md](commit-plan.md)에 있다. 사용자 직접 설명 완료로 처리하거나 constitution의 기본 규칙을 변경하지 않는다.
`.specify/extensions.yml`이 없어 plan 전후 확장 훅은 없다.
