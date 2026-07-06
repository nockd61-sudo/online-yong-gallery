# YONGRYEON Gallery v3.0

처음부터 다시 제작한 운영형 온라인 3D 미술관입니다.

## 방향
- 관람객 화면은 최대한 단순하게 구성
- 브랜드명: YONGRYEON
- 샘플 작품 없음
- 관리자 등록 작품만 표시
- 음성 해설 없음
- 작품 대표 이미지와 GLB는 Cloudflare R2 저장
- 작품 정보는 Cloudflare D1 저장
- API는 Cloudflare Worker 사용
- GitHub를 작품 저장소로 사용하지 않음

## 폴더
- public: 관람객 화면, 관리자 화면, 3D 뷰어
- worker: Cloudflare Worker API
- database: D1 데이터베이스 schema.sql

## 먼저 해야 할 일
1. Cloudflare에서 R2 버킷 생성: yongryeon-assets
2. R2 public access 또는 custom domain 설정
3. Cloudflare D1 생성: yongryeon-db
4. database/schema.sql 실행
5. worker/wrangler.toml에서 database_id, PUBLIC_R2_URL 수정
6. ADMIN_PASS, JWT_SECRET 변경
7. Worker 배포
8. public/js/config.js에서 API_BASE에 Worker 주소 입력
9. public 폴더를 Cloudflare Pages 또는 GitHub Pages에 배포

## 관리자 주소
/admin.html

## 주의
R2 파일 삭제까지 완전 자동화하려면 삭제 API에서 R2 key 저장 필드를 추가해야 합니다. 현재 버전은 작품 DB 삭제 중심입니다.
