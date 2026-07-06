const year = document.getElementById('year');
year.textContent = new Date().getFullYear();

/*
  운영 업그레이드 지점:
  다음 단계에서 Cloudflare Worker API가 준비되면 아래 WORKS_API에 주소를 넣습니다.
  예: const WORKS_API = 'https://yongryeon-api.yourname.workers.dev/api/artworks';
*/
const WORKS_API = '';

async function loadWorks() {
  if (!WORKS_API) return;
  try {
    const res = await fetch(WORKS_API);
    if (!res.ok) throw new Error('API error');
    const works = await res.json();
    renderWorks(Array.isArray(works) ? works : []);
  } catch (error) {
    console.warn('Works API is not connected yet.', error);
  }
}

function renderWorks(works) {
  const grid = document.getElementById('worksGrid');
  const empty = document.getElementById('emptyGallery');
  if (!works.length) return;
  empty.hidden = true;
  grid.hidden = false;
  grid.innerHTML = works.map(work => `
    <article class="work-card">
      <img src="${escapeHtml(work.thumbnail_url || '')}" alt="${escapeHtml(work.title || 'Artwork')}" loading="lazy" />
      <div class="work-info">
        <h3>${escapeHtml(work.title || 'Untitled')}</h3>
        <p>${escapeHtml([work.year, work.material].filter(Boolean).join(' · '))}</p>
      </div>
    </article>
  `).join('');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag]));
}

loadWorks();
