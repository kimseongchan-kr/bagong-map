import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";
const meta = {
 id: "design-system-checkbox", title: "배공맵/Checkbox", component: Checkbox, tags: ["autodocs"],
 args: { label: "선택 항목" },
 argTypes: { disabled: { type: "boolean", control: "boolean" }, defaultChecked: { type: "boolean", control: "boolean" } },
 parameters: { docs: { description: { component: "native checkbox입니다. 라벨 클릭·Space로 선택하고 disabled는 입력을 막습니다. checked/onChange는 부모 제어, defaultChecked는 초기값입니다. name/value/required와 폼 reset을 그대로 사용합니다. 여러 항목의 그룹 이름은 화면에서 fieldset/legend로 제공합니다. [Figma BG/Checkbox](https://www.figma.com/design/DLAopCpFgjiiAdyWuUL2z2?node-id=22-194)." } } },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "미선택 · Tab으로 포커스" };
export const Checked: Story = { name: "선택됨", args: { defaultChecked: true } };
export const Disabled: Story = { name: "비활성", args: { disabled: true } };
export const CheckedDisabled: Story = { name: "선택됨 + 비활성", args: { defaultChecked: true, disabled: true } };
