import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NaverMap } from "../../src/features/map/naver-map";
import { loadNaverSdk } from "../../src/features/map/naver-sdk";

vi.mock("../../src/features/map/naver-sdk", () => ({ loadNaverSdk: vi.fn() }));

// 지도 서버에 접속하지 않고 SDK 완료 시점과 지도 생성/제거를 관찰한다.
const loadSdk = vi.mocked(loadNaverSdk);
const mapCreated = vi.fn();
const mapDestroyed = vi.fn();

class FakeLatLng {
  constructor(public lat: number, public lng: number) {}
}

class FakeMap {
  constructor(container: HTMLElement, options: unknown) {
    mapCreated(container, options);
  }
  destroy() {
    mapDestroyed();
  }
}

function pendingSdk() {
  let complete!: () => void;
  const promise = new Promise<void>((resolve) => { complete = resolve; });
  return { promise, complete };
}

beforeEach(() => {
  loadSdk.mockReset();
  mapCreated.mockClear();
  mapDestroyed.mockClear();
  vi.stubGlobal("naver", { maps: { Map: FakeMap, LatLng: FakeLatLng } });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("지도 화면 — 로딩·성공·오류·재시도·정리", () => {
  it("SDK를 기다리는 동안 로딩 안내를 표시하고 지도를 아직 생성하지 않는다", () => {
    loadSdk.mockReturnValue(pendingSdk().promise);
    render(<NaverMap clientId="test-client-id" />);

    expect(screen.getByRole("status").textContent).toContain("지도를 불러오는 중이에요");
    expect(mapCreated).not.toHaveBeenCalled();
  });

  it("SDK 준비 후 연남동 중심으로 지도를 생성하고 로딩 안내를 없앤다", async () => {
    const sdk = pendingSdk();
    loadSdk.mockReturnValue(sdk.promise);
    render(<NaverMap clientId="test-client-id" />);
    await act(async () => { sdk.complete(); });

    await waitFor(() => expect(mapCreated).toHaveBeenCalledTimes(1));
    expect(loadSdk).toHaveBeenCalledWith("test-client-id");
    expect(mapCreated).toHaveBeenCalledWith(
      screen.getByRole("region", { name: "연남동 주변 지도" }),
      expect.objectContaining({ center: new FakeLatLng(37.566, 126.923) }),
    );
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("SDK 실패 시 오류와 다시 시도 버튼을 보여준다", async () => {
    loadSdk.mockRejectedValue(new Error("네이버 지도를 불러오지 못했어요. 다시 시도해 주세요."));
    render(<NaverMap clientId="test-client-id" />);

    expect((await screen.findByRole("alert")).textContent).toContain("네이버 지도를 불러오지 못했어요");
    expect(screen.getByRole("button", { name: "다시 시도" })).toBeDefined();
    expect(screen.queryByRole("status")).toBeNull();
    expect(mapCreated).not.toHaveBeenCalled();
  });

  it("다시 시도를 누르면 로딩으로 돌아가고 성공 시 오류가 사라진다", async () => {
    const user = userEvent.setup();
    const retry = pendingSdk();
    loadSdk.mockRejectedValueOnce(new Error("지도 로딩 실패")).mockReturnValueOnce(retry.promise);
    render(<NaverMap clientId="test-client-id" />);

    await user.click(await screen.findByRole("button", { name: "다시 시도" }));
    expect(screen.getByRole("status").textContent).toContain("지도를 불러오는 중이에요");
    expect(loadSdk).toHaveBeenCalledTimes(2);
    await act(async () => { retry.complete(); });

    await waitFor(() => expect(mapCreated).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("화면에서 지도를 제거할 때 생성한 지도 객체도 정리한다", async () => {
    loadSdk.mockResolvedValue(undefined);
    const view = render(<NaverMap clientId="test-client-id" />);
    await waitFor(() => expect(mapCreated).toHaveBeenCalledTimes(1));
    view.unmount();

    expect(mapDestroyed).toHaveBeenCalledTimes(1);
  });

  it("화면을 떠난 후 SDK가 늦게 완료되어도 지도를 생성하지 않는다", async () => {
    const sdk = pendingSdk();
    loadSdk.mockReturnValue(sdk.promise);
    const view = render(<NaverMap clientId="test-client-id" />);
    expect(loadSdk).toHaveBeenCalledTimes(1);
    view.unmount();
    await act(async () => { sdk.complete(); });

    expect(mapCreated).not.toHaveBeenCalled();
  });
});
