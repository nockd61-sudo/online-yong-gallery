const API = window.YONGRYEON_CONFIG.API_BASE;
const enterBtn = document.getElementById('enterBtn');
const gallery = document.getElementById('gallery');
const works = document.getElementById('works');
const empty = document.getElementById('empty');

enterBtn.addEventListener('click', () => {
  document.querySelector('.hero').classList.add('hidden');
  gallery.classList.remove('hidden');
  location.hash = 'gallery';
});

if (location.hash === '#gallery') {
  document.querySelector('.hero').classList.add('hidden');
  gallery.classList.remove('hidden');
}

async function loadWorks() {
  try {
    const res = await fetch(`${API}/api/artworks`);
    const data = await res.json();
    works.innerHTML = '';
    if (!data.length) { empty.classList.remove('hidden'); return; }
    empty.classList.add('hidden');
    data.forEach(a => {
      const card = document.createElement('article');
      card.className = 'work-card';
      card.innerHTML = `
        <div class="image-wrap"><img src="${a.image_url || ''}" alt="${escapeHtml(a.title)}"/></div>
        <div class="work-text">
          <h2>${escapeHtml(a.title)}</h2>
          <p>${escapeHtml([a.material, a.year].filter(Boolean).join(' · '))}</p>
          ${a.model_url ? `<a class="view-link" href="viewer.html?id=${encodeURIComponent(a.id)}">View in 3D</a>` : ''}
        </div>`;
      works.appendChild(card);
    });
  } catch (e) {
    empty.textContent = '전시장 데이터를 불러오지 못했습니다.';
    empty.classList.remove('hidden');
  }
}
function escapeHtml(s='') { return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
loadWorks();
