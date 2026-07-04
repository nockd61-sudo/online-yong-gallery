fetch("data/artworks.json")
  .then(response => response.json())
  .then(artworks => {
    const grid = document.getElementById("artGrid");

    artworks.forEach(art => {
      const card = document.createElement("article");
      card.className = "art-card";

      card.innerHTML = `
        <a href="${art.page}">
          <div class="art-image-wrap">
            <img src="${art.cover}" alt="${art.title} 대표 이미지" onerror="this.src='images/placeholder-cover.jpg'" />
            <div class="spotlight"></div>
          </div>
          <div class="card-body">
            <p class="art-number">${art.number}</p>
            <h3>${art.title}</h3>
            <p>${art.material} · ${art.year}</p>
            <span>3D 작품 감상하기 →</span>
          </div>
        </a>
      `;

      grid.appendChild(card);
    });
  });
