# 나머지 Figma 컴포넌트 명세

작성일: 2026-10-12 · 상태: 요청 범위 구현·자동 검증 완료, 사용자 상세 리뷰는 추후

## 목적·승인 범위

Button에서 경험한 명세 → 설계 → Red → Green → 구조 검토 → Storybook → 검증 순서를 나머지 9개에도 적용한다.
사용자가 “남은 컴포넌트는 그냥 빨리 다 만들삼 내가 나중에 따로 볼게”, “button 만들 때 순서로 쭉 만들면 될듯”으로 중간 리뷰를 추후에 모아 받도록 명시했다. 이 문서는 그 요청 안에서 선택한 구현 계약이며 사용자 상세 리뷰 완료를 뜻하지 않는다. 커밋 전 직접 설명 규칙은 별도다.

기준: [Figma 컴포넌트 가이드](https://www.figma.com/design/DLAopCpFgjiiAdyWuUL2z2?node-id=17-93). Input 22:125, Select option 22:132, Select 22:180, Checkbox 22:194, Radio 22:208, Badge 22:217, Card 3:80/22:233/22:246, Marker 3:294/22:260/22:263, Modal 22:232의 화면·상태·토큰을 확인했다.

## 범위·제약

- 기존 React·TypeScript·CSS Modules·Storybook·Vitest·Playwright를 사용한다. 추가 UI 패키지나 SDK 의존성을 만들지 않는다.
- 컴포넌트는 전달받은 값과 콜백을 사용한다. 모집 가능 여부·인원·가격·잔여 시간·인증·주소 공개 정책은 화면/서버가 판단한다.
- 서버 연동, 회원가입, SSE, 지도 마커 실제 배치, 전체 메인 화면 교체, Figma 원본 수정은 제외한다.
- Figma 고정 폭은 기본 폭/최대 폭으로 사용하고 320px 화면과 긴 한국어 문구에서는 잘림 없이 확장한다.
- Figma 색상은 보존한다. 작은 브랜드색 글자·선택 배경은 기존 Button의 대비 보완 색상을 의미 토큰으로 재사용하고, 보조 글자에는 기존 onDisabled를 사용한다. 원본의 장식선은 유지하므로 WCAG 전체 준수를 주장하지 않는다.

## 동작과 수용 조건

| ID | 계약과 관찰 가능한 결과 |
|---|---|
| DS2-01 | Input은 항상 보이는 label, native input 속성, helperText/error를 받는다. 오류 문구가 도움말에 우선하고 aria-invalid·aria-describedby로 연결된다. id 자동 생성은 다중 인스턴스에서 충돌하지 않는다. disabled 입력과 콜백은 차단된다. controlled/uncontrolled·폼 reset은 native 계약을 따른다. |
| DS2-02 | Checkbox·Radio는 native input과 클릭 가능한 label을 사용한다. checked/defaultChecked/onChange/name/value/required/disabled를 전달하며 Space·Radio 방향키·동일 name 단일 선택·폼 제출을 보존한다. 별도 업무 상태를 소유하지 않는다. |
| DS2-03 | Select는 label/options/value/onValueChange를 받는 단일 선택 controlled 컴포넌트다. option value는 비어 있지 않은 고유 문자열이다. 열린 상태와 탐색 위치만 내부에서 관리한다. 선택값과 탐색 위치를 분리한다. Arrow·Home·End·문자 탐색, Enter/Space 확정, Escape 취소, Tab/바깥 클릭 닫기를 지원한다. Tab/바깥 클릭은 확정하지 않는다. 비활성 항목을 건너뛰며 빈 목록을 안내한다. disabled는 열림/선택을 막는다. 오류·도움말 연결은 Input과 같다. name이 있으면 hidden input으로 선택값을 전달한다. 필수 여부·폼 reset·유효성 판단은 부모가 관리한다. |
| DS2-04 | SelectOption은 listbox 안의 표현 요소다. selected/active/disabled를 구분하고 접근 가능한 선택 상태를 제공한다. Select가 포커스·키보드 탐색을 관리한다. 단독 폼 필드로 사용하지 않는다. |
| DS2-05 | Badge는 recruiting/pending/approved/closed 기본 문구와 외형을 표시한다. label 덮어쓰기를 허용하고 자체 상태 전환/클릭 동작은 없다. |
| DS2-06 | Card는 title/number/modeLabel/deadlineLabel/description/participantsLabel/priceLabel을 받아 표시한다. Marker는 number/label을 받는다. 둘 다 selected와 closed를 독립적으로 받는 native button이며 부모의 onClick만 실행한다. 마감 문구를 표시하되 상세 확인을 위해 선택할 수 있다. 참여 행동은 이 컴포넌트에 없다. 같은 모집의 선택 연동은 부모가 소유하며 Storybook 예시로 검증한다. |
| DS2-07 | Modal은 open/title/description/children/footer/onClose를 받는다. native dialog로 배경 조작을 차단하고, 열 때 내부 포커스·Tab 순환·Escape/닫기 요청·닫힌 뒤 원래 요소 포커스 복귀를 지원한다. 닫기 요청의 실제 open 변경은 부모 책임이다. 배경 클릭은 닫지 않는다. 긴 본문은 내부 스크롤, 헤더/푸터는 계속 보인다. 중첩 모달·초기 포커스 사용자 지정은 이번 범위에서 제외한다. |
| DS2-08 | 각 컴포넌트는 한국어 Storybook Docs/상태 예시/사용 계약을 제공한다. Gallery에서 조합 예시와 선택 동기화를 확인한다. Focus/hover는 실제 입력 상태로 확인한다. 단위·브라우저·타입·lint·정적 빌드를 검증하고 실제 스크린리더 미검증을 기록한다. |

## 설계 선택과 근거

Input/Checkbox/Radio에는 브라우저 기본 입력 동작을 사용한다. Select는 Figma의 독립된 옵션 외형과 선택/탐색 분리를 위해 작은 combobox로 구성한다. [WAI combobox 지침](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/)의 키보드·active descendant 방식을 참고하되 Tab/바깥 클릭에서는 명시적 확정 전 값을 보존하도록 정했다. Modal은 [native dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)의 top layer와 모달 처리를 사용한다. 범용 overlay 프레임워크를 추가하지 않는다.
