const defaultArtworks = [
  {
    id:"sample-apple",
    title:"Energy Apple",
    number:"작품 01",
    room:"ROOM 01 · 생명의 형태",
    year:"2026",
    material:"브론즈 조각",
    artist:"김용연",
    description:"Energy Apple은 생명, 에너지, 기억의 형태를 사과라는 상징으로 표현한 조각 작품입니다.",
    cover:"images/apple-cover.jpg",
    model:"models/apple.glb"
  }
];

function getArtworks(){
  const saved = localStorage.getItem("sewoong_artworks");
  if(saved) return JSON.parse(saved);
  return defaultArtworks;
}

function renderGallery(){
  const gallery = document.getElementById("gallery");
  const artworks = getArtworks();
  gallery.innerHTML = artworks.map(a => `
    <article class="card" onclick="location.href='viewer.html?id=${a.id}'">
      <img src="${a.cover}" alt="${a.title}" onerror="this.src='images/no-image.jpg'">
      <div class="card-body">
        <small>${a.number || ""} · ${a.room || ""}</small>
        <h3>${a.title}</h3>
        <p>${a.description || ""}</p>
      </div>
    </article>
  `).join("");
}
renderGallery();
