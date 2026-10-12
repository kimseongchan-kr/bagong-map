import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button, type ButtonProps } from "./button";

const meta = {
  id: "design-system-button",
  title: "배공맵/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "다시 시도",
    variant: "primary",
    loading: false,
    disabled: false,
    onClick: fn(),
    style: { width: "100%" },
  },
  argTypes: {
    children: { control: "text", description: "버튼이 수행할 행동을 설명하는 문구" },
    variant: {
      control: "radio",
      options: ["primary", "secondary", "ghost"],
      description: "행동의 시각적 강조 수준",
    },
    loading: { control: "boolean", description: "부모가 전달하는 처리 중 상태. 추가 실행을 차단한다." },
    // 네이티브 props에서 상속한 타입은 docgen이 생략하므로 URL args에도 타입을 명시한다.
    disabled: { type: "boolean", control: "boolean", description: "부모가 판단한 실행 불가 상태" },
    onClick: { control: false, description: "실행할 함수. 반환된 Promise로 로딩을 추론하지 않는다." },
  },
  parameters: {
    controls: { include: ["children", "variant", "loading", "disabled"] },
    docs: {
      description: {
        component: `
배공맵의 공통 행동 버튼입니다. 실행할 함수와 로딩·비활성 상태는 사용하는 화면이 관리합니다.
Button은 지도 SDK·업무 서버·재시도 정책을 알지 못합니다.

**현재 구현 단계:** 동작 Green 리뷰를 마치고 디자인 Green을 적용했습니다. 아래 예시는 공통 토큰과 CSS를 사용하는 실제 Button이며 사용자 시각 리뷰 대상입니다.

**사용 방법:** \`<Button onClick={retry}>다시 시도</Button>\`처럼 함수를 전달합니다.
기본 type은 button이며 폼 제출은 type="submit"을 명시할 때만 수행합니다.
지도 화면은 재시도 시 오류 영역 자체를 제거하고 지도 로딩 안내로 전환합니다. 아래 Loading 예시와 구분해 주세요.

**상태와 책임:** Primary는 주요 행동, Secondary는 보조 행동, Ghost는 강조가 낮은 행동에 사용합니다.
loading 또는 disabled이면 실행을 차단합니다. 둘 다 참이면 처리 중 표시를 우선하고,
loading만 해제해도 disabled가 남아 있으면 실행할 수 없습니다.

**키보드 검증:** Canvas 안에서 Tab으로 버튼에 접근하고 Enter·Space로 실행합니다.
비활성·로딩 버튼은 Tab 순서에서 제외됩니다. Hover는 실제 마우스 이동으로, Focus는 Tab으로 확인합니다.
Controls에서 3가지 variant를 바꾸며 기본·호버·포커스·비활성·로딩의 15조합을 재현할 수 있습니다.

**디자인 기준:** [Figma BG/Button](https://www.figma.com/design/DLAopCpFgjiiAdyWuUL2z2?node-id=22-89).
비교 예시의 폭은 180px이며 목표 높이는 48px입니다. 긴 문구에는 높이 확장을 허용합니다.
흰 글자 대비를 보완하기 위해 Primary 기본 #c94620·호버 #b13b18로 조정하기로 합의했습니다.
포커스는 #2463eb의 2px 바깥선과 2px 간격으로 표현합니다. Figma 원본은 변경하지 않았습니다.
`,
      },
    },
  },
  decorators: [
    (Story) => <div style={{ width: 180, maxWidth: "100%" }}><Story /></div>,
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { name: "Primary · 주요 행동" };
export const Secondary: Story = { name: "Secondary · 보조 행동", args: { variant: "secondary" } };
export const Ghost: Story = { name: "Ghost · 낮은 강조", args: { variant: "ghost" } };
export const Disabled: Story = { name: "비활성", args: { disabled: true } };
export const Loading: Story = { name: "처리 중", args: { loading: true } };
export const LoadingAndDisabled: Story = {
  name: "처리 중 + 비활성",
  args: { loading: true, disabled: true },
};
export const LongLabel: Story = {
  name: "긴 한국어 문구",
  args: { children: "네트워크 연결을 확인한 뒤 주변의 모집 중인 모임을 다시 불러와 주세요" },
};

function ControlledLoadingExample(args: ButtonProps) {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Button
        {...args}
        loading={loading}
        onClick={(event) => {
          args.onClick?.(event);
          setCount((value) => value + 1);
          setLoading(true);
        }}
      />
      <p>실행 횟수: {count}</p>
      <Button variant="secondary" disabled={!loading} onClick={() => setLoading(false)}>
        처리 완료로 바꾸기
      </Button>
    </div>
  );
}

export const ControlledLoading: Story = {
  name: "부모가 로딩을 제어하는 예시",
  render: (args) => <ControlledLoadingExample {...args} />,
  parameters: {
    controls: { include: ["children", "variant", "disabled"] },
    docs: {
      description: {
        story: "첫 버튼을 실행하면 예제 부모가 loading을 켭니다. ‘처리 완료로 바꾸기’를 누르면 해제합니다. SDK·서버·자동 타이머 없이 상태 소유와 복구를 확인할 수 있습니다.",
      },
    },
  },
};
