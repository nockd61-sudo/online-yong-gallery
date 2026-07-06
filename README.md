# YONGRYEON 3D Online Gallery v3.0

Cloudflare Pages + Worker + D1 + R2 구조입니다.

## 포함 기능
- 관람객용 미니멀 전시장
- 관리자 로그인
- 관리자 작품 등록/수정/삭제
- 대표 이미지와 GLB를 Cloudflare R2에 저장
- 작품 정보는 Cloudflare D1에 저장
- 샘플 작품 없음: 관리자 등록 작품만 표시

## 배포 순서
1. Cloudflare에서 R2 버킷 생성: `yongryeon-assets`
2. D1 데이터베이스 생성: `yongryeon-db`
3. `schema.sql` 실행
4. Worker 배포
5. Pages에 `public` 폴더 배포
6. Worker URL을 `public/config.js`의 `API_BASE`에 입력

## 관리자 기본값
Worker 환경변수에 아래 값을 넣으세요.
- ADMIN_USER
- ADMIN_PASS
- JWT_SECRET

예:
ADMIN_USER=admin
ADMIN_PASS=원하는비밀번호
JWT_SECRET=긴랜덤문자열
