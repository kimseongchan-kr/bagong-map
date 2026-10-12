import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Card } from "./card";
const meta = {
 id: "design-system-card", title: "배공맵/Card", component: Card, tags: ["autodocs"],
 args: { title: "바삭치킨 · 반반치킨", number: "01", modeLabel: "각자 가져가기", deadlineLabel: "12분 뒤 마감", description: "19:00 수령 예정 · 배달비 나눠 내요", participantsLabel: "2 / 3명 참여", priceLabel: "1인 예상  12,000원", selected: false, closed: false, onClick: fn() },
 parameters: { docs: { description: { component: "표시할 문자열과 selected/closed/onClick을 받는 native button입니다. 가격·시간·인원 계산과 지도 연동은 부모가 담당합니다. closed와 selected는 함께 적용할 수 있습니다. 마감되어도 상세 확인을 위해 선택할 수 있고 참여 기능은 포함하지 않습니다. [Figma BG/Card](https://www.figma.com/design/DLAopCpFgjiiAdyWuUL2z2?node-id=25-1496)." } } },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
export const Selected: Story = { name: "선택됨", args: { selected: true } };
export const Closed: Story = { name: "마감", args: { closed: true } };
export const SelectedClosed: Story = { name: "선택된 모집 마감", args: { selected: true, closed: true } };
export const LongContent: Story = { name: "긴 문구", args: { title: "동네에서 함께 나눠 먹는 아주 긴 가게 이름과 반반치킨 세트 메뉴", description: "내용이 길어지면 카드 높이가 늘어나며 모든 정보가 읽을 수 있는 상태로 유지됩니다." } };
