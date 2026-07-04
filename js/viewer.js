import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

const button = document.getElementById("load3d");
const viewer = document.getElementById("viewer");

if (button) {
  button.addEventListener("click", () => {
    button.remove();
    init3DViewer();
  });
}

function init3DViewer() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111827);

  const camera = new THREE.PerspectiveCamera(
    45,
    viewer.clientWidth / viewer.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 1.2, 4);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(viewer.clientWidth, viewer.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  viewer.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
  keyLight.position.set(3, 5, 4);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 1.1);
  fillLight.position.set(-3, 2, -2);
  scene.add(fillLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.1;

  const loader = new GLTFLoader();

  loader.load(
    "../../models/apple/apple.glb",
    (gltf) => {
      const model = gltf.scene;
      model.position.set(0, -0.8, 0);
      model.scale.set(1.4, 1.4, 1.4);
      scene.add(model);
    },
    undefined,
    () => {
      const fallback = document.createElement("div");
      fallback.className = "load-button";
      fallback.style.display = "flex";
      fallback.style.alignItems = "center";
      fallback.style.justifyContent = "center";
      fallback.style.width = "320px";
      fallback.innerText = "apple.glb 파일을 models/apple 폴더에 넣어주세요";
      viewer.appendChild(fallback);
    }
  );

  window.addEventListener("resize", () => {
    camera.aspect = viewer.clientWidth / viewer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(viewer.clientWidth, viewer.clientHeight);
  });

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
