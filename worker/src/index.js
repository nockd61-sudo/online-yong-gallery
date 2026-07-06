const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization'
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    const url = new URL(request.url);
    try {
      if (url.pathname === '/api/login' && request.method === 'POST') return login(request, env);
      if (url.pathname === '/api/artworks' && request.method === 'GET') return listPublic(env);
      if (url.pathname.startsWith('/api/artworks/') && request.method === 'GET') return getPublic(env, url.pathname.split('/').pop());
      if (url.pathname === '/api/admin/artworks' && request.method === 'GET') { await requireAuth(request, env); return listAdmin(env); }
      if (url.pathname === '/api/admin/artworks' && request.method === 'POST') { await requireAuth(request, env); return saveArtwork(request, env); }
      if (url.pathname.startsWith('/api/admin/artworks/') && request.method === 'DELETE') { await requireAuth(request, env); return deleteArtwork(env, url.pathname.split('/').pop()); }
      return json({ error: 'Not found' }, 404);
    } catch (e) {
      return json({ error: e.message || 'Server error' }, e.status || 500);
    }
  }
};

async function login(request, env) {
  const { username, password } = await request.json();
  if (username !== env.ADMIN_USER || password !== env.ADMIN_PASS) return json({ error: 'Invalid login' }, 401);
  const token = await signJWT({ sub: username, exp: Math.floor(Date.now()/1000) + 60*60*12 }, env.JWT_SECRET);
  return json({ token });
}

async function listPublic(env) {
  const { results } = await env.DB.prepare('SELECT * FROM artworks WHERE is_public=1 ORDER BY sort_order ASC, created_at DESC').all();
  return json(results);
}
async function getPublic(env, id) {
  const row = await env.DB.prepare('SELECT * FROM artworks WHERE id=? AND is_public=1').bind(id).first();
  if (!row) return json({ error: 'Not found' }, 404);
  return json(row);
}
async function listAdmin(env) {
  const { results } = await env.DB.prepare('SELECT * FROM artworks ORDER BY sort_order ASC, created_at DESC').all();
  return json(results);
}

async function saveArtwork(request, env) {
  const form = await request.formData();
  const id = form.get('id') || crypto.randomUUID();
  const old = await env.DB.prepare('SELECT * FROM artworks WHERE id=?').bind(id).first();
  let image_url = old?.image_url || '';
  let model_url = old?.model_url || '';
  const image = form.get('image');
  const model = form.get('model');
  if (image && image.name) image_url = await putFile(env, image, `images/${id}-${safeName(image.name)}`);
  if (model && model.name) model_url = await putFile(env, model, `models/${id}-${safeName(model.name)}`);
  const data = {
    title: String(form.get('title') || '').trim(),
    year: String(form.get('year') || ''),
    material: String(form.get('material') || ''),
    size: String(form.get('size') || ''),
    description: String(form.get('description') || ''),
    sort_order: Number(form.get('sort_order') || 0),
    is_public: Number(form.get('is_public') || 0)
  };
  if (!data.title) return json({ error: 'title required' }, 400);
  if (old) {
    await env.DB.prepare(`UPDATE artworks SET title=?,year=?,material=?,size=?,description=?,image_url=?,model_url=?,sort_order=?,is_public=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`)
      .bind(data.title,data.year,data.material,data.size,data.description,image_url,model_url,data.sort_order,data.is_public,id).run();
  } else {
    await env.DB.prepare(`INSERT INTO artworks (id,title,year,material,size,description,image_url,model_url,sort_order,is_public) VALUES (?,?,?,?,?,?,?,?,?,?)`)
      .bind(id,data.title,data.year,data.material,data.size,data.description,image_url,model_url,data.sort_order,data.is_public).run();
  }
  return json({ ok: true, id, image_url, model_url });
}

async function deleteArtwork(env, id) {
  await env.DB.prepare('DELETE FROM artworks WHERE id=?').bind(id).run();
  return json({ ok: true });
}

async function putFile(env, file, key) {
  await env.R2.put(key, file.stream(), { httpMetadata: { contentType: file.type || 'application/octet-stream' } });
  return `${env.PUBLIC_R2_BASE.replace(/\/$/, '')}/${key}`;
}
function safeName(name) { return name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').slice(0, 80); }

async function requireAuth(request, env) {
  const h = request.headers.get('Authorization') || '';
  const token = h.replace('Bearer ', '');
  if (!token) throw Object.assign(new Error('Unauthorized'), { status: 401 });
  const payload = await verifyJWT(token, env.JWT_SECRET);
  if (!payload || payload.exp < Math.floor(Date.now()/1000)) throw Object.assign(new Error('Unauthorized'), { status: 401 });
}

function json(data, status=200) { return new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' } }); }
function b64url(input) { return btoa(String.fromCharCode(...new Uint8Array(input))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_'); }
function b64urlText(text) { return btoa(unescape(encodeURIComponent(text))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_'); }
async function hmac(data, secret) { const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), {name:'HMAC', hash:'SHA-256'}, false, ['sign']); return crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data)); }
async function signJWT(payload, secret) { const head = b64urlText(JSON.stringify({alg:'HS256',typ:'JWT'})); const body = b64urlText(JSON.stringify(payload)); const sig = b64url(await hmac(`${head}.${body}`, secret)); return `${head}.${body}.${sig}`; }
async function verifyJWT(token, secret) { const [h,p,s] = token.split('.'); if(!h||!p||!s) return null; const good = b64url(await hmac(`${h}.${p}`, secret)); if (good !== s) return null; return JSON.parse(decodeURIComponent(escape(atob(p.replace(/-/g,'+').replace(/_/g,'/'))))); }
