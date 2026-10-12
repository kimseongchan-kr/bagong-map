import { expect, test } from "@playwright/test";

test("Marker: 한국어 Docs·Figma 링크·실제 예시가 열린다", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-marker--docs&viewMode=docs");
 await expect(page.getByRole("link", { name: "Figma BG/Marker", exact: true })).toBeVisible();
 await expect(page.locator(".docs-story").first()).toBeVisible();
 await expect(page.getByText("Storybook preview hooks can only be called inside decorators and story functions.", { exact: true })).not.toBeVisible();
});

test("Marker: 상태별 Figma 외형", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-marker--selected&viewMode=story");
 await expect(page.getByRole("button")).toHaveCSS("height", "46px");
 await expect(page.getByRole("button")).toHaveCSS("background-color", "rgb(201, 70, 32)");
 await page.goto("/iframe.html?id=design-system-marker--closed&viewMode=story");
 await expect(page.getByRole("button")).toContainText("모집 마감"); await expect(page.getByRole("button")).toBeEnabled();
});
