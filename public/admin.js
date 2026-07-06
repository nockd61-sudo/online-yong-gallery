const API = window.YONGRYEON_CONFIG.API_BASE;
let token = localStorage.getItem('yr_token');
const $ = id => document.getElementById(id);

function authHeaders(){ return { Authorization: `Bearer ${token}` }; }
function showAdmin(){ $('login').classList.add('hidden'); $('admin').classList.remove('hidden'); loadList(); }
if(token) showAdmin();

$('loginBtn').onclick = async () => {
  const res = await fetch(`${API}/api/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username:$('user').value, password:$('pass').value}) });
  if(!res.ok){ $('loginMsg').textContent='로그인 실패'; return; }
  const data = await res.json(); token = data.token; localStorage.setItem('yr_token', token); showAdmin();
};
$('logoutBtn').onclick = () => { localStorage.removeItem('yr_token'); location.reload(); };
$('resetBtn').onclick = resetForm;

$('form').onsubmit = async e => {
  e.preventDefault(); $('msg').textContent='저장 중...';
  const fd = new FormData();
  ['id','title','year','material','size','description','sort_order'].forEach(k => fd.append(k, $(k).value));
  fd.append('is_public', $('is_public').checked ? '1' : '0');
  if($('image').files[0]) fd.append('image', $('image').files[0]);
  if($('model').files[0]) fd.append('model', $('model').files[0]);
  const res = await fetch(`${API}/api/admin/artworks`, { method:'POST', headers: authHeaders(), body: fd });
  $('msg').textContent = res.ok ? '저장되었습니다.' : '저장 실패';
  if(res.ok){ resetForm(); loadList(); }
};

async function loadList(){
  const res = await fetch(`${API}/api/admin/artworks`, { headers: authHeaders() });
  const data = await res.json();
  $('list').innerHTML = data.map(a => `<div class="admin-item"><strong>${escapeHtml(a.title)}</strong><span>${escapeHtml(a.year||'')}</span><button onclick='edit(${JSON.stringify(a).replace(/'/g,"&#39;")})'>수정</button><button onclick='del("${a.id}")'>삭제</button></div>`).join('');
}
window.edit = a => { ['id','title','year','material','size','description','sort_order'].forEach(k => $(k).value = a[k] || ''); $('is_public').checked = !!a.is_public; window.scrollTo(0,0); };
window.del = async id => { if(!confirm('삭제할까요?')) return; await fetch(`${API}/api/admin/artworks/${id}`, {method:'DELETE', headers:authHeaders()}); loadList(); };
function resetForm(){ $('form').reset(); $('id').value=''; $('sort_order').value='0'; $('is_public').checked=true; }
function escapeHtml(s=''){ return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
