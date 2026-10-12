import { expect, test } from "@playwright/test";

test("Select option: 한국어 Docs·Figma 링크·실제 예시가 열린다", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-select-option--docs&viewMode=docs");
 await expect(page.getByRole("link", { name: "Figma BG/Select option", exact: true })).toBeVisible();
 await expect(page.locator(".docs-story").first()).toBeVisible();
 await expect(page.getByText("Storybook preview hooks can only be called inside decorators and story functions.", { exact: true })).not.toBeVisible();
});
