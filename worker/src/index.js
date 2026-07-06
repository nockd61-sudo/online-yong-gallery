export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return cors();
    if (url.pathname === '/api/login' && request.method === 'POST') return login(request, env);
    if (url.pathname === '/api/artworks' && request.method === 'GET') return json([]);
    return json({error:'not found'}, 404);
  }
}
function cors(){return new Response(null,{headers:{'access-control-allow-origin':'*','access-control-allow-methods':'GET,POST,PUT,DELETE,OPTIONS','access-control-allow-headers':'content-type,authorization'}})}
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','access-control-allow-origin':'*'}})}
async function login(request, env){
  const {username,password}=await request.json();
  if(username !== env.ADMIN_USER || password !== env.ADMIN_PASS) return json({error:'아이디 또는 비밀번호가 틀립니다.'},401);
  const token = await signToken({user:username,iat:Date.now()}, env.JWT_SECRET || 'change-me');
  return json({token});
}
async function signToken(payload, secret){
  const enc = new TextEncoder();
  const header = b64(JSON.stringify({alg:'HS256',typ:'JWT'}));
  const body = b64(JSON.stringify(payload));
  const key = await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const sig = await crypto.subtle.sign('HMAC',key,enc.encode(`${header}.${body}`));
  return `${header}.${body}.${b64buf(sig)}`;
}
function b64(s){return btoa(unescape(encodeURIComponent(s))).replaceAll('+','-').replaceAll('/','_').replaceAll('=','')}
function b64buf(buf){return btoa(String.fromCharCode(...new Uint8Array(buf))).replaceAll('+','-').replaceAll('/','_').replaceAll('=','')}
