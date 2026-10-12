import { expect, test, type Locator, type Page } from "@playwright/test";

const variants = ["primary", "secondary", "ghost"] as const;
const states = ["default", "hover", "focus", "disabled", "loading"] as const;
type Variant = (typeof variants)[number];
type State = (typeof states)[number];

async function openStory(page: Page, story: string, args = "") {
  const query = new URLSearchParams({
    id: `design-system-button--${story}`,
    viewMode: "story",
    args,
  });
  await page.goto(`/iframe.html?${query}`);
  await expect(page.getByRole("button").first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

function expectedColors(variant: Variant, state: State) {
  if (state === "disabled") {
    return { backgroundColor: "rgb(233, 236, 233)", color: "rgb(101, 114, 104)" };
  }
  if (variant === "primary") {
    return {
      backgroundColor: state === "hover" ? "rgb(177, 59, 24)" : "rgb(201, 70, 32)",
      color: "rgb(255, 255, 255)",
    };
  }
  return {
    backgroundColor: state === "hover"
      ? "rgb(255, 242, 235)"
      : variant === "secondary" ? "rgb(255, 255, 255)" : "rgba(0, 0, 0, 0)",
    color: "rgb(32, 45, 41)",
  };
}

async function readAppearance(button: Locator) {
  return button.evaluate((element) => {
    const css = getComputedStyle(element);
    const bounds = element.getBoundingClientRect();
    return {
      backgroundColor: css.backgroundColor,
      color: css.color,
      borderColor: css.borderTopColor,
      borderWidth: css.borderTopWidth,
      borderStyle: css.borderTopStyle,
      borderRadius: css.borderRadius,
      fontFamily: css.fontFamily,
      fontSize: css.fontSize,
      fontWeight: css.fontWeight,
      lineHeight: css.lineHeight,
      paddingLeft: css.paddingLeft,
      paddingRight: css.paddingRight,
      boxSizing: css.boxSizing,
      minHeight: css.minHeight,
      width: bounds.width,
      height: bounds.height,
    };
  });
}

for (const variant of variants) {
  for (const state of states) {
    test(`${variant}: ${state}의 승인된 외형`, async ({ page }) => {
      const args = state === "disabled" ? "disabled:true" : state === "loading" ? "loading:true" : "";
      await openStory(page, variant, args);
      const button = page.getByRole("button", {
        name: state === "loading" ? "다시 시도 처리 중…" : "다시 시도",
        exact: true,
      });
      const before = await button.boundingBox();

      // 실제 마우스·키보드로 상태를 만든다. 표시용 state prop은 없다.
      if (state === "hover" || state === "disabled" || state === "loading") {
        await button.hover();
      }
      if (state === "focus") {
        await page.keyboard.press("Tab");
        await expect(button).toBeFocused();
      }
      if (state === "disabled" || state === "loading") {
        await expect(button).toBeDisabled();
      }

      const appearance = await readAppearance(button);
      expect.soft(appearance).toMatchObject({
        ...expectedColors(variant, state),
        borderColor: variant === "secondary" ? "rgb(231, 235, 231)" : "rgba(0, 0, 0, 0)",
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: "700",
        lineHeight: "21px",
        paddingLeft: "12px",
        paddingRight: "12px",
        boxSizing: "border-box",
        minHeight: "48px",
        width: 180,
        height: 48,
      });
      expect.soft(appearance.fontFamily).toContain("Noto Sans KR");

      if (state === "focus") {
        const outline = await button.evaluate((element) => {
          const css = getComputedStyle(element);
          return { color: css.outlineColor, width: css.outlineWidth, style: css.outlineStyle, offset: css.outlineOffset };
        });
        expect.soft(outline).toEqual({ color: "rgb(36, 99, 235)", width: "2px", style: "solid", offset: "2px" });
        expect.soft(await button.boundingBox()).toEqual(before);
      }
    });
  }

  test(`${variant}: loading + disabled는 로딩 색상을 유지한다`, async ({ page }) => {
    await openStory(page, variant, "loading:true;disabled:true");
    const button = page.getByRole("button", { name: "다시 시도 처리 중…", exact: true });
    await expect(button).toBeDisabled();
    await button.hover();
    expect(await readAppearance(button)).toMatchObject(expectedColors(variant, "loading"));
  });
}

test("390px 화면에서 긴 한국어 문구가 줄바꿈되고 넘치지 않는다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openStory(page, "long-label");
  const button = page.getByRole("button");
  const dimensions = await button.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      left: rect.left, right: rect.right, height: rect.height,
      clientWidth: element.clientWidth, scrollWidth: element.scrollWidth,
      clientHeight: element.clientHeight, scrollHeight: element.scrollHeight,
      pageWidth: document.documentElement.scrollWidth,
    };
  });
  expect.soft(dimensions.height).toBeGreaterThan(48);
  expect.soft(dimensions.left).toBeGreaterThanOrEqual(0);
  expect.soft(dimensions.right).toBeLessThanOrEqual(390);
  expect.soft(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  expect.soft(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.clientHeight);
  expect.soft(dimensions.pageWidth).toBeLessThanOrEqual(390);
});

