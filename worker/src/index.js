const enc = new TextEncoder();
function json(data, status=200, headers={}){return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json;charset=utf-8','access-control-allow-origin':'*',...headers}})}
function bad(msg,status=400){return json({error:msg},status)}
async function sha256(text){const b=await crypto.subtle.digest('SHA-256',enc.encode(text));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
async function makeToken(env,user){const exp=Date.now()+1000*60*60*12; const body=btoa(JSON.stringify({user,exp})); const sig=await sha256(body+'.'+env.JWT_SECRET); return body+'.'+sig}
async function verify(req,env){const h=req.headers.get('authorization')||''; const t=h.replace('Bearer ',''); if(!t)return false; const [body,sig]=t.split('.'); if(!body||!sig)return false; if(await sha256(body+'.'+env.JWT_SECRET)!==sig)return false; const p=JSON.parse(atob(body)); return p.exp>Date.now()}
async function uploadFile(env,file,folder){if(!file||typeof file==='string'||file.size===0)return ''; const ext=(file.name.split('.').pop()||'bin').toLowerCase(); const key=`${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`; await env.ASSETS.put(key, await file.arrayBuffer(), {httpMetadata:{contentType:file.type||'application/octet-stream'}}); return `${env.PUBLIC_R2_URL}/${key}`}
export default {async fetch(req,env){
 const url=new URL(req.url); if(req.method==='OPTIONS') return new Response(null,{headers:{'access-control-allow-origin':'*','access-control-allow-methods':'GET,POST,DELETE,OPTIONS','access-control-allow-headers':'content-type,authorization'}});
 try{
  if(url.pathname==='/api/login'&&req.method==='POST'){const {user,pass}=await req.json(); if(user===env.ADMIN_USER&&pass===env.ADMIN_PASS) return json({token:await makeToken(env,user)}); return bad('아이디 또는 비밀번호가 맞지 않습니다.',401)}
  if(url.pathname==='/api/artworks'&&req.method==='GET'){const {results}=await env.DB.prepare('SELECT * FROM artworks WHERE is_public=1 ORDER BY sort_order ASC, created_at DESC').all(); return json(results)}
  if(url.pathname.startsWith('/api/artworks/')&&req.method==='GET'){const id=url.pathname.split('/').pop(); const w=await env.DB.prepare('SELECT * FROM artworks WHERE id=? AND is_public=1').bind(id).first(); return w?json(w):bad('not found',404)}
  if(url.pathname==='/api/admin/artworks'&&req.method==='GET'){if(!await verify(req,env))return bad('unauthorized',401); const {results}=await env.DB.prepare('SELECT * FROM artworks ORDER BY sort_order ASC, created_at DESC').all(); return json(results)}
  if(url.pathname==='/api/artworks'&&req.method==='POST'){if(!await verify(req,env))return bad('unauthorized',401); const form=await req.formData(); const id=crypto.randomUUID(); const image=await uploadFile(env,form.get('image'),'images'); const model=await uploadFile(env,form.get('model'),'models'); const now=new Date().toISOString(); await env.DB.prepare(`INSERT INTO artworks(id,title,year,material,size,description,image_url,model_url,is_public,sort_order,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`).bind(id,form.get('title')||'Untitled',form.get('year')||'',form.get('material')||'',form.get('size')||'',form.get('description')||'',image,model,form.get('is_public')==='on'?1:0,Number(form.get('sort_order')||0),now,now).run(); return json({ok:true,id})}
  if(url.pathname.startsWith('/api/artworks/')&&req.method==='DELETE'){if(!await verify(req,env))return bad('unauthorized',401); const id=url.pathname.split('/').pop(); await env.DB.prepare('DELETE FROM artworks WHERE id=?').bind(id).run(); return json({ok:true})}
  return bad('not found',404)
 }catch(e){return bad(e.message||'server error',500)}
}}
