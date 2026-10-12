# Button UI 계약

승인된 설계 계약이다. 디자인 Red 리뷰 후 Button 외형을 구현하고 Storybook에 연결했으며 사용자 Green 리뷰를 마쳤다. 지도 연결은 이후 작업이다. [명세](../spec.md)의 DS-FR-001~007을 구체화한다.

## 공개 입력

| 입력 | 형식·기본값 | 책임 |
|---|---|---|
| children | 필수 문자열 | 실행할 행동을 설명하는 문구. 아이콘 전용·임의 JSX는 이번 범위 밖 |
| variant | primary / secondary / ghost, 기본 primary | 시각적 강조 수준 |
| onClick | React 버튼 click handler, 선택 | 화면이 전달한 동작을 연결. 콜백 반환값으로 로딩을 추론하지 않음 |
| loading | boolean, 기본 false | 부모가 처리 중임을 알림 |
| disabled | boolean, 기본 false | 부모가 실행 불가임을 알림 |
| type | button / submit / reset, 기본 button | HTML 폼 동작을 명시적으로 선택 |
| 기타 | id·name·value·form·aria-describedby·className 등 네이티브 버튼 속성 | className은 부모 배치 용도로 사용. 버튼 의미·이름·차단·busy 처리는 컴포넌트가 관리 |

`state="hover"` 같은 표시 전용 입력, size, asChild, SDK 인스턴스는 추가하지 않는다.
접근 가능한 이름을 children과 다르게 덮어쓰는 aria-label/aria-labelledby, role, aria-busy는 공개 입력에서 제외한다.

## 조작과 접근성

- 활성 버튼은 클릭·Enter·Space 한 번당 onClick 한 번 실행. 키 이벤트로 click을 중복 생성하지 않는다.
- `disabled || loading`을 네이티브 disabled로 전달한다. 차단 상태는 Tab에서 제외되며, 로딩 전 포커스 보존·자동 복귀는 보장하지 않는다.
- 일반 상태의 접근 가능한 이름은 children이다. 로딩은 화면에 ‘처리 중…’, 접근 가능한 이름에 ‘{원래 문구} 처리 중…’, aria-busy=true를 제공한다.
- 버튼 바깥의 항상 존재하는 시각적 숨김 live region(aria-live=polite, aria-atomic=true)에 처리 중 문구를 갱신한다. busy 영역과 분리하고 강제 포커스를 이동하지 않는다. 실제 음성 출력은 별도 확인한다.
- 기본 type=button은 폼을 제출하지 않는다. submit/reset을 지정하면 활성 상태에서 해당 네이티브 동작을 따른다.
- 차단 상태에서는 활성 hover 스타일이 나타나지 않는다. 키보드 focus-visible에는 파란 포커스 표시가 보이며 레이아웃이 이동하지 않는다.

## 외형과 토큰

원본 색상·간격·글자 토큰은 [명세의 기준](../spec.md#assumptions)을 따른다. CSS 이름은 `--bg-` 접두사로 기존 전역 변수와 구분하고 원본 이름을 주석으로 남긴다.

| variant | Default·Loading 배경 / 글자 | Hover 배경 | 테두리 |
|---|---|---|---|
| primary | 버튼 전용 #c94620 / white | 버튼 전용 #b13b18 | 투명 |
| secondary | white / ink | brandSoft | line 1px |
| ghost | 투명 / ink | brandSoft | 투명 |

- Disabled는 모두 disabled 배경·onDisabled 글자이며 Secondary만 line 테두리를 유지한다. Loading+Disabled 조합은 Loading 색상을 쓴다.
- `--bg-button-primary`는 기존 brandHover primitive를 참조하고 `--bg-button-primary-hover`만 새 어두운 primitive를 참조한다. brand 원본 #e65c32는 유지한다.
- Focus는 승인된 계획에 따라 focus 토큰 #2463eb의 2px outline과 2px offset으로 표현한다. Figma의 테두리를 바깥 표시로 옮겨 크기 변화 없이 주변 배경과 구분한다. 이 표현 차이도 시각 리뷰한다.
- Noto Sans KR 14px/21px·700, 모서리 space/12, 최소 높이 48px. 좌우 padding 12px, 내용 간격 8px. 한 줄은 세로 중앙 정렬하고 긴 문구는 줄바꿈·높이 확장을 허용한다.
- 원본 비교 Story는 180×48 기준이다. 제품은 내용에 맞는 폭과 부모 너비 제한을 사용한다. 별도 크기 variant는 없다.
- Ghost의 투명 배경은 이번에 사용하는 흰색 배경을 기준으로 검증한다. 임의 배경 위 대비까지 보장하지 않는다.

## Storybook과 지도 사용 경계

Storybook은 3가지 variant를 제공하고 Controls로 children·variant·loading·disabled를 변경한다. Disabled·Loading·동시 상태·긴 문구·부모가 로딩을 켜고 끄는 예시를 둔다. Hover/Focus는 실제 마우스·Tab 동작으로 재현하며 Playwright에서도 같은 조작을 사용한다.

한국어 Autodocs에는 역할 분리, 상태별 사용법, 코드 예시, 키보드 확인법, Figma 링크와 승인된 대비 보완을 설명한다. 예제 부모는 클릭 횟수와 loading만 관리하며 네트워크·SDK를 사용하지 않는다.

지도 연결은 `<Button onClick={retry}>다시 시도</Button>` 형태다. 기존 retry·effect·오류/로딩 렌더링은 유지한다. 실제 Loading Button 예시는 지도 오류 화면의 동작과 다름을 명시한다.
