import { expect, test } from "@playwright/test";

test("Modal: 한국어 Docs·Figma 링크·실제 예시가 열린다", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-modal--docs&viewMode=docs");
 await expect(page.getByRole("link", { name: "Figma BG/Modal", exact: true })).toBeVisible();
 await expect(page.locator(".docs-story").first()).toBeVisible();
 await expect(page.getByText("Storybook preview hooks can only be called inside decorators and story functions.", { exact: true })).not.toBeVisible();
});

test("Modal: 열기·포커스 순환·Escape·원래 버튼 복귀", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-modal--default&viewMode=story");
 const opener = page.getByRole("button", { name: "모달 열기" });
 await opener.click();
 const modal = page.getByRole("dialog", { name: "모달 구조" });
 await expect(modal).toBeVisible();
 await expect(modal.getByRole("button", { name: "닫기", exact: true })).toBeFocused();
 await page.keyboard.press("Shift+Tab");
 await expect(modal.getByRole("button", { name: "다음", exact: true })).toBeFocused();
 await page.keyboard.press("Tab");
 await expect(modal.getByRole("button", { name: "닫기", exact: true })).toBeFocused();
 await page.keyboard.press("Escape"); await expect(modal).not.toBeVisible(); await expect(opener).toBeFocused();
 await opener.click(); await modal.getByRole("button", { name: "닫기", exact: true }).click();
 await expect(modal).not.toBeVisible(); await expect(opener).toBeFocused();
});

test("Modal: 닫기 요청만 전달하고 부모가 허용해야 닫는다", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-modal--controlled&viewMode=story");
 await page.getByRole("button", { name: "모달 열기" }).click();
 const modal = page.getByRole("dialog");
 await page.keyboard.press("Escape");
 await expect(modal).toBeVisible(); await expect(modal).toContainText("닫기 요청 1회");
 await modal.getByRole("button", { name: "변경 버리고 닫기" }).click(); await expect(modal).not.toBeVisible();
});

test("Modal: StrictMode에서도 다시 열 수 있다", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-modal--strict-mode-example&viewMode=story");
 for (let i = 0; i < 2; i++) {
  await page.getByRole("button", { name: "모달 열기" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
 }
});

test("Modal: 320px 긴 본문에서도 헤더·푸터 유지, 배경 클릭 차단", async ({ page }, testInfo) => {
 await page.setViewportSize({ width: 320, height: 740 });
 await page.goto("/iframe.html?id=design-system-modal--long-content&viewMode=story");
 await page.getByRole("button", { name: "모달 열기" }).click();
 const modal = page.getByRole("dialog");
 await expect(modal).toHaveCSS("width", "288px");
 const body = modal.locator("div").first();
 expect(await body.evaluate(element => element.scrollHeight > element.clientHeight)).toBe(true);
 await body.evaluate(element => { element.scrollTop = element.scrollHeight; });
 await expect(modal.getByRole("button", { name: "닫기", exact: true })).toBeInViewport();
 await expect(modal.getByRole("button", { name: "다음", exact: true })).toBeInViewport();
 await page.mouse.click(2, 2); await expect(modal).toBeVisible();
 await page.screenshot({ path: testInfo.outputPath("modal-mobile.png") });
 await page.keyboard.press("Escape"); await expect(modal).not.toBeVisible();
});
