# Button 구현 후 실행·검증 안내

Button과 후속 9개 컴포넌트의 구현·자동 검증 및 개별 커밋을 마쳤다. 단위 테스트 51개·브라우저 검사 46개·타입·lint·Storybook 정적 빌드가 통과했다. 전체 49개 예시·10개 Docs와 모아보기의 검토 순서는 [리뷰 안내](components-review.md)에 있다. 사용자 승인으로 이번 커밋의 직접 설명 확인은 추후로 미뤘다. 아래 표의 Next 제품 빌드·지도 연결은 이후 단계에서 검증한다.

로컬 서버 실행 후 [Button Docs](http://localhost:6006/?path=/docs/design-system-button--docs)에서 예시를 확인한다. 비교 예시는 180×48·모서리 12px이며 승인된 색·글꼴·포커스를 적용했다. 실제 hover와 Tab focus, loading·disabled의 표시 차이를 리뷰한다. 긴 문구는 줄바꿈하며 높이가 늘어난다. 앱 진입점의 공통 토큰 import와 지도 연결은 이후 작업이다.

## 준비와 실행

Node 24.x, npm, 프로젝트 의존성, Playwright Chromium이 필요하다. Storybook 의존성은 설치하고 lockfile에 고정했다. 이후 재현은 `npm ci`를 사용한다.

| 명령 | 기대 결과 |
|---|---|
| `npm run storybook` | localhost:6006에 로컬 Button 예시·Docs 표시 |
| `npm run build-storybook` | storybook-static 정적 빌드 성공 |
| `npm test` | Button·기존 SDK/지도 동작 검사 통과 |
| `npm run test:storybook` | Storybook 서버를 사용한 Playwright Chromium 검사 통과 |
| `npm run lint` / `npm run typecheck` | Storybook·브라우저 검사 설정까지 포함해 통과 |
| `npm run build` | 기존 Next 제품 빌드 성공 |

Chromium이 없으면 `npx playwright install chromium`으로 준비한다. 이 작업 환경에는 설치를 완료했다. 공개 배포 명령은 추가하지 않는다.
지도 키는 Storybook에 필요하지 않다. 글꼴은 기존 Google Fonts URL을 fonts.css에 정의해 Storybook에서 불러오며 앱에도 연결할 예정이다. Chromium에서 document.fonts.load로 한국어 문구에 대응하는 Noto Sans KR FontFace의 실제 로딩을 확인했다. 외부 글꼴 서버 접근이 실패하면 글꼴 검사가 실패하며 시각 비교를 미검증으로 표시한다. CSS의 font-family 문자열 검사만으로 다운로드 성공을 판단하지 않는다.

## Button 검증

1. Docs에서 목적·입력·Figma 링크·승인된 색상 차이를 확인한다. Controls로 문구와 variant를 변경한다.
2. Primary·Secondary·Ghost 각각 기본, 실제 hover, Tab focus, Disabled, Loading을 재현해 총 15조합을 비교한다. 예시 180×48, 글꼴 준비 완료 후 색·테두리·문구를 확인한다.
3. 각 스타일에서 클릭·Enter·Space의 콜백 횟수를 확인한다. disabled, loading, 두 값 모두 true에서 추가 실행이 차단되고 해제 후 복구되는지 확인한다.
4. 부모 상태 예시에서 로딩 시작·종료를 조작한다. 처리 중 표시, 원래 동작이 포함된 접근 가능한 이름·busy·live region을 검사한다. 스크린리더 발화는 실제 수행한 도구와 결과를 따로 기록한다.
5. 기본 버튼이 폼을 제출하지 않고 명시적 submit은 제출하는지 검사한다. 390px 화면에서 긴 한국어 문구가 잘리거나 가로 넘침을 만들지 않는지 확인한다.

## 지도 연결과 회귀 확인

1. 기존 지도 검사 11개에 재실패·로딩 중 버튼 제거 검증을 보완하고 통과를 확인한다.
2. localhost:3000에서 SDK 요청을 통제하는 브라우저 대역으로 첫 실패 → 다시 시도 → 로딩 → 성공, 재실패 → 오류·버튼 복귀를 재현한다. 인증 정보가 없는 환경에서도 테스트용 SDK 대역과 공개용 가짜 Client ID로 검증한다. 실제 키는 출력·기록하지 않는다.
3. 1440×900·390×844에서 오류 버튼의 문구·포커스·배치를 확인한다. SDK 응답 통제 결과와 실제 네이버 지도 인증 결과를 구분한다.
4. 프로덕션 빌드 화면에서도 Button 스타일 적용과 다른 화면 요소의 회귀를 확인한다.

## 완료 기록

SC-001~005별 실행 명령·결과·시각 리뷰·미검증 항목을 tasks.md와 AI_LOG에 기록한다. 저장한 스크린샷만으로 사용자 시각 승인을 대신하지 않는다.
사용자는 토큰 공유 이유, onClick과 loading의 책임, 입력 차단·기본 type·검증을 자기 말로 설명한다. 기본 절차는 설명 확인 후 커밋 범위·메시지를 제시하고 별도 지시를 따르는 것이다. 이번 12개 커밋에만 직접 설명 확인을 추후로 미루는 사용자 승인을 받았다([기록](commit-plan.md)).
