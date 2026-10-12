import { useId } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio } from "./radio";
function GroupExample() {
 const name = useId();
 return <fieldset style={{ border: 0, padding: 0, display: "grid", gap: 8 }}><legend>참여 방식</legend>
 <Radio name={name} label="각자 가져가기" value="pickup" defaultChecked />
 <Radio name={name} label="준비 중" value="unavailable" disabled />
 <Radio name={name} label="함께 먹기" value="together" /></fieldset>;
}
const meta = {
 id: "design-system-radio", title: "배공맵/Radio", component: Radio, tags: ["autodocs"],
 args: { label: "선택 항목" },
 argTypes: { disabled: { type: "boolean", control: "boolean" }, defaultChecked: { type: "boolean", control: "boolean" } },
 parameters: { docs: { description: { component: "native radio입니다. 같은 name의 항목 중 하나를 선택하며 그룹 안에서 방향키로 이동합니다. 각 그룹은 고유 name과 fieldset/legend를 사용하세요. checked/onChange 또는 defaultChecked를 사용합니다. [Figma BG/Radio](https://www.figma.com/design/DLAopCpFgjiiAdyWuUL2z2?node-id=22-208)." } } },
} satisfies Meta<typeof Radio>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "미선택" };
export const Checked: Story = { name: "선택됨", args: { defaultChecked: true } };
export const Disabled: Story = { name: "비활성", args: { disabled: true } };
export const Group: Story = { name: "그룹 · 방향키 조작", render: () => <GroupExample /> };
