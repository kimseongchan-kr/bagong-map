import { expect, test } from "@playwright/test";

test("Checkbox: 한국어 Docs·Figma 링크·실제 예시가 열린다", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-checkbox--docs&viewMode=docs");
 await expect(page.getByRole("link", { name: "Figma BG/Checkbox", exact: true })).toBeVisible();
 await expect(page.locator(".docs-story").first()).toBeVisible();
 await expect(page.getByText("Storybook preview hooks can only be called inside decorators and story functions.", { exact: true })).not.toBeVisible();
});

test("Checkbox: Tab·Space·선택과 비활성 외형", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-checkbox--default&viewMode=story");
 const checkbox = page.getByRole("checkbox", { name: "선택 항목" });
 await expect(checkbox).toHaveCSS("width", "20px");
 await page.keyboard.press("Tab"); await expect(checkbox).toBeFocused();
 await expect(checkbox).toHaveCSS("outline-color", "rgb(36, 99, 235)");
 await page.keyboard.press("Space"); await expect(checkbox).toBeChecked();
 await expect(checkbox).toHaveCSS("background-color", "rgb(201, 70, 32)");
 await page.goto("/iframe.html?id=design-system-checkbox--checked-disabled&viewMode=story");
 await expect(checkbox).toBeChecked(); await expect(checkbox).toBeDisabled();
});
