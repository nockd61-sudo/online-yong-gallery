function login(){
  const pw = document.getElementById("password").value;
  if(pw === "1234"){
    localStorage.setItem("sewoong_admin","yes");
    showAdmin();
  }else{
    alert("비밀번호가 다릅니다.");
  }
}

function showAdmin(){
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("adminBox").classList.remove("hidden");
  document.getElementById("listBox").classList.remove("hidden");
  renderAdminList();
}

if(localStorage.getItem("sewoong_admin")==="yes") showAdmin();

function getArtworks(){
  const saved = localStorage.getItem("sewoong_artworks");
  return saved ? JSON.parse(saved) : [];
}

function setArtworks(data){
  localStorage.setItem("sewoong_artworks", JSON.stringify(data));
}

function fileToDataURL(file){
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function saveArtwork(){
  const coverFile = document.getElementById("coverFile").files[0];
  const modelFile = document.getElementById("modelFile").files[0];

  if(!coverFile || !modelFile){
    alert("대표 이미지와 GLB 파일을 모두 선택해 주세요.");
    return;
  }

  const cover = await fileToDataURL(coverFile);
  const model = await fileToDataURL(modelFile);

  const artwork = {
    id: "art-" + Date.now(),
    title: document.getElementById("title").value || "무제",
    number: document.getElementById("number").value,
    room: document.getElementById("room").value,
    year: document.getElementById("year").value,
    material: document.getElementById("material").value,
    artist: document.getElementById("artist").value || "김용연",
    description: document.getElementById("description").value,
    cover,
    model
  };

  const artworks = getArtworks();
  artworks.unshift(artwork);
  setArtworks(artworks);

  alert("작품이 등록되었습니다. 전시관에서 확인하세요.");
  renderAdminList();
}

function renderAdminList(){
  const list = document.getElementById("adminList");
  const artworks = getArtworks();
  if(!artworks.length){
    list.innerHTML = "<p class='muted'>아직 등록된 작품이 없습니다.</p>";
    return;
  }
  list.innerHTML = artworks.map(a => `
    <div class="admin-item">
      <div class="admin-item-left">
        <img src="${a.cover}">
        <div>
          <b>${a.title}</b><br>
          <span class="muted">${a.number || ""} ${a.year || ""}</span>
        </div>
      </div>
      <button class="danger" onclick="deleteArtwork('${a.id}')">삭제</button>
    </div>
  `).join("");
}

function deleteArtwork(id){
  if(!confirm("삭제할까요?")) return;
  const artworks = getArtworks().filter(a => a.id !== id);
  setArtworks(artworks);
  renderAdminList();
}

function exportData(){
  const data = localStorage.getItem("sewoong_artworks") || "[]";
  const blob = new Blob([data], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "sewoong-artworks-backup.json";
  a.click();
}
