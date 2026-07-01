import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

const wrap = document.getElementById('canvasWrap');
const loadingBox = document.getElementById('loadingBox');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);
scene.fog = new THREE.Fog(0x050505, 8, 28);

const camera = new THREE.PerspectiveCamera(55, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
camera.position.set(4, 3, 7);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(wrap.clientWidth, wrap.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
wrap.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1.25, 0);
controls.minDistance = 2.4;
controls.maxDistance = 14;
controls.maxPolarAngle = Math.PI * 0.49;

// 전시장 바닥
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(22, 18),
  new THREE.MeshStandardMaterial({ color: 0x15110d, roughness: 0.42, metalness: 0.08 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// 뒤쪽 벽
const backWall = new THREE.Mesh(
  new THREE.PlaneGeometry(22, 8),
  new THREE.MeshStandardMaterial({ color: 0x201b16, roughness: 0.85 })
);
backWall.position.set(0, 4, -5.6);
backWall.receiveShadow = true;
scene.add(backWall);

// 좌우 벽
function makeWall(x, rot){
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(18, 8), new THREE.MeshStandardMaterial({ color: 0x121212, roughness: .9 }));
  wall.position.set(x, 4, 0);
  wall.rotation.y = rot;
  wall.receiveShadow = true;
  scene.add(wall);
}
makeWall(-8, Math.PI/2); makeWall(8, -Math.PI/2);

// 받침대
const pedestal = new THREE.Mesh(
  new THREE.BoxGeometry(1.9, 1.1, 1.9),
  new THREE.MeshStandardMaterial({ color: 0xd4c4a0, roughness: 0.55 })
);
pedestal.position.set(0, 0.55, 0);
pedestal.castShadow = true;
pedestal.receiveShadow = true;
scene.add(pedestal);

// 작품 기본 위치 그룹
const artGroup = new THREE.Group();
artGroup.position.set(0, 1.35, 0);
scene.add(artGroup);

// 조명
scene.add(new THREE.AmbientLight(0xffdfaa, 0.45));
const key = new THREE.SpotLight(0xffd18a, 3.8, 18, Math.PI * 0.18, 0.45, 1.1);
key.position.set(0, 7.5, 3.3);
key.target.position.set(0, 1.2, 0);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
scene.add(key); scene.add(key.target);
const rim = new THREE.PointLight(0xe0a249, 1.5, 8);
rim.position.set(-3, 2.6, -2.5); scene.add(rim);

// 설명 패널
const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.15), new THREE.MeshStandardMaterial({ color: 0x080808, roughness: .6 }));
panel.position.set(3.1, 2.0, -5.45);
scene.add(panel);

let loadedModel = null;

function createFallbackSculpture(){
  const mat = new THREE.MeshStandardMaterial({ color: 0xb87535, metalness: 0.75, roughness: 0.27 });
  const apple = new THREE.Mesh(new THREE.SphereGeometry(0.9, 64, 64), mat);
  apple.scale.set(1, .96, 1);
  apple.castShadow = true;
  artGroup.add(apple);

  for(let i=0;i<28;i++){
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.38, 18), mat);
    const phi = Math.acos(2*Math.random()-1);
    const theta = Math.random()*Math.PI*2;
    const r = 0.92;
    spike.position.set(r*Math.sin(phi)*Math.cos(theta), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(theta));
    spike.lookAt(spike.position.clone().multiplyScalar(2));
    spike.castShadow = true;
    artGroup.add(spike);
  }
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(.08,.12,.5,24), mat);
  stem.position.set(0,.95,0); stem.rotation.z=.25; stem.castShadow=true; artGroup.add(stem);
  loadingBox.querySelector('strong').textContent = '샘플 3D 조각 표시 중';
  loadingBox.querySelector('span').textContent = 'models/model-main.glb를 올리면 이 샘플 대신 실제 작품이 표시됩니다.';
}

const loader = new GLTFLoader();
loader.load('models/model-main.glb', (gltf) => {
  loadedModel = gltf.scene;
  loadedModel.traverse((obj) => {
    if(obj.isMesh){ obj.castShadow = true; obj.receiveShadow = true; }
  });
  const box = new THREE.Box3().setFromObject(loadedModel);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());
  loadedModel.position.sub(center);
  loadedModel.scale.setScalar(2.1 / size);
  artGroup.add(loadedModel);
  loadingBox.style.display = 'none';
}, undefined, () => {
  createFallbackSculpture();
  setTimeout(()=> loadingBox.style.display='none', 2500);
});

function moveCamera(pos){
  camera.position.set(pos.x,pos.y,pos.z);
  controls.target.set(0,1.25,0);
  controls.update();
}
document.getElementById('frontBtn').onclick = () => moveCamera({x:0,y:2.7,z:6.5});
document.getElementById('leftBtn').onclick = () => moveCamera({x:-5.5,y:2.6,z:3.8});
document.getElementById('rightBtn').onclick = () => moveCamera({x:5.5,y:2.6,z:3.8});

function showModal(id){ document.getElementById(id).classList.add('show'); }
document.getElementById('profileBtn').onclick = () => showModal('profileModal');
document.getElementById('worksBtn').onclick = () => showModal('worksModal');
document.querySelectorAll('.close').forEach(btn => btn.onclick = () => document.getElementById(btn.dataset.close).classList.remove('show'));

document.getElementById('shareBtn').onclick = async () => {
  if(navigator.share){ await navigator.share({title:document.title,url:location.href}); }
  else { navigator.clipboard.writeText(location.href); alert('주소를 복사했습니다.'); }
};

function animate(){
  requestAnimationFrame(animate);
  artGroup.rotation.y += 0.0025;
  controls.update();
  renderer.render(scene,camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = wrap.clientWidth / wrap.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(wrap.clientWidth, wrap.clientHeight);
});
