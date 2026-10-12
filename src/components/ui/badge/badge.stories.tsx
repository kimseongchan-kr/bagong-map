import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";
const meta = {
 id: "design-system-badge", title: "배공맵/Badge", component: Badge, tags: ["autodocs"],
 args: { status: "recruiting" },
 parameters: { docs: { description: { component: "화면이 결정한 상태를 문구와 색상으로 표시합니다. 자체 클릭/상태 변경은 없습니다. label로 기본 문구를 바꿀 수 있습니다. 원본 브랜드색은 유지하고 작은 글자는 대비 보완 토큰을 사용합니다. [Figma BG/Badge](https://www.figma.com/design/DLAopCpFgjiiAdyWuUL2z2?node-id=22-217)." } } },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Recruiting: Story = { name: "모집 중" };
export const Pending: Story = { name: "승인 대기", args: { status: "pending" } };
export const Approved: Story = { name: "참여 승인", args: { status: "approved" } };
export const Closed: Story = { name: "모집 마감", args: { status: "closed" } };
