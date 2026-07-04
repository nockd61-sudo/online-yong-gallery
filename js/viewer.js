import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

const loadButton = document.getElementById("load3d");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const resetViewBtn = document.getElementById("resetViewBtn");
const viewer = document.getElementById("viewer");

let camera;
let controls;
let renderer;
let isLoaded = false;
let currentArtwork = null;

const pathParts = location.pathname.split("/").filter(Boolean);
const artworkId = pathParts[pathParts.length - 1];

fetch("../../data/artworks.json")
  .then(response => response.json())
  .then(artworks => {
    currentArtwork = artworks.find(item => item.id === artworkId) || artworks[0];
    applyArtworkData(currentArtwork);
  });

function applyArtworkData(art) {
  document.title = `${art.title} | SEWOONG 3D Online Museum`;

  document.getElementById("artRoom").innerText = art.room;
  document.getElementById("artTitle").innerText = art.title;
  document.getElementById("viewerTitle").innerText = art.title;
  document.getElementById("artMeta").innerText = `${art.material} · ${art.year} · ${art.artist}`;

  document.getElementById("artNumber").innerText = art.number;
  document.getElementById("panelTitle").innerText = art.title;
  document.getElementById("panelMeta").innerText = `${art.material} · ${art.year}`;
  document.getElementById("artDescription").innerText = art.description;
  document.getElementById("docentText").innerText = art.docent;
}

if (loadButton) {
  loadButton.addEventListener("click", () => {
    if (!isLoaded) {
      init3DViewer();
      isLoaded = true;
      loadButton.innerText = "3D 로딩 완료";
      loadButton.disabled = true;
    }
  });
}

if (fullscreenBtn) {
  fullscreenBtn.addEventListener("click", () => {
    if (viewer.requestFullscreen) viewer.requestFullscreen();
  });
}

if (resetViewBtn) {
  resetViewBtn.addEventListener("click", () => {
    if (camera && controls) {
      camera.position.set(0, 1.2, 4);
      controls.target.set(0, 0, 0);
      controls.update();
    }
  });
}

function init3DViewer() {
  viewer.innerHTML = "";

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111827);

  camera = new THREE.PerspectiveCamera(
    45,
    viewer.clientWidth / viewer.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 1.2, 4);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(viewer.clientWidth, viewer.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  viewer.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 1.2));

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
  keyLight.position.set(3, 5, 4);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 1.1);
  fillLight.position.set(-3, 2, -2);
  scene.add(fillLight);

  const backLight = new THREE.DirectionalLight(0xffffff, 1.2);
  backLight.position.set(0, 3, -4);
  scene.add(backLight);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.1;

  const loader = new GLTFLoader();
  const modelPath = currentArtwork?.model || "../../models/apple/apple.glb";

  loader.load(
    modelPath,
    (gltf) => {
      const model = gltf.scene;

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      model.position.x += model.position.x - center.x;
      model.position.y += model.position.y - center.y;
      model.position.z += model.position.z - center.z;

      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.4 / maxDim;
      model.scale.setScalar(scale);

      scene.add(model);
    },
    undefined,
    () => {
      const fallback = document.createElement("div");
      fallback.className = "load-message";
      fallback.innerText = `${modelPath} 파일을 넣으면 3D 작품이 표시됩니다.`;
      viewer.appendChild(fallback);
    }
  );

  window.addEventListener("resize", resizeRenderer);
  document.addEventListener("fullscreenchange", () => setTimeout(resizeRenderer, 150));

  function resizeRenderer() {
    if (!camera || !renderer) return;
    camera.aspect = viewer.clientWidth / viewer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(viewer.clientWidth, viewer.clientHeight);
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}

window.sharePage = async function () {
  if (navigator.share) {
    await navigator.share({
      title: document.title,
      text: "세웅 3D 온라인 미술관 작품을 감상해보세요.",
      url: location.href
    });
  } else {
    copyLink();
  }
};

window.copyLink = function () {
  navigator.clipboard.writeText(location.href);
  alert("링크가 복사되었습니다.");
};

window.speakDocent = function () {
  const text = document.getElementById("docentText")?.innerText || "";
  if (!text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = 0.92;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
};

window.stopDocent = function () {
  window.speechSynthesis.cancel();
};
