import { expect, test } from "@playwright/test";

test("Gallery: Card·Marker 선택 동기화와 마감 상태 유지", async ({ page }, testInfo) => {
 await page.goto("/iframe.html?id=design-system-gallery--overview&viewMode=story");
 await page.getByRole("button", { name: /02 분식/ }).click();
 await expect(page.getByRole("button", { name: /든든분식/ })).toHaveAttribute("aria-pressed", "true");
 await expect(page.getByRole("button", { name: /바삭치킨/ })).toHaveAttribute("aria-pressed", "false");
 await page.getByRole("button", { name: /바삭치킨/ }).click();
 await expect(page.getByRole("button", { name: /01 치킨/ })).toHaveAttribute("aria-pressed", "true");
 await page.getByRole("checkbox", { name: "01번 모집 마감" }).check();
 await expect(page.getByRole("button", { name: /바삭치킨/ })).toContainText("모집 마감");
 await expect(page.getByRole("button", { name: /01 치킨/ })).toHaveAttribute("aria-pressed", "true");
 await page.screenshot({ path: testInfo.outputPath("components-gallery-desktop.png"), fullPage: true });
});

test("320px: 전체 컴포넌트·긴 카드 문구는 가로로 넘치지 않는다", async ({ page }, testInfo) => {
 await page.setViewportSize({ width: 320, height: 740 });
 await page.goto("/iframe.html?id=design-system-gallery--overview&viewMode=story");
 await expect(page.getByRole("heading", { name: "배공맵 컴포넌트" })).toBeVisible();
 expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
 await page.getByRole("combobox").click(); await expect(page.getByRole("listbox")).toBeVisible();
 expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
 await page.screenshot({ path: testInfo.outputPath("components-gallery-mobile.png"), fullPage: true });
 await page.goto("/iframe.html?id=design-system-card--long-content&viewMode=story");
 const card = page.getByRole("button"); await expect(card).toContainText("아주 긴 가게 이름");
 expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
 expect(await card.evaluate(element => element.scrollHeight <= element.clientHeight)).toBe(true);
 for (const story of ["input--default", "select--default", "select-option--selected", "marker--closed"]) {
  await page.goto(`/iframe.html?id=design-system-${story}&viewMode=story`);
  await expect(page.locator("#storybook-root")).not.toBeEmpty();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
 }
});
