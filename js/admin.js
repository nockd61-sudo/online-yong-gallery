const ADMIN_ID='admin';
const ADMIN_PW='yongryeon2026';
const SESSION_KEY='yongryeon_admin_session';
const loginPanel=document.getElementById('loginPanel');
const dashboardPanel=document.getElementById('dashboardPanel');
const loginForm=document.getElementById('loginForm');
const loginMessage=document.getElementById('loginMessage');
const logoutBtn=document.getElementById('logoutBtn');
function showDashboard(){loginPanel.classList.add('hidden');dashboardPanel.classList.remove('hidden');}
function showLogin(){dashboardPanel.classList.add('hidden');loginPanel.classList.remove('hidden');}
function isLoggedIn(){return localStorage.getItem(SESSION_KEY)==='ok';}
if(isLoggedIn()) showDashboard();
loginForm?.addEventListener('submit',(e)=>{e.preventDefault();const id=document.getElementById('adminId').value.trim();const pw=document.getElementById('adminPw').value;if(id===ADMIN_ID&&pw===ADMIN_PW){localStorage.setItem(SESSION_KEY,'ok');showDashboard();}else{loginMessage.textContent='아이디 또는 비밀번호가 맞지 않습니다.';}});
logoutBtn?.addEventListener('click',()=>{localStorage.removeItem(SESSION_KEY);showLogin();});
