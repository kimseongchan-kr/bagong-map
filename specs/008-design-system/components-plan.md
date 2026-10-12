# 컴포넌트 확장 구현 계획·작업

범위: [components.md](components.md). Button 기반 커밋과 후속 구현을 분리한다. 동반 writing-plans 스킬이 설치되어 있지 않아 기존 specs 위치에 직접 계획을 작성한다. 순차 구현하며 사용자 요청대로 중간 리뷰는 추후에 받는다.

- [X] C01 입력·선택·표현 컴포넌트 계약 테스트 작성 및 Red 확인 (DS2-01~06)
- [X] C02 Input, Checkbox, Radio, Badge, Card, Marker 최소 구현·CSS·상태 예시 (DS2-01/02/05/06)
- [X] C03 SelectOption/Select 키보드·값·오류·비활성 구현·예시 (DS2-03/04)
- [X] C04 Modal 실제 브라우저 Red → native dialog 구현·예시 (DS2-07)
- [X] C05 한국어 Docs·Gallery, 브라우저에서 키보드·크기·색상·모달 검증 (DS2-08)
- [X] C06 중복/실패 조건 검토, 단위·브라우저·타입·lint·Storybook 빌드, 결과/AI_LOG 갱신

구조: `src/components/ui/<name>/`에 컴포넌트·CSS Module·story를 함께 둔다. Input과 Select의 label/도움말 스타일, Checkbox와 Radio의 선택 표시 스타일만 공유한다. Select 내부 UI 상태는 필드 값과 구분한다. 원본 모집 데이터 모델을 UI 안으로 가져오지 않는다. 공개 export는 개별 파일로 사용하며 불필요한 barrel은 만들지 않는다.

검증: 단위 테스트는 전달된 값·이벤트·폼·상태 의미를 검사한다. 실제 Chromium은 CSS/keyboard/focus/dialog/320px 반응형을 검사한다. 스크린리더 발화와 다른 브라우저는 별도 직접 검증 대상으로 남긴다. 동작 없는 문서는 검토로 확인한다.

## 실행 기록

- 2026-10-12: Figma 9개 구성요소와 상태 화면 확인. 고정 크기는 반응형 최대/최소 크기로 번역하고 접근성 색상 보완은 의미 토큰으로 구분한다. 명세·계획 작성 후 계약 테스트부터 진행한다.
- C01: 타입만 있는 null 반환 컴포넌트를 두고 새 계약 18개가 요소 미구현으로 실패함을 확인했다. 기존 33개는 통과했다. 문법/import 오류와 구분했다.
- C02~03: native 입력·표현·Select UI 상태 및 공통 토큰·CSS 구현 후 전체 51개 단위 테스트 통과. 선택/탐색/비활성·폼·오류·전달 이벤트를 검사했다.
- C04: Modal null 반환 상태에서 실제 브라우저 3개가 dialog 부재로 실패함을 확인했다. native dialog 구현 후 포커스 순환·부모 닫기 결정·재열기 모두 통과했다. StrictMode 예시를 최초 open 상태로 마운트/제거하는 구성으로 보완해 정리도 검증한다.
- 구조 검토: Input/Select 필드 CSS, Checkbox/Radio 표시 CSS만 공유했다. 상태/업무 모델 추상화는 추가하지 않았다. Modal은 기존 텍스트 Button 계약을 바꾸지 않고 이름이 있는 닫기 아이콘 버튼을 내부에 둔다. Footer 예시는 공통 Button을 사용한다.
- Storybook: 전체 49개 story, 10개 Docs, 전체 모아보기 포함. 실제 업무 API·지도 SDK를 사용하지 않는다. 데스크톱·320px 모아보기, 모바일 긴 Modal 스크린샷을 직접 확인했다.
- 최종 결과: `npm test` 51개, `npm run test:storybook` 44개, `typecheck`, `lint`, `build-storybook`, 공백 검사 통과. 브라우저 44개는 기존 Button 22개와 후속 22개이며 9개 한국어 Docs, 키보드, 긴 옵션 스크롤, 부모 선택 동기화, StrictMode Modal, 320px 넘침을 포함한다. 기존 검사의 수용 기대값은 유지했다.
- 미검증/리뷰: 실제 스크린리더·Safari/Firefox·실제 모바일 기기는 미실행이다. 사용자 상세 코드·시각 리뷰는 요청대로 추후 진행하며 리뷰 완료로 표시하지 않는다. 기존 지도 연결 T010~012와 첫 사이클의 직접 설명 T014는 별도 작업이다.
- 커밋 분리 후 재검증: 사용자의 컴포넌트별 커밋 요청에 따라 테스트 파일도 나눴다. Badge·Card·Marker 외형 검사를 같은 내용의 3개 테스트로 분리해 브라우저 수가 46개가 되었으며 전부 통과했다. 단위 51개·타입·lint도 다시 통과했다. 상세 배정은 [commit-plan.md](commit-plan.md)에 있다.
- 커밋 실행: 이번 12개 커밋에 한해 직접 설명 확인을 추후로 미루는 사용자 승인을 받았다. 공통 기반·컴포넌트별 커밋을 생성했고 모아보기·문서·기록은 마지막 통합 커밋에 포함한다. 푸시는 실행하지 않는다.
