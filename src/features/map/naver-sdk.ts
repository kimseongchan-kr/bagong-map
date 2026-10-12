type NaverSdkWindow = Window & {
  naver?: { maps?: { Map?: unknown } };
};

// 같은 페이지의 호출들이 하나의 로딩 작업을 공유한다.
let sdkLoad: Promise<void> | null = null;

export function loadNaverSdk(clientId: string): Promise<void> {
  const key = clientId.trim();
  if (!key) {
    return Promise.reject(new Error("네이버 지도 Client ID를 설정해 주세요."));
  }

  if (sdkLoad) return sdkLoad;

  sdkLoad = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    const url = new URL("https://oapi.map.naver.com/openapi/v3/maps.js");
    url.searchParams.set("ncpKeyId", key);
    script.src = url.toString();
    script.async = true;

    const fail = () => {
      script.onload = null;
      script.onerror = null;
      script.remove();
      // 실패한 Promise를 재사용하지 않아야 다음 호출에서 다시 로딩할 수 있다.
      sdkLoad = null;
      reject(new Error("네이버 지도를 불러오지 못했어요. 다시 시도해 주세요."));
    };

    script.onerror = fail;
    script.onload = () => {
      if (typeof (window as NaverSdkWindow).naver?.maps?.Map !== "function") {
        fail();
        return;
      }

      script.onload = null;
      script.onerror = null;
      resolve();
    };

    document.head.appendChild(script);
  });

  return sdkLoad;
}
