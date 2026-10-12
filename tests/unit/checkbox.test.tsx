import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Checkbox } from "../../src/components/ui/checkbox/checkbox";

afterEach(cleanup);

describe("DS2-02 Checkbox", () => {
 it("Checkbox는 라벨 클릭·Space·폼 값과 비활성을 보존한다", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form><Checkbox label="동의" name="agree" value="yes" onChange={change} /><Checkbox label="차단" disabled onChange={change} /></form>);
  const check = screen.getByRole<HTMLInputElement>("checkbox", { name: "동의" });
  await user.click(screen.getByText("동의")); expect(check.checked).toBe(true);
  expect(new FormData(check.form!).get("agree")).toBe("yes");
  await user.keyboard(" "); expect(check.checked).toBe(false);
  await user.click(screen.getByText("차단")); expect(change).toHaveBeenCalledTimes(2);
 });
});