test("예제 부모가 로딩을 켜고 해제하며 버튼 실행을 한 번씩 받는다", async ({ page }) => {
  const mapRequests: string[] = [];
  page.on("request", (request) => {
    if (/https:\/\/(?:oapi|openapi)\.map\.naver\.com\//.test(request.url())) {
      mapRequests.push(request.url());
    }
  });
  await openStory(page, "controlled-loading");
  const mainButton = page.getByRole("button", { name: "다시 시도", exact: true });
  await page.keyboard.press("Tab");
  await expect(mainButton).toBeFocused();
  await page.keyboard.press("Enter");
  const busyButton = page.getByRole("button", { name: "다시 시도 처리 중…", exact: true });
  await expect(busyButton).toBeDisabled();
  await expect(page.getByText("실행 횟수: 1", { exact: true })).toBeVisible();
  const bounds = await busyButton.boundingBox();
  if (!bounds) throw new Error("로딩 버튼의 위치를 찾지 못했습니다.");
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await expect(page.getByText("실행 횟수: 1", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "처리 완료로 바꾸기" }).click();
  await expect(mainButton).toBeEnabled();
  await mainButton.focus();
  await page.keyboard.press("Space");
  await expect(page.getByText("실행 횟수: 2", { exact: true })).toBeVisible();
  expect(mapRequests).toEqual([]);
});

test("한국어 Docs에서 사용법과 Figma 기준을 확인할 수 있다", async ({ page }, testInfo) => {
  await page.goto("/iframe.html?id=design-system-button--docs&viewMode=docs");
  await expect(page.getByText("배공맵의 공통 행동 버튼입니다.", { exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: "Figma BG/Button" })).toHaveAttribute(
    "href", "https://www.figma.com/design/DLAopCpFgjiiAdyWuUL2z2?node-id=22-89",
  );
  await expect(page.getByText("Primary 기본 #c94620·호버 #b13b18", { exact: false })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  // 사용자 시각 리뷰 자료이며 자동 승인되는 스냅샷 기준은 아니다.
  await page.screenshot({ path: testInfo.outputPath("button-docs.png") });
});

test("Button의 한국어 글꼴 파일이 실제로 로드된다", async ({ page }) => {
  await openStory(page, "primary");
  const loadedFaces = await page.getByRole("button", { name: "다시 시도", exact: true }).evaluate(async (element) => {
    const css = getComputedStyle(element);
    const faces = await element.ownerDocument.fonts.load(
      `${css.fontWeight} ${css.fontSize} "Noto Sans KR"`, element.textContent ?? "다시 시도",
    );
    return faces.map((face) => ({ family: face.family, status: face.status }));
  });
  // font-family 문자열만 맞고 실제로는 대체 글꼴인 경우를 구분한다.
  expect(loadedFaces.length).toBeGreaterThan(0);
  expect(loadedFaces.every((face) => face.family.includes("Noto Sans KR") && face.status === "loaded")).toBe(true);
});
