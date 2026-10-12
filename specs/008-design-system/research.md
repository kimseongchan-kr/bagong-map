# Button 설계 조사

확인일: 2026-10-12. 아래는 설계 근거이며 설치·실행 통과 기록은 아니다.

## 1. 컴포넌트와 스타일

- **결정**: 네이티브 `button`, CSS Modules, 공통 CSS custom properties를 사용한다.
- **이유**: 기존 React·CSS 환경으로 클릭·키보드·disabled·폼 의미를 제공하고 Button의 스타일을 분리할 수 있다. 앱과 Storybook은 같은 토큰·폰트 파일을 가져온다.
- **대안**: Chakra 등의 라이브러리는 Button 하나의 첫 사이클에 추가 추상화가 크다. 전역 클래스만 사용하면 기존 `.map-error button`처럼 화면 CSS가 Button에 간섭한다.
- **근거**: [HTML button](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button), [WAI Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/), 설치된 Next 16.4 문서 `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`. CSS 순서는 프로덕션에서도 검증한다.

## 2. Storybook 구성

- **결정**: `storybook@10.6.1`, `@storybook/react-vite@10.6.1`, `@storybook/addon-docs@10.6.1`, `vite@8.3.4`를 devDependency로 고정하는 계획이다. 기존 Vitest와 Playwright를 유지한다.
- **이유**: 이번 Button에는 Next 전용 API가 없다. React Vite는 CSS Modules를 지원하며 Controls와 한국어 Autodocs로 사용법·상태·Figma 링크를 제공할 수 있다.
- **호환 근거**: 조사한 react-vite 10.6.1 peer 범위는 React/ReactDOM 16.8~19, Vite 5~8, Storybook ^10.6.1, TypeScript >=4.9다. 설치된 Vite 8.3.4의 Node 범위는 ^20.19.0 || >=22.12.0이며 Node 24.12.0이 충족한다. 기존 Vitest 5.0.3은 Vite 8을 허용한다. 설치·빌드 검증은 계획 승인 후 수행한다.
- **Docs 호환 근거**: addon-docs 10.6.1은 Storybook ^10.6.1 및 @types/react 16.8~19를 허용한다. 현재 @types/react 19.3.0이 범위에 들어간다. addon-vitest 10.6.1도 Vitest 5를 허용하지만, 호환 여부와 별개로 이번 최소 구성에는 추가하지 않는다.
- **대안**: Next 전용 어댑터는 Next Image/Link/라우터를 포함한 컴포넌트가 필요할 때 재검토한다. `addon-vitest`와 별도 browser Vitest 환경은 기존 검사 체계를 중복하므로 첫 범위에서 제외한다. Chromatic·공개 배포는 포함하지 않는다.
- **근거**: [React Vite 공식 안내](https://storybook.js.org/docs/get-started/frameworks/react-vite), [스타일 지원](https://storybook.js.org/docs/configure/styling-and-css), [Controls](https://storybook.js.org/docs/essentials/controls), [Autodocs](https://storybook.js.org/docs/writing-docs/autodocs), npm 패키지 메타데이터 및 기존 `node_modules/vite/package.json`·`vitest/package.json`.

## 3. 로딩과 접근성

- **결정**: `disabled || loading`으로 네이티브 disabled를 설정한다. Loading이면 화면에는 ‘처리 중…’, 접근 가능한 이름에는 원래 동작과 처리 중 문구를 함께 제공하고 `aria-busy`를 설정한다.
- **이유**: 자체 키 이벤트 구현 없이 입력을 차단한다. 처리 중 상태는 busy 버튼 바깥의 항상 존재하는 숨김 live region(aria-live=polite, aria-atomic=true)을 갱신해 알린다. 기존 지도 로딩의 status 역할과 구분한다.
- **한계·대안**: native disabled는 Tab 순서에서 빠지고 로딩 전 포커스 유지는 보장하지 않는다. `aria-disabled`만 쓰면 클릭·키보드·폼 동작을 직접 차단해야 하므로 이번에는 채택하지 않는다. 스크린리더의 실제 발화는 자동 DOM 검사와 별도로 확인한다.
- **근거**: [Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/), [status 역할](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role).

## 4. Figma 색상과 대비 보완

- **발견**: 원본 Primary의 흰색 / `#e65c32`는 약 3.53:1. 원본 글자 14px·700은 큰 글자 기준에 해당하지 않으므로 일반 글자 4.5:1 기준에 못 미친다.
- **사용자 결정**: 2026-10-12 버튼 기본색을 기존 호버색 `#c94620`로 조정하고 호버는 더 진하게 설계하도록 승인했다.
- **설계**: 기본 `#c94620`(4.79:1), 호버 `#b13b18`(5.99:1)을 버튼 전용 토큰으로 둔다. 전자는 기존 primitive를 참조하고 후자만 새 값을 추가한다. 원본 브랜드 토큰과 다른 화면은 유지한다.
- **대안**: 원본 유지·문제 기록도 제시했으나 사용자가 개선을 선택했다. Figma 수정은 요청 범위 밖이므로 코드 문서에 차이를 명시한다.
- **근거**: [Figma BG/Button](https://www.figma.com/design/DLAopCpFgjiiAdyWuUL2z2?node-id=22-89), [WCAG 글자 대비 기준](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). 비율은 sRGB 상대휘도 계산값이며 실제 렌더링 검증은 남아 있다.

## 5. 검증 경계

Vitest는 상태·callback·폼 의미를, Playwright는 CSS·실제 hover/focus·줄바꿈을 검증한다. jsdom 검사만으로 색·배치가 맞다고 결론내리지 않는다. 스크린샷은 사용자 비교 자료이며 첫 실행 결과를 자동으로 정답 이미지로 승인하지 않는다. 기존 외부 Noto Sans KR 로딩이 실패하면 동작 검사는 가능하지만 Figma와의 글꼴 비교는 미검증으로 남긴다.
