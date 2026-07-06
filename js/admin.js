const API_BASE = window.YONGRYEON_API_BASE || '';
const tokenKey = 'yongryeon_admin_token';
const loginPanel = document.getElementById('loginPanel');
const dashboardPanel = document.getElementById('dashboardPanel');
const msg = document.getElementById('loginMsg');
function showDashboard(){ loginPanel.classList.add('hidden'); dashboardPanel.classList.remove('hidden'); }
function showLogin(){ dashboardPanel.classList.add('hidden'); loginPanel.classList.remove('hidden'); }
if(localStorage.getItem(tokenKey)) showDashboard();
document.getElementById('loginBtn').onclick = async () => {
  msg.textContent = '로그인 확인 중...';
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  try{
    if(!API_BASE){
      if(username && password){ localStorage.setItem(tokenKey,'local-dev-token'); showDashboard(); return; }
      msg.textContent='아이디와 비밀번호를 입력하세요.'; return;
    }
    const res = await fetch(`${API_BASE}/api/login`, {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({username,password})});
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || '로그인 실패');
    localStorage.setItem(tokenKey, data.token); showDashboard();
  }catch(e){ msg.textContent = e.message; }
};
document.getElementById('logoutBtn').onclick = () => { localStorage.removeItem(tokenKey); showLogin(); };
