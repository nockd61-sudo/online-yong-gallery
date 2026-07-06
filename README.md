# YONGRYEON Gallery v4 - Step 1 관리자 로그인

이번 단계 포함:
- Cloudflare Pages용 전시장
- `/admin.html` 관리자 로그인 화면
- Cloudflare Worker 로그인 API `/api/login`
- 작품 API 자리 준비 `/api/artworks`

## Pages에 올릴 파일
루트에 아래 파일이 바로 있어야 합니다.

- index.html
- admin.html
- css/
- js/
- assets/
- README.md

## Worker 배포
`worker` 폴더를 Cloudflare Workers로 배포합니다.

환경변수/Secrets:
- ADMIN_USER=원하는아이디
- ADMIN_PASS=원하는비밀번호
- JWT_SECRET=길고복잡한문자열

다음 단계: 작품 등록 폼 + D1 테이블 연결.
