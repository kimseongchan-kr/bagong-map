"use client";

import { useEffect, useRef, useState } from "react";
import { loadNaverSdk } from "./naver-sdk";

type NaverMapProps = {
  clientId: string;
};

type MapInstance = { destroy(): void };
type MapSdk = {
  LatLng: new (lat: number, lng: number) => unknown;
  Map: new (container: HTMLElement, options: {
    center: unknown;
    zoom: number;
    zoomControl: boolean;
  }) => MapInstance;
};

export function NaverMap({ clientId }: NaverMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{ loading: boolean; error: string | null }>({
    loading: true, error: null,
  });

  useEffect(() => {
    let cancelled = false;
    let map: MapInstance | undefined;

    loadNaverSdk(clientId)
      .then(() => {
        // SDK가 늦게 도착해도 이미 떠난 화면에는 지도를 만들지 않는다.
        if (cancelled || !container.current) return;
        const sdk = (window as Window & { naver?: { maps: MapSdk } }).naver?.maps;
        if (!sdk) throw new Error("지도 SDK를 사용할 수 없어요. 다시 시도해 주세요.");
        map = new sdk.Map(container.current, {
          center: new sdk.LatLng(37.566, 126.923),
          zoom: 16,
          zoomControl: true,
        });
        setState({ loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setState({ loading: false, error: error instanceof Error
          ? error.message : "지도를 불러오지 못했어요. 다시 시도해 주세요." });
      });

    return () => {
      cancelled = true;
      map?.destroy();
    };
  }, [clientId, attempt]);

  function retry() {
    setState({ loading: true, error: null });
    setAttempt((value) => value + 1);
  }

  return (
    <div className="map-panel">
      <div ref={container} className="map-canvas" role="region" aria-label="연남동 주변 지도" />
      {state.loading && <div className="map-message" role="status">지도를 불러오는 중이에요</div>}
      {state.error && (
        <div className="map-message map-error">
          <p role="alert">{state.error}</p>
          <button type="button" onClick={retry}>다시 시도</button>
        </div>
      )}
    </div>
  );
}
