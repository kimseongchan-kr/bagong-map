# 지도 시험 데이터 모델

설계 승인(2026-10-08) · 실제 개인 데이터 없음.

- PublicRecruitment: id(고유 문자열), shopName, food, meetingAt(ISO 시각),
  receivingMode(pickup/together), paymentMode(individual/equal),
  status(open/closed), publicPosition(lat/lng), closedAt(미마감 null).
- 시험용 가상 모집만 저장한다. 연남동 주변 공개용 좌표를 별도 지정한다.
  주소·비공개 좌표·채팅·사용자 인증 데이터는 없다.
- Store: epoch(초기화 세대 UUID), revision(0부터 단조 증가 정수), 모집 Map, 구독자 Set.
  open→closed만 지원. 반복 마감은 동일 결과를 반환하고 버전을 다시 올리지 않는다.
  시험 초기화는 새 epoch로 전체 데이터를 교체하고 연결된 클라이언트에 알린다.
- Snapshot: epoch, revision, openRecruitments, selectedRecruitment(없으면 null).
  목록과 선택 항목을 같은 버전에서 복사하여 직렬화한다.
- ClientState: snapshot, selectedId, connection(connecting/syncing/live/reconnecting),
  load/error, viewportBounds. 선택한 마감 항목만 예외 마커로 유도한다.
  목록 조회 결과가 바뀌어도 selectedId를 자동 해제하지 않는다.
- 공개 직렬화는 허용 필드만 구성한다. 좌표는 유한 수이고 위도 -90~90, 경도 -180~180.
  잘못된 상태/응답은 데이터 갱신 실패로 처리하고 이전 정상 화면을 보존한다.
