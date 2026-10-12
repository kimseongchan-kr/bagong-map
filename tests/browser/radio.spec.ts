import { expect, test } from "@playwright/test";

test("Radio: 한국어 Docs·Figma 링크·실제 예시가 열린다", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-radio--docs&viewMode=docs");
 await expect(page.getByRole("link", { name: "Figma BG/Radio", exact: true })).toBeVisible();
 await expect(page.locator(".docs-story").first()).toBeVisible();
 await expect(page.getByText("Storybook preview hooks can only be called inside decorators and story functions.", { exact: true })).not.toBeVisible();
});

test("Radio: 방향키는 비활성 항목을 건너뛰고 단일 선택한다", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-radio--group&viewMode=story");
 const first = page.getByRole("radio", { name: "각자 가져가기" });
 const last = page.getByRole("radio", { name: "함께 먹기" });
 await page.keyboard.press("Tab"); await expect(first).toBeFocused();
 await page.keyboard.press("ArrowDown"); await expect(last).toBeFocused(); await expect(last).toBeChecked(); await expect(first).not.toBeChecked();
 await page.keyboard.press("ArrowUp"); await expect(first).toBeChecked();
});
