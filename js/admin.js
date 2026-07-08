const API_URL = "https://yongryeon-api.nockd61.workers.dev/api/artworks";

const ADMIN_ID = "admin";
const ADMIN_PW = "admin";

const loginBtn = document.getElementById("loginBtn");
const loginPanel = document.getElementById("loginPanel");
const dashboardPanel = document.getElementById("dashboardPanel");
const loginMsg = document.getElementById("loginMsg");
const adminList = document.getElementById("adminList");

loginBtn.addEventListener("click", () => {
  const user = document.getElementById("adminUser").value.trim();
  const pass = document.getElementById("adminPass").value.trim();

  if (user === ADMIN_ID && pass === ADMIN_PW) {
    loginPanel.classList.add("hidden");
    dashboardPanel.classList.remove("hidden");
    loadAdminArtworks();
  } else {
    loginMsg.textContent = "로그인 실패";
  }
});

async function loadAdminArtworks() {
  adminList.innerHTML = "등록 작품을 불러오는 중...";

  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const artworks = data.artworks || [];

    if (artworks.length === 0) {
      adminList.innerHTML = "등록된 작품이 없습니다.";
      return;
    }

    adminList.innerHTML = "";

    artworks.forEach((art) => {
      const item = document.createElement("div");
      item.className = "admin-item";

      item.innerHTML = `
        <img src="${art.image_url}" alt="${art.title}">
        <div style="flex:1">
          <strong>${art.title}</strong>
          <span>${art.material || ""} · ${art.year || ""}</span>
          <span>${art.description || ""}</span>
        </div>
        <button class="ghost" disabled>수정</button>
        <button class="ghost" disabled>삭제</button>
      `;

      adminList.appendChild(item);
    });

  } catch (err) {
    console.error(err);
    adminList.innerHTML = "작품 목록을 불러오지 못했습니다.";
  }
}
