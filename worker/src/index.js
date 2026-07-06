const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization'
};
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'yongryeon2026';

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null,{headers:CORS});
    const url = new URL(request.url);
    try {
      if (url.pathname === '/api/login' && request.method === 'POST') return login(request);
      if (url.pathname === '/api/artworks' && request.method === 'GET') return listArtworks(request, env);
      if (url.pathname === '/api/artworks' && request.method === 'POST') return createArtwork(request, env);
      return json({error:'Not found'},404);
    } catch (e) {
      return json({error:e.message || 'Server error'},500);
    }
  }
};

async function login(request){
  const body = await request.json();
  if(body.user === ADMIN_USER && body.password === ADMIN_PASS){
    return json({token:'local-admin-token'});
  }
  return json({error:'아이디 또는 비밀번호가 맞지 않습니다.'},401);
}
function requireAdmin(request){
  const h = request.headers.get('authorization') || '';
  if(h !== 'Bearer local-admin-token') throw new Error('관리자 인증이 필요합니다.');
}
async function listArtworks(request, env){
  const url = new URL(request.url);
  const all = url.searchParams.get('all') === '1';
  if(all) requireAdmin(request);
  const where = all ? '' : 'WHERE is_public = 1';
  const { results } = await env.DB.prepare(`SELECT * FROM artworks ${where} ORDER BY display_order ASC, created_at DESC`).all();
  return json({artworks:results || []});
}
async function createArtwork(request, env){
  requireAdmin(request);
  const form = await request.formData();
  const image = form.get('image');
  const model = form.get('model');
  if(!image || !model) return json({error:'대표 이미지와 GLB 파일이 필요합니다.'},400);
  const id = crypto.randomUUID();
  const safeTitle = slug(form.get('title') || 'artwork');
  const imageExt = ext(image.name,'jpg');
  const modelExt = ext(model.name,'glb');
  const imageKey = `images/${Date.now()}-${safeTitle}.${imageExt}`;
  const modelKey = `models/${Date.now()}-${safeTitle}.${modelExt}`;

  await env.ASSETS.put(imageKey, image.stream(), { httpMetadata:{ contentType:image.type || 'image/jpeg' }});
  await env.ASSETS.put(modelKey, model.stream(), { httpMetadata:{ contentType:model.type || 'model/gltf-binary' }});

  const origin = new URL(request.url).origin;
  const imageUrl = `${origin}/assets/${imageKey}`;
  const modelUrl = `${origin}/assets/${modelKey}`;
  await env.DB.prepare(`INSERT INTO artworks (id,title,number,year,material,size,description,image_url,model_url,image_key,model_key,display_order,is_public) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .bind(id, str(form.get('title')), str(form.get('number')), str(form.get('year')), str(form.get('material')), str(form.get('size')), str(form.get('description')), imageUrl, modelUrl, imageKey, modelKey, Number(form.get('display_order')||0), form.get('is_public') ? 1 : 0)
    .run();
  return json({ok:true,id,imageUrl,modelUrl});
}
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{...CORS,'content-type':'application/json; charset=utf-8'}})}
function str(v){return v == null ? '' : String(v)}
function slug(s){return String(s).toLowerCase().replace(/[^a-z0-9가-힣]+/gi,'-').replace(/^-|-$/g,'').slice(0,50)||'artwork'}
function ext(name, fallback){const m=String(name||'').match(/\.([a-z0-9]+)$/i);return m?m[1].toLowerCase():fallback}
