import { useState } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Select, type SelectProps } from "../../src/components/ui/select/select";

afterEach(cleanup);
const options = [
 { value: "pickup", label: "각자 가져가기" },
 { value: "disabled", label: "준비 중", disabled: true },
 { value: "together", label: "함께 먹기" },
];
function SelectExample(props: Partial<SelectProps> = {}) {
 const [value, setValue] = useState("");
 return <><Select label="참여 방식" options={options} value={value} onValueChange={setValue} {...props} /><button>다음</button></>;
}

describe("DS2-03 Select", () => {
 it("탐색은 값을 바꾸지 않고 Enter 확정·Escape 취소를 구분한다", async () => {
  const user = userEvent.setup(); render(<SelectExample />);
  const combo = screen.getByRole("combobox", { name: "참여 방식" });
  await user.tab(); await user.keyboard("{ArrowDown}");
  expect(combo.getAttribute("aria-expanded")).toBe("true");
  expect(combo.textContent).toContain("항목을 선택하세요");
  expect(document.getElementById(combo.getAttribute("aria-activedescendant")!)?.textContent).toBe("각자 가져가기");
  await user.keyboard("{ArrowDown}");
  expect(document.getElementById(combo.getAttribute("aria-activedescendant")!)?.textContent).toBe("함께 먹기");
  await user.keyboard("{Enter}"); expect(combo.textContent).toContain("함께 먹기");
  await user.keyboard("{ArrowUp}{Home}{Escape}"); expect(combo.textContent).toContain("함께 먹기");
  expect(combo.getAttribute("aria-expanded")).toBe("false");
 });
 it("마우스로 확정하되 비활성 option은 실행되지 않는다", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<SelectExample onValueChange={change} />);
  await user.click(screen.getByRole("combobox"));
  await user.click(screen.getByRole("option", { name: "준비 중" })); expect(change).not.toHaveBeenCalled();
  await user.click(screen.getByRole("option", { name: "함께 먹기" })); expect(change).toHaveBeenCalledExactlyOnceWith("together");
 });
 it("Tab·바깥 클릭은 확정하지 않고 닫고 다음 입력을 허용한다", async () => {
  const user = userEvent.setup(); const change = vi.fn(); render(<SelectExample onValueChange={change} />);
  const combo = screen.getByRole("combobox");
  await user.click(combo); await user.keyboard("{End}{Tab}");
  expect(combo.getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "다음" }));
  await user.click(combo); await user.click(screen.getByRole("button", { name: "다음" }));
  expect(combo.getAttribute("aria-expanded")).toBe("false"); expect(change).not.toHaveBeenCalled();
 });
 it("오류·빈 목록·비활성 전환을 처리하고 미존재 값을 표시하지 않는다", async () => {
  const user = userEvent.setup();
  const view = render(<SelectExample options={[]} value="missing" error="방식을 선택해 주세요" />);
  const combo = screen.getByRole<HTMLButtonElement>("combobox");
  expect(combo.getAttribute("aria-invalid")).toBe("true");
  expect(combo.textContent).toContain("항목을 선택하세요");
  await user.click(combo); expect(screen.getByText("선택 가능한 항목이 없어요")).toBeDefined();
  view.rerender(<SelectExample disabled />);
  expect(combo.disabled).toBe(true); expect(combo.getAttribute("aria-expanded")).toBe("false");
  expect(screen.queryByRole("listbox")).toBeNull();
 });
 it("부모 값·hidden 폼 값·selected 표시가 일치한다", async () => {
  const user = userEvent.setup(); render(<form><SelectExample name="mode" value="pickup" /></form>);
  const combo = screen.getByRole<HTMLButtonElement>("combobox");
  expect(new FormData(combo.form!).get("mode")).toBe("pickup");
  await user.click(combo);
  expect(screen.getByRole("option", { name: "각자 가져가기" }).getAttribute("aria-selected")).toBe("true");
 });
 it("문자 탐색과 Home·End는 활성 항목을 이동한다", async () => {
  const user = userEvent.setup();
  render(<SelectExample options={[{ value: "a", label: "Apple" }, { value: "b", label: "Banana" }]} />);
  const combo = screen.getByRole("combobox"); await user.tab(); await user.keyboard("b");
  expect(document.getElementById(combo.getAttribute("aria-activedescendant")!)?.textContent).toBe("Banana");
  await user.keyboard("{Home}"); expect(document.getElementById(combo.getAttribute("aria-activedescendant")!)?.textContent).toBe("Apple");
  await user.keyboard("{End} "); expect(combo.textContent).toContain("Banana");
 });
});
