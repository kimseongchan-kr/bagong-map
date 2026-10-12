import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Card, type CardProps } from "../../src/components/ui/card/card";

afterEach(cleanup);
const card: CardProps = { title: "바삭치킨 · 반반치킨", number: "01", modeLabel: "각자 가져가기", deadlineLabel: "12분 뒤 마감", description: "19:00 수령 예정", participantsLabel: "2 / 3명 참여", priceLabel: "1인 예상 12,000원" };

describe("DS2-06 Card", () => {
 it("Card는 마감과 선택을 독립적으로 표시하며 상세 선택을 전달한다", async () => {
  const user = userEvent.setup(); const click = vi.fn();
  render(<Card {...card} closed selected onClick={click} />);
  const button = screen.getByRole<HTMLButtonElement>("button");
  expect(button.getAttribute("aria-pressed")).toBe("true"); expect(button.type).toBe("button");
  expect(screen.getByText("모집 마감")).toBeDefined(); expect(screen.queryByText("12분 뒤 마감")).toBeNull();
  await user.click(button); expect(click).toHaveBeenCalledTimes(1);
 });
});
