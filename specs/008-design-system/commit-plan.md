# 디자인 시스템 컴포넌트별 커밋 구성

작성일: 2026-10-12 · 상태: 공통 기반·컴포넌트 11개 커밋 완료, 이 기록은 마지막 통합 커밋에 포함

사용자 요청: “각 컴포넌트마다 커밋좀 해줄래”. 작업 내용은 보존하고 미커밋 변경을 아래 12개로 나눈다. 각 컴포넌트 커밋에는 구현·스타일·Storybook 예시와 관련 테스트를 함께 넣는다. 공통 기반이 먼저 들어가며 SelectOption → Select, Button/Input → Modal의 의존성을 지킨다. 푸시는 이 요청에 포함하지 않는다.

| 순서 | 한국어 커밋 메시지 | 포함 파일·목적 |
|---|---|---|
| 1 | `chore(ui): 디자인 토큰과 Storybook 공통 환경 구성` | `.gitignore`, `.storybook/`, `eslint.config.mjs`, `package.json`, `package-lock.json`, `playwright.storybook.config.ts`, `tsconfig.json`, `src/design-system/{tokens,fonts}.css`, `src/components/ui/{field,choice}/*.css`. 공통 환경·글꼴·색·필드 스타일. |
| 2 | `feat(ui): Button 컴포넌트와 검증 예시 추가` | `src/components/ui/button/`, `tests/unit/button.test.tsx`, `tests/browser/button.spec.ts` |
| 3 | `feat(ui): Input 컴포넌트와 검증 예시 추가` | `src/components/ui/input/`, `tests/unit/input.test.tsx`, `tests/browser/input.spec.ts` |
| 4 | `feat(ui): SelectOption 컴포넌트와 검증 예시 추가` | `src/components/ui/select-option/`, `tests/unit/select-option.test.tsx`, `tests/browser/select-option.spec.ts` |
| 5 | `feat(ui): Select 컴포넌트와 검증 예시 추가` | `src/components/ui/select/`, `tests/unit/select.test.tsx`, `tests/browser/select.spec.ts` |
| 6 | `feat(ui): Checkbox 컴포넌트와 검증 예시 추가` | `src/components/ui/checkbox/`, `tests/unit/checkbox.test.tsx`, `tests/browser/checkbox.spec.ts` |
| 7 | `feat(ui): Radio 컴포넌트와 검증 예시 추가` | `src/components/ui/radio/`, `tests/unit/radio.test.tsx`, `tests/browser/radio.spec.ts` |
| 8 | `feat(ui): Badge 컴포넌트와 검증 예시 추가` | `src/components/ui/badge/`, `tests/unit/badge.test.tsx`, `tests/browser/badge.spec.ts` |
| 9 | `feat(ui): Card 컴포넌트와 검증 예시 추가` | `src/components/ui/card/`, `tests/unit/card.test.tsx`, `tests/browser/card.spec.ts` |
| 10 | `feat(ui): Marker 컴포넌트와 검증 예시 추가` | `src/components/ui/marker/`, `tests/unit/marker.test.tsx`, `tests/browser/marker.spec.ts` |
| 11 | `feat(ui): Modal 컴포넌트와 검증 예시 추가` | `src/components/ui/modal/`, `tests/browser/modal.spec.ts`. 실제 브라우저 포커스 검증. |
| 12 | `feat(ui): 컴포넌트 모아보기와 통합 검증 추가` | `src/design-system/gallery.*`, `tests/browser/gallery.spec.ts`, `specs/008-design-system/`, `specs/README.md`, `AI_LOG.md`. 조합 예시·명세·작업/리뷰 기록. |

## 분리 기준·검증

제품 동작과 기존 테스트 기대값은 바꾸지 않았다. 기존 한 파일의 단위 테스트를 컴포넌트별 8개 파일로 나누고, 브라우저 검사도 컴포넌트별 파일로 옮겼다. Badge·Card·Marker 외형 한 검사를 동일한 검증 내용의 독립된 3개 검사로 나눴으므로 브라우저 검사 수는 44개에서 46개가 된다. Playwright는 `tests/browser/**/*.spec.ts`를 검색한다.

단위 51개·브라우저 46개·타입·lint·공백 검사 통과. 변경 파일 76개가 정확히 한 커밋에 배정되고 각 단계에서 필요한 상대 경로 import 대상이 앞선 커밋 또는 같은 커밋에 포함되는지 확인했다. 제품 코드·Storybook 예시는 이번 분리에서 바꾸지 않아 직전 정적 빌드 결과를 유지한다.

## 이번 커밋의 절차 조정

사용자는 이번 12개 커밋의 직접 설명 확인을 추후로 미룰지 묻는 질문에 “이번엔 커믹해줘.”라고 답해 이번 커밋 실행을 승인했다(2026-10-12). 이 예외는 위 12개 커밋에만 적용하며 constitution의 기본 규칙은 유지한다. Button 테스트의 역할에 대한 직접 설명과 후속 컴포넌트의 상세 리뷰는 완료로 처리하지 않고 추후 진행한다. 푸시는 승인 범위에 포함하지 않는다.

## 실행 기록

1~11번 커밋은 `f24d226`부터 `ee81380`까지 생성했고 각 커밋의 실제 파일 목록이 위 배정과 일치함을 확인했다. 이 문서와 모아보기·통합 검증을 12번 커밋으로 묶는다. 지도 적용·사용자 상세 리뷰는 후속 작업이며 푸시는 실행하지 않는다.
