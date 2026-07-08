const API_BASE = "https://yongryeon-api.nockd61.workers.dev";
const API_URL = `${API_BASE}/api/artworks`;

let adminToken = "";

const loginBtn = document.getElementById("loginBtn");
const loginPanel = document.getElementById("loginPanel");
const dashboardPanel = document.getElementById("dashboardPanel");
const loginMsg = document.getElementById("loginMsg");
const adminList = document.getElementById("adminList");
const artworkForm = document.getElementById("artworkForm");
const saveMsg = document.getElementById("saveMsg");

loginBtn.addEventListener("click", async () => {
  const user = document.getElementById("adminUser").value.trim();
  const password = document.getElementById("adminPass").value.trim();

  const res = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, password })
  });

  const data = await res.json();

  if (!res.ok) {
    loginMsg.textContent = data.error || "로그인 실패";
    return;
  }

  adminToken = data.token;
  loginPanel.classList.add("hidden");
  dashboardPanel.classList.remove("hidden");
  loadAdminArtworks();
});

artworkForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  saveMsg.textContent = "작품을 업로드하는 중입니다...";

  const formData = new FormData(artworkForm);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminToken}`
      },
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      saveMsg.textContent = data.error || "작품 등록 실패";
      return;
    }

    saveMsg.textContent = "작품이 등록되었습니다.";
    artworkForm.reset();
    loadAdminArtworks();

  } catch (err) {
    console.error(err);
    saveMsg.textContent = "업로드 중 오류가 발생했습니다.";
  }
});

async function loadAdminArtworks() {
  adminList.innerHTML = "등록 작품을 불러오는 중...";

  const res = await fetch(`${API_URL}?all=1`, {
    headers: {
      Authorization: `Bearer ${adminToken}`
    }
  });

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
      <button class="ghost" onclick='editArtwork(${JSON.stringify(art)})'>수정</button>
      <button class="ghost" onclick="deleteArtwork('${art.id}')">삭제</button>
    `;

    adminList.appendChild(item);
  });
}

async function deleteArtwork(id) {
  if (!confirm("정말 삭제하시겠습니까?")) return;

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${adminToken}`
    }
  });

  if (!res.ok) {
    alert("삭제 실패");
    return;
  }

  alert("삭제되었습니다.");
  loadAdminArtworks();
}

async function editArtwork(art) {
  const title = prompt("작품명", art.title || "");
  if (title === null) return;

  const year = prompt("제작연도", art.year || "");
  if (year === null) return;

  const material = prompt("재료", art.material || "");
  if (material === null) return;

  const description = prompt("작품 설명", art.description || "");
  if (description === null) return;

  const res = await fetch(`${API_URL}/${art.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      title,
      number: art.number || "",
      year,
      material,
      size: art.size || "",
      description,
      display_order: art.display_order || 0,
      is_public: art.is_public === 1
    })
  });

  if (!res.ok) {
    alert("수정 실패");
    return;
  }

  alert("수정되었습니다.");
  loadAdminArtworks();
}
