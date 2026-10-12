import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Marker } from "./marker";
const meta = {
 id: "design-system-marker", title: "배공맵/Marker", component: Marker, tags: ["autodocs"],
 args: { number: "01", label: "치킨 · 2/3명", selected: false, closed: false, onClick: fn() },
 parameters: { docs: { description: { component: "SDK를 모르는 마커 모양의 native button입니다. 위치 배치와 모집/Card 동기화는 부모가 담당합니다. 선택은 aria-pressed, 마감은 눈에 보이는 문구로 표시합니다. selected와 closed는 독립적입니다. 지도 SDK 연결은 이번 범위에 포함하지 않습니다. [Figma BG/Marker](https://www.figma.com/design/DLAopCpFgjiiAdyWuUL2z2?node-id=25-1543)." } } },
} satisfies Meta<typeof Marker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
export const Selected: Story = { name: "선택됨", args: { selected: true } };
export const Closed: Story = { name: "마감", args: { closed: true } };
export const SelectedClosed: Story = { name: "선택된 모집 마감", args: { selected: true, closed: true } };
