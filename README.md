# YONGRYEON Gallery v5 - R2/D1 운영 연결

## 이번 단계 핵심
- 관리자 작품 등록 폼
- 이미지/GLB를 Worker로 전송
- Worker가 R2에 파일 저장
- Worker가 D1에 작품 정보 저장
- Works 화면이 D1 작품 목록을 자동 출력

## 교체/추가할 파일
GitHub 저장소에서 아래 파일을 교체 또는 추가하세요.

- index.html
- admin.html
- viewer.html
- css/style.css
- js/config.js
- js/app.js
- js/admin.js
- worker/src/index.js
- database/schema.sql
- README.md

## 꼭 해야 할 설정
### 1. D1 테이블 생성
Cloudflare > D1 > yongryeon-db > Console 에서 database/schema.sql 내용을 붙여넣고 실행하세요.

### 2. Worker 코드 교체
Cloudflare > Workers & Pages > yongryeon-api > Edit code 에서 worker/src/index.js 내용을 붙여넣고 Deploy 하세요.

### 3. Worker 주소 확인
Worker의 Visit 주소를 복사합니다. 예:
https://yongryeon-api.xxxxx.workers.dev

### 4. js/config.js 수정
YOUR_SUBDOMAIN 부분을 실제 Worker 주소로 바꾸세요.

```js
window.YONGRYEON_API_BASE = 'https://yongryeon-api.xxxxx.workers.dev';
```

## 관리자 로그인
- 아이디: admin
- 비밀번호: yongryeon2026

## 주의
이번 단계 인증은 임시 토큰 방식입니다. 실제 운영 전에는 JWT/Secret 기반으로 강화합니다.
