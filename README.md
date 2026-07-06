# YONGRYEON Gallery v4.3 - 작품 등록 폼 단계

이번 단계에서 추가된 기능:

- `/admin.html` 로그인 후 작품 등록 폼 표시
- 작품명, 제작연도, 재료, 크기, 설명 입력
- 대표 이미지 선택
- GLB 파일 선택
- 파일명/용량 확인
- 입력값 검증
- Worker `/api/artworks` 엔드포인트 준비

## 임시 로그인

- 아이디: `admin`
- 비밀번호: `yongryeon2026`

## GitHub에 올릴 파일

이번에는 전체를 지우지 말고 아래 파일/폴더만 덮어쓰면 됩니다.

- `admin.html`
- `js/admin.js`
- `css/style.css`
- `worker/src/index.js`
- `README.md`

## 다음 단계

v4.4에서 Cloudflare R2 업로드를 연결합니다.
