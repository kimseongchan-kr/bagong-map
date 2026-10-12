import { StrictMode, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal, type ModalProps } from "./modal";
import { Button } from "../button/button";
import { Input } from "../input/input";

function ModalExample({ long = false, unmountOnClose = false }: { long?: boolean; unmountOnClose?: boolean }) {
 const [open, setOpen] = useState(false);
 return <><Button onClick={() => setOpen(true)}>모달 열기</Button>
  {(!unmountOnClose || open) && <Modal open={open} onClose={() => setOpen(false)} title="모달 구조"
   description="본문 콘텐츠는 화면별로 구성하고 하단 행동은 고정합니다."
   footer={<><Button variant="secondary" onClick={() => setOpen(false)}>이전</Button><Button onClick={() => setOpen(false)}>다음</Button></>}>
   <Input label="요청 사항" placeholder="요청 사항을 입력해 주세요" />
   {long && Array.from({ length: 30 }, (_, i) => <p key={i}>안내 {i + 1}. 긴 내용은 본문 안에서 스크롤합니다.</p>)}
  </Modal>}
 </>;
}
function ControlledExample() {
 const [open, setOpen] = useState(false);
 const [requests, setRequests] = useState(0);
 return <><Button onClick={() => setOpen(true)}>모달 열기</Button>
 <Modal open={open} title="부모가 닫기를 결정" onClose={() => setRequests(n => n + 1)}
   footer={<Button onClick={() => setOpen(false)}>변경 버리고 닫기</Button>}>
   <p>닫기 요청 {requests}회</p>
 </Modal></>;
}
const meta = {
 id: "design-system-modal", title: "배공맵/Modal", component: Modal, tags: ["autodocs"],
 parameters: { controls: { disable: true }, docs: { description: { component:
 "open과 onClose는 부모가 관리합니다. 닫기·Escape는 닫기 요청이며 부모가 open=false로 바꿀 때 닫힙니다. 배경 클릭은 닫지 않습니다. 본문/푸터는 슬롯이고 업무 로직을 알지 못합니다. native dialog로 배경 입력 차단·내부 포커스·닫힌 뒤 복귀를 제공합니다. 중첩 모달은 지원 범위 밖입니다. [Figma BG/Modal](https://www.figma.com/design/DLAopCpFgjiiAdyWuUL2z2?node-id=22-232)." } } },
 render: () => <ModalExample />,
} satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<ModalProps>;
export const Default: Story = { name: "기본 · 열고 닫기", render: () => <ModalExample /> };
export const LongContent: Story = { name: "긴 본문 · 내부 스크롤", render: () => <ModalExample long /> };
export const Controlled: Story = { name: "부모가 닫기를 결정", render: () => <ControlledExample /> };
export const StrictModeExample: Story = { name: "StrictMode · 마운트·제거·재열기", render: () => <StrictMode><ModalExample unmountOnClose /></StrictMode> };
