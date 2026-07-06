const API = window.YONGRYEON_CONFIG.API_BASE;
const id = new URLSearchParams(location.search).get('id');
async function init(){
  const res = await fetch(`${API}/api/artworks/${id}`);
  const a = await res.json();
  document.getElementById('viewer').src = a.model_url;
  document.getElementById('title').textContent = a.title || '';
  document.getElementById('meta').textContent = [a.material, a.size, a.year].filter(Boolean).join(' · ');
}
init();
