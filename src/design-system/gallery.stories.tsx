import { useId, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/ui/button/button";
import { Input } from "../components/ui/input/input";
import { Select } from "../components/ui/select/select";
import { Checkbox } from "../components/ui/checkbox/checkbox";
import { Radio } from "../components/ui/radio/radio";
import { Badge } from "../components/ui/badge/badge";
import { Card } from "../components/ui/card/card";
import { Marker } from "../components/ui/marker/marker";
import { Modal } from "../components/ui/modal/modal";
import styles from "./gallery.module.css";

function Gallery() {
  const name = useId();
  const [mode, setMode] = useState("");
  const [selected, setSelected] = useState("01");
  const [closed, setClosed] = useState(false);
  const [modal, setModal] = useState(false);
  return <main className={styles.gallery}>
    <header><p className={styles.eyebrow}>BAGONG MAP · DESIGN SYSTEM</p><h1>배공맵 컴포넌트</h1><p>화면은 상태를 결정하고, 컴포넌트는 표시와 입력을 맡습니다.</p></header>
    <section><h2>행동과 상태</h2><div className={styles.row}>
      <Button>주요 행동</Button><Button variant="secondary">보조 행동</Button><Button variant="ghost">낮은 강조</Button>
      <Button loading>저장</Button><Button disabled>사용 불가</Button>
    </div><div className={styles.row}>
      <Badge /><Badge status="pending" /><Badge status="approved" /><Badge status="closed" />
    </div></section>
    <section><h2>입력과 선택</h2><div className={styles.fields}>
      <Input label="모집 제목" placeholder="메뉴와 함께 적어 주세요" helperText="예: 치킨 함께 주문해요" />
      <Input label="메뉴" defaultValue="" error="메뉴를 입력해 주세요." />
      <Select label="참여 방식" value={mode} onValueChange={setMode} helperText="선택값은 이 예시 화면이 관리합니다."
        options={[{ value: "pickup", label: "각자 가져가기" }, { value: "together", label: "함께 먹기" }]} />
      <fieldset><legend>알림과 주문 방식</legend><Checkbox label="모집 마감 알림 받기" defaultChecked />
        <Radio name={name} value="individual" label="각자 메뉴 선택" defaultChecked />
        <Radio name={name} value="shared" label="함께 메뉴 선택" /></fieldset>
    </div></section>
    <section><h2>같은 모집, 같은 선택</h2><p>Card와 Marker는 부모의 같은 selected 값을 받습니다. 마감 후에도 상세를 확인할 수 있습니다.</p>
      <p role="status">선택된 모집: {selected}</p>
      <div className={styles.row}><Checkbox label="01번 모집 마감" checked={closed} onChange={event => setClosed(event.target.checked)} />
        <Button variant="secondary" onClick={() => setModal(true)}>모달 열기</Button></div>
      <div className={styles.cards}>
        {[{ number: "01", title: "바삭치킨 · 반반치킨", marker: "치킨 · 2/3명" }, { number: "02", title: "든든분식 · 떡볶이 세트", marker: "분식 · 1/3명" }].map(item => <div className={styles.pair} key={item.number}>
          <Card number={item.number} title={item.title} modeLabel="각자 가져가기" deadlineLabel="12분 뒤 마감"
            description="19:00 수령 예정 · 배달비 나눠 내요" participantsLabel={item.number === "01" ? "2 / 3명 참여" : "1 / 3명 참여"}
            priceLabel="1인 예상 12,000원" selected={selected === item.number} closed={closed && item.number === "01"} onClick={() => setSelected(item.number)} />
          <Marker number={item.number} label={item.marker} selected={selected === item.number} closed={closed && item.number === "01"} onClick={() => setSelected(item.number)} />
        </div>)}
      </div>
    </section>
    <Modal open={modal} onClose={() => setModal(false)} title="선택한 모집" description="부모가 전달한 상태를 표시하는 조합 예시입니다."
      footer={<Button onClick={() => setModal(false)}>확인</Button>}>
      <p>선택된 모집: {selected}</p><Badge status={closed && selected === "01" ? "closed" : "recruiting"} />
      <p>서버·SDK·실제 참여 요청이 없는 디자인 시스템 예시입니다.</p>
    </Modal>
  </main>;
}

const meta = {
  id: "design-system-gallery", title: "배공맵/둘러보기", component: Gallery,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Gallery>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = { name: "전체 컴포넌트와 조합 예시" };
