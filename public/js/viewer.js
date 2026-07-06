import { API_BASE } from './config.js';
const id=new URLSearchParams(location.search).get('id');
const mv=document.getElementById('mv'), title=document.getElementById('title'), meta=document.getElementById('meta'), desc=document.getElementById('desc');
async function load(){
 if(!id){title.textContent='작품을 찾을 수 없습니다.';return}
 const r=await fetch(`${API_BASE}/api/artworks/${encodeURIComponent(id)}`); if(!r.ok){title.textContent='작품을 찾을 수 없습니다.';return}
 const w=await r.json(); title.textContent=w.title||'Untitled'; meta.textContent=[w.material,w.size,w.year].filter(Boolean).join(' · '); desc.textContent=w.description||''; if(w.model_url) mv.src=w.model_url; else mv.poster=w.image_url||'';
}
load();
