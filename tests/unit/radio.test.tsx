import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Radio } from "../../src/components/ui/radio/radio";

afterEach(cleanup);

describe("DS2-02 Radio", () => {
 it("Radio는 동일 name에서 하나만 선택하고 disabled를 차단한다", async () => {
  const user = userEvent.setup();
  render(<form><Radio name="mode" value="pickup" label="각자" defaultChecked /><Radio name="mode" value="together" label="함께" /><Radio name="mode" value="disabled" label="차단" disabled /></form>);
  await user.click(screen.getByText("함께"));
  const first = screen.getByRole<HTMLInputElement>("radio", { name: "각자" });
  expect(first.checked).toBe(false); expect(new FormData(first.form!).get("mode")).toBe("together");
  await user.click(screen.getByText("차단")); expect(new FormData(first.form!).get("mode")).toBe("together");
 });
});
