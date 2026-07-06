const API_BASE = window.YONGRYEON_API_BASE;
const tokenKey = 'yongryeon_admin_token';
const $ = (id)=>document.getElementById(id);
const loginPanel=$('loginPanel'), dashboardPanel=$('dashboardPanel');

function token(){return localStorage.getItem(tokenKey)}
function showDash(){loginPanel.classList.add('hidden');dashboardPanel.classList.remove('hidden');loadAdminList();}
function showLogin(){dashboardPanel.classList.add('hidden');loginPanel.classList.remove('hidden');}

$('loginBtn').onclick = async ()=>{
  $('loginMsg').textContent='로그인 중...';
  try{
    const res=await fetch(`${API_BASE}/api/login`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({user:$('adminUser').value,password:$('adminPass').value})});
    const data=await res.json();
    if(!res.ok) throw new Error(data.error||'로그인 실패');
    localStorage.setItem(tokenKey,data.token);
    $('loginMsg').textContent=''; showDash();
  }catch(e){$('loginMsg').textContent=e.message;}
};
$('logoutBtn').onclick=()=>{localStorage.removeItem(tokenKey);showLogin();};

$('artworkForm').onsubmit = async (e)=>{
  e.preventDefault();
  $('saveMsg').textContent='업로드 중입니다. GLB 용량에 따라 시간이 걸릴 수 있습니다...';
  const fd = new FormData(e.target);
  try{
    const res=await fetch(`${API_BASE}/api/artworks`,{method:'POST',headers:{authorization:`Bearer ${token()}`},body:fd});
    const data=await res.json();
    if(!res.ok) throw new Error(data.error||'저장 실패');
    $('saveMsg').textContent='작품 등록 완료';
    e.target.reset();
    await loadAdminList();
  }catch(err){$('saveMsg').textContent=err.message;}
};

async function loadAdminList(){
  const box=$('adminList'); box.textContent='불러오는 중...';
  try{
    const res=await fetch(`${API_BASE}/api/artworks?all=1`,{headers:{authorization:`Bearer ${token()}`}});
    const data=await res.json();
    if(!res.ok) throw new Error(data.error||'목록 오류');
    if(!data.artworks?.length){box.textContent='등록된 작품이 없습니다.';return;}
    box.innerHTML=data.artworks.map(w=>`<div class="admin-item"><img src="${w.image_url}"><div><b>${escapeHtml(w.title)}</b><span>${escapeHtml(w.year||'')} ${w.is_public?'공개':'비공개'}</span></div></div>`).join('');
  }catch(e){box.textContent=e.message;}
}
function escapeHtml(s=''){return String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}
if(token()) showDash(); else showLogin();
