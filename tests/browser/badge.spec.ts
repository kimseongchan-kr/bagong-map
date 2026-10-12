import { expect, test } from "@playwright/test";

test("Badge: 한국어 Docs·Figma 링크·실제 예시가 열린다", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-badge--docs&viewMode=docs");
 await expect(page.getByRole("link", { name: "Figma BG/Badge", exact: true })).toBeVisible();
 await expect(page.locator(".docs-story").first()).toBeVisible();
 await expect(page.getByText("Storybook preview hooks can only be called inside decorators and story functions.", { exact: true })).not.toBeVisible();
});

test("Badge: 상태별 Figma 외형", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-badge--recruiting&viewMode=story");
 await expect(page.getByText("모집 중", { exact: true })).toHaveCSS("height", "28px");
 await expect(page.getByText("모집 중", { exact: true })).toHaveCSS("background-color", "rgb(255, 242, 235)");
});
