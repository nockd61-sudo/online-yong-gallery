import { API_BASE } from './config.js';
let token=localStorage.getItem('yr_token')||'';
const $=s=>document.querySelector(s); const loginBox=$('#loginBox'), adminBox=$('#adminBox');
function authHeaders(){return token?{Authorization:`Bearer ${token}`}:{}}
function show(){loginBox.hidden=!!token; adminBox.hidden=!token; if(token) loadAdmin()}
$('#loginBtn').onclick=async()=>{try{const r=await fetch(`${API_BASE}/api/login`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({user:$('#user').value,pass:$('#pass').value})}); const j=await r.json(); if(!r.ok) throw new Error(j.error||'로그인 실패'); token=j.token; localStorage.setItem('yr_token',token); show()}catch(e){$('#loginMsg').textContent=e.message}};
$('#logoutBtn').onclick=()=>{token='';localStorage.removeItem('yr_token');show()};
$('#artForm').onsubmit=async(e)=>{e.preventDefault(); const fd=new FormData(e.target); $('#saveMsg').textContent='업로드 중입니다...'; try{const r=await fetch(`${API_BASE}/api/artworks`,{method:'POST',headers:authHeaders(),body:fd}); const j=await r.json(); if(!r.ok) throw new Error(j.error||'저장 실패'); $('#saveMsg').textContent='저장되었습니다.'; e.target.reset(); e.target.is_public.checked=true; loadAdmin()}catch(err){$('#saveMsg').textContent=err.message}};
async function loadAdmin(){const r=await fetch(`${API_BASE}/api/admin/artworks`,{headers:authHeaders()}); if(!r.ok){token='';localStorage.removeItem('yr_token');show();return} const works=await r.json(); const box=$('#adminList'); box.innerHTML=''; works.forEach(w=>{const div=document.createElement('div'); div.className='row'; div.innerHTML=`<div><b>${escapeHtml(w.title)}</b><br><small>${w.is_public?'공개':'비공개'} · ${w.year||''}</small></div><button class="danger" data-id="${w.id}">삭제</button>`; box.appendChild(div)}); box.querySelectorAll('button').forEach(b=>b.onclick=()=>del(b.dataset.id))}
async function del(id){if(!confirm('삭제할까요?'))return; await fetch(`${API_BASE}/api/artworks/${id}`,{method:'DELETE',headers:authHeaders()}); loadAdmin()}
function escapeHtml(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
show();
