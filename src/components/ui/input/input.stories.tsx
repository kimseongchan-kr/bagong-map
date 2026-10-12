import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";
const meta = {
 id: "design-system-input", title: "배공맵/Input", component: Input, tags: ["autodocs"],
 args: { label: "라벨", placeholder: "입력해 주세요", helperText: "도움말" },
 argTypes: { disabled: { type: "boolean", control: "boolean" } },
 parameters: { docs: { description: { component: "항상 보이는 label과 native input 속성을 사용합니다. helperText보다 error가 우선하며 aria-describedby로 입력과 연결됩니다. className은 필드 전체에 적용됩니다. value/onChange는 부모 제어, defaultValue는 native 초기값입니다. required·name·type·폼 reset도 native 동작을 따릅니다. [Figma BG/Input](https://www.figma.com/design/DLAopCpFgjiiAdyWuUL2z2?node-id=22-125)." } } },
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본 · Tab으로 포커스" };
export const Filled: Story = { name: "입력됨", args: { defaultValue: "입력한 내용" } };
export const Error: Story = { name: "오류", args: { error: "입력 내용을 확인해 주세요." } };
export const Disabled: Story = { name: "비활성", args: { disabled: true } };
export const LongLabel: Story = { name: "긴 라벨과 안내", args: { label: "참가자에게 표시할 이름을 입력해 주세요", helperText: "개인 연락처나 정확한 집 주소는 공개 입력란에 적지 마세요." } };
