import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Marker } from "../../src/components/ui/marker/marker";

afterEach(cleanup);

describe("DS2-06 Marker", () => {
 it("Marker는 Enter로 실행하고 마감을 글자로 알린다", async () => {
  const user = userEvent.setup(); const click = vi.fn();
  render(<Marker number="01" label="치킨 · 2/3명" closed selected onClick={click} />);
  const button = screen.getByRole("button", { name: /모집 마감/ });
  expect(button.getAttribute("aria-pressed")).toBe("true");
  await user.tab(); await user.keyboard("{Enter}"); expect(click).toHaveBeenCalledTimes(1);
 });
});
