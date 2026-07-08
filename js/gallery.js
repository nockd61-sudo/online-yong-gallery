
const API_URL = "https://yongryeon-api.nockd61.workers.dev/api/artworks";

async function loadArtworks() {
  const grid = document.getElementById("worksGrid");

  if (!grid) return;

  grid.innerHTML = "<p class='muted'>작품을 불러오는 중입니다...</p>";

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const artworks = data.artworks || [];

    if (artworks.length === 0) {
      grid.innerHTML = "<p class='muted'>등록된 작품이 없습니다.</p>";
      return;
    }

    grid.innerHTML = "";

    artworks.forEach((art) => {
      const card = document.createElement("div");
      card.className = "work-card";

      card.innerHTML = `
        <a class="thumb" href="viewer.html?model=${art.model_url}">
          <img src="${art.image_url}" alt="${art.title}">
        </a>

        <div class="work-meta">
          <h3>${art.title}</h3>
          <p>${art.material || ""} · ${art.year || ""}</p>

          <a class="view3d" href="viewer.html?model=${art.model_url}">
            VIEW 3D
          </a>
        </div>
      `;

      grid.appendChild(card);
    });

  } catch (error) {
    console.error(error);
    grid.innerHTML = "<p class='muted'>작품을 불러오지 못했습니다.</p>";
  }
}

loadArtworks();
