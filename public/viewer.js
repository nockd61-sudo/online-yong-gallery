const API=window.YONGRYEON_API_BASE;const id=new URLSearchParams(location.search).get('id');
async function load(){const r=await fetch(`${API}/api/artworks/${id}`);const a=await r.json();document.getElementById('mv').src=a.model_url;document.getElementById('title').textContent=a.title||'';document.getElementById('meta').textContent=[a.material,a.size,a.year].filter(Boolean).join(' · ')}load();
