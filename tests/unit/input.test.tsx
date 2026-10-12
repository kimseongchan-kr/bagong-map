import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Input } from "../../src/components/ui/input/input";

afterEach(cleanup);

describe("DS2-01 Input", () => {
 it("라벨·도움말·고유 id를 연결하고 입력/폼 reset을 전달한다", async () => {
  const user = userEvent.setup();
  render(<form><Input label="이름" helperText="공개 이름" name="nickname" defaultValue="찬" /><Input label="메뉴" /><button type="reset">초기화</button></form>);
  const input = screen.getByRole<HTMLInputElement>("textbox", { name: "이름" });
  expect(input.id).not.toBe(screen.getByRole("textbox", { name: "메뉴" }).id);
  expect(document.getElementById(input.getAttribute("aria-describedby")!)?.textContent).toBe("공개 이름");
  await user.type(input, "님");
  expect(new FormData(input.form!).get("nickname")).toBe("찬님");
  await user.click(screen.getByText("초기화"));
  expect(input.value).toBe("찬");
 });
 it("오류가 도움말에 우선하고 외부 설명 id도 보존한다", () => {
  render(<><p id="external">필수</p><Input label="메뉴" helperText="도움말" error="메뉴를 입력해 주세요" aria-describedby="external" /></>);
  const input = screen.getByRole("textbox");
  expect(input.getAttribute("aria-invalid")).toBe("true");
  expect(input.getAttribute("aria-describedby")).toContain("external");
  expect(screen.queryByText("도움말")).toBeNull();
  expect(input.getAttribute("aria-describedby")?.split(" ").map(id => document.getElementById(id)?.textContent)).toContain("메뉴를 입력해 주세요");
 });
 it("controlled 값은 부모가 결정하고 disabled에서 입력을 막는다", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const view = render(<Input label="메뉴" value="치킨" onChange={change} />);
  const input = screen.getByRole<HTMLInputElement>("textbox");
  await user.type(input, "A");
  expect(change).toHaveBeenCalledTimes(1); expect(input.value).toBe("치킨");
  view.rerender(<Input label="메뉴" value="치킨" onChange={change} disabled />);
  await user.type(input, "B"); expect(change).toHaveBeenCalledTimes(1);
 });
});
