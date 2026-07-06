const API_BASE = window.YONGRYEON_API_BASE || '';
async function loadWorks(){
  if(!API_BASE) return;
  try{
    const res = await fetch(`${API_BASE}/api/artworks`);
    if(!res.ok) return;
    const works = await res.json();
    const grid = document.getElementById('worksGrid');
    if(!works.length) return;
    grid.className='works-grid';
    grid.innerHTML = works.map(w=>`<article class="work-card"><img src="${w.image_url}" alt="${w.title}"><h3>${w.title}</h3><p>${w.year||''} ${w.material||''}</p></article>`).join('');
  }catch(e){console.warn(e)}
}
loadWorks();
