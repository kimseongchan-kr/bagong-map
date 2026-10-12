# 컴포넌트 리뷰 안내

## 실행·탐색

`npm run storybook` 후 [전체 모아보기](http://localhost:6006/?path=/story/design-system-gallery--overview)에서 조작한다.
각 컴포넌트의 Docs에는 책임·props·Figma 원본 링크가 있고 Canvas에서는 실제 Tab/Space/Enter/방향키·클릭을 사용할 수 있다.

| 읽을 코드 | 먼저 확인할 내용 |
|---|---|
| `src/components/ui/input/input.tsx` | native 속성 전달, useId, label, 도움말·오류 연결 |
| `src/components/ui/checkbox/checkbox.tsx`, `radio/radio.tsx` | native 입력을 감싸며 checked/onChange는 화면에서 받는 구조 |
| `src/components/ui/badge/badge.tsx` | 상태 → 기본 문구 매핑, 자체 상태 변경 없음 |
| `src/components/ui/card/card.tsx`, `marker/marker.tsx` | selected와 closed의 독립성, 전달받은 문구와 onClick만 사용 |
| `src/components/ui/select-option/select-option.tsx` | 확정된 selected, 탐색 중인 active, 입력 불가 disabled 구분 |
| `src/components/ui/select/select.tsx` | 확정값은 부모, open/activeValue는 내부 UI 상태. Escape 취소, Enter 확정, disabled 건너뛰기 |
| `src/components/ui/modal/modal.tsx` | open과 native dialog 연결, effect 정리·포커스 복귀, 닫기 요청만 부모에게 전달 |
| `src/design-system/gallery.stories.tsx` | 화면이 선택값 하나를 Card/Marker에 공유하는 예시 |

## 직접 검증 순서

1. Input에 입력하고 Error·Disabled 예시를 비교한다. 라벨 클릭으로 입력에 포커스가 가는지 본다.
2. Checkbox를 Space로 전환하고 Radio 그룹에서 방향키로 비활성 항목을 건너뛴다.
3. Select를 열고 방향키로 이동한다. Enter를 누르기 전 확정값이 유지되고, Escape를 누르면 기존 값으로 닫히는지 본다. 빈 목록과 긴 목록도 확인한다.
4. 모아보기에서 Card 또는 Marker를 누른다. 두 표현의 선택 상태가 함께 바뀌는지 확인한다. ‘01번 모집 마감’을 켜도 선택은 유지되고 마감 문구가 보인다.
5. Modal을 열고 Tab/Shift+Tab으로 순환한다. Escape·닫기 후 원래 버튼으로 돌아오는지 본다. Controlled 예시에서는 닫기 요청 횟수만 늘고 ‘변경 버리고 닫기’를 눌러야 닫힌다.
6. 브라우저 폭을 320px로 줄여 긴 카드·모달 본문의 줄바꿈·내부 스크롤을 확인한다.

## 화면에서 사용하는 방식

```tsx
const [mode, setMode] = useState("");
const [open, setOpen] = useState(false);

<Select label="참여 방식" value={mode} onValueChange={setMode}
  options={[{ value: "pickup", label: "각자 가져가기" }]} />
<Modal open={open} onClose={() => setOpen(false)} title="모집 상세"
  footer={<Button onClick={() => setOpen(false)}>확인</Button>}>
  <p>화면에서 구성한 내용</p>
</Modal>
```

소비하는 앱 진입점에서는 `src/design-system/fonts.css`와 `tokens.css`를 가져와야 한다. Storybook에는 이미 연결되어 있다. 실제 지도 화면의 교체는 기존 tasks.md의 T010~012에 남겨 두었다.
Radio 그룹은 고유 name과 fieldset/legend를 함께 사용한다. Select option value는 고유한 비어 있지 않은 문자열이어야 한다. Select 폼 필수 검증/reset은 부모가 결정한다.

## 자동 검증

2026-10-12 결과: 단위 테스트 51개, Chromium 브라우저 테스트 46개, 타입 검사, lint, Storybook 정적 빌드 통과. 컴포넌트별 커밋 준비 중 Badge·Card·Marker 외형 검사를 각각 나누어 44개에서 46개가 되었으며 검증 내용은 동일하다. 49개 예시와 10개 Docs가 생성되며 각 Docs의 실제 표시도 확인했다.

```sh
npm test
npm run typecheck
npm run lint
npm run build-storybook
npm run test:storybook
```

정적 빌드와 브라우저 검사는 순서대로 실행한다. 개발 서버는 생성된 storybook-static HTML 변경에도 페이지를 새로고침하므로 동시에 실행하면 브라우저 검사가 중단될 수 있다. `.storybook/main.ts`의 검색 경로를 바꾼 경우 개발 서버를 재시작한다.

자동 검증은 사용자 시각 리뷰·코드 설명을 대신하지 않는다. 실제 스크린리더, Safari/Firefox, 실제 모바일 기기 검증은 미실행이다. SDK 배치·서버 연동·실제 참여 요청·지도의 기존 UI 전환은 이번 확장 범위에서 제외했다.
