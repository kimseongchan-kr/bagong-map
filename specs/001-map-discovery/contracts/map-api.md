# 지도 API 계약

설계 승인(2026-10-08). 모든 응답은 캐시하지 않는다. 인증은 이번 범위에 없다.

## GET /api/map/recruitments?selectedId=<id>

200: {epoch, revision, openRecruitments, selectedRecruitment}.
선택 ID가 없거나 존재하지 않으면 selectedRecruitment=null. 일반 목록은 open만 반환한다.
시험 데이터는 작으므로 전체 open을 조회하고 화면 영역 필터는 클라이언트에서 수행한다.
오류는 500과 {error:{code,message}}. 부정확한 성공/빈 목록으로 치환하지 않는다.

## GET /api/map/events

Content-Type: text/event-stream; Cache-Control: no-cache, no-transform.
Node 런타임의 취소 가능한 스트림. 구독 등록 후 ready 이벤트 {epoch,revision} 전송.
변경 시 changed 이벤트 {epoch,revision} 전송. 15초 간격 heartbeat 주석.
각 이벤트는 빈 줄로 끝나며 재연결은 EventSource에 맡긴다(retry 1000ms).
과거 이벤트 재생 대신 매 ready 때 전체 최신 상태를 조회한다.
클라이언트는 최소 목표 revision을 기억하고 조회 중 새 이벤트가 오면 후속 조회한다.
ready를 기준으로 연결 세대를 갱신하며 이전 세대·선택·요청 결과는 무시한다.
연결 해제·abort·enqueue 실패 시 구독과 타이머를 정리한다.

## 로컬 시험 전용 POST

MAP_DEMO_CONTROLS=1인 루프백 실행에서만 제공. 일반 실행은 404.
동일 Origin과 application/json 요구(위반 시 403/415). 서버 저장소는 공개 시험 데이터뿐이다.

- /api/dev/recruitments/<id>/close: body {}.
  200 {epoch,revision,closedAt}; 없는 ID 404. 반복 마감은 기존 결과 반환.
  상태 저장과 버전 증가 후 알림. closedAt은 서버 확정 시각이다.
- /api/dev/reset: body {}. 새 세대로 시험 데이터 초기화 후 changed 알림.
  200 {epoch,revision}. 테스트는 직렬 실행하여 다른 시나리오 데이터를 초기화하지 않는다.

시험 API는 회원용 생성·승인·마감 계약으로 재사용하지 않는다.
