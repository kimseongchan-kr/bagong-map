import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// 외부 네트워크 대신 script load/error 이벤트와 SDK 준비 상태를 직접 제어한다.
const sdkWindow = window as Window & { naver?: { maps: { Map: unknown } } };
const scriptSelector = 'script[src^="https://oapi.map.naver.com/openapi/v3/maps.js"]';

function observe(promise: Promise<void>) {
  return promise.then(
    () => ({ ok: true as const }),
    (error: Error) => ({ ok: false as const, message: error.message }),
  );
}

function getScript(): HTMLScriptElement {
  const script = document.querySelector<HTMLScriptElement>(scriptSelector);
  expect(script, "SDK를 로드하는 script가 생성되어야 한다").not.toBeNull();
  return script!;
}

beforeEach(() => {
  vi.resetModules();
  document.head.innerHTML = "";
  document.body.innerHTML = "";
  delete sdkWindow.naver;
});

afterEach(() => {
  delete sdkWindow.naver;
});

describe("네이버 지도 SDK 로딩 — 지도 표시 첫 단계", () => {
  it("키가 없으면 설정 오류를 안내하고 외부 요청을 시작하지 않는다", async () => {
    const { loadNaverSdk } = await import("../../src/features/map/naver-sdk");
    const result = await observe(loadNaverSdk("  "));

    expect(result).toEqual({ ok: false, message: "네이버 지도 Client ID를 설정해 주세요." });
    expect(document.querySelector(scriptSelector)).toBeNull();
  });

  it("발급 키를 ncpKeyId에 넣고 SDK 준비 후 완료한다", async () => {
    const { loadNaverSdk } = await import("../../src/features/map/naver-sdk");
    const result = observe(loadNaverSdk("test-client-id"));
    const script = getScript();

    expect(new URL(script.src).searchParams.get("ncpKeyId")).toBe("test-client-id");
    sdkWindow.naver = { maps: { Map: class FakeMap {} } };
    script.dispatchEvent(new Event("load"));

    expect(await result).toEqual({ ok: true });
  });

  it("SDK 파일 로딩이 실패하면 성공으로 처리하지 않는다", async () => {
    const { loadNaverSdk } = await import("../../src/features/map/naver-sdk");
    const result = observe(loadNaverSdk("test-client-id"));
    getScript().dispatchEvent(new Event("error"));

    expect(await result).toEqual({ ok: false, message: "네이버 지도를 불러오지 못했어요. 다시 시도해 주세요." });
  });

  it("실패 후 재시도하면 새 로딩을 수행하고 성공할 수 있다", async () => {
    const { loadNaverSdk } = await import("../../src/features/map/naver-sdk");
    const firstResult = observe(loadNaverSdk("test-client-id"));
    const failedScript = getScript();
    failedScript.dispatchEvent(new Event("error"));
    expect((await firstResult).ok).toBe(false);

    const retryResult = observe(loadNaverSdk("test-client-id"));
    const retryScript = getScript();
    expect(retryScript).not.toBe(failedScript);
    sdkWindow.naver = { maps: { Map: class FakeMap {} } };
    retryScript.dispatchEvent(new Event("load"));

    expect(await retryResult).toEqual({ ok: true });
  });

  it("동시에 두 번 요청해도 SDK를 한 번만 불러온다", async () => {
    const { loadNaverSdk } = await import("../../src/features/map/naver-sdk");
    const firstResult = observe(loadNaverSdk("test-client-id"));
    const secondResult = observe(loadNaverSdk("test-client-id"));
    const script = getScript();
    expect(document.querySelectorAll(scriptSelector)).toHaveLength(1);

    sdkWindow.naver = { maps: { Map: class FakeMap {} } };
    script.dispatchEvent(new Event("load"));
    expect(await Promise.all([firstResult, secondResult])).toEqual([{ ok: true }, { ok: true }]);
  });
});
