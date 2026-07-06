export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return cors(new Response(null, { status: 204 }));
    if (url.pathname === '/health') return cors(Response.json({ ok: true }));

    if (url.pathname === '/api/login' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      if (body.id === 'admin' && body.password === 'yongryeon2026') {
        return cors(Response.json({ ok: true, token: 'step3-temporary-token' }));
      }
      return cors(Response.json({ ok: false, message: 'login failed' }, { status: 401 }));
    }

    if (url.pathname === '/api/artworks' && request.method === 'POST') {
      // Step 3: 작품 등록 API 자리만 준비합니다.
      // Step 4에서 R2 업로드, Step 5에서 D1 저장을 연결합니다.
      return cors(Response.json({ ok: true, message: 'artwork form received - R2/D1 not connected yet' }));
    }

    return cors(Response.json({ ok: false, message: 'YONGRYEON API route not found' }, { status: 404 }));
  }
}

function cors(response) {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
