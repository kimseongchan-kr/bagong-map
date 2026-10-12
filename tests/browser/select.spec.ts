import { expect, test } from "@playwright/test";

test("Select: 한국어 Docs·Figma 링크·실제 예시가 열린다", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-select--docs&viewMode=docs");
 await expect(page.getByRole("link", { name: "Figma BG/Select", exact: true })).toBeVisible();
 await expect(page.locator(".docs-story").first()).toBeVisible();
 await expect(page.getByText("Storybook preview hooks can only be called inside decorators and story functions.", { exact: true })).not.toBeVisible();
});

test("Select: 확정값과 탐색 위치 분리·키보드·비활성·마우스", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-select--default&viewMode=story");
 const combo = page.getByRole("combobox", { name: "참여 방식" });
 await expect(combo).toHaveCSS("height", "44px");
 await page.keyboard.press("Tab"); await page.keyboard.press("ArrowDown");
 await expect(combo).toBeFocused(); await expect(combo).toContainText("항목을 선택하세요");
 await page.keyboard.press("ArrowDown");
 await expect(page.getByRole("option", { name: "함께 먹기" })).toHaveAttribute("data-active", "true");
 await page.keyboard.press("Enter"); await expect(combo).toContainText("함께 먹기");
 await page.keyboard.press("ArrowUp"); await page.keyboard.press("Home"); await page.keyboard.press("Escape");
 await expect(combo).toContainText("함께 먹기"); await expect(page.getByRole("listbox")).not.toBeVisible();
 await combo.click();
 // aria-disabled 요소에는 Playwright가 클릭을 기다리므로 실제 포인터 시도만 전달한다.
 await page.getByRole("option", { name: "준비 중" }).click({ force: true });
 await expect(page.getByRole("listbox")).toBeVisible(); await expect(combo).toContainText("함께 먹기");
 await page.getByRole("option", { name: "각자 가져가기" }).click(); await expect(combo).toContainText("각자 가져가기"); await expect(combo).toBeFocused();
});

test("Select: 긴 목록 탐색은 활성 옵션을 스크롤해 보여준다", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-select--long-list&viewMode=story");
 await page.getByRole("combobox").focus(); await page.keyboard.press("End");
 const last = page.getByRole("option", { name: "선택 항목 24", exact: true });
 await expect(last).toHaveAttribute("data-active", "true"); await expect(last).toBeInViewport();
 await page.keyboard.press("Home"); await expect(page.getByRole("option", { name: "선택 항목 1", exact: true })).toBeInViewport();
});

test("Select: 비활성·오류·빈 목록 안내", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-select--disabled&viewMode=story");
 await expect(page.getByRole("combobox")).toBeDisabled();
 await page.goto("/iframe.html?id=design-system-select--error&viewMode=story");
 await expect(page.getByRole("combobox")).toHaveAccessibleDescription("항목을 선택해 주세요.");
 await page.goto("/iframe.html?id=design-system-select--empty&viewMode=story");
 await page.getByRole("combobox").click(); await expect(page.getByRole("status")).toHaveText("선택 가능한 항목이 없어요");
});
