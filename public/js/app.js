import { API_BASE } from './config.js';
const grid=document.getElementById('grid'), empty=document.getElementById('empty'), count=document.getElementById('countText');
async function load(){
  try{const r=await fetch(`${API_BASE}/api/artworks`); if(!r.ok) throw new Error('load failed'); const works=await r.json();
    count.textContent=`공개 작품 ${works.length}점`; empty.hidden=works.length>0; grid.innerHTML='';
    works.forEach(w=>{const a=document.createElement('a'); a.className='card'; a.href=`viewer.html?id=${encodeURIComponent(w.id)}`; a.innerHTML=`<div class="thumb">${w.image_url?`<img src="${w.image_url}" alt="${escapeHtml(w.title)}">`:'YONGRYEON'}</div><div class="card-body"><h3>${escapeHtml(w.title)}</h3><p>${[w.material,w.year].filter(Boolean).map(escapeHtml).join(' · ')}</p></div>`; grid.appendChild(a)});
  }catch(e){count.textContent='작품 정보를 불러오지 못했습니다.'; console.error(e)}
}
function escapeHtml(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
load();
