import { expect, test } from "@playwright/test";

test("Card: 한국어 Docs·Figma 링크·실제 예시가 열린다", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-card--docs&viewMode=docs");
 await expect(page.getByRole("link", { name: "Figma BG/Card", exact: true })).toBeVisible();
 await expect(page.locator(".docs-story").first()).toBeVisible();
 await expect(page.getByText("Storybook preview hooks can only be called inside decorators and story functions.", { exact: true })).not.toBeVisible();
});

test("Card: 상태별 Figma 외형", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-card--selected&viewMode=story");
 const card = page.getByRole("button"); await expect(card).toHaveCSS("width", "388px"); await expect(card).toHaveCSS("height", "164px");
 await expect(card).toHaveCSS("background-color", "rgb(255, 242, 235)"); await expect(card).toHaveAttribute("aria-pressed", "true");
});
