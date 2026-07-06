const API_BASE = window.YONGRYEON_API_BASE;
const grid = document.getElementById('worksGrid');
const statusEl = document.getElementById('worksStatus');

async function loadWorks(){
  try{
    const res = await fetch(`${API_BASE}/api/artworks`);
    if(!res.ok) throw new Error('작품 목록 API 오류');
    const data = await res.json();
    const works = data.artworks || [];
    grid.innerHTML = '';
    if(!works.length){
      statusEl.innerHTML = '<div class="empty-box"><div class="empty-art"></div><strong>등록된 작품을 기다리고 있습니다.</strong><span>샘플 작품은 넣지 않았습니다. 관리자 등록 작품만 이곳에 표시됩니다.</span></div>';
      return;
    }
    statusEl.textContent = '';
    works.forEach(w => {
      const card = document.createElement('article');
      card.className = 'work-card';
      const viewUrl = `viewer.html?model=${encodeURIComponent(w.model_url)}`;
      card.innerHTML = `
        <a href="${viewUrl}" class="thumb"><img src="${w.image_url}" alt="${escapeHtml(w.title)}"></a>
        <div class="work-meta">
          <h3>${escapeHtml(w.title)}</h3>
          <p>${escapeHtml([w.material,w.year].filter(Boolean).join(' · '))}</p>
          <a class="view3d" href="${viewUrl}">View in 3D</a>
        </div>`;
      grid.appendChild(card);
    });
  }catch(e){
    statusEl.textContent = '작품 목록을 불러오지 못했습니다. js/config.js의 Worker 주소를 확인하세요.';
  }
}
function escapeHtml(s=''){return String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}
loadWorks();
