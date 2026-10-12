import { expect, test } from "@playwright/test";

test("Input: 한국어 Docs·Figma 링크·실제 예시가 열린다", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-input--docs&viewMode=docs");
 await expect(page.getByRole("link", { name: "Figma BG/Input", exact: true })).toBeVisible();
 await expect(page.locator(".docs-story").first()).toBeVisible();
 await expect(page.getByText("Storybook preview hooks can only be called inside decorators and story functions.", { exact: true })).not.toBeVisible();
});

test("Input: 실제 입력·포커스·Figma 크기와 오류 상태", async ({ page }) => {
 await page.goto("/iframe.html?id=design-system-input--default&viewMode=story");
 const input = page.getByRole("textbox", { name: "라벨" });
 await expect(input).toHaveCSS("height", "44px"); await expect(input).toHaveCSS("width", "300px");
 await expect(input).toHaveCSS("border-radius", "8px"); await expect(input).toHaveCSS("font-size", "14px");
 await page.keyboard.press("Tab"); await expect(input).toBeFocused();
 await expect(input).toHaveCSS("outline-color", "rgb(36, 99, 235)");
 await input.fill("반반치킨"); await expect(input).toHaveValue("반반치킨");
 await page.goto("/iframe.html?id=design-system-input--error&viewMode=story");
 await expect(input).toHaveAttribute("aria-invalid", "true");
 await expect(input).toHaveAccessibleDescription("입력 내용을 확인해 주세요.");
 await expect(input).toHaveCSS("border-color", "rgb(180, 35, 24)");
 await page.goto("/iframe.html?id=design-system-input--disabled&viewMode=story");
 await expect(input).toBeDisabled(); await expect(input).toHaveCSS("background-color", "rgb(248, 250, 247)");
});
