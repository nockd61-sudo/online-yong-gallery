import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.getElementById('scene');
const loading = document.getElementById('loading');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0805);
scene.fog = new THREE.Fog(0x0a0805, 14, 38);

const camera = new THREE.PerspectiveCamera(48, window.innerWidth / (window.innerHeight - 86), 0.1, 100);
camera.position.set(0, 3.2, 8.2);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight - 86);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.target.set(0, 1.55, 0);
controls.minDistance = 3.2;
controls.maxDistance = 13;
controls.maxPolarAngle = Math.PI * 0.48;
controls.screenSpacePanning = true;

function makeGallery(){
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x1b1712, roughness: 0.32, metalness: 0.18 });
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x2a251f, roughness: 0.74 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x0b0a08, roughness: 0.52 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xb3772e, roughness: 0.22, metalness: 0.9 });

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 22), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(24, 8, 0.35), wallMat);
  backWall.position.set(0, 4, -8);
  backWall.receiveShadow = true;
  scene.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 8, 22), wallMat);
  leftWall.position.set(-12, 4, 0);
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 8, 22), wallMat);
  rightWall.position.set(12, 4, 0);
  scene.add(rightWall);

  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(24, 0.32, 22), new THREE.MeshStandardMaterial({color:0x161310, roughness:.7}));
  ceiling.position.set(0, 8.05, 0);
  scene.add(ceiling);

  // pedestal
  const pedestal = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.9, 3.4), darkMat);
  pedestal.position.set(0, 0.45, 0);
  pedestal.castShadow = true;
  pedestal.receiveShadow = true;
  scene.add(pedestal);

  const plate = new THREE.Mesh(new THREE.BoxGeometry(2.4, .06, .78), new THREE.MeshStandardMaterial({color:0x070707, roughness:.25, metalness:.2}));
  plate.position.set(0, .9, 1.72);
  scene.add(plate);

  // side sculptures as abstract shapes
  const torusGeo = new THREE.TorusKnotGeometry(.42, .12, 90, 12);
  [-7.4, -4.6, 4.6, 7.4].forEach((x,i)=>{
    const stand = new THREE.Mesh(new THREE.BoxGeometry(1,1.4,1), darkMat);
    stand.position.set(x,.7,-4.6 + (i%2)*1.2);
    stand.castShadow = true; stand.receiveShadow = true; scene.add(stand);
    const s = new THREE.Mesh(torusGeo, goldMat);
    s.position.set(x,2.1,-4.6 + (i%2)*1.2);
    s.scale.set(1,1.7,1);
    s.rotation.set(.6,i,.2);
    s.castShadow = true;
    scene.add(s);
  });

  // wall frames
  const frameMat = new THREE.MeshStandardMaterial({color:0x16120d, roughness:.35});
  for(let i=0;i<4;i++){
    const f = new THREE.Mesh(new THREE.BoxGeometry(1.4,2,.08), frameMat);
    f.position.set(i<2?-8.8:8.8,3.2,-5.5 + (i%2)*3.2);
    f.rotation.y = i<2?Math.PI/2:-Math.PI/2;
    scene.add(f);
  }

  // lights
  scene.add(new THREE.AmbientLight(0xffe0aa, .65));
  const main = new THREE.SpotLight(0xffd18a, 8.5, 18, Math.PI/7, .48, 1.2);
  main.position.set(0,7.6,2.6); main.target.position.set(0,1.4,0); main.castShadow = true;
  main.shadow.mapSize.set(2048,2048); scene.add(main); scene.add(main.target);
  [-6,-3,3,6].forEach(x=>{
    const l = new THREE.SpotLight(0xffffff, 2.2, 11, Math.PI/9, .5, 1.5);
    l.position.set(x,7.5,-3); l.target.position.set(x,1.5,-5); scene.add(l); scene.add(l.target);
  });

  // grid floor lines
  const grid = new THREE.GridHelper(24, 24, 0x5b5142, 0x2d2922);
  grid.position.y = .01;
  scene.add(grid);
}
makeGallery();

let modelRoot = new THREE.Group();
scene.add(modelRoot);

const loader = new GLTFLoader();
loader.load('models/model-main.glb', (gltf) => {
  const model = gltf.scene;
  model.traverse((obj)=>{
    if(obj.isMesh){
      obj.castShadow = true;
      obj.receiveShadow = true;
      if(obj.material){
        obj.material.side = THREE.DoubleSide;
        obj.material.needsUpdate = true;
      }
    }
  });

  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  model.position.sub(center);
  const maxSize = Math.max(size.x, size.y, size.z);
  const scale = 2.7 / maxSize;
  model.scale.setScalar(scale);
  model.position.y = 1.02;
  modelRoot.add(model);
  loading.style.display = 'none';
}, (xhr)=>{
  if(xhr.total){
    const pct = Math.round(xhr.loaded / xhr.total * 100);
    loading.querySelector('span').textContent = `불러오는 중 ${pct}%`;
  }
}, (err)=>{
  console.error(err);
  loading.querySelector('strong').textContent = 'GLB 파일을 찾지 못했습니다';
  loading.querySelector('span').textContent = 'models/model-main.glb 위치와 파일명을 확인하세요.';
});

function resetView(){
  camera.position.set(0,3.2,8.2);
  controls.target.set(0,1.55,0);
  controls.update();
}

document.getElementById('resetBtn').addEventListener('click', resetView);
canvas.addEventListener('dblclick', resetView);
document.getElementById('fullscreenBtn').addEventListener('click', ()=>{
  if(!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
});

const modal = document.getElementById('modal');
document.getElementById('infoBtn').onclick = ()=>modal.classList.add('show');
document.getElementById('closeModal').onclick = ()=>modal.classList.remove('show');
modal.addEventListener('click', e=>{ if(e.target===modal) modal.classList.remove('show'); });

function resize(){
  const h = window.innerWidth <= 640 ? window.innerHeight - 76 : window.innerHeight - 86;
  camera.aspect = window.innerWidth / h;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, h);
}
window.addEventListener('resize', resize);

function animate(){
  requestAnimationFrame(animate);
  modelRoot.rotation.y += 0.0022;
  controls.update();
  renderer.render(scene, camera);
}
animate();
