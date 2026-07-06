const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{'content-type':'application/json','access-control-allow-origin':'*'}});
const cors=()=>new Response(null,{headers:{'access-control-allow-origin':'*','access-control-allow-methods':'GET,POST,DELETE,OPTIONS','access-control-allow-headers':'authorization,content-type'}});
const enc=new TextEncoder();
async function sha(txt){const b=await crypto.subtle.digest('SHA-256',enc.encode(txt));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
async function token(env){const exp=Date.now()+86400000;const sig=await sha(`${exp}.${env.JWT_SECRET}`);return `${exp}.${sig}`}
async function auth(req,env){const h=req.headers.get('authorization')||'';const t=h.replace('Bearer ','');const [exp,sig]=t.split('.');if(!exp||Date.now()>Number(exp))return false;return sig===await sha(`${exp}.${env.JWT_SECRET}`)}
function id(){return crypto.randomUUID()}
async function upload(file,folder,env){if(!file||!file.name)return null;const ext=(file.name.split('.').pop()||'bin').toLowerCase();const key=`${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;await env.ASSETS.put(key, file.stream(), {httpMetadata:{contentType:file.type||'application/octet-stream'}});return `${env.PUBLIC_R2_BASE_URL}/${key}`}
export default {async fetch(req,env){if(req.method==='OPTIONS')return cors();const url=new URL(req.url);try{
 if(url.pathname==='/api/login'&&req.method==='POST'){const b=await req.json();if(b.user===env.ADMIN_USER&&b.pass===env.ADMIN_PASS)return json({token:await token(env)});return json({error:'login failed'},401)}
 if(url.pathname==='/api/artworks'&&req.method==='GET'){const r=await env.DB.prepare('SELECT * FROM artworks WHERE is_public=1 ORDER BY sort_order ASC, created_at DESC').all();return json(r.results||[])}
 if(url.pathname.startsWith('/api/artworks/')&&req.method==='GET'){const aid=url.pathname.split('/').pop();const r=await env.DB.prepare('SELECT * FROM artworks WHERE id=? AND is_public=1').bind(aid).first();return r?json(r):json({error:'not found'},404)}
 if(url.pathname==='/api/admin/artworks'&&req.method==='GET'){if(!await auth(req,env))return json({error:'unauthorized'},401);const r=await env.DB.prepare('SELECT * FROM artworks ORDER BY sort_order ASC, created_at DESC').all();return json(r.results||[])}
 if(url.pathname==='/api/admin/artworks'&&req.method==='POST'){if(!await auth(req,env))return json({error:'unauthorized'},401);const f=await req.formData();const aid=id();const image=await upload(f.get('image'),'images',env);const model=await upload(f.get('model'),'models',env);await env.DB.prepare(`INSERT INTO artworks(id,title,artist,year,material,size,description,image_url,model_url,is_public,sort_order) VALUES(?,?,?,?,?,?,?,?,?,?,?)`).bind(aid,f.get('title')||'Untitled','YONGRYEON',f.get('year')||'',f.get('material')||'',f.get('size')||'',f.get('description')||'',image,model,f.get('is_public')==='on'?1:0,0).run();return json({ok:true,id:aid})}
 if(url.pathname.startsWith('/api/admin/artworks/')&&req.method==='DELETE'){if(!await auth(req,env))return json({error:'unauthorized'},401);const aid=url.pathname.split('/').pop();await env.DB.prepare('DELETE FROM artworks WHERE id=?').bind(aid).run();return json({ok:true})}
 return json({error:'not found'},404)
}catch(e){return json({error:e.message},500)}}}
