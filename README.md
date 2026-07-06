# YONGRYEON Gallery v3.0 Fresh

샘플 작품 없는 미니멀 3D 온라인 전시장입니다.

## 구조
- public: 관람객 전시장 + 관리자 화면
- worker: Cloudflare Worker API
- schema.sql: Cloudflare D1 테이블
- R2: 이미지/GLB 저장

## 배포 순서
1. Cloudflare R2 버킷 생성: `yongryeon-assets`
2. R2 Public URL 활성화 또는 커스텀 도메인 연결
3. Cloudflare D1 생성: `yongryeon-db`
4. D1에서 `schema.sql` 실행
5. `worker/wrangler.toml` 수정
   - database_id 입력
   - ADMIN_PASS 변경
   - JWT_SECRET 긴 임의문자열로 변경
   - PUBLIC_R2_BASE_URL 입력
6. Worker 배포
7. Worker 주소를 `public/config.js`에 입력
8. Cloudflare Pages 또는 GitHub Pages에 `public` 폴더 배포

## 관리자 주소
`/admin.html`

## 관람객 주소
`/index.html`
