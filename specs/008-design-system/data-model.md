# Button의 입력과 상태

서버 데이터·DB 모델은 없다. 이 문서는 화면이 소유하는 입력과 Button이 계산하는 표시 상태를 정의한다.

| 대상 | 값과 관계 | 검증 규칙 |
|---|---|---|
| Token | 원본 기본 값 → 의미 이름 → 버튼 전용 의미 이름 | 앱·Storybook이 같은 CSS 정의를 사용한다. Figma 이름·차이 이유를 기록한다. |
| Button 입력 | 문구, variant, onClick, loading, disabled, type | 문구는 비어 있지 않은 문자열. 알려진 3가지 variant만 허용한다. 기본 type은 button이다. |
| Button 표시 | 입력과 실제 hover/focus에서 계산 | 내부 업무 상태·SDK·자동 Promise 추적을 두지 않는다. |
| Story | Button 입력 + 예제 부모 상태 | 실제 Button을 가져온다. 별도의 복제품을 만들지 않는다. |

| loading | disabled | 문구 | 조작·Tab | 스타일 |
|---|---|---|---|---|
| false | false | 원래 문구 | 가능 | variant의 기본·실제 hover·focus-visible |
| false | true | 원래 문구 | 불가 | Disabled |
| true | false | 처리 중… | 불가 | 해당 variant의 Loading |
| true | true | 처리 중… | 불가 | Loading 우선 |

부모가 입력을 변경하면 바로 그 조합으로 다시 계산한다. Loading 해제 후 disabled가 남으면 비활성 상태로 돌아간다.
콜백의 반환값·성공·실패는 Button의 상태 전환을 일으키지 않는다.
지도 재시도에서는 부모가 오류 영역 자체를 제거하므로 Button의 Loading 상태가 아니라 기존 지도 로딩 안내를 표시한다.
