import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { Select, type SelectProps } from "./select";
function ControlledSelect() {
 const [args, updateArgs] = useArgs<SelectProps>();
 return <Select {...args} onValueChange={value => { args.onValueChange(value); updateArgs({ value }); }} />;
}
const meta = {
 id: "design-system-select", title: "배공맵/Select", component: Select, tags: ["autodocs"],
 args: { label: "참여 방식", value: "", helperText: "원하는 참여 방식을 선택하세요.", options: [
 { value: "pickup", label: "각자 가져가기" }, { value: "disabled", label: "준비 중", disabled: true }, { value: "together", label: "함께 먹기" },
 ], onValueChange: fn() },
 parameters: { docs: { description: { component: "value/onValueChange로 부모가 확정값을 관리합니다. 내부는 열림/탐색 위치만 소유합니다. options의 value는 비어 있지 않은 고유 문자열이어야 합니다. Arrow/Home/End/문자로 탐색하고 Enter·Space·클릭으로 확정합니다. Escape/Tab/바깥 클릭은 확정 전 값을 보존하고 닫습니다. disabled 옵션은 건너뜁니다. name은 hidden input으로 폼 값을 전달하며 필수 검증·reset은 부모가 관리합니다. [Figma BG/Select](https://www.figma.com/design/DLAopCpFgjiiAdyWuUL2z2?node-id=22-180)." } } },
 render: ControlledSelect,
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본 · 클릭 또는 키보드로 열기" };
export const Selected: Story = { name: "선택됨", args: { value: "pickup" } };
export const Error: Story = { name: "오류", args: { error: "항목을 선택해 주세요." } };
export const Disabled: Story = { name: "비활성", args: { disabled: true } };
export const Empty: Story = { name: "빈 목록", args: { options: [] } };
export const LongList: Story = { name: "긴 목록 · 탐색 시 스크롤", args: { options: Array.from({ length: 24 }, (_, i) => ({ value: String(i + 1), label: `선택 항목 ${i + 1}` })) } };
