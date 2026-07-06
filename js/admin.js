const ADMIN_ID = 'admin';
const ADMIN_PW = 'yongryeon2026';
const SESSION_KEY = 'yongryeon_admin_session';

const loginPanel = document.getElementById('loginPanel');
const dashboardPanel = document.getElementById('dashboardPanel');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const logoutBtn = document.getElementById('logoutBtn');
const artworkForm = document.getElementById('artworkForm');
const saveMessage = document.getElementById('saveMessage');
const clearFormBtn = document.getElementById('clearFormBtn');
const imageFile = document.getElementById('imageFile');
const modelFile = document.getElementById('modelFile');
const imageName = document.getElementById('imageName');
const modelName = document.getElementById('modelName');

function showDashboard() {
  loginPanel?.classList.add('hidden');
  dashboardPanel?.classList.remove('hidden');
}

function showLogin() {
  dashboardPanel?.classList.add('hidden');
  loginPanel?.classList.remove('hidden');
}

function isLoggedIn() {
  return localStorage.getItem(SESSION_KEY) === 'ok';
}

function formatFileSize(bytes) {
  if (!bytes) return '0 MB';
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(2)} MB`;
}

function setMessage(title, lines = []) {
  if (!saveMessage) return;
  saveMessage.innerHTML = `<strong>${title}</strong>${lines.map(line => `<p>${line}</p>`).join('')}`;
}

if (isLoggedIn()) showDashboard();

loginForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('adminId').value.trim();
  const pw = document.getElementById('adminPw').value;
  if (id === ADMIN_ID && pw === ADMIN_PW) {
    localStorage.setItem(SESSION_KEY, 'ok');
    loginMessage.textContent = '';
    showDashboard();
  } else {
    loginMessage.textContent = '아이디 또는 비밀번호가 맞지 않습니다.';
  }
});

logoutBtn?.addEventListener('click', () => {
  localStorage.removeItem(SESSION_KEY);
  showLogin();
});

imageFile?.addEventListener('change', () => {
  const file = imageFile.files?.[0];
  imageName.textContent = file ? `${file.name} · ${formatFileSize(file.size)}` : '선택된 이미지 없음';
});

modelFile?.addEventListener('change', () => {
  const file = modelFile.files?.[0];
  modelName.textContent = file ? `${file.name} · ${formatFileSize(file.size)}` : '선택된 GLB 없음';
});

clearFormBtn?.addEventListener('click', () => {
  artworkForm.reset();
  imageName.textContent = '선택된 이미지 없음';
  modelName.textContent = '선택된 GLB 없음';
  setMessage('입력 지움', ['작품 등록 폼을 비웠습니다.']);
});

artworkForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const year = document.getElementById('year').value.trim();
  const material = document.getElementById('material').value.trim();
  const size = document.getElementById('size').value.trim();
  const description = document.getElementById('description').value.trim();
  const image = imageFile.files?.[0];
  const model = modelFile.files?.[0];

  if (!title) return setMessage('확인 필요', ['작품명을 입력하세요.']);
  if (!image) return setMessage('확인 필요', ['대표 이미지를 선택하세요.']);
  if (!model) return setMessage('확인 필요', ['GLB 파일을 선택하세요.']);
  if (!model.name.toLowerCase().endsWith('.glb')) return setMessage('확인 필요', ['3D 파일은 .glb 형식이어야 합니다.']);

  const draft = {
    title,
    year,
    material,
    size,
    description,
    image_filename: image.name,
    image_size: image.size,
    model_filename: model.name,
    model_size: model.size,
    created_at: new Date().toISOString()
  };

  console.log('YONGRYEON artwork draft', draft);

  setMessage('작품 등록 준비 완료', [
    `작품명: ${title}`,
    `대표 이미지: ${image.name} (${formatFileSize(image.size)})`,
    `GLB 파일: ${model.name} (${formatFileSize(model.size)})`,
    '현재 Step 3은 등록 폼 검증 단계입니다. 다음 Step 4에서 이 파일들이 Cloudflare R2로 업로드됩니다.'
  ]);
});
