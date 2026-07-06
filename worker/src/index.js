export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/health') return Response.json({ ok: true });
    return Response.json({ message: 'YONGRYEON API 준비 중' });
  }
}
