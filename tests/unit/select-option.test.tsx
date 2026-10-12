import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SelectOption } from "../../src/components/ui/select-option/select-option";

afterEach(cleanup);

describe("DS2-04 SelectOption", () => {
 it("SelectOption은 선택·탐색·비활성을 구분하고 비활성 클릭을 막는다", async () => {
  const user = userEvent.setup(); const click = vi.fn();
  render(<ul role="listbox" aria-label="예시"><SelectOption label="항목" selected active disabled onClick={click} /></ul>);
  const option = screen.getByRole("option");
  expect(option.getAttribute("aria-selected")).toBe("true"); expect(option.getAttribute("aria-disabled")).toBe("true");
  await user.click(option); expect(click).not.toHaveBeenCalled();
 });
});
