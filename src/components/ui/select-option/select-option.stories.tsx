import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectOption } from "./select-option";
const meta = {
 id: "design-system-select-option", title: "배공맵/Select option", component: SelectOption, tags: ["autodocs"],
 args: { label: "옵션", selected: false, active: false, disabled: false },
 decorators: [(Story) => <ul role="listbox" aria-label="옵션 외형 예시" style={{ width: 300, maxWidth: "100%", padding: 0, margin: 0 }}><Story /></ul>],
 parameters: { docs: { description: { component: "Select 내부의 listbox 표현 요소입니다. selected는 확정값, active는 탐색 위치, disabled는 선택 불가입니다. 이 페이지는 외형 비교이며 실제 키보드/마우스 사용 예시는 Select에서 확인하세요. 단독 입력 필드로 사용하지 않습니다. [Figma BG/Select option](https://www.figma.com/design/DLAopCpFgjiiAdyWuUL2z2?node-id=22-132)." } } },
} satisfies Meta<typeof SelectOption>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
export const Selected: Story = { name: "선택됨", args: { selected: true } };
export const Active: Story = { name: "탐색 위치", args: { active: true } };
export const Disabled: Story = { name: "비활성", args: { disabled: true } };
